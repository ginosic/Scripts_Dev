// =============================================================================
// Script Name: Wiggle Master
// Version: 5.0
// Creators: Pedro Isaias, Gino De Sicco (@gino.sicco) and Elton JSON
// Description: Applies loopable wiggle expressions to ANY property.
// =============================================================================

var lingo = {
    en: {
        scriptName: "Wiggle Master v5.0",
        propPosition: "Position",
        propScale: "Scale",
        propRotation: "Rotation",
        propOpacity: "Opacity",
        unlinkUniversal: "Unlink Dimensions",
        unlinkUniversalTip: "Apply independent wiggle to each axis (for 2D/3D properties)",
        wiggleSelected: "★ Wiggle Selected",
        wiggleSelectedTip: "Apply wiggle to any property selected in the timeline",
        wiggleChecked: "Wiggle Checked",
        clearCheckedButton: "Clear Checked",
        nukeButton: "Nuke 'Em",
        undoApply: "Apply Wiggle Master",
        alertNoComp: "Please select a composition first.",
        alertNoLayer: "Please select at least one layer.",
        alertNoProp: "Please select at least one property in the timeline."
    },
    pt: {
        scriptName: "Wiggle Master v5.0",
        propPosition: "Posição",
        propScale: "Escala",
        propRotation: "Rotação",
        propOpacity: "Opacidade",
        unlinkUniversal: "Separar Dimensões",
        unlinkUniversalTip: "Aplica wiggle independente em cada eixo (para propriedades 2D/3D)",
        wiggleSelected: "★ Wiggle Selecionado",
        wiggleSelectedTip: "Aplica wiggle a qualquer propriedade selecionada na timeline",
        wiggleChecked: "Wiggle Marcados",
        clearCheckedButton: "Limpar Marcados",
        nukeButton: "Limpar Tudo",
        undoApply: "Aplicar Wiggle Master",
        alertNoComp: "Por favor, selecione uma composição primeiro.",
        alertNoLayer: "Por favor, selecione pelo menos uma camada.",
        alertNoProp: "Por favor, selecione ao menos uma propriedade na timeline."
    }
};

var S = (app.language === Language.PORTUGUESE) ? lingo.pt : lingo.en;

