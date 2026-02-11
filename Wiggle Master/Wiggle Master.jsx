// =============================================================================
// Script Name: Wiggle Master
// Version: 4.0
// Creator: Pedro Isaias
// Co-Creators: Gino De Sicco (@gino.sicco) and Elton JSON
// Description: Applies loopable wiggle expressions using a Wiggle Master null object.
// =============================================================================

// --- BILINGUAL LINGO DICTIONARY (For UI Text Only) ---
var lingo = {
    en: {
        scriptName: "Wiggle Master",
        propPosition: "Position",
        propScale: "Scale",
        propRotation: "Rotation",
        propOpacity: "Opacity",
        unlinkScale: "Unlink scale",
        unlinkScaleTip: "Wiggle scale axes independently",
        wiggleButton: "Wiggle it!",
        clearCheckedButton: "Clear Checked",
        clearCheckedTip: "Clears wiggles from checked properties.",
        nukeButton: "Nuke 'Em",
        nukeButtonTip: "Clears wiggles from ALL properties.",
        undoApply: "Apply Wiggle Master",
        undoClearChecked: "Clear Checked Wiggles",
        undoNuke: "Nuke Wiggles",
        alertNoComp: "Please select a composition first.",
        alertNoLayer: "Please select at least one layer.",
        alertNoApply: "Please check at least one property box to apply.",
        alertNoClear: "Please check at least one property box to clear."
    },
    pt: {
        scriptName: "Wiggle Master",
        propPosition: "Posição",
        propScale: "Escala",
        propRotation: "Rotação",
        propOpacity: "Opacidade",
        unlinkScale: "Desunir escala",
        unlinkScaleTip: "Animar eixos da escala independentemente",
        wiggleButton: "Wiggle it!",
        clearCheckedButton: "Limpar Marcados",
        clearCheckedTip: "Limpa as expressões das propriedades marcadas.",
        nukeButton: "Limpar Tudo",
        nukeButtonTip: "Limpa as expressões de TODAS as propriedades.",
        undoApply: "Aplicar Wiggle Master",
        undoClearChecked: "Limpar Wiggles Marcados",
        undoNuke: "Limpar Todos os Wiggles",
        alertNoComp: "Por favor, selecione uma composição primeiro.",
        alertNoLayer: "Por favor, selecione pelo menos uma camada.",
        alertNoApply: "Por favor, marque ao menos uma propriedade para aplicar.",
        alertNoClear: "Por favor, marque ao menos uma propriedade para limpar."
    }
};

// --- Auto-detect language ---
var S = (app.language === Language.PORTUGUESE) ? lingo.pt : lingo.en;


