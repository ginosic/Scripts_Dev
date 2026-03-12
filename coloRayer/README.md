# coloRayer for After Effects

**Version:** v1.5
**Developers:** Gino De Sicco & Elton JSON

coloRayer is a smart palette for Adobe After Effects that streamlines the process of labeling layers, keyframes and compositions. Unlike standard label scripts, coloRayer reads your local AE preferences to display the **exact** label colors you have configured, ensuring what you see is what you get.

## 🚀 Features

### 1. Contextual Layer Coloring
- **One-Click Labeling:** Apply label colors to selected layers or keyframes instantly.
- **Live Color Sync:** The panel fetches the actual hex codes from your After Effects "Label Preferences". If you have custom label colors set up in AE, coloRayer will match them perfectly.
- **Full Spectrum:** Access all 16 label colors + "None" (Grey) in a compact grid.

### 2. "Alice" Mode (Recursive Comp Coloring)
- **The Rabbit Hole:** Click the **✦** button to enter Alice mode.
- **Recursive Power:** Select a composition in the Project Panel and choose a color. Alice will dive into that composition and recursively label **that comp and all its pre-comps/dependencies** with the chosen color.
- **Organization Savior:** Perfect for color-coding entire branches of a project (e.g., "All Character Pre-comps = Blue", "All BG Pre-comps = Green").

## 📦 Installation

1. Copy `coloRayer.jsx` to your After Effects Scripts folder:
   - **Mac:** `/Applications/Adobe After Effects [Year]/Scripts/ScriptUI Panels/`
   - **Windows:** `C:\Program Files\Adobe\Adobe After Effects [Year]\Support Files\Scripts\ScriptUI Panels\`
2. Restart After Effects.
3. Open via the **Window** menu (bottom of the list).

## 💡 Usage

**For Layers:**
1. Open a composition.
2. Select one or more layers or keyframes.
3. Click a color swatch in the coloRayer panel.

**For Comps (Alice Mode):**
1. Select a **single composition** in the Project Panel.
2. Click the **✦** button at the bottom of the panel.
3. Pick a color from the pop-up window.
4. Watch as the comp and all its nested pre-comps are labeled automatically.

---
*Made with ❤️ and ExtendScript.*