/*
    Pathfinder v2.2.4 (The Feedback Update)
    -------------------------------------------------
    Fixes:
    - Added Selection Status Text (Visual Feedback)
    - Forced Focus on Listbox (To try and trigger active OS highlight color)
    - Clean Layout maintained
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
            report_col_path: "Localização",
            btn_reveal_proj: "Selecionar no Projeto",
            btn_reveal_finder: "Revelar no Explorer/Finder",
            btn_action_collect: "Coletar (Em Breve)",
            btn_action_import: "Importar (Em Breve)",
            btn_close: "Fechar",
            sel_none: "Nenhum item selecionado",
            sel_single: "Selecionado: ",
            sel_multi: " itens selecionados"
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
            report_col_path: "Location",
            btn_reveal_proj: "Select in Project",
            btn_reveal_finder: "Reveal in Explorer/Finder",
            btn_action_collect: "Collect (Soon)",
            btn_action_import: "Import (Soon)",
            btn_close: "Close",
            sel_none: "No items selected",
            sel_single: "Selected: ",
            sel_multi: " items selected"
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
        win.spacing = 5; // Spacing reduzido para ficar compacto
        win.margins = 15;
        win.preferredSize = [750, 400]; 

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
                name = decodeURI(itemData.name); 
                fullPath = decodeURI(itemData.file.fsName);
            } else {
                name = decodeURI(itemData.name);
                fullPath = decodeURI(itemData.fsName);
            }

            var entry = list.add("item", name);
            entry.subItems[0].text = fullPath; 
            entry.data = itemData; 
        }

        // --- SELECTION STATUS BAR (A Correção Visual) ---
        var statusText = win.add("statictext", undefined, L.sel_none);
        statusText.alignment = ["fill", "top"];
        statusText.graphics.font = ScriptUI.newFont("Segoe UI", "Italic", 11);
        statusText.graphics.foregroundColor = statusText.graphics.newPen(statusText.graphics.PenType.SOLID_COLOR, [0.7, 0.7, 0.7], 1);

        // Listener para atualizar o texto quando clica
        list.onChange = function() {
            if (!this.selection) {
                statusText.text = L.sel_none;
                // Botões podem ser desabilitados aqui se quiser refinar
            } else if (this.selection instanceof Array) {
                statusText.text = this.selection.length + L.sel_multi;
            } else {
                statusText.text = L.sel_single + this.selection.text;
            }
        };

        // --- FOOTER GROUP ---
        var footerGroup = win.add("group");
        footerGroup.orientation = "row";
        footerGroup.alignment = ["fill", "bottom"]; 
        footerGroup.alignChildren = ["left", "center"];
        footerGroup.margins = 0; 
        footerGroup.spacing = 10;
        footerGroup.margins.top = 5; // Um respiro do texto de status

        var leftGroup = footerGroup.add("group");
        leftGroup.orientation = "row";
        leftGroup.alignment = ["left", "center"];
        leftGroup.margins = 0; 
        leftGroup.spacing = 5; 

        var spacer = footerGroup.add("group");
        spacer.alignment = ["fill", "fill"];

        var rightGroup = footerGroup.add("group");
        rightGroup.orientation = "row";
        rightGroup.alignment = ["right", "center"];
        rightGroup.margins = 0;

        // Botões de Ação
        if (type === "stray") {
            var btnReveal = leftGroup.add("button", undefined, L.btn_reveal_proj);
            var btnCollect = leftGroup.add("button", undefined, L.btn_action_collect);
            
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
            var btnFinder = leftGroup.add("button", undefined, L.btn_reveal_finder);
            var btnImport = leftGroup.add("button", undefined, L.btn_action_import);

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

        var closeBtn = rightGroup.add("button", undefined, L.btn_close);
        closeBtn.preferredSize = [100, 30]; 
        closeBtn.onClick = function() { win.close(); };

        // Layout Update
        function updateLayout() {
            var listWidth = list.size[0];
            if (listWidth < 100) return;
            var availableWidth = listWidth - 25;
            var col1 = availableWidth * 0.35;
            var col2 = availableWidth * 0.65;
            list.columnWidths = [col1, col2];
        }

        win.onResizing = win.onResize = function() {
            this.layout.resize();
            updateLayout();
        };

        // Forçar foco na lista (Tenta ativar a cor azul do OS)
        win.onShow = function() {
            list.active = true;
        }

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