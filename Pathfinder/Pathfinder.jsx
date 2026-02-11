/*
    Pathfinder v2.0
    -------------------------------------------------
    The Unified Dashboard - Official Baseline
*/

(function(thisObj) {

    // Objeto Lingo completo
    var lingo = {
        pt: {
            title: "Pathfinder v2.0",
            btn_change_root: "📂", // Pasta
            btn_change_root_tip: "Mudar Pasta Raiz...",
            btn_refresh: "↻", // Refresh
            btn_refresh_tip: "Atualizar Status",
            status_panel_title: "Status da Auditoria",
            attention_strays: "ATENÇÃO: {0} arquivos fujões encontrados!",
            perfect_strays: "Perfeito: Nenhum arquivo fujão.",
            attention_orphans: "ATENÇÃO: {0} arquivos órfãos encontrados!",
            perfect_orphans: "Perfeito: Nenhum arquivo órfão na pasta.",
            monitoring_path: "Monitorando: {0}",
            btn_list_strays: "Listar Fujões...",
            btn_list_orphans: "Listar Órfãos...",
            alert_save_project: "Por favor, salve seu projeto para continuar."
        },
        en: {
            title: "Pathfinder v2.0",
            btn_change_root: "📂",
            btn_change_root_tip: "Change Root Folder...",
            btn_refresh: "↻",
            btn_refresh_tip: "Refresh Status",
            status_panel_title: "Audit Status",
            attention_strays: "ATTENTION: {0} stray files found!",
            perfect_strays: "Perfect: No stray files found.",
            attention_orphans: "ATTENTION: {0} orphan files found!",
            perfect_orphans: "Perfect: No orphan files in folder.",
            monitoring_path: "Monitoring: {0}",
            btn_list_strays: "List Strays...",
            btn_list_orphans: "List Orphans...",
            alert_save_project: "Please save your project to continue."
        }
    };
    
    // Detecção de idioma mais segura
    var L = (app.language === Language.PORTUGUESE_BRAZILIAN) ? lingo.pt : lingo.en;

    // --- FUNÇÕES AUXILIARES ---
    function getShortPath(fullPath) {
        var separator = $.os.indexOf("Windows") > -1 ? "\\" : "/";
        var parts = fullPath.split(separator);
        if (parts.length <= 4) return fullPath;
        var start = parts[0];
        var end = parts.slice(-2).join(separator);
        return start + separator + "..." + separator + end;
    }

    function getAllFilesRecursive(folder) {
        var fileList = [];
        var filesAndFolders = folder.getFiles();
        if (filesAndFolders === null) return [];
        for (var i = 0; i < filesAndFolders.length; i++) {
            var currentItem = filesAndFolders[i];
            if (currentItem instanceof File) {
                // Filtra arquivos de sistema invisíveis comuns
                if (currentItem.name.indexOf(".") !== 0) { 
                    fileList.push(currentItem);
                }
            } else if (currentItem instanceof Folder) {
                fileList = fileList.concat(getAllFilesRecursive(currentItem));
            }
        }
        return fileList;
    }

    // --- CONSTRUÇÃO DA UI ---
    var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", L.title, undefined, { resizeable: true });
    if (pal === null) return;

    pal.text = L.title;
    pal.orientation = "column";
    pal.alignChildren = ["fill", "top"];
    pal.spacing = 10;
    pal.margins = 15;

    // --- Variáveis Globais do Painel ---
    var currentBasePath = "";
    var currentStrayItems = []; // Array de FootageItems (AE)
    var currentOrphanFiles = []; // Array de File objects (Disco)

    // --- GRUPO 1: CABEÇALHO ---
    var headerGroup = pal.add("group");
    headerGroup.orientation = "row";
    headerGroup.alignChildren = ["left", "center"];
    
    var titleText = headerGroup.add("statictext", undefined, L.title);
    titleText.graphics.font = ScriptUI.newFont("Segoe UI", "Bold", 14);
    
    headerGroup.add("panel", [0, 0, 1, 1], ""); // Spacer elástico

    // Botão Mudar Pasta
    var changeRootBtn = headerGroup.add("button", undefined, L.btn_change_root);
    changeRootBtn.preferredSize = [30, 25];
    changeRootBtn.helpTip = L.btn_change_root_tip;
    
    // Botão Atualizar
    var refreshBtn = headerGroup.add("button", undefined, L.btn_refresh);
    refreshBtn.preferredSize = [30, 25];
    refreshBtn.helpTip = L.btn_refresh_tip;

    // --- GRUPO 2: PAINEL DE STATUS ---
    var statusGroup = pal.add("panel", undefined, L.status_panel_title);
    statusGroup.alignChildren = ["fill", "top"];
    statusGroup.spacing = 5;
    
    var monitoringPathText = statusGroup.add("statictext", undefined, "Monitorando: ...", { truncate: "middle" });
    monitoringPathText.graphics.foregroundColor = monitoringPathText.graphics.newPen(monitoringPathText.graphics.PenType.SOLID_COLOR, [0.5, 0.5, 0.5], 1);

    var straysStatusText = statusGroup.add("statictext", undefined, "Status Fujões: --", { multiline: true });
    var orphansStatusText = statusGroup.add("statictext", undefined, "Status Órfãos: --", { multiline: true });

    // --- GRUPO 3: PAINEL DE AÇÕES ---
    var actionsGroup = pal.add("group");
    actionsGroup.orientation = "row";
    actionsGroup.alignment = "center";
    
    var listStraysBtn = actionsGroup.add("button", undefined, L.btn_list_strays);
    var listOrphansBtn = actionsGroup.add("button", undefined, L.btn_list_orphans);
    
    listStraysBtn.enabled = false;
    listOrphansBtn.enabled = false;

    // --- LÓGICA DO BOTÃO MUDAR PASTA (Stub) ---
    changeRootBtn.onClick = function() { 
        var newFolder = Folder.selectDialog(L.btn_change_root_tip);
        if (newFolder) {
            currentBasePath = newFolder.fsName;
            runFullAudit(true); // Força auditoria com novo caminho
        }
    };

    // --- MOTOR PRINCIPAL ---
    function runFullAudit(manualOverride) {
        var proj = app.project;
        if (!proj || !proj.file) {
            // Se o projeto não foi salvo, não dá pra adivinhar o caminho, 
            // a não ser que o usuário tenha setado manualmente.
            if (!currentBasePath) {
                alert(L.alert_save_project);
                return;
            }
        } else {
            // Se não houve override manual, usa o caminho do projeto
            if (!manualOverride) {
                currentBasePath = proj.file.parent.fsName;
            }
        }

        monitoringPathText.text = L.monitoring_path.replace("{0}", getShortPath(currentBasePath));

        var normalizedBasePath = decodeURI(currentBasePath).toLowerCase().replace(/[\\\/]$/, "");
        
        // 1. Achar Fujões (Strays) - Itens do AE fora da pasta
        currentStrayItems = [];
        var projectFilesMap = {}; // Mapa para checagem rápida de órfãos depois

        for (var i = 1; i <= proj.numItems; i++) {
            var currentItem = proj.item(i);
            if (currentItem instanceof FootageItem && currentItem.file !== null) {
                // Ignora sequências de imagens para não poluir (podemos melhorar isso depois)
                if (currentItem.mainSource instanceof FileSource) {
                    var footagePath = decodeURI(currentItem.file.fsName);
                    projectFilesMap[footagePath.toLowerCase()] = true; // Marca como "Usado"
                    
                    if (footagePath.toLowerCase().indexOf(normalizedBasePath) !== 0) {
                        currentStrayItems.push(currentItem);
                    }
                }
            }
        }

        // Atualiza UI Fujões
        if (currentStrayItems.length > 0) {
            straysStatusText.text = L.attention_strays.replace("{0}", currentStrayItems.length);
            listStraysBtn.enabled = true;
        } else {
            straysStatusText.text = L.perfect_strays;
            listStraysBtn.enabled = false;
        }

        // 2. Achar Órfãos (Orphans) - Arquivos na pasta não usados no AE
        currentOrphanFiles = [];
        var diskFiles = getAllFilesRecursive(new Folder(currentBasePath));
        
        for (var i = 0; i < diskFiles.length; i++) {
            var diskPath = decodeURI(diskFiles[i].fsName).toLowerCase();
            
            // Se NÃO está no mapa de arquivos usados E não é o próprio projeto (.aep)
            if (!projectFilesMap[diskPath]) {
                if (diskFiles[i].name.indexOf(".aep") === -1 && 
                    diskFiles[i].name.toLowerCase() !== "thumbs.db" && 
                    diskFiles[i].name.toLowerCase() !== ".ds_store") {
                    
                    currentOrphanFiles.push(diskFiles[i]);
                }
            }
        }

        // Atualiza UI Órfãos
        if (currentOrphanFiles.length > 0) {
            orphansStatusText.text = L.attention_orphans.replace("{0}", currentOrphanFiles.length);
            listOrphansBtn.enabled = true;
        } else {
            orphansStatusText.text = L.perfect_orphans;
            listOrphansBtn.enabled = false;
        }
        
        pal.layout.layout(true);
    }

    refreshBtn.onClick = function() { runFullAudit(false); };
    
    // Stubs para as janelas de relatório
    listStraysBtn.onClick = function() { alert("Janela de Fujões: " + currentStrayItems.length + " itens."); };
    listOrphansBtn.onClick = function() { alert("Janela de Órfãos: " + currentOrphanFiles.length + " arquivos."); };

    // Inicializa se possível
    if (app.project.file) {
        runFullAudit(false);
    }

    pal.layout.layout(true);
    pal.onResizing = pal.onResize = function() { this.layout.resize(); };
    if (pal instanceof Window) {
        pal.center();
        pal.show();
    }

})(this);