# Wiggle Master for After Effects

**Version:** v4.0
**Creator:** Pedro Isaias
**Co-Developers:** Gino De Sicco & Elton JSON

Wiggle Master is a powerful automation tool for Adobe After Effects that revolutionizes how you apply and control wiggles. Instead of dealing with isolated expressions on every single layer, Wiggle Master links everything to a central "Master Null" object.

This allows you to change the frequency, amplitude, and—most importantly—**create seamless loops** for all your wiggling layers at once.

## 🚀 Features

### 1. Centralized Control
- **One Null to Rule Them All:** The script creates a "Wiggle Master" layer in your comp.
- **Global Adjustments:** Change the Frequency or Amplitude (Amount) for Position, Scale, Rotation, and Opacity for *all* linked layers instantly via Sliders.

### 2. Seamless Looping
- **Perfect Loops:** Unlike the standard wiggle expression, Wiggle Master is built to loop. Just set the **Loop Duration** slider (in seconds) on the Master layer, and your chaotic motion will wrap around perfectly.

### 3. Advanced Controls
- **Unlink Scale:** Choose between uniform scaling (X/Y locked) or independent wiggling (squash and stretch effect).
- **Posterize Time:** Built-in "Stop Motion" feel. Adjust the frame rate of the wiggle directly on the Master layer without adding extra adjustment layers.

### 4. Workflow Tools
- **Nuke 'Em:** A panic button to strip expressions from all properties on selected layers.
- **Clear Checked:** Removes expressions only from the specific properties you have checked in the UI.

## 📦 Installation

1. Copy `Wiggle Master.jsx` to your After Effects Scripts folder:
   - **Mac:** `/Applications/Adobe After Effects [Year]/Scripts/ScriptUI Panels/`
   - **Windows:** `C:\Program Files\Adobe\Adobe After Effects [Year]\Support Files\Scripts\ScriptUI Panels\`
2. Restart After Effects.
3. Open via the **Window** menu.

## 💡 Usage

1. Select one or more layers in your composition.
2. Check the properties you want to animate (Position, Scale, Rotation, Opacity).
3. Click **"Wiggle it!"**.
4. The script will create a **"Wiggle Master"** layer (if one doesn't exist).
5. Select the **"Wiggle Master"** layer and go to the **Effect Controls** panel to adjust the speed, amount, and loop duration.

---
*Original concept by Pedro Isaias. Developed with ❤️ and ExtendScript.*