grid(Maker) v1.2 – README

### 1. Placement Instructions:

- **As a Standard Script:**  
    Place the file (e.g., `grid(Maker)_v1.2.jsx`) in your After Effects Scripts folder:
    - **Windows:**  
        `C:\Program Files\Adobe\Adobe After Effects <version>\Support Files\Scripts\`
    - **macOS:**  
        `/Applications/Adobe After Effects <version>/Scripts/`
- **As a Dockable Panel:**  
    Place the file in your ScriptUI Panels folder:
    - **Windows:**  
        `C:\Program Files\Adobe\Adobe After Effects <version>\Support Files\ScriptUI Panels\`
    - **macOS:**  
        `/Applications/Adobe After Effects <version>/ScriptUI Panels/`
- Restart After Effects after placing the script to ensure it is recognized.

### 2. Script Description:

grid(Maker) dynamically creates a reactive grid system within your active composition. It generates a controller null layer (the effector) and a set of vertical and horizontal grid line shape layers that adjust automatically based on composition size, layer order, and controller settings.

**User Inputs:**

- **Controller Name:**  
    Sets the name of the controller null layer; this name is incorporated into the naming convention for grid lines.
- **Vertical & Horizontal Lines:**  
    Specify the number of grid lines in each direction.
- **Line Thickness:**  
    Determines the uniform thickness applied to all grid lines.
- **Max Push Distance (pixels):**  
    Defines the maximum displacement for grid lines under the push effect.
- **Effect Range (pixels):**  
    Specifies the range within which the push effect is active.
- **fill(Cells)?**  
    When enabled, the script creates additional shape layers (cells) that fill the gaps between grid lines. These cells are dynamically sized based on adjacent grid lines and are automatically moved to the bottom of the layer stack so they appear behind the grid lines.

### 3. Changelog:

- **v1.1:**
    - Small performance improvements.
    - Added support for usage as a dockable panel.
- **v1.2:**
    - Introduced the new fill(Cells) functionality.
    - Additional performance optimizations for dynamic grid adjustments.

### 4. Feedback:

If you enjoy using grid(Maker) and have ideas for improvements, please send your feedback to:  
**hey@ginodesicco.com**  
And if you create something cool with it, tag **@gino.sicco** on Instagram!

Happy Gridding!