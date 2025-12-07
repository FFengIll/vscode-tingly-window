# Tingly Window

VSCode extension for managing window layouts and UI elements.

## Features

### Window Management
- **Window Mode Switching**: Cycle between three layout modes:
  - **L Mode**: Show only left sidebar
  - **LR Mode**: Show all sidebars and panels
  - **FULL Mode**: Hide all sidebars and panels
- **Status Bar Integration**: Window mode indicator with click-to-switch
- **Quick Mode Commands**: Direct commands for Full Window and Show Panels modes
- **Open Folder in Current Window**: Simplify configuration switching by opening folders in the current window instead of creating new windows

### Selected Lines Status Bar
- **Smart Line Counter**: Display selected line count in status bar
- **Customizable Display Format**: Configure text format and VSCode icons
- **Flexible Positioning**: Choose left/right alignment in status bar
- **Priority Control**: Adjust display priority

## Commands

- `Tingly Window: Switch Mode` - Cycle through window modes (L → LR → FULL)
- `Tingly Window: Full Window` - Switch to Full window mode
- `Tingly Window: Show Panels` - Switch to LR mode (show all panels)
- `Tingly Window: Open Folder in Current Window` - Open folder in current window

**Usage**: Click status bar item or use Command Palette (`Ctrl+Shift+P`)

## Configuration

```json
{
  "selectline.displayFormat": "Selected %d Lines",
  "selectline.alignment": "left",
  "selectline.statusbarPriority": 100
}
```

- `displayFormat`: Text format for selected lines (supports VSCode icons)
- `alignment`: Status bar position (`"left"` or `"right"`)
- `statusbarPriority`: Display priority (higher = more left)

## Changelog

### 0.25.1207
- New "Open Folder in New Window" command

### v0.25.1206
- New "Open Folder in Current Window" command
- Enhanced window status bar icons
- Better status bar text display
- Update window mode name (L, LR, FULL)

### v0.25.1107
- Selected lines status bar

### v0.3.0 (and before)
- Window mode switching (L, LR, N/A)

## Ref

- https://go.microsoft.com/fwlink/?LinkID=703825
- https://github.com/tomoki1207/selectline-statusbar/tree/master