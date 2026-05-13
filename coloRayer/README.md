# coloRayer for After Effects

**Version:** v2.0
**Developers:** Gino De Sicco & Elton JSON

coloRayer is a smart, context-aware palette for Adobe After Effects that streamlines labeling layers, keyframes, and project items. It reads your local AE preferences to display the **exact** label colors you have configured.

## 🚀 Features

### 1. Smart Inject System (New in v2.0)
The script now automatically identifies the best target for coloring based on a priority system:
**Keyframes > Layers > Project Selection > Active Comp.**

#### **🎮 Modifier Keys (The Pro Way):**
You can override the automatic logic using keyboard modifiers:
- **Normal Click:** Automatic priority.
- **ALT / OPT + Click:** Forces coloring to the **Project Panel Selection** (ignores timeline).
- **SHIFT + Click:** Forces coloring to the **Active Composition** (the item in the project panel).

### 2. Group Infect (Enhanced Alice Mode)
- **The Core:** Click the **✦** button to color an entire hierarchy.
- **Contextual Target:**
    - If a **Pre-comp layer** is selected in the timeline, it targets that comp and all its nested sub-comps.
    - If nothing is selected, it targets the **Active Comp** and its hierarchy.
- **Recursive Power:** Dives into dependencies to ensure entire project branches are color-coded consistently.

## 📦 Installation

1. Copy `coloRayer.jsx` to your After Effects Scripts folder:
   - **Mac:** `/Applications/Adobe After Effects [Year]/Scripts/ScriptUI Panels/`
   - **Windows:** `C:\Program Files\Adobe\Adobe After Effects [Year]\Support Files\Scripts\ScriptUI Panels\`
2. Restart After Effects.
3. Open via the **Window** menu.

## 💡 Usage Tips
- **Tooltips:** Hover over any color swatch to see the available shortcuts.
- **Zero Label:** The first (grey) swatch clears the label (sets to 0/None).
- **Cross-Platform:** Works on both Windows and macOS (Option = Alt).

---
*Made with ❤️ and ExtendScript.*
