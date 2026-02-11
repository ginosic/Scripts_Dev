/*
 * coloRayer v1.5
 * A script to quickly apply label colors to After Effects layers and comps.
 * Developed by: Gino De Sicco (@gino.sicco) and Elton JSON
 */

(function(thisObj) {

    // ===================================================================
    //                        HELPER & CORE FUNCTIONS
    // ===================================================================

    var table1252 = {"€":128,"‚":130,"ƒ":131,"„":132,"…":133,"†":134,"‡":135,"ˆ":136,"‰":137,"Š":138,"‹":139,"Œ":140,"Ž":142,"‘":145,"’":146,"“":147,"”":148,"•":149,"–":150,"—":151,"˜":152,"™":153,"š":154,"›":155,"œ":156,"ž":158,"Ÿ":159,"¡":161,"¢":162,"£":163,"¤":164,"¥":165,"¦":166,"§":167,"¨":168,"©":169,"ª":170,"«":171,"¬":172,"­":173,"®":174,"¯":175,"°":176,"±":177,"²":178,"³":179,"´":180,"µ":181,"¶":182,"·":183,"¸":184,"¹":185,"º":186,"»":187,"¼":188,"½":189,"¾":190,"¿":191,"À":192,"Á":193,"Â":194,"Ã":195,"Ä":196,"Å":197,"Æ":198,"Ç":199,"È":200,"É":201,"Ê":202,"Ë":203,"Ì":204,"Í":205,"Î":206,"Ï":207,"Ð":208,"Ñ":209,"Ò":210,"Ó":211,"Ô":212,"Õ":213,"Ö":214,"×":215,"Ø":216,"Ù":217,"Ú":218,"Û":219,"Ü":220,"Ý":221,"Þ":222,"ß":223,"à":224,"á":225,"â":226,"ã":227,"ä":228,"å":229,"æ":230,"ç":231,"è":232,"é":233,"ê":234,"ë":235,"ì":236,"í":237,"î":238,"ï":239,"ð":240,"ñ":241,"ò":242,"ó":243,"ô":244,"õ":245,"ö":246,"÷":247,"ø":248,"ù":249,"ú":250,"û":251,"ü":252,"ý":253,"þ":254,"ÿ":255};

    function getLabelHexColor(labelIndex) {
        try {
            $.appEncoding = 'CP1252'; 
            var section = "Label Preference Color Section 5";
            var key = "Label Color ID 2 # " + labelIndex;
            var prefType = PREFType.PREF_Type_MACHINE_INDEPENDENT;
            var prefValue = app.preferences.getPrefAsString(section, key, prefType);
            var hexValue = '';
            for (var i = 1; i < prefValue.length; i++) {
                var charCode = prefValue.charCodeAt(i);
                if (charCode > 254) { charCode = table1252[prefValue[i]]; }
                var hex = charCode.toString(16).toUpperCase();
                hexValue += (hex.length < 2) ? '0' + hex : hex;
            }
            return hexValue;
        } catch (e) { return "000000"; }
    }

    function hexToRgb(hex) {
        try {
            var r = parseInt(hex.substring(0, 2), 16) / 255;
            var g = parseInt(hex.substring(2, 4), 16) / 255;
            var b = parseInt(hex.substring(4, 6), 16) / 255;
            return [r, g, b, 1];
        } catch(e) { return null; }
    }

    function applyLabelColor(labelNum) {
        var comp = app.project.activeItem;
        if (!(comp && comp instanceof CompItem)) {
            alert("Please select a composition first.");
            return;
        }
        var selectedLayers = comp.selectedLayers;
        if (selectedLayers.length === 0) {
            alert("Please select one or more layers to color.");
            return;
        }
        app.beginUndoGroup("coloRayer: Apply Label");
        for (var i = 0; i < selectedLayers.length; i++) {
            selectedLayers[i].label = labelNum;
        }
        app.endUndoGroup();
    }

    function customDraw() {
        with(this) {
            graphics.drawOSControl();
            graphics.rectPath(0, 0, size[0], size[1]);
            graphics.fillPath(fillBrush);
        }
    }

    function runAliceColoring(startComp, labelNum) {
        var foundComps = [];
        var processedCompIDs = [];
        function _recursiveDive(currentComp) {
            for (var i = 0; i < processedCompIDs.length; i++) {
                if (processedCompIDs[i] === currentComp.id) { return; }
            }
            processedCompIDs.push(currentComp.id);
            foundComps.push(currentComp);
            for (var i = 1; i <= currentComp.numLayers; i++) {
                var currentLayer = currentComp.layer(i);
                if (currentLayer.source instanceof CompItem) {
                    _recursiveDive(currentLayer.source);
                }
            }
        }
        _recursiveDive(startComp);
        app.beginUndoGroup("Alice: Color Pre-comps");
        for (var i = 0; i < foundComps.length; i++) {
            foundComps[i].label = labelNum;
        }
        app.endUndoGroup();
    }

    function createSwatch(parentGroup, labelNum, hexColor, size, onClickCallback) {
        var swatchButton = parentGroup.add("button", undefined, "");
        if (size) { swatchButton.preferredSize = size; }
        swatchButton.labelNum = labelNum;
        var colorRgb = hexToRgb(hexColor);
        if (!colorRgb || colorRgb.length !== 4) { colorRgb = [0.5, 0.5, 0.5, 1]; }
        swatchButton.fillBrush = swatchButton.graphics.newBrush(swatchButton.graphics.BrushType.SOLID_COLOR, colorRgb);
        swatchButton.onDraw = customDraw;
        swatchButton.onClick = onClickCallback;
    }

    // ===================================================================
    //                         UI FUNCTIONS
    // ===================================================================

    function createAliceColorPicker(targetComp) {
        var pickerWin = new Window("dialog", "Alice: Choose a Color");
        pickerWin.orientation = "column";
        
        var onAliceSwatchClick = function() {
            runAliceColoring(targetComp, this.labelNum);
            pickerWin.close();
        };

        var gridGroup = pickerWin.add("group");
        gridGroup.orientation = "column";
        gridGroup.spacing = 2;

        var swatchCounter = 1;
        for (var r = 0; r < 4; r++) {
            var row = gridGroup.add("group");
            row.orientation = "row";
            row.spacing = 2;
            for (var c = 0; c < 4; c++) {
                createSwatch(row, swatchCounter, getLabelHexColor(swatchCounter), [50, 50], onAliceSwatchClick);
                swatchCounter++;
            }
        }
        
        pickerWin.show();
    }

    function createColoRayerWindow(thisObj) {
        // This is the magic line. It checks if the script is running inside an
        // existing panel. If so, it uses that panel. If not, it creates a new one.
        var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "coloRayer", undefined, { resizeable: true });
        
        if (win !== null) {
            win.orientation = "column";
            win.margins = 1;

            var mainSwatchGroup = win.add("group");
            mainSwatchGroup.orientation = "column";
            mainSwatchGroup.spacing = 0;
            mainSwatchGroup.margins = 0;
            mainSwatchGroup.alignment = ['fill', 'fill'];
            mainSwatchGroup.alignChildren = ['fill', 'fill'];
            
            var onMainSwatchClick = function() {
                applyLabelColor(this.labelNum);
            };

            createSwatch(mainSwatchGroup, 0, "666666", null, onMainSwatchClick);
            for (var i = 1; i <= 16; i++) {
                createSwatch(mainSwatchGroup, i, getLabelHexColor(i), null, onMainSwatchClick);
            }
            
            var aliceButton = mainSwatchGroup.add("button", undefined, "✦");
            aliceButton.helpTip = "Run Alice (Recursive Comp Coloring)";
            
            var defaultFont = aliceButton.graphics.font;
            aliceButton.graphics.font = ScriptUI.newFont(defaultFont.name, defaultFont.style, defaultFont.size + 4);
            
            aliceButton.enabled = false;
            aliceButton.enabled = true;

            aliceButton.onClick = function() {
                var selection = app.project.selection;
                if (selection.length !== 1 || !(selection[0] instanceof CompItem)) {
                    alert("Please select a single composition in the Project Panel first.");
                    return;
                }
                createAliceColorPicker(selection[0]);
            };
            
            win.onResizing = function () { this.layout.resize(); };
            
            // This logic ensures the window is shown correctly whether it's new or docked
            if (win instanceof Window) {
                win.center();
                win.show();
            } else {
                win.layout.layout(true);
            }
        }
    }

    // ===================================================================
    //                         SCRIPT EXECUTION
    // ===================================================================
    createColoRayerWindow(thisObj);

})(this);