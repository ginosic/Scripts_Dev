/*
    grid(Maker)_v1.2
    ----------------
    A dynamic grid creation script for After Effects.
    Generates a reactive grid with customizable parameters and optional cell filling.
    (C) 2025 GS Motion Design
*/

﻿#target aftereffects

(function(thisObj){
    // Initialize the UI panel:
    // Use a dockable panel if available; otherwise, create a floating palette.
    var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "grid(Maker)", undefined, {resizeable:true});
    myPanel.orientation = "column";
    myPanel.alignChildren = ["fill", "top"];

    // --- UI Creation ---
    // Controller Name: Input for the grid controller (effector) name.
    var groupCtrlName = myPanel.add("group");
    groupCtrlName.orientation = "row";
    groupCtrlName.add("statictext", undefined, "Controller Name:");
    var ctrlNameInput = groupCtrlName.add("edittext", undefined, "Grid Ctrl");
    ctrlNameInput.characters = 15;

    // Vertical Lines: Input for the number of vertical grid lines.
    var groupVertical = myPanel.add("group");
    groupVertical.orientation = "row";
    groupVertical.add("statictext", undefined, "Vertical Lines:");
    var verticalLinesInput = groupVertical.add("edittext", undefined, "2");
    verticalLinesInput.characters = 5;

    // Horizontal Lines: Input for the number of horizontal grid lines.
    var groupHorizontal = myPanel.add("group");
    groupHorizontal.orientation = "row";
    groupHorizontal.add("statictext", undefined, "Horizontal Lines:");
    var horizontalLinesInput = groupHorizontal.add("edittext", undefined, "2");
    horizontalLinesInput.characters = 5;

    // Line Thickness: Input for grid line thickness.
    var groupThickness = myPanel.add("group");
    groupThickness.orientation = "row";
    groupThickness.add("statictext", undefined, "Line Thickness:");
    var thicknessInput = groupThickness.add("edittext", undefined, "2");
    thicknessInput.characters = 5;

    // Max Push Distance: Input for the maximum distance (in pixels) the effector can push a line.
    var groupPush = myPanel.add("group");
    groupPush.orientation = "row";
    groupPush.add("statictext", undefined, "Max Push Distance (pixels):");
    var pushInput = groupPush.add("edittext", undefined, "100");
    pushInput.characters = 5;

    // Effect Range: Input for the range (in pixels) within which the effector influences grid lines.
    var groupEffectRange = myPanel.add("group");
    groupEffectRange.orientation = "row";
    groupEffectRange.add("statictext", undefined, "Effect Range (pixels):");
    var effectRangeInput = groupEffectRange.add("edittext", undefined, "300");
    effectRangeInput.characters = 5;

    // fill(Cells) Checkbox: Toggle to create grid cells that fill the gaps.
    var groupCreateCells = myPanel.add("group");
    groupCreateCells.orientation = "row";
    var createCellsCheckbox = groupCreateCells.add("checkbox", undefined, "fill(Cells)?");
    createCellsCheckbox.value = true;

    // Run Button: Initiates grid creation.
    var buttonGroup = myPanel.add("group");
    buttonGroup.alignment = "left";
    var runButton = buttonGroup.add("button", undefined, "make(Grid)!");

    // --- Main Script Function ---
    function runScript() {
        // Step 1: Retrieve the active composition.
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            alert("Please select a composition.");
            return;
        }

        // Step 2: Read and validate user inputs.
        var ctrlName = ctrlNameInput.text; // Effector name.
        var numVerticalLines = parseInt(verticalLinesInput.text);
        var numHorizontalLines = parseInt(horizontalLinesInput.text);
        var lineThickness = parseInt(thicknessInput.text);
        var initialMaxPush = parseInt(pushInput.text);
        var effectRangeValue = parseInt(effectRangeInput.text);
        if (isNaN(numVerticalLines) || isNaN(numHorizontalLines) || isNaN(lineThickness) || isNaN(initialMaxPush) || isNaN(effectRangeValue)) {
            alert("Please enter valid numbers for all fields.");
            return;
        }
        var createCells = createCellsCheckbox.value;

        app.beginUndoGroup("grid(Maker)");

        // Step 3: Create the grid controller (null layer) and center it.
        var gridCtrlLayer = comp.layers.addNull();
        gridCtrlLayer.name = ctrlName;
        gridCtrlLayer.property("Transform").property("Position").setValue([comp.width / 2, comp.height / 2]);

        // Step 4: Add effect controls to the controller layer.
        // These include line thickness, maximum push, push factor, effect ranges (X and Y), and grid color.
        var sliderEffect, colorEffect;
        sliderEffect = gridCtrlLayer.property("Effects").addProperty("ADBE Slider Control");
        sliderEffect.name = "Line Thickness";
        sliderEffect("Slider").setValue(lineThickness);
        sliderEffect = gridCtrlLayer.property("Effects").addProperty("ADBE Slider Control");
        sliderEffect.name = "Max Push";
        sliderEffect("Slider").setValue(initialMaxPush);
        sliderEffect = gridCtrlLayer.property("Effects").addProperty("ADBE Slider Control");
        sliderEffect.name = "Push Factor";
        sliderEffect("Slider").setValue(-1);
        sliderEffect = gridCtrlLayer.property("Effects").addProperty("ADBE Slider Control");
        sliderEffect.name = "Effect Range X";
        sliderEffect("Slider").setValue(effectRangeValue);
        sliderEffect = gridCtrlLayer.property("Effects").addProperty("ADBE Slider Control");
        sliderEffect.name = "Effect Range Y";
        sliderEffect("Slider").setValue(effectRangeValue);
        colorEffect = gridCtrlLayer.property("Effects").addProperty("ADBE Color Control");
        colorEffect.name = "Grid Color";
        colorEffect("Color").setValue([0, 0, 0]);

        // Step 5: Build expressions for grid lines using the controller name.
        // These expressions calculate dimensions and positions for vertical and horizontal lines.
        var verticalLineDimensionExpression =
            'var ctrl = thisComp.layer("' + ctrlName + '");\n' +
            'var lt = ctrl.effect("Line Thickness")("Slider").value;\n' +
            '[lt, thisComp.height + 2];';
        var horizontalLineDimensionExpression =
            'var ctrl = thisComp.layer("' + ctrlName + '");\n' +
            'var lt = ctrl.effect("Line Thickness")("Slider").value;\n' +
            '[thisComp.width + 2, lt];';
        var fillColorExpression =
            'thisComp.layer("' + ctrlName + '").effect("Grid Color")("Color");';
        var verticalLineCombinedPositionExpression =
            'var comp = thisComp;\n' +
            'var pushCtrl = comp.layer("' + ctrlName + '");\n' +
            'var effectorPos = pushCtrl.transform.position[0];\n' +
            'var token = "Vertical Line";\n' +
            'var searchStr = "' + ctrlName + '" + " | " + token;\n' +
            'var layerIndex = thisLayer.index;\n' +
            'var totalCount = 0;\n' +
            'var order = 0;\n' +
            'for (var i = 1; i <= comp.numLayers; i++) {\n' +
            '  var lyr = comp.layer(i);\n' +
            '  if (lyr.name.indexOf(searchStr) !== -1) {\n' +
            '    totalCount++;\n' +
            '    if (lyr.index === layerIndex) { order = totalCount; }\n' +
            '  }\n' +
            '}\n' +
            'var originalX = totalCount > 1 ? order * (comp.width / (totalCount + 1)) : comp.width / 2;\n' +
            'var maxPush = pushCtrl.effect("Max Push")("Slider").value;\n' +
            'var pushFactor = pushCtrl.effect("Push Factor")("Slider").value;\n' +
            'var effectRangeX = pushCtrl.effect("Effect Range X")("Slider").value;\n' +
            'var distance = originalX - effectorPos;\n' +
            'var absDistance = Math.abs(distance);\n' +
            'var pushAmount = 0;\n' +
            'if (absDistance <= effectRangeX) {\n' +
            '  var normalized = absDistance / effectRangeX;\n' +
            '  var falloff = Math.max(0, 1 - normalized);\n' +
            '  pushAmount = -distance * pushFactor * falloff;\n' +
            '  pushAmount = Math.max(Math.min(pushAmount, maxPush), -maxPush);\n' +
            '}\n' +
            'var finalX = originalX + pushAmount;\n' +
            'var finalY = comp.height / 2;\n' +
            '[finalX, finalY];';
        var horizontalLinePositionExpression =
            'var comp = thisComp;\n' +
            'var pushCtrl = comp.layer("' + ctrlName + '");\n' +
            'var effectorPosY = pushCtrl.transform.position[1];\n' +
            'var token = "Horizontal Line";\n' +
            'var searchStr = "' + ctrlName + '" + " | " + token;\n' +
            'var layerIndex = thisLayer.index;\n' +
            'var totalCount = 0;\n' +
            'var order = 0;\n' +
            'for (var i = 1; i <= comp.numLayers; i++) {\n' +
            '  var lyr = comp.layer(i);\n' +
            '  if (lyr.name.indexOf(searchStr) !== -1) {\n' +
            '    totalCount++;\n' +
            '    if (lyr.index === layerIndex) { order = totalCount; }\n' +
            '  }\n' +
            '}\n' +
            'var originalY = totalCount > 1 ? order * (comp.height / (totalCount + 1)) : comp.height / 2;\n' +
            'var maxPush = pushCtrl.effect("Max Push")("Slider").value;\n' +
            'var pushFactor = pushCtrl.effect("Push Factor")("Slider").value;\n' +
            'var effectRangeY = pushCtrl.effect("Effect Range Y")("Slider").value;\n' +
            'var distance = originalY - effectorPosY;\n' +
            'var absDistance = Math.abs(distance);\n' +
            'var pushAmount = 0;\n' +
            'if (absDistance <= effectRangeY) {\n' +
            '  var normalized = absDistance / effectRangeY;\n' +
            '  var falloff = Math.max(0, 1 - normalized);\n' +
            '  pushAmount = -distance * pushFactor * falloff;\n' +
            '  pushAmount = Math.max(Math.min(pushAmount, maxPush), -maxPush);\n' +
            '}\n' +
            'var finalY = originalY + pushAmount;\n' +
            'var finalX = comp.width / 2;\n' +
            '[finalX, finalY];';

        // Step 6: Helper function to create a grid line shape layer.
        // Applies dimension, position, and fill color expressions.
        function createLineLayer(lineName, dimensionExpr, positionExpr, fillExpr, sizeVal) {
            var lineLayer = comp.layers.addShape();
            lineLayer.name = lineName;
            var contents = lineLayer.property("Contents");
            var shapeGroup = contents.addProperty("ADBE Vector Group");
            shapeGroup.name = "Group 1";
            var rectPath = shapeGroup.property("Contents").addProperty("ADBE Vector Shape - Rect");
            rectPath.name = "Rectangle Path 1";
            var fillProp = shapeGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");
            fillProp.name = "Fill 1";
            fillProp.property("ADBE Vector Fill Color").expression = fillExpr;
            var sizeProp = lineLayer.property("Contents")
                                      .property("Group 1")
                                      .property("Contents")
                                      .property("Rectangle Path 1")
                                      .property("Size");
            sizeProp.expression = dimensionExpr;
            sizeProp.setValue(sizeVal);
            var posProp = lineLayer.property("Transform").property("Position");
            posProp.expression = positionExpr;
            return lineLayer;
        }

        // Step 7: Create vertical grid line layers (in reverse order for stacking).
        for (var i = numVerticalLines; i >= 1; i--) {
            var lineName = ctrlName + " | Vertical Line " + i;
            createLineLayer(lineName, verticalLineDimensionExpression, verticalLineCombinedPositionExpression, fillColorExpression, [lineThickness, comp.height + 2]);
        }

        // Step 8: Create horizontal grid line layers (in reverse order for stacking).
        for (var j = numHorizontalLines; j >= 1; j--) {
            var lineName = ctrlName + " | Horizontal Line " + j;
            createLineLayer(lineName, horizontalLineDimensionExpression, horizontalLinePositionExpression, fillColorExpression, [comp.width + 2, lineThickness]);
        }

        // Step 9: Optionally create grid cells filling the gaps.
        // Each cell gets a rectangle path with size and position expressions,
        // a random gray fill, and is moved to the bottom of the layer stack.
        if (createCells) {
            var numCells = (numVerticalLines + 1) * (numHorizontalLines + 1);
            for (var cellIndex = 1; cellIndex <= numCells; cellIndex++) {
                var cellLayer = comp.layers.addShape();
                cellLayer.name = ctrlName + " | Cell " + cellIndex;
                var contents = cellLayer.property("Contents");
                var shapeGroup = contents.addProperty("ADBE Vector Group");
                shapeGroup.name = "Group 1";
                var rectPath = shapeGroup.property("Contents").addProperty("ADBE Vector Shape - Rect");
                rectPath.name = "Rectangle Path 1";
                rectPath.property("Size").expression =
                    "var comp = thisComp;\n" +
                    "var numVerticalLines = " + numVerticalLines + ";\n" +
                    "var numHorizontalLines = " + numHorizontalLines + ";\n" +
                    "var cellIndex = parseInt(thisLayer.name.split('Cell ')[1]);\n" +
                    "var cellColumn = (cellIndex - 1) % (numVerticalLines + 1) + 1;\n" +
                    "var cellRow = Math.ceil(cellIndex / (numVerticalLines + 1));\n" +
                    "var leftBoundaryX = (cellColumn === 1) ? 0 : comp.layer('" + ctrlName + " | Vertical Line ' + (cellColumn - 1)).transform.position[0];\n" +
                    "var rightBoundaryX = (cellColumn > numVerticalLines) ? comp.width : comp.layer('" + ctrlName + " | Vertical Line ' + cellColumn).transform.position[0];\n" +
                    "var cellWidth = rightBoundaryX - leftBoundaryX;\n" +
                    "var topBoundaryY = (cellRow === 1) ? 0 : comp.layer('" + ctrlName + " | Horizontal Line ' + (cellRow - 1)).transform.position[1];\n" +
                    "var bottomBoundaryY = (cellRow > numHorizontalLines) ? comp.height : comp.layer('" + ctrlName + " | Horizontal Line ' + cellRow).transform.position[1];\n" +
                    "var cellHeight = bottomBoundaryY - topBoundaryY;\n" +
                    "[cellWidth, cellHeight];";
                var fillProp = shapeGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                fillProp.name = "Fill 1";
                var grayValue = Math.random();
                var randomGrayColor = [grayValue, grayValue, grayValue];
                fillProp.property("ADBE Vector Fill Color").setValue(randomGrayColor);
                fillProp.property("Opacity").setValue(100);
                var cellPositionExpression =
                    "var comp = thisComp;\n" +
                    "var numVerticalLines = " + numVerticalLines + ";\n" +
                    "var numHorizontalLines = " + numHorizontalLines + ";\n" +
                    "var cellIndex = parseInt(thisLayer.name.split('Cell ')[1]);\n" +
                    "var cellColumn = (cellIndex - 1) % (numVerticalLines + 1) + 1;\n" +
                    "var cellRow = Math.ceil(cellIndex / (numVerticalLines + 1));\n" +
                    "var leftBoundaryX = (cellColumn === 1) ? 0 : comp.layer('" + ctrlName + " | Vertical Line ' + (cellColumn - 1)).transform.position[0];\n" +
                    "var rightBoundaryX = (cellColumn > numVerticalLines) ? comp.width : comp.layer('" + ctrlName + " | Vertical Line ' + cellColumn).transform.position[0];\n" +
                    "var topBoundaryY = (cellRow === 1) ? 0 : comp.layer('" + ctrlName + " | Horizontal Line ' + (cellRow - 1)).transform.position[1];\n" +
                    "var bottomBoundaryY = (cellRow > numHorizontalLines) ? comp.height : comp.layer('" + ctrlName + " | Horizontal Line ' + cellRow).transform.position[1];\n" +
                    "var cellCenterX = leftBoundaryX + ((rightBoundaryX - leftBoundaryX) / 2);\n" +
                    "var cellCenterY = topBoundaryY + ((bottomBoundaryY - topBoundaryY) / 2);\n" +
                    "[cellCenterX, cellCenterY];";
                cellLayer.property("Transform").property("Position").expression = cellPositionExpression;
                cellLayer.moveToEnd();
            }
        }

        // Step 10: Move the controller layer to the top of the stack for accessibility.
        if (comp.layers.length > 1) {
            var firstLayer = comp.layers[1];
            gridCtrlLayer.moveBefore(firstLayer);
        }

        app.endUndoGroup();
    }

    runButton.onClick = runScript;

    // Finalize and display the UI.
    myPanel.layout.layout(true);
    myPanel.layout.resize();
    if (myPanel instanceof Window) {
        myPanel.center();
        myPanel.show();
    }
})(this);
