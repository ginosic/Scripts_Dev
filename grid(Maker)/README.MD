# grid(Maker) for After Effects

**Version:** v1.2
**Developer:** Gino De Sicco & Elton JSON

grid(Maker) is a dynamic grid generation tool for Adobe After Effects that goes far beyond static lines. It builds a **reactive grid system** controlled by a single Null Layer (Effector).

The grid lines are not just placed; they are rigged with expressions that allow them to be "pushed" and distorted by the controller, creating organic, responsive layouts perfect for UI design, sci-fi HUDs, and kinetic typography.

## 🚀 Features

### 1. Reactive Grid System
- **Controller-Driven:** Generates a `Grid Ctrl` null layer that acts as the brain of the grid.
- **Push & Distort:** The grid lines react to the controller's position. Move the controller to "push" lines apart, creating focus areas or breathing animations.

### 2. Fully Customizable
- **Dynamic Inputs:** Set the number of Vertical and Horizontal lines, line thickness, and interaction range directly from the panel.
- **Live Adjustments:** Once built, you can tweak the `Line Thickness`, `Max Push`, `Effect Range`, and `Grid Color` in real-time via the Effect Controls panel on the controller layer.

### 3. Smart Cells (Auto-Fill)
- **fill(Cells)? Mode:** When enabled, the script automatically generates shape layers to fill the gaps between grid lines.
- **Responsive Geometry:** These cells resize and move automatically as you push the grid lines, maintaining a solid background structure.

## 📦 Installation

1. Copy `grid(Maker).jsx` to your After Effects Scripts folder:
   - **Mac:** `/Applications/Adobe After Effects [Year]/Scripts/ScriptUI Panels/`
   - **Windows:** `C:\Program Files\Adobe\Adobe After Effects [Year]\Support Files\Scripts\ScriptUI Panels\`
2. Restart After Effects.
3. Open via the **Window** menu.

## 💡 Usage

1. Open a composition.
2. In the **grid(Maker)** panel, set your desired parameters:
   - **Controller Name:** Name of the null layer (default: "Grid Ctrl").
   - **Vertical/Horizontal Lines:** How many lines you want.
   - **Max Push Distance:** How far lines can move when the controller gets close.
   - **Effect Range:** The radius of influence for the controller.
   - **fill(Cells)?:** Check this to generate background cells.
3. Click **"make(Grid)!"**.
4. Select the newly created Controller layer and move it around to see the grid react!

---
*Developed with ❤️ and ExtendScript.*