(function(thisObj) {

    var config = {
        scriptName: S.scriptName,
        layerName: "Wiggle Master",
        effects: {
            freq: { name: "WM Freq", defaultValue: 2 },
            loop: { name: "WM Loop Duration", defaultValue: 60 },
            posterizeTimeFx: { name: "WM Posterize Time", defaultValue: 0 }
        }
    };

    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", config.scriptName, undefined);
    win.spacing = 8; win.margins = 12;

    // --- QUICK TRANSFORM SECTION ---
    var quickPanel = win.add("panel", undefined, "Quick Transform");
    quickPanel.orientation = "column"; quickPanel.alignChildren = "fill"; quickPanel.spacing = 5;

    var ui = {};
    var commonProps = [
        { key: "position", label: S.propPosition, ref: "ADBE Position" },
        { key: "scale", label: S.propScale, ref: "ADBE Scale" },
        { key: "rotation", label: S.propRotation, ref: "ADBE Rotation" },
        { key: "opacity", label: S.propOpacity, ref: "ADBE Opacity" }
    ];

    function addPropRow(parent, item) {
        var r = parent.add("group");
        r.spacing = 10;
        ui[item.key + "Chk"] = r.add("checkbox", undefined, "");
        ui[item.key + "Btn"] = r.add("button", undefined, item.label);
        ui[item.key + "Btn"].preferredSize = [120, 22];
        ui[item.key + "Btn"].onClick = function() { runSmartWiggle([item.ref], false); };
    }

    for (var i = 0; i < commonProps.length; i++) addPropRow(quickPanel, commonProps[i]);

    // --- UNIVERSAL SETTINGS ---
    var settingsGroup = win.add("group");
    settingsGroup.orientation = "column"; settingsGroup.alignChildren = "left";
    ui.unlinkChk = settingsGroup.add("checkbox", undefined, S.unlinkUniversal);
    ui.unlinkChk.helpTip = S.unlinkUniversalTip;

    // --- MAIN ACTIONS ---
    var mainActions = win.add("group");
    mainActions.orientation = "column"; mainActions.alignChildren = "fill"; mainActions.spacing = 5;

    var wiggleSelectedBtn = mainActions.add("button", undefined, S.wiggleSelected);
    wiggleSelectedBtn.helpTip = S.wiggleSelectedTip;
    wiggleSelectedBtn.preferredSize.height = 35;

    var wiggleCheckedBtn = mainActions.add("button", undefined, S.wiggleChecked);

    var clearGroup = mainActions.add("group");
    clearGroup.spacing = 5;
    var clearBtn = clearGroup.add("button", undefined, S.clearCheckedButton);
    clearBtn.preferredSize = [85, 22];
    var nukeBtn = clearGroup.add("button", undefined, S.nukeButton);
    nukeBtn.preferredSize = [85, 22];

    // =============================================================================
    // --- LOGIC ---
    // =============================================================================

    function getMasterLayer(comp) {
        for (var i = 1; i <= comp.numLayers; i++) {
            if (comp.layer(i).name === config.layerName && !comp.layer(i).locked) return comp.layer(i);
        }
        var m = comp.layers.addNull();
        m.name = config.layerName; m.enabled = false;
        return m;
    }

    function getSlider(layer, name, def) {
        var eff = layer.effect(name);
        if (eff) return eff;
        var s = layer.Effects.addProperty("ADBE Slider Control");
        s.name = name; s.property("Slider").setValue(def || 50);
        return s;
    }

    function runSmartWiggle(targetPropNames, useSelection) {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) { alert(S.alertNoComp); return; }

        var selectedLayers = comp.selectedLayers;
        if (selectedLayers.length === 0) { alert(S.alertNoLayer); return; }

        app.beginUndoGroup(S.undoApply);
        var master = getMasterLayer(comp);
        getSlider(master, config.effects.freq.name, config.effects.freq.defaultValue);
        getSlider(master, config.effects.loop.name, config.effects.loop.defaultValue);
        getSlider(master, config.effects.posterizeTimeFx.name, config.effects.posterizeTimeFx.defaultValue);

        var propsToProcess = [];
        if (useSelection) {
            for (var i = 0; i < selectedLayers.length; i++) {
                var sel = selectedLayers[i].selectedProperties;
                for (var j = 0; j < sel.length; j++) {
                    if (sel[j].propertyType === PropertyType.PROPERTY && sel[j].canSetExpression) {
                        propsToProcess.push(sel[j]);
                    }
                }
            }
        } else {
            for (var i = 0; i < selectedLayers.length; i++) {
                for (var j = 0; j < targetPropNames.length; j++) {
                    var p = selectedLayers[i].property("ADBE Transform Group").property(targetPropNames[j]);
                    if (p) propsToProcess.push(p);
                }
            }
        }

        if (propsToProcess.length === 0 && useSelection) { alert(S.alertNoProp); app.endUndoGroup(); return; }

        for (var i = 0; i < propsToProcess.length; i++) {
            var prop = propsToProcess[i];
            var amtSliderName = "WM " + prop.name + " Amount";
            getSlider(master, amtSliderName, 50);
            applyExpression(prop, amtSliderName, ui.unlinkChk.value);
        }

        app.endUndoGroup();
    }

    function applyExpression(prop, amtSlider, forceUnlink) {
        var isMulti = prop.value.length > 1;
        var doUnlink = isMulti && forceUnlink;

        var wiggleCore = '';
        if (doUnlink) {
            // Universal Unlink: Works for 2D, 3D, or any array property
            wiggleCore = 'var w1=wiggle(freq,amp,1,.5,t),w2=wiggle(freq,amp,1,.5,t-secondsToLoop),res=[];for(var i=0;i<value.length;i++){res[i]=linear(t,0,secondsToLoop,w1[i],w2[i])}res;';
        } else if (isMulti) {
            // Multi-dimensional but linked (standard Scale behavior)
            wiggleCore = 'var w1=wiggle(freq,amp,1,.5,t),v1=w1[0],lW1=[];for(var i=0;i<value.length;i++){lW1[i]=v1}var w2=wiggle(freq,amp,1,.5,t-secondsToLoop),v2=w2[0],lW2=[];for(var i=0;i<value.length;i++){lW2[i]=v2}linear(t,0,secondsToLoop,lW1,lW2);';
        } else {
            // Single dimension
            wiggleCore = 'var w1=wiggle(freq,amp,1,.5,t),w2=wiggle(freq,amp,1,.5,t-secondsToLoop);linear(t,0,secondsToLoop,w1,w2);';
        }

        prop.expression = 'try{var master=thisComp.layer("' + config.layerName + '"),pRate=master.effect("' + config.effects.posterizeTimeFx.name + '")("Slider");if(pRate>0)posterizeTime(pRate);var freq=master.effect("' + config.effects.freq.name + '")("Slider"),amp=master.effect("' + amtSlider + '")("Slider"),secondsToLoop=master.effect("' + config.effects.loop.name + '")("Slider");if(secondsToLoop>0){var t=time%secondsToLoop;' + wiggleCore + '}else{wiggle(freq,amp)}}catch(e){value}';
    }

    // --- EVENTS ---
    wiggleSelectedBtn.onClick = function() { runSmartWiggle([], true); };

    wiggleCheckedBtn.onClick = function() {
        var targets = [];
        if (ui.positionChk.value) targets.push("ADBE Position");
        if (ui.scaleChk.value) targets.push("ADBE Scale");
        if (ui.rotationChk.value) targets.push("ADBE Rotation");
        if (ui.opacityChk.value) targets.push("ADBE Opacity");
        runSmartWiggle(targets, false);
    };

    clearBtn.onClick = function() {
        var comp = app.project.activeItem;
        if (!comp) return;
        var selLayers = comp.selectedLayers;
        var targets = [];
        if (ui.positionChk.value) targets.push("ADBE Position");
        if (ui.scaleChk.value) targets.push("ADBE Scale");
        if (ui.rotationChk.value) targets.push("ADBE Rotation");
        if (ui.opacityChk.value) targets.push("ADBE Opacity");

        app.beginUndoGroup("Clear Wiggles");
        for (var i = 0; i < selLayers.length; i++) {
            for (var j = 0; j < targets.length; j++) {
                var p = selLayers[i].property("ADBE Transform Group").property(targets[j]);
                if (p && p.canSetExpression) p.expression = "";
            }
        }
        app.endUndoGroup();
    };

    nukeBtn.onClick = function() {
        var comp = app.project.activeItem;
        if (!comp) return;
        app.beginUndoGroup("Nuke Wiggles");
        var selLayers = comp.selectedLayers;
        for (var i = 0; i < selLayers.length; i++) {
            var props = selLayers[i].selectedProperties;
            if (props.length > 0) {
                for (var j = 0; j < props.length; j++) if (props[j].canSetExpression) props[j].expression = "";
            } else {
                // Fallback to transform if no props selected
                var t = selLayers[i].property("ADBE Transform Group");
                for (var j = 1; j <= t.numProperties; j++) if (t.property(j).canSetExpression) t.property(j).expression = "";
            }
        }
        app.endUndoGroup();
    };

    win.layout.layout(true);
    if (win instanceof Window) { win.center(); win.show(); }
})(this);