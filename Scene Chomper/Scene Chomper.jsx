/**
 * Scene Chomper v3.9
 * A script to automate scene creation and pre-composition in After Effects.
 * * Developed by: Gino De Sicco (@gino.sicco) and Elton JSON
 */

var SceneChomper = {

    //––––––––––––––––––––––––––––––––––––––––––––––––––
    // LINGO OBJECT
    //––––––––––––––––––––––––––––––––––––––––––––––––––
    lingo: {
        en_US: {
            windowTitle: "Scene Chomper v3.9",
            settingsPanel: "Global Settings",
            paddingLabel: "Padding (Frames):",
            baseNameLabel: "Base Scene Name:",
            baseNameDefault: "Scene ", // Added space here by default for better UX, but user can remove it.
            guidesCheck: "Turn layers to guides.",
            binCheck: "Organize into new folder",
            binNameLabel: "Folder Name:",
            markersCheck: "Name 'In'/'Out' markers.",
            progressTitle: "Chomping...",
            helpTitle: "Scene Chomper Help",
            helpText: "Scene Chomper v3.9\nDeveloped by Gino De Sicco & Elton JSON\n\n" +
                      "--- WORKFLOWS ---\n" +
                      "• Pre-compose Selected Layers:\nIf 'Base Scene Name' is empty, new scenes keep the original layer name exactly as is. If text is provided, it uses that text + numbering (e.g., 'Scene 01'). Tip: Add a space at the end of your base name if you want one!\n\n" +
                      "• Create Scenes from Comp Markers:\nCreates new placeholder scenes based on markers. Requires a Base Scene Name. It will append numbering directly to your text.\n\n" +
                      "--- CONTACT ---\n" +
                      "Email: hey@ginodesicco.com\n" +
                      "Instagram: @gino.sicco",
            alert_noComp: "Please select a composition first.",
            alert_noLayers: "For this workflow, please select the layers you want to pre-compose.",
            alert_noMarkers: "No layer or comp markers found. Please add markers to guide the scene creation.",
            alert_invalidFrames: "Please enter a valid non-negative number for handle frames.",
            alert_noBaseName: "Please enter a base name for the scenes when using Markers workflow.",
            alert_precomposeDone_p1: "Successfully pre-composed ",
            alert_precomposeDone_p2: " layers into new scenes!",
            alert_markersDone: " scenes created and pre-composed successfully!",
            undo_precompose: "Scene Chomper: Pre-compose Selected",
            undo_fromMarkers: "Scene Chomper: Create & Pre-compose from Markers",
            buttonPrecompose: "Pre-compose Selected Layers",
            buttonFromMarkers: "Create Scenes from Comp Markers",
        },
        pt_BR: {
            windowTitle: "Scene Chomper v3.9",
            settingsPanel: "Configurações Globais",
            paddingLabel: "Respiro (Frames):",
            baseNameLabel: "Nome Base da Cena:",
            baseNameDefault: "Cena ", // Adicionado espaço por padrão para melhor UX
            guidesCheck: "Transformar layers em guias.",
            binCheck: "Organizar em nova pasta.",
            binNameLabel: "Nome da Pasta:",
            markersCheck: "Nomear marcadores 'In'/'Out'.",
            progressTitle: "Devorando...",
            helpTitle: "Ajuda do Scene Chomper",
            helpText: "Scene Chomper v3.9\nDesenvolvido por Gino De Sicco & Elton JSON\n\n" +
                      "--- FLUXOS DE TRABALHO ---\n" +
                      "• Pré-compor Camadas Selecionadas:\nSe 'Nome Base' estiver vazio, as novas cenas mantêm o nome exato da layer original. Se houver texto, usa esse texto + numeração (ex: 'Cena 01'). Dica: Adicione um espaço no final do seu nome base se quiser um!\n\n" +
                      "• Criar Cenas a partir de Marcadores:\nCria novas cenas placeholder baseadas em marcadores. Requer um Nome Base. A numeração será adicionada diretamente ao seu texto.\n\n" +
                      "--- CONTATO ---\n" +
                      "Email: hey@ginodesicco.com\n" +
                      "Instagram: @gino.sicco",
            alert_noComp: "Por favor, selecione uma composição primeiro.",
            alert_noLayers: "Para este fluxo de trabalho, por favor selecione as camadas que deseja pré-compor.",
            alert_noMarkers: "Nenhum marcador de layer ou de comp encontrado. Adicione marcadores para guiar a criação de cenas.",
            alert_invalidFrames: "Por favor, insira um número válido e não-negativo para os frames de respiro.",
            alert_noBaseName: "Por favor, insira um nome base para as cenas ao usar o fluxo de Marcadores.",
            alert_precomposeDone_p1: "",
            alert_precomposeDone_p2: " camadas foram pré-compostas em novas cenas com sucesso!",
            alert_markersDone: " cenas criadas e pré-compostas com sucesso!",
            undo_precompose: "Scene Chomper: Pré-compor Selecionadas",
            undo_fromMarkers: "Scene Chomper: Criar & Pré-compor a partir de Marcadores",
            buttonPrecompose: "Pré-compor Camadas Selecionadas",
            buttonFromMarkers: "Criar Cenas a partir de Marcadores",
        }
    },

    //––––––––––––––––––––––––––––––––––––––––––––––––––
    // CORE LOGIC
    //––––––––––––––––––––––––––––––––––––––––––––––––––
    runPrecomposeSelected: function(settings, L, controls) {
        var activeComp = app.project.activeItem;
        if (!activeComp || !(activeComp instanceof CompItem)) { alert(L.alert_noComp); return; }
        var selectedLayers = activeComp.selectedLayers;
        if (selectedLayers.length === 0) { alert(L.alert_noLayers); return; }
        var layersToProcess = [];
        for (var i = 0; i < selectedLayers.length; i++) {
            if (selectedLayers[i].matchName !== "ADBE Camera Layer" && selectedLayers[i].matchName !== "ADBE Light Layer") {
                layersToProcess.push(selectedLayers[i]);
            }
        }
        if (layersToProcess.length === 0) { return; } 
        var baseName = settings.baseName, handleFrames = settings.handleFrames, makeGuides = settings.makeGuides, addMarkers = settings.addMarkers, createBin = settings.createBin, binName = settings.binName;
        var frameDur = activeComp.frameDuration, handleDur = handleFrames * frameDur;
        
        app.beginUndoGroup(L.undo_precompose);
        
        var scenesBin = null;
        if (createBin && binName) { scenesBin = this.findOrCreateBin(binName); }
        
        var progPal = new Window("palette", L.progressTitle);
        progPal.alignChildren = 'center';
        var progText = progPal.add("statictext", undefined, L.buttonPrecompose + ": 1/" + layersToProcess.length);
        progText.preferredSize = [300, 20]; progText.justify = 'center';
        var pBar = progPal.add("progressbar", undefined, 0, layersToProcess.length);
        pBar.preferredSize = [300, 20];
        progPal.show();
        
        for (var i = 0; i < layersToProcess.length; i++) {
            pBar.value = i + 1;
            progText.text = L.buttonPrecompose + ": " + (i+1) + "/" + layersToProcess.length;
            progPal.update();
            
            var origLayer = layersToProcess[i];
            
            // --- V3.9 NAMING LOGIC START ---
            var newSceneName;
            if (baseName === "") {
                // Road 2: Empty base name -> Exact original layer name.
                newSceneName = origLayer.name;
            } else {
                 // Road 1: User provided base name -> User Text + Numbering (NO forced space).
                newSceneName = baseName + this.padZero(i + 1);
            }
            // --- V3.9 NAMING LOGIC END ---
            
            var origIn = origLayer.inPoint, origOut = origLayer.outPoint, sceneDur = origOut - origIn;
            var returned = activeComp.layers.precompose([origLayer.index], newSceneName, true);
            var sceneComp = (returned instanceof CompItem) ? returned : app.project.item(app.project.numItems);
            
            if (scenesBin) { sceneComp.parentFolder = scenesBin; }
            var compLayer = this.findLayerForComp(activeComp, sceneComp);
            if (!compLayer) { continue; }
            
            sceneComp.duration = sceneDur + 2 * handleDur;
            var markerIn = new MarkerValue(addMarkers ? "In" : "");
            var markerOut = new MarkerValue(addMarkers ? "Out" : "");
            var compMk = sceneComp.markerProperty;
            compMk.setValueAtTime(handleDur, markerIn);
            compMk.setValueAtTime(handleDur + sceneDur, markerOut);
            
            var innerL = sceneComp.layer(1);
            innerL.inPoint = handleDur;
            innerL.outPoint = handleDur + sceneDur;
            var innerMk = innerL.property("Marker");
            innerMk.setValueAtTime(handleDur, markerIn);
            innerMk.setValueAtTime(handleDur + sceneDur, markerOut);
            if (makeGuides) { innerL.guideLayer = true; }
            
            compLayer.startTime = origIn - handleDur;
            var layerMk = compLayer.property("Marker");
            layerMk.setValueAtTime(origIn, markerIn);
            layerMk.setValueAtTime(origOut, markerOut);
            compLayer.inPoint = origIn;
            compLayer.outPoint = origOut;
        }
        progPal.close();
        app.endUndoGroup();
        this.saveSettings(controls);
        alert(L.alert_precomposeDone_p1 + layersToProcess.length + L.alert_precomposeDone_p2);
    },
    
    runCreateFromMarkers: function(settings, L, controls) {
        var activeComp = app.project.activeItem;
        if (!activeComp || !(activeComp instanceof CompItem)) { alert(L.alert_noComp); return; }
        
        var allMarkerTimes = [];
        var compMarkerProp = activeComp.markerProperty;
        if (compMarkerProp && compMarkerProp.numKeys > 0) {
            for (var j = 1; j <= compMarkerProp.numKeys; j++) {
                allMarkerTimes.push(compMarkerProp.keyTime(j));
            }
        }
        for (var i = 1; i <= activeComp.numLayers; i++) {
            var markerProperty = activeComp.layer(i).property("Marker");
            if (markerProperty && markerProperty.numKeys > 0) {
                for (var j = 1; j <= markerProperty.numKeys; j++) { allMarkerTimes.push(markerProperty.keyTime(j)); }
            }
        }
        if (allMarkerTimes.length === 0) { alert(L.alert_noMarkers); return; }
        
        var baseName = settings.baseName, handleFrames = settings.handleFrames, makeGuides = settings.makeGuides, addMarkers = settings.addMarkers, createBin = settings.createBin, binName = settings.binName;
        var frameDur = activeComp.frameDuration, handleDur = handleFrames * frameDur;
        
        app.beginUndoGroup(L.undo_fromMarkers);
        
        var scenesBin = null;
        if (createBin && binName) { scenesBin = this.findOrCreateBin(binName); }
        
        var cutPoints = [0];
        allMarkerTimes.sort(function(a, b) { return a - b; });
        for (var i = 0; i < allMarkerTimes.length; i++) {
            if (allMarkerTimes[i] > cutPoints[cutPoints.length - 1] && allMarkerTimes[i] < activeComp.duration) {
                cutPoints.push(allMarkerTimes[i]);
            }
        }
        cutPoints.push(activeComp.duration);
        
        var masterLayer = activeComp.layers.addText("");
        // V3.9: Removed forced space here too. Road 1 rules apply.
        masterLayer.name = baseName + this.padZero(1);
        masterLayer.property("Source Text").expression = "thisLayer.name";
        var textProp = masterLayer.property("Source Text"), textDocument = textProp.value;
        textDocument.font = "ArialMT"; textDocument.fillColor = [1, 1, 1]; textDocument.fontSize = 100;
        textDocument.justification = ParagraphJustification.CENTER_JUSTIFY; textProp.setValue(textDocument);
        masterLayer.property("Transform").property("Anchor Point").setValue([0, 0]);
        var rect = masterLayer.sourceRectAtTime(0, false);
        masterLayer.property("Transform").property("Anchor Point").setValue([rect.left + rect.width / 2, rect.top + rect.height / 2]);
        masterLayer.property("Transform").property("Position").setValue([activeComp.width / 2, activeComp.height / 2]);
        
        var createdLayers = [];
        for (var i = 0; i < cutPoints.length - 1; i++) {
            var startTime = cutPoints[i], endTime = cutPoints[i+1];
            var currentSceneLayer = (i === 0) ? masterLayer : masterLayer.duplicate();
            // V3.9: Removed forced space. Road 1 rules apply.
            currentSceneLayer.name = baseName + this.padZero(i + 1);
            currentSceneLayer.inPoint = startTime;
            currentSceneLayer.outPoint = endTime;
            createdLayers.push(currentSceneLayer);
        }
        for (var i = 0; i < createdLayers.length; i++) { createdLayers[i].moveToBeginning(); }
        
        var progPal = new Window("palette", L.progressTitle);
        progPal.alignChildren = 'center';
        var progText = progPal.add("statictext", undefined, L.buttonFromMarkers + ": 1/" + createdLayers.length);
        progText.preferredSize = [300, 20]; progText.justify = 'center';
        var pBar = progPal.add("progressbar", undefined, 0, createdLayers.length);
        pBar.preferredSize = [300, 20];
        progPal.show();
        
        for (var i = 0; i < createdLayers.length; i++) {
            pBar.value = i + 1;
            progText.text = L.buttonFromMarkers + ": " + (i+1) + "/" + createdLayers.length;
            progPal.update();
            
            var layerToPrecompose = createdLayers[i];
            var sceneName = layerToPrecompose.name, origIn = layerToPrecompose.inPoint, origOut = layerToPrecompose.outPoint, sceneDur = origOut - origIn;
            var returned = activeComp.layers.precompose([layerToPrecompose.index], sceneName, true);
            var sceneComp = (returned instanceof CompItem) ? returned : app.project.item(app.project.numItems);
            
            if (scenesBin) { sceneComp.parentFolder = scenesBin; }
            var compLayer = this.findLayerForComp(activeComp, sceneComp);
            if (!compLayer) { continue; }
            
            sceneComp.duration = sceneDur + 2 * handleDur;
            var markerIn = new MarkerValue(addMarkers ? "In" : "");
            var markerOut = new MarkerValue(addMarkers ? "Out" : "");
            var compMk = sceneComp.markerProperty;
            compMk.setValueAtTime(handleDur, markerIn);
            compMk.setValueAtTime(handleDur + sceneDur, markerOut);
            
            var innerL = sceneComp.layer(1);
            innerL.inPoint = handleDur;
            innerL.outPoint = handleDur + sceneDur;
            var innerMk = innerL.property("Marker");
            innerMk.setValueAtTime(handleDur, markerIn);
            innerMk.setValueAtTime(handleDur + sceneDur, markerOut);
            if (makeGuides) { innerL.guideLayer = true; }
            
            compLayer.startTime = origIn - handleDur;
            var layerMk = compLayer.property("Marker");
            layerMk.setValueAtTime(origIn, markerIn);
            layerMk.setValueAtTime(origOut, markerOut);
            compLayer.inPoint = origIn;
            compLayer.outPoint = origOut;
        }
        progPal.close();
        app.endUndoGroup();
        this.saveSettings(controls);
        alert((cutPoints.length - 1) + L.alert_markersDone);
    },

    //––––––––––––––––––––––––––––––––––––––––––––––––––
    // HELPER FUNCTIONS & UI
    //––––––––––––––––––––––––––––––––––––––––––––––––––
    padZero: function(num) { return num < 10 ? "0" + num : num.toString(); },
    findLayerForComp: function(comp, sourceComp) { for (var i = 1; i <= comp.numLayers; i++) { if (comp.layer(i).source === sourceComp) { return comp.layer(i); } } return null; },
    findOrCreateBin: function(binName) {
        for (var i = 1; i <= app.project.numItems; i++) {
            if ((app.project.item(i) instanceof FolderItem) && (app.project.item(i).name === binName)) { return app.project.item(i); }
        }
        return app.project.items.addFolder(binName);
    },
    saveSettings: function(controls) {
        app.settings.saveSetting("SceneChomper", "padding", controls.frameInput.text);
        app.settings.saveSetting("SceneChomper", "baseName", controls.baseNameInput.text);
        app.settings.saveSetting("SceneChomper", "makeGuides", controls.guideChk.value.toString());
        app.settings.saveSetting("SceneChomper", "addMarkers", controls.markerChk.value.toString());
        app.settings.saveSetting("SceneChomper", "createBin", controls.binChk.value.toString());
        app.settings.saveSetting("SceneChomper", "binName", controls.binNameInput.text);
    },
    loadSettings: function(controls) {
        if (app.settings.haveSetting("SceneChomper", "padding")) { controls.frameInput.text = app.settings.getSetting("SceneChomper", "padding"); }
        if (app.settings.haveSetting("SceneChomper", "baseName")) { controls.baseNameInput.text = app.settings.getSetting("SceneChomper", "baseName"); }
        if (app.settings.haveSetting("SceneChomper", "makeGuides")) { controls.guideChk.value = (app.settings.getSetting("SceneChomper", "makeGuides") === "true"); }
        if (app.settings.haveSetting("SceneChomper", "addMarkers")) { controls.markerChk.value = (app.settings.getSetting("SceneChomper", "addMarkers") === "true"); }
        if (app.settings.haveSetting("SceneChomper", "createBin")) { controls.binChk.value = (app.settings.getSetting("SceneChomper", "createBin") === "true"); }
        if (app.settings.haveSetting("SceneChomper", "binName")) { controls.binNameInput.text = app.settings.getSetting("SceneChomper", "binName"); }
    },
    
    buildUI: function(thisObj) {
        var L = (this.language === "pt_BR") ? this.lingo.pt_BR : this.lingo.en_US;
        var that = this;
        var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", L.windowTitle, undefined, { resizeable: true });
        if (pal === null) return;
        pal.orientation = "column"; pal.alignChildren = ["fill", "top"]; pal.spacing = 10; pal.margins = 16;
        
        var settingsPanel = pal.add("panel", undefined, L.settingsPanel);
        settingsPanel.orientation = "column"; 
        settingsPanel.alignChildren = "fill";
        
        var frameGroup = settingsPanel.add("group");
        frameGroup.orientation = "row";
        var frameLabel = frameGroup.add("statictext", undefined, L.paddingLabel);
        frameLabel.preferredSize.width = 110; 
        var frameInput = frameGroup.add("edittext", undefined, "24");
        frameInput.alignment = ["fill", "center"];

        var nameGroup = settingsPanel.add("group");
        nameGroup.orientation = "row";
        var nameLabel = nameGroup.add("statictext", undefined, L.baseNameLabel);
        nameLabel.preferredSize.width = 110;
        // V3.9 TWEAK: Added a default space to "Scene " or "Cena " for better first impression, user can delete it.
        var baseNameInput = nameGroup.add("edittext", undefined, L.baseNameDefault);
        baseNameInput.alignment = ["fill", "center"];
        
        var guideChk = settingsPanel.add("checkbox", undefined, L.guidesCheck);
        guideChk.alignment = "left";
        
        var markerChk = settingsPanel.add("checkbox", undefined, L.markersCheck);
        markerChk.alignment = "left";
        markerChk.value = true;
        
        var binChk = settingsPanel.add("checkbox", undefined, L.binCheck);
        binChk.alignment = "left";
        
        var binNameGroup = settingsPanel.add("group");
        binNameGroup.orientation = "row";
        var binNameLabel = binNameGroup.add("statictext", undefined, L.binNameLabel);
        binNameLabel.preferredSize.width = 110;
        var binNameInput = binNameGroup.add("edittext", undefined, "_Scene Comps");
        binNameInput.alignment = ["fill", "center"];
        
        binChk.onClick = function() {
            binNameGroup.enabled = this.value;
        };
        
        var workflowPanel = pal.add("panel", undefined, L.workflowPanel);
        workflowPanel.orientation = "column"; workflowPanel.alignChildren = ["fill", "top"]; workflowPanel.spacing = 10; workflowPanel.margins = 10;
        
        var buttonOne = workflowPanel.add("button", undefined, L.buttonPrecompose);
        var buttonTwo = workflowPanel.add("button", undefined, L.buttonFromMarkers);

        var helpGroup = pal.add("group");
        helpGroup.orientation = "row";
        helpGroup.alignment = ["right", "bottom"];
        var helpButton = helpGroup.add("button", undefined, "?");
        helpButton.preferredSize.width = 30;
        helpButton.onClick = function() {
            alert(L.helpText, L.helpTitle);
        };

        var uiControls = {
            frameInput: frameInput,
            baseNameInput: baseNameInput,
            guideChk: guideChk,
            markerChk: markerChk,
            binChk: binChk,
            binNameInput: binNameInput
        };
        
        buttonOne.onClick = function() {
            var settings = { 
                handleFrames: parseInt(uiControls.frameInput.text, 10), 
                baseName: uiControls.baseNameInput.text, 
                makeGuides: uiControls.guideChk.value,
                addMarkers: uiControls.markerChk.value,
                createBin: uiControls.binChk.value,
                binName: uiControls.binNameInput.text
            };
            if (isNaN(settings.handleFrames) || settings.handleFrames < 0) { alert(L.alert_invalidFrames); return; }
            that.runPrecomposeSelected(settings, L, uiControls);
        };
        buttonTwo.onClick = function() {
            var settings = { 
                handleFrames: parseInt(uiControls.frameInput.text, 10), 
                baseName: uiControls.baseNameInput.text, 
                makeGuides: uiControls.guideChk.value,
                addMarkers: uiControls.markerChk.value,
                createBin: uiControls.binChk.value,
                binName: uiControls.binNameInput.text
            };
            if (isNaN(settings.handleFrames) || settings.handleFrames < 0) { alert(L.alert_invalidFrames); return; }
            if (!settings.baseName) { alert(L.alert_noBaseName); return; }
            that.runCreateFromMarkers(settings, L, uiControls);
        };
        
        this.loadSettings(uiControls);
        binNameGroup.enabled = uiControls.binChk.value;
       
        pal.layout.layout(true);
        pal.onResizing = pal.onResize = function() { this.layout.resize(); }
        if (pal instanceof Window) { pal.center(); pal.show(); }
    }
};

SceneChomper.language = (app.language === Language.ENGLISH) ? "en_US" : "pt_BR";
SceneChomper.buildUI(this);