# Pathfinder for After Effects

**Version:** v2.5.1 (Golden Master)
**Developers:** Gino De Sicco & Elton JSON

Pathfinder is a robust dashboard panel for Adobe After Effects designed to audit your project's file structure, locate missing or stray assets, and organize your workspace with a few clicks.

## 🚀 Features

### 1. The Audit Dashboard
- **Real-time Monitoring:** Shows the current root folder being tracked.
- **Strays Detection:** Identifies files imported into AE that are located *outside* the project root folder (e.g., Downloads, Desktop).
- **Orphans Detection:** Identifies files located *inside* your root folder that haven't been imported into AE yet.

### 2. Strays Management (The "Rescue" Team)
- **Collect (Copy & Relink):** Safely copies stray files to a `_Collected_Strays` folder within your project root and relinks them automatically.
- **Auto Relink (Search):** Searches your root folder for files with matching names and relinks them without moving/copying. Great for fixing broken links after manual organization.
- **The Bouncer:** Intelligently skips layered files (PSD, AI, PDF) during automated processes to prevent unwanted merging or layer loss.

### 3. Orphans Management
- **Import:** Bulk imports unused files into a structured `_Pathfinder_Imports` bin in your Project Panel.
- **Reveal:** Quickly opens the file location in Finder/Explorer.

### 4. Power User Tools
- **Bulk Selection:** "Select All" / "None" buttons for quick management.
- **Visual Feedback:** Dynamic list that updates as you process files.
- **Selection Sync:** Select an item in the list to highlight it in the Project Panel instantly.

## 📦 Installation

1. Copy `Pathfinder.jsx` to your After Effects Scripts folder:
   - **Mac:** `/Applications/Adobe After Effects [Year]/Scripts/ScriptUI Panels/`
   - **Windows:** `C:\Program Files\Adobe\Adobe After Effects [Year]\Support Files\Scripts\ScriptUI Panels\`
2. Restart After Effects.
3. Open via the **Window** menu (bottom of the list).

## ⚠️ Notes
- The script requires permission to write files/folders (for the Collect feature).
- Always save your project (`.aep`) before running an audit for automatic folder detection.

---
*Made with ❤️ and ExtendScript.*