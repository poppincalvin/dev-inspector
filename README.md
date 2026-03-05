[English](README.md) | [中文](README.zh-CN.md)

# DevInspector

> Zero-dependency element inspector. Hover, click, copy — structured UI data for AI coding assistants.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![No Dependencies](https://img.shields.io/badge/dependencies-0-green.svg)](#) [![Chrome Extension](https://img.shields.io/badge/chrome-extension-brightgreen.svg)](#chrome-extension-recommended)

**AI assistants need structured data, not screenshots.**
A screenshot costs ~3000 tokens. DevInspector output? **~150 tokens.**

## Install

### Chrome Extension (recommended)

Persistent, works on every page, no manual activation needed.

1. Clone this repo (or download ZIP)
2. Open `chrome://extensions/` → enable **Developer mode**
3. Click **Load unpacked** → select the project folder
4. Refresh any page → **Alt+A** to toggle

### Bookmarklet

1. `npm install && npm run build`
2. Copy content of `dist/bookmarklet.txt`
3. Create a bookmark → paste as URL → click to activate on any page

### Console Paste

Open DevTools → paste `src/dev-inspector.js` → runs immediately.

## Usage

| Key            | Action                                  |
| -------------- | --------------------------------------- |
| **Alt+A** (⌥A) | Toggle inspector on/off                 |
| **Hover**      | Highlight element + show property panel |
| **Click**      | Copy structured info to clipboard       |
| **ESC**        | Deactivate inspector                    |

Paste the copied output into Claude Code, Cursor, Copilot Chat, or any AI assistant.

## Output Format

```
[DevInspector]
Component: App > Header > NavBar
Element: nav.main-nav.sticky
Position: (0, 0) 1440×64
Font size: 14px | Line height: 20px | Color: #1a1a2e
Padding: 12px 24px | Margin: 0px | Radius: 0px
Background: #ffffff
```

~150 tokens — 20x cheaper than a screenshot.

## Framework Support

| Framework   | Detection                                                     |
| ----------- | ------------------------------------------------------------- |
| **React**   | Fiber tree → component chain (filters Router/Redux internals) |
| **Vue 2/3** | `__vue__` / `__vueParentComponent` → component name           |
| **Angular** | `__ng*` key detection                                         |
| **Svelte**  | `__svelte_meta` detection                                     |

## i18n

Auto-detects `navigator.language` — switches between English and Chinese for panel labels and clipboard output.

## API

```js
window.__devInspector.toggle(); // toggle on/off
window.__devInspector.destroy(); // remove completely
```

## Build

```bash
npm install && npm run build
```

Outputs `dist/dev-inspector.min.js` (minified) and `dist/bookmarklet.txt`.

## License

[MIT](LICENSE)
