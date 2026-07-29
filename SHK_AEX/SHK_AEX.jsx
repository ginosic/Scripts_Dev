/*
 * SHK_AEX.jsx - Shark AeMaster (v1.3)
 * After Effects Native Versioner & Duplicator Panel
 * Developed by: Elton JSON for CodeVault / AeScripts
 * 
 * Features:
 * - Smart Token-Based Base Name cleaning:
 *   1. Protects core project tokens (first 3 tokens: e.g. NJA_FS701_ENDCARD or NJA_FS70X_SZL)
 *   2. Preserves studio/department tags (SUPERS, VFX, MGFX, etc.) and cuts everything after them
 *   3. Removes trailing versions (_V01), 6-digit dates (_YYMMDD), and trailing initials (_GDS) without duplicating or deleting descriptor tokens
 * - All UI in English (no Portuguese strings)
 * - Responsive dockable ScriptUI layout with proper resizing hooks
 * - Persistent preferences for Initials & Target Folder/Tag via app.settings
 * - "Increment and Save" behavior: saves directly to /AE_PROJECTS/<FOLDER>/ and keeps new version active
 */

(function(thisObj) {
    // ===================================================================
    //                      CONSTANTS & PREFERENCES
    // ===================================================================
    var PREF_SECTION = "SHK_AEX_Preferences";
    var PREF_KEY_INITIALS = "Initials";
    var PREF_KEY_FOLDER = "TargetFolder";
    
    var DEFAULT_INITIALS = "GDS";
    var DEFAULT_FOLDER = "SUPERS";

    // ===================================================================
    //                         HELPER FUNCTIONS
    // ===================================================================

    function getSetting(key, defaultValue) {
        try {
            if (app.settings.haveSetting(PREF_SECTION, key)) {
                return app.settings.getSetting(PREF_SECTION, key);
            }
        } catch (e) {}
        return defaultValue;
    }

    function saveSetting(key, value) {
        try {
            app.settings.saveSetting(PREF_SECTION, key, value);
        } catch (e) {}
    }

    function getDateString() {
        var d = new Date();
        var yy = String(d.getFullYear()).slice(-2);
        var mm = ('0' + (d.getMonth() + 1)).slice(-2);
        var dd = ('0' + d.getDate()).slice(-2);
        return yy + mm + dd;
    }

    function indexOfUpper(arr, str) {
        if (!str) return -1;
        var target = str.toUpperCase();
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].toUpperCase() === target) return i;
        }
        return -1;
    }

    function cleanBaseName(name, folderTag) {
        if (!name || name === "") return "Untitled_Project";
        // Strip .aep extension if present
        name = name.replace(/\.aep$/i, "");

        // Studio tags that denote the folder/tag segment of a filename
        var tags = ["SUPERS", "VFX", "MGFX", "REFS", "SHOTS", "ASSETS"];
        if (folderTag && folderTag.length > 0 && indexOfUpper(tags, folderTag) === -1) {
            tags.push(folderTag.toUpperCase());
        }

        var tokens = name.split("_");
        var minTokens = Math.min(3, tokens.length);
        var tagFoundIndex = -1;

        // 1. Check if a Studio Tag exists after the first token
        for (var i = 1; i < tokens.length; i++) {
            var tokenUpper = tokens[i].toUpperCase();
            if (indexOfUpper(tags, tokenUpper) !== -1) {
                tagFoundIndex = i;
                var activeTagUpper = (folderTag || "SUPERS").toUpperCase();
                // If the found tag is a different studio tag than the active folderTag, update it
                if (tokenUpper !== activeTagUpper) {
                    tokens[i] = (folderTag || "SUPERS");
                }
                break;
            }
        }

        if (tagFoundIndex !== -1) {
            // Keep tokens up to and including the studio tag, discard everything after it
            tokens = tokens.slice(0, tagFoundIndex + 1);
        } else {
            // 2. No studio tag found -> clean from the end backwards, protecting at least the first 3 core tokens
            var initialsStripped = false;
            while (tokens.length > minTokens) {
                var lastToken = tokens[tokens.length - 1];
                if (/^v\d+$/i.test(lastToken)) {
                    // Trailing version number like V01, v02
                    tokens.pop();
                } else if (/^\d{6}$/.test(lastToken)) {
                    // Trailing 6-digit date like 260729
                    tokens.pop();
                } else if (!initialsStripped && /^[A-Za-z]{2,4}$/.test(lastToken)) {
                    // Trailing initials like GDS, EJ (strip only once from the end)
                    tokens.pop();
                    initialsStripped = true;
                } else {
                    // Token is part of the core descriptor -> stop stripping immediately
                    break;
                }
            }
        }

        return tokens.join("_") || "Project";
    }

    function getTargetDirectory(projFile, folderTag) {
        if (!projFile || !projFile.exists) return null;
        var parentDir = projFile.parent.fsName.replace(/\\/g, "/");
        
        var idx = parentDir.indexOf("/AE_PROJECTS");
        var baseAeDir;
        if (idx !== -1) {
            baseAeDir = parentDir.substring(0, idx + "/AE_PROJECTS".length);
        } else {
            baseAeDir = parentDir;
        }
        var folderName = (folderTag && folderTag.length > 0) ? folderTag : DEFAULT_FOLDER;
        return baseAeDir + "/" + folderName;
    }

    // ===================================================================
    //                           UI BUILDING
    // ===================================================================

    function buildUI(thisObj) {
        var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "SHARK AEMASTER", undefined, {resizeable: true});
        pal.orientation = "column";
        pal.alignChildren = ["fill", "top"];
        pal.spacing = 10;
        pal.margins = 12;
        pal.minimumSize = [200, 310];

        // --- SECTION: BASE NAME ---
        var baseGroup = pal.add("panel", undefined, "Base Name");
        baseGroup.orientation = "row";
        baseGroup.alignChildren = ["fill", "center"];
        baseGroup.alignment = ["fill", "top"];
        baseGroup.margins = [10, 15, 10, 10];

        var baseInput = baseGroup.add("edittext", undefined, "");
        baseInput.alignment = ["fill", "center"];
        var btnRefresh = baseGroup.add("button", undefined, "⟳");
        btnRefresh.helpTip = "Reload base name from active project";
        btnRefresh.preferredSize = [28, 22];
        btnRefresh.alignment = ["right", "center"];

        // --- SECTION: TARGET FOLDER / TAG ---
        var folderGroup = pal.add("panel", undefined, "Target Folder / Tag");
        folderGroup.orientation = "column";
        folderGroup.alignChildren = ["fill", "top"];
        folderGroup.alignment = ["fill", "top"];
        folderGroup.margins = [10, 15, 10, 10];
        var folderInput = folderGroup.add("edittext", undefined, getSetting(PREF_KEY_FOLDER, DEFAULT_FOLDER));
        folderInput.alignment = ["fill", "top"];
        folderInput.helpTip = "Subfolder to create/use (e.g., SUPERS, VFX, MGFX)";

        // --- SECTION: INITIALS ---
        var initialsGroup = pal.add("panel", undefined, "Initials");
        initialsGroup.orientation = "column";
        initialsGroup.alignChildren = ["fill", "top"];
        initialsGroup.alignment = ["fill", "top"];
        initialsGroup.margins = [10, 15, 10, 10];
        var initialsInput = initialsGroup.add("edittext", undefined, getSetting(PREF_KEY_INITIALS, DEFAULT_INITIALS));
        initialsInput.alignment = ["fill", "top"];
        initialsInput.helpTip = "Your initials (e.g., GDS)";

        // --- SECTION: LIVE PREVIEW ---
        var previewGroup = pal.add("panel", undefined, "Live Preview (Increment & Save)");
        previewGroup.orientation = "column";
        previewGroup.alignChildren = ["fill", "top"];
        previewGroup.alignment = ["fill", "top"];
        previewGroup.margins = [10, 15, 10, 10];
        previewGroup.spacing = 6;
        
        var previewPathText = previewGroup.add("statictext", undefined, "", {multiline: true});
        previewPathText.graphics.font = ScriptUI.newFont("Tahoma", "BOLD", 11);
        previewPathText.alignment = ["fill", "top"];
        previewPathText.preferredSize.height = 38;

        var previewFileText = previewGroup.add("statictext", undefined, "");
        previewFileText.graphics.font = ScriptUI.newFont("Tahoma", "BOLD", 13);
        previewFileText.alignment = ["fill", "top"];

        // --- ACTION BUTTON ---
        var btnSave = pal.add("button", undefined, "⚡ Increment & Save");
        btnSave.alignment = ["fill", "top"];
        btnSave.preferredSize.height = 32;

        // --- LOGIC & HELPERS ---
        function updatePreview() {
            var folderTag = folderInput.text.replace(/[\/\\]/g, "").toUpperCase() || "SUPERS";
            var initStr = initialsInput.text.replace(/\s+/g, "").toUpperCase() || "GDS";
            var baseStr = baseInput.text || "Untitled";

            var dateStr = getDateString();
            var finalName = baseStr + "_" + dateStr + "_" + initStr + ".aep";
            
            var targetDir = getTargetDirectory(app.project.file, folderTag);
            if (!targetDir) {
                targetDir = "Root: [Save project once to detect directory] / " + folderTag;
            }

            previewPathText.text = "Dir: " + targetDir;
            previewFileText.text = "File: " + finalName;

            // Save preferences on type
            saveSetting(PREF_KEY_FOLDER, folderTag);
            saveSetting(PREF_KEY_INITIALS, initStr);
        }

        function reloadFromProject() {
            var folderTag = folderInput.text || "SUPERS";
            if (app.project && app.project.file && app.project.file.exists) {
                baseInput.text = cleanBaseName(app.project.file.name, folderTag);
            } else {
                baseInput.text = "Untitled_Project";
            }
            updatePreview();
        }

        // --- EVENT HANDLERS ---
        baseInput.onChanging = updatePreview;
        folderInput.onChanging = function() {
            folderInput.text = folderInput.text.toUpperCase();
            updatePreview();
        };
        initialsInput.onChanging = function() {
            initialsInput.text = initialsInput.text.toUpperCase();
            updatePreview();
        };
        btnRefresh.onClick = reloadFromProject;

        btnSave.onClick = function() {
            if (!app.project) {
                alert("No active project open in After Effects.", "SHK_AEX - Error");
                return;
            }
            if (!app.project.file || !app.project.file.exists) {
                alert("Please save your project once before using SHK_AEX to establish the root directory.", "SHK_AEX - Warning");
                return;
            }

            var folderTag = folderInput.text.replace(/[\/\\]/g, "").toUpperCase() || "SUPERS";
            var initStr = initialsInput.text.replace(/\s+/g, "").toUpperCase() || "GDS";
            var baseStr = cleanBaseName(baseInput.text, folderTag);

            var targetDirStr = getTargetDirectory(app.project.file, folderTag);
            var dateStr = getDateString();
            var finalName = baseStr + "_" + dateStr + "_" + initStr + ".aep";
            var fullPath = targetDirStr + "/" + finalName;

            try {
                var folderObj = new Folder(targetDirStr);
                if (!folderObj.exists) {
                    var created = folderObj.create();
                    if (!created) {
                        alert("Unable to create directory:\n" + targetDirStr, "SHK_AEX - Permission Error");
                        return;
                    }
                }

                var destFile = new File(fullPath);
                app.project.save(destFile);

                reloadFromProject();
                alert("✔ Project versioned and saved successfully!\nActive version:\n" + fullPath, "SHK_AEX - Success");
            } catch (err) {
                alert("Error saving project:\n" + err.toString(), "SHK_AEX - Error");
            }
        };

        // --- RESIZING & LAYOUT HOOKS ---
        pal.onResizing = pal.onResized = function() {
            this.layout.resize();
        };

        // --- INITIALIZE UI ---
        reloadFromProject();

        pal.layout.layout(true);
        pal.layout.resize();

        return pal;
    }

    var shkPanel = buildUI(thisObj);
    if ((shkPanel !== null) && (shkPanel instanceof Window)) {
        shkPanel.center();
        shkPanel.show();
    }

})(this);