(function(thisObj) {

    // --- CENTRAL BRAIN ---
    var config = {
        scriptName: S.scriptName,
        layerName: "Wiggle Master",
        effects: {
            freq: { name: "WM Freq", defaultValue: 2 },
            loop: { name: "WM Loop Duration", defaultValue: 60 },
            posterizeTimeFx: { name: "WM Posterize Time", defaultValue: 0 },
            posAmt: { name: "WM Position Amount", defaultValue: 50 },
            scaleAmt: { name: "WM Scale Amount", defaultValue: 10 },
            rotAmt: { name: "WM Rotation Amount", defaultValue: 20 },
            opacAmt: { name: "WM Opacity Amount", defaultValue: 10 }
        }
    };

    // Initialize the UI panel:
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", config.scriptName, undefined);
    win.preferredSize.width = 180;
    win.orientation = "column";
    win.alignChildren = "fill";
    win.spacing = 5;
    win.margins = 15;

    // --- Top Group for Properties ---
    var topGroup = win.add("group");
    topGroup.orientation = "column";
    topGroup.alignChildren = "left"; 
    topGroup.spacing = 5;

    var ui = {}; 

    var propertyMap = {
        position: { uiText: S.propPosition, propRef: "Position", sliderConfig: config.effects.posAmt },
        scale: { uiText: S.propScale, propRef: "Scale", sliderConfig: config.effects.scaleAmt },
        rotation: { uiText: S.propRotation, propRef: "Rotation", sliderConfig: config.effects.rotAmt },
        opacity: { uiText: S.propOpacity, propRef: "Opacity", sliderConfig: config.effects.opacAmt }
    };
    
    function createPropertyRow(group, key) {
        var propGroup = group.add("group");
        propGroup.orientation = "row";
        propGroup.alignChildren = ["left", "center"];
        
        ui[key + "Checkbox"] = propGroup.add("checkbox", undefined, "");
        ui[key + "Button"] = propGroup.add("button", undefined, propertyMap[key].uiText);
        ui[key + "Button"].preferredSize.width = 120;
    }

    createPropertyRow(topGroup, "position");
    createPropertyRow(topGroup, "scale");
    
    var unlinkGroup = topGroup.add("group");
    unlinkGroup.orientation = "row";
    unlinkGroup.margins.left = 20;
    ui.unlinkScaleCheckbox = unlinkGroup.add("checkbox", undefined, S.unlinkScale);
    ui.unlinkScaleCheckbox.helpTip = S.unlinkScaleTip;
    
    createPropertyRow(topGroup, "rotation");
    createPropertyRow(topGroup, "opacity");
    
    ui.unlinkScaleCheckbox.enabled = ui.scaleCheckbox.value;

    ui.scaleCheckbox.onClick = function() {
        ui.unlinkScaleCheckbox.enabled = this.value;
        if (!this.value) ui.unlinkScaleCheckbox.value = false;
    };


    // --- Bottom Group for Actions ---
    var bottomGroup = win.add("group");
    bottomGroup.orientation = "column";
    bottomGroup.alignChildren = "fill";
    bottomGroup.spacing = 5;
    bottomGroup.margins.top = 10;
    
    var wiggleButton = bottomGroup.add("button", undefined, S.wiggleButton);

    var clearWrapperGroup = bottomGroup.add("group");
    clearWrapperGroup.orientation = "row";
    clearWrapperGroup.alignChildren = "fill";
    clearWrapperGroup.spacing = 5;

    var clearCheckedButton = clearWrapperGroup.add("button", undefined, S.clearCheckedButton);
    clearCheckedButton.helpTip = S.clearCheckedTip;
    
    var nukeButton = clearWrapperGroup.add("button", undefined, S.nukeButton);
    nukeButton.helpTip = S.nukeButtonTip;


    // =============================================================================
    // --- SCRIPT LOGIC ---
    // =============================================================================
    function validateContext() {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert(S.alertNoComp);
            return null;
        }
        if (comp.selectedLayers.length === 0) {
            alert(S.alertNoLayer);
            return null;
        }
        return comp;
    }

    function getOrAddSliderControl(layer, effectConfig) {
        var effect = layer.effect(effectConfig.name);
        if (effect) {
            return effect;
        } else {
            var newSlider = layer.Effects.addProperty("ADBE Slider Control");
            newSlider.name = effectConfig.name;
            newSlider.property("Slider").setValue(effectConfig.defaultValue);
            return newSlider;
        }
    }

    function runWiggleApply(propertiesToWiggle) {
        var comp = validateContext();
        if (!comp) return;

        var selectedLayers = comp.selectedLayers;
        app.beginUndoGroup(S.undoApply);

        var wiggleMaster = null;
        for (var i = 1; i <= comp.numLayers; i++) {
            var lyr = comp.layer(i);
            if (lyr.name === config.layerName && !lyr.locked) {
                wiggleMaster = lyr;
                break;
            }
        }
        if (!wiggleMaster) {
            wiggleMaster = comp.layers.addNull(comp.duration);
            wiggleMaster.name = config.layerName;
            // --- Corrected Tweak: Hide video in comp viewer (eyeball switch) ---
            wiggleMaster.enabled = false;
        }

        getOrAddSliderControl(wiggleMaster, config.effects.freq);
        getOrAddSliderControl(wiggleMaster, config.effects.loop);
        getOrAddSliderControl(wiggleMaster, config.effects.posterizeTimeFx);

        for (var i = 0; i < propertiesToWiggle.length; i++) {
            var key = propertiesToWiggle[i];
            var map = propertyMap[key];
            var isUnlinked = (key === 'scale') && ui.unlinkScaleCheckbox.value;

            getOrAddSliderControl(wiggleMaster, map.sliderConfig);

            for (var j = 0; j < selectedLayers.length; j++) {
                var targetLayer = selectedLayers[j];
                applyWiggleExpression(targetLayer.property("Transform"), map.propRef, map.sliderConfig.name, isUnlinked);
            }
        }
        
        // --- Restore original layer selection ---
        for (var i = 1; i <= comp.numLayers; i++) {
            comp.layer(i).selected = false;
        }
        for (var i = 0; i < selectedLayers.length; i++) {
            selectedLayers[i].selected = true;
        }

        app.endUndoGroup();
    }
    
    clearCheckedButton.onClick = function() {
        var comp = validateContext();
        if (!comp) return;

        var propsToClear = [];
        if (ui.positionCheckbox.value) propsToClear.push(propertyMap.position.propRef);
        if (ui.scaleCheckbox.value) propsToClear.push(propertyMap.scale.propRef);
        if (ui.rotationCheckbox.value) propsToClear.push(propertyMap.rotation.propRef);
        if (ui.opacityCheckbox.value) propsToClear.push(propertyMap.opacity.propRef);

        if (propsToClear.length === 0) {
            alert(S.alertNoClear);
            return;
        }

        app.beginUndoGroup(S.undoClearChecked);
        var selectedLayers = comp.selectedLayers;
        for (var i = 0; i < selectedLayers.length; i++) {
            var transform = selectedLayers[i].property("Transform");
            for (var j = 0; j < propsToClear.length; j++) {
                var prop = transform.property(propsToClear[j]);
                if (prop && prop.canSetExpression && prop.expression !== "") {
                    prop.expression = "";
                }
            }
        }
        app.endUndoGroup();
    };

    nukeButton.onClick = function() {
        var comp = validateContext();
        if (!comp) return;

        var propsToClear = [propertyMap.position.propRef, propertyMap.scale.propRef, propertyMap.rotation.propRef, propertyMap.opacity.propRef];

        app.beginUndoGroup(S.undoNuke);
        var selectedLayers = comp.selectedLayers;
        for (var i = 0; i < selectedLayers.length; i++) {
            var transform = selectedLayers[i].property("Transform");
            for (var j = 0; j < propsToClear.length; j++) {
                var prop = transform.property(propsToClear[j]);
                if (prop && prop.canSetExpression && prop.expression !== "") {
                    prop.expression = "";
                }
            }
        }
        app.endUndoGroup();
    };
    
    ui.positionButton.onClick = function() { runWiggleApply(["position"]); };
    ui.scaleButton.onClick = function() { runWiggleApply(["scale"]); };
    ui.rotationButton.onClick = function() { runWiggleApply(["rotation"]); };
    ui.opacityButton.onClick = function() { runWiggleApply(["opacity"]); };
    
    wiggleButton.onClick = function() {
        var checkedProperties = [];
        if (ui.positionCheckbox.value) checkedProperties.push("position");
        if (ui.scaleCheckbox.value) checkedProperties.push("scale");
        if (ui.rotationCheckbox.value) checkedProperties.push("rotation");
        if (ui.opacityCheckbox.value) checkedProperties.push("opacity");
        
        if (checkedProperties.length > 0) {
            runWiggleApply(checkedProperties);
        } else {
            alert(S.alertNoApply);
        }
    };
    
    function applyWiggleExpression(transform, propertyRef, amountSliderName, isUnlinked) {
        var selectedProperty = transform.property(propertyRef);
        if (selectedProperty !== null && selectedProperty.canSetExpression) {
            
            var wiggleCore = '';
            // Always check against the English property reference
            if (propertyRef === "Scale" && !isUnlinked) {
                wiggleCore = 'var w1=wiggle(freq,amp,1,.5,t),l1=w1[0],lW1=[l1,l1];if(value.length>2)lW1[2]=l1;var w2=wiggle(freq,amp,1,.5,t-secondsToLoop),l2=w2[0],lW2=[l2,l2];if(value.length>2)lW2[2]=l2;linear(t,0,secondsToLoop,lW1,lW2);';
            } else {
                wiggleCore = 'var w1=wiggle(freq,amp,1,.5,t),w2=wiggle(freq,amp,1,.5,t-secondsToLoop);linear(t,0,secondsToLoop,w1,w2);';
            }

            // The expression now uses the simple, internal English names from config
            selectedProperty.expression = 'try{var master=thisComp.layer("' + config.layerName + '"),pRate=master.effect("' + config.effects.posterizeTimeFx.name + '")("Slider");if(pRate>0)posterizeTime(pRate);var freq=master.effect("' + config.effects.freq.name + '")("Slider"),amp=master.effect("' + amountSliderName + '")("Slider"),secondsToLoop=master.effect("' + config.effects.loop.name + '")("Slider");if(secondsToLoop>0){var t=time%secondsToLoop;' + wiggleCore + '}else{wiggle(freq,amp)}}catch(e){value}';
        }
    }
    
    win.layout.layout(true);
    
    if (win instanceof Window) {
        win.center();
        win.show();
    }
})(this);