/*
    Pathfinder v2.2.2 (The Responsive Layout)
    -------------------------------------------------
    Fixes:
    - Dynamic Column Widths (Paths expand with window)
    - Footer Layout (Buttons aligned properly at bottom)
    - UI cleanup
*/

(function(thisObj) {

    // --- LINGO ---
    var lingo = {
        pt: {
            title: "Pathfinder v2.2",
            btn_change_root: "📂",
            btn_change_root_tip: "Mudar Pasta Raiz...",
            btn_refresh: "↻",
            btn_refresh_tip: "Atualizar Status",
            status_panel_title: "Status da Auditoria",
            attention_strays: "ATENÇÃO: {0} arquivos fujões encontrados!",
            perfect_strays: "Perfeito: Nenhum arquivo fujão.",
            attention_orphans: "ATENÇÃO: {0} arquivos órfãos encontrados!",
            perfect_orphans: "Perfeito: Nenhum arquivo órfão na pasta.",
            monitoring_path: "Monitorando: {0}",
            btn_list_strays: "Listar Fujões...",
            btn_list_orphans: "Listar Órfãos...",
            alert_save_project: "Salve o projeto para detectar a pasta automaticamente ou defina uma manualmente.",
            // Report Window
            report_title_strays: "Relatório de Fujões",
            report_title_orphans: "Relatório de Órfãos",
            report_col_name: "Nome do Arquivo",
            report_col_path: "Caminho Completo",
            btn_reveal_proj: "Selecionar no Projeto",
            btn_reveal_finder: "Revelar no Explorer/Finder",
            btn_action_collect: "Coletar (Em Breve)",
            btn_action_import: "Importar (Em Breve)",
            btn_close: "Fechar"
        },
        en: {
            title: "Pathfinder v2.2",
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
            alert_save_project: "Save project to detect folder automatically or set one manually.",
            // Report Window
            report_title_strays: "Strays Report",
            report_title_orphans: "Orphans Report",
            report_col_name: "File Name",
            report_col_path: "Full Path",
            btn_reveal_proj: "Select in Project",
            btn_reveal_finder: "Reveal in Explorer/Finder",
            btn_action_collect: "Collect (Soon)",
            btn_action_import: "Import (Soon)",
            btn_close: "Close"
        }
    };
    
    var L = (app.language === Language.PORTUGUESE_BRAZILIAN) ? lingo.pt : lingo.en;

    // --- FUNÇÕES AUXILIARES ---
    function getShortPath(fullPath) {
        if (!fullPath) return "...";
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
                if (currentItem.name.indexOf(".") !== 0) { 
                    fileList.push(currentItem);
                }
            } else if (currentItem instanceof Folder) {
                fileList = fileList.concat(getAllFilesRecursive(currentItem));
            }
        }
        return fileList;
    }

    // --- REPORT WINDOW GENERATOR ---
    function buildReportWindow(title, dataArray, type) {
        var win = new Window("dialog", title, undefined, {resizeable: true});
        win.orientation = "column";
        win.alignChildren = ["fill", "fill"];
        win.spacing = 10;
        win.margins = 15;
        win.preferredSize = [700, 400]; // Tamanho inicial um pouco maior

        // --- LISTBOX ---
        var list = win.add("listbox", undefined, [], {
            numberOfColumns: 2, 
            showHeaders: true, 
            columnTitles: [L.report_col_name, L.report_col_path],
            multiselect: true
        });
        
        list.alignment = ["fill", "fill"];

        // Populate List
        for (var i = 0; i < dataArray.length; i++) {
            var itemData = dataArray[i];
            var name, fullPath;
            
            if (type === "stray") {
                name = itemData.name;
                fullPath = itemData.file.fsName;
            } else {
                name = itemData.name;
                fullPath = itemData.fsName;
            }

            var entry = list.add("item", name);
            // entry.subItems[0].text = getShortPath(fullPath); // Versão anterior (curta)
            entry.subItems[0].text = fullPath; // Agora mostramos o full path, pois a coluna vai esticar
            entry.data = itemData; 
        }

        // --- FOOTER GROUP (Botões) ---
        // Cria um grupo horizontal que fica preso no rodapé
        var footerGroup = win.add("group");
        footerGroup.orientation = "row";
        footerGroup.alignment = ["fill", "bottom"]; 
        footerGroup.alignChildren = ["left", "center"];

        // Grupo da Esquerda (Ações)
        var leftGroup = footerGroup.add("group");
        leftGroup.orientation = "row";
        leftGroup.alignment = ["left", "center"];

        // Grupo da Direita (Fechar) - Spacer empurra ele pra direita
        var rightGroup = footerGroup.add("group");
        rightGroup.orientation = "row";
        rightGroup.alignment = ["right", "center"];
        
        // Espaçador Flexível entre os grupos
        // O truque do layout manager: se adicionar componentes com alignment left e right no mesmo pai, às vezes buga.
        // O jeito mais seguro é criar um painel invisível que estica.
        // Mas o ScriptUI básico é simples: vamos usar o layout do footerGroup.
        
        // Refazendo footer layout para garantir separação:
        footerGroup.add("statictext", undefined, ""); // Filler dummy se necessário, mas vamos tentar alignment direto.
        // ScriptUI layout hack: para separar Esquerda e Direita, o pai tem que ser justify? Não tem justify.
        // Vamos usar um preferredSize width grande no meio ou um container que estica.
        
        // Melhor abordagem limpa:
        footerGroup.remove(leftGroup);
        footerGroup.remove(rightGroup);
        
        // Botões de Ação (Esquerda)
        if (type === "stray") {
            var btnReveal = footerGroup.add("button", undefined, L.btn_reveal_proj);
            var btnCollect = footerGroup.add("button", undefined, L.btn_action_collect);
            
            btnReveal.onClick = function() {
                if (list.selection) {
                    var sel = list.selection;
                    if (!(sel instanceof Array)) sel = [sel];
                    
                    var currentSel = app.project.selection;
                    for (var c = 0; c < currentSel.length; c++) {
                        currentSel[c].selected = false;
                    }

                    for(var k=0; k<sel.length; k++) {
                        try { sel[k].data.selected = true; } catch(e) {}
                    }
                }
            };
            btnCollect.enabled = false;
        } else {
            var btnFinder = footerGroup.add("button", undefined, L.btn_reveal_finder);
            var btnImport = footerGroup.add("button", undefined, L.btn_action_import);

            btnFinder.onClick = function() {
                 if (list.selection) {
                    var sel = list.selection;
                    if (sel instanceof Array) sel = sel[0];
                    var fileObj = sel.data;
                    if (fileObj.parent) fileObj.parent.execute();
                    else fileObj.execute();
                 }
            };
            btnImport.enabled = false;
        }

        // Espaçador elástico para empurrar o botão Fechar para a direita
        var spacer = footerGroup.add("group");
        spacer.alignment = ["fill", "fill"];

        // Botão Fechar (Direita)
        var closeBtn = footerGroup.add("button", undefined, L.btn_close);
        closeBtn.onClick = function() { win.close(); };


        // --- FUNÇÃO DE UPDATE DE COLUNAS ---
        function updateLayout() {
            // Calcula a largura disponível na lista
            var listWidth = list.size[0];
            if (listWidth < 100) return; // Segurança inicial

            // Tira um pouquinho pra barra de rolagem (aprox 20px)
            var availableWidth = listWidth - 25;

            // Define proporções: 30% Nome, 70% Caminho
            var col1 = availableWidth * 0.30;
            var col2 = availableWidth * 0.70;

            list.columnWidths = [col1, col2];
        }

        // Listener de Resize da Janela
        win.onResizing = win.onResize = function() {
            this.layout.resize();
            updateLayout(); // Chama nossa matemática de colunas
        };

        // Mostra a janela e força o primeiro update
        win.show();
        updateLayout(); 
    }

    // --- UI BUILD PRINCIPAL ---
    var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", L.title, undefined, { resizeable: true });
    if (pal === null) return;

    pal.text = L.title;
    pal.orientation = "column";
    pal.alignChildren = ["fill", "top"];
    pal.spacing = 10;
    pal.margins = 15;

    // --- ESTADO GLOBAL ---
    var currentBasePath = (app.project.file) ? app.project.file.parent.fsName : "";
    var currentStrayItems = []; 
    var currentOrphanFiles = [];

    // --- CABEÇALHO ---
    var headerGroup = pal.add("group");
    headerGroup.orientation = "row";
    headerGroup.alignChildren = ["left", "center"];
    
    var titleText = headerGroup.add("statictext", undefined, L.title);
    titleText.graphics.font = ScriptUI.newFont("Segoe UI", "Bold", 14);
    
    headerGroup.add("panel", [0, 0, 1, 1], ""); 

    var changeRootBtn = headerGroup.add("button", undefined, L.btn_change_root);
    changeRootBtn.preferredSize = [30, 25];
    changeRootBtn.helpTip = L.btn_change_root_tip;
    
    var refreshBtn = headerGroup.add("button", undefined, L.btn_refresh);
    refreshBtn.preferredSize = [30, 25];
    refreshBtn.helpTip = L.btn_refresh_tip;

    // --- STATUS ---
    var statusGroup = pal.add("panel", undefined, L.status_panel_title);
    statusGroup.alignChildren = ["fill", "top"];
    statusGroup.spacing = 5;
    
    var monitoringPathText = statusGroup.add("statictext", undefined, L.monitoring_path.replace("{0}", "..."), { truncate: "middle" });
    monitoringPathText.graphics.foregroundColor = monitoringPathText.graphics.newPen(monitoringPathText.graphics.PenType.SOLID_COLOR, [0.5, 0.5, 0.5], 1);

    var straysStatusText = statusGroup.add("statictext", undefined, "Status Fujões: --", { multiline: true });
    var orphansStatusText = statusGroup.add("statictext", undefined, "Status Órfãos: --", { multiline: true });

    // --- AÇÕES ---
    var actionsGroup = pal.add("group");
    actionsGroup.orientation = "row";
    actionsGroup.alignment = "center";
    
    var listStraysBtn = actionsGroup.add("button", undefined, L.btn_list_strays);
    var listOrphansBtn = actionsGroup.add("button", undefined, L.btn_list_orphans);
    
    listStraysBtn.enabled = false;
    listOrphansBtn.enabled = false;

    // --- LISTENERS ---
    changeRootBtn.onClick = function() { 
        var defaultFolder = currentBasePath ? new Folder(currentBasePath) : Folder.myDocuments;
        var newFolder = defaultFolder.selectDlg(L.btn_change_root_tip);
        if (newFolder) {
            currentBasePath = newFolder.fsName;
            runFullAudit(); 
        }
    };

    refreshBtn.onClick = function() { runFullAudit(); };

    listStraysBtn.onClick = function() { 
        buildReportWindow(L.report_title_strays, currentStrayItems, "stray"); 
    };

    listOrphansBtn.onClick = function() { 
        buildReportWindow(L.report_title_orphans, currentOrphanFiles, "orphan"); 
    };

    // --- CORE AUDIT ---
    function runFullAudit() {
        if (!currentBasePath && app.project.file) {
            currentBasePath = app.project.file.parent.fsName;
        }

        if (!currentBasePath) {
            monitoringPathText.text = L.monitoring_path.replace("{0}", "N/A");
            straysStatusText.text = L.alert_save_project;
            orphansStatusText.text = "";
            return;
        }

        monitoringPathText.text = L.monitoring_path.replace("{0}", getShortPath(currentBasePath));
        var normalizedBasePath = decodeURI(currentBasePath).toLowerCase().replace(/[\\\/]$/, "");
        
        // 1. FUJÕES
        var proj = app.project;
        currentStrayItems = [];
        var projectFilesMap = {}; 

        for (var i = 1; i <= proj.numItems; i++) {
            var item = proj.item(i);
            if (item instanceof FootageItem && item.file !== null) {
                if (item.mainSource instanceof FileSource) {
                    var footagePath = decodeURI(item.file.fsName);
                    projectFilesMap[footagePath.toLowerCase()] = true;
                    
                    if (footagePath.toLowerCase().indexOf(normalizedBasePath) !== 0) {
                        currentStrayItems.push(item);
                    }
                }
            }
        }

        if (currentStrayItems.length > 0) {
            straysStatusText.text = L.attention_strays.replace("{0}", currentStrayItems.length);
            listStraysBtn.enabled = true;
        } else {
            straysStatusText.text = L.perfect_strays;
            listStraysBtn.enabled = false;
        }

        // 2. ÓRFÃOS
        currentOrphanFiles = [];
        var diskFiles = getAllFilesRecursive(new Folder(currentBasePath));
        
        for (var i = 0; i < diskFiles.length; i++) {
            var diskPath = decodeURI(diskFiles[i].fsName).toLowerCase();
            if (!projectFilesMap[diskPath]) {
                if (diskFiles[i].name.indexOf(".aep") === -1 && 
                    diskFiles[i].name.toLowerCase() !== "thumbs.db" && 
                    diskFiles[i].name.toLowerCase() !== ".ds_store") {
                    
                    currentOrphanFiles.push(diskFiles[i]);
                }
            }
        }

        if (currentOrphanFiles.length > 0) {
            orphansStatusText.text = L.attention_orphans.replace("{0}", currentOrphanFiles.length);
            listOrphansBtn.enabled = true;
        } else {
            orphansStatusText.text = L.perfect_orphans;
            listOrphansBtn.enabled = false;
        }
        
        pal.layout.layout(true);
    }

    if (app.project.file) {
        runFullAudit();
    }

    pal.layout.layout(true);
    pal.onResizing = pal.onResize = function() { this.layout.resize(); };
    if (pal instanceof Window) {
        pal.center();
        pal.show();
    }

})(this);