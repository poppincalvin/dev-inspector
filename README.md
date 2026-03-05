# DevInspector

> Hover, inspect, copy — paste structured UI info to your AI coding assistant.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![No Dependencies](https://img.shields.io/badge/dependencies-0-green.svg)](#)

AI coding assistants need **structured element data**, not screenshots.
A screenshot costs ~3000 tokens. DevInspector's clipboard output? **~150 tokens.**

---

## Install

### Bookmarklet (recommended)

1. Run `npm install && npm run build`
2. Copy the content of `dist/bookmarklet.txt`
3. Create a new bookmark and paste as the URL

### Console Paste

Open DevTools console and paste the content of `src/dev-inspector.js`.

### Script Tag

```html
<script src="https://unpkg.com/dev-inspector/src/dev-inspector.js"></script>
```

---

## Usage

1. **⌥A** (Alt+A) to toggle inspector — or click the badge
2. **Hover** any element to see highlight + property panel
3. **Click** the element to copy structured info to clipboard
4. **Paste** into your AI assistant (Claude Code, Cursor, Copilot Chat, etc.)
5. **ESC** to deactivate

---

## Clipboard Format

```
[DevInspector]
Component: App > Header > NavBar
Element: nav.main-nav.sticky
Position: (0, 0) 1440×64
Font size: 14px | Line height: 20px | Color: #1a1a2e
Padding: 12px 24px | Margin: 0px | Radius: 0px
Background: #ffffff
```

---

## Framework Support

| Framework | Detection |
|-----------|-----------|
| **React** | Fiber tree → component chain (filters internal Router/Redux components) |
| **Vue 2/3** | `__vue__` / `__vueParentComponent` → component name |
| **Angular** | `__ng*` key detection |
| **Svelte** | `__svelte_meta` detection |

---

## Use with AI Assistants

### Claude Code

```
Look at this element and suggest improvements:

[DevInspector]
Component: App > ProductCard
Element: div.card.shadow-md
Position: (120, 340) 320×180
Font size: 16px | Line height: 24px | Color: #333333
Padding: 16px | Margin: 0px 8px | Radius: 12px
Background: #ffffff
```

### Cursor / Copilot Chat

Paste DevInspector output directly in the chat — AI gets precise element context without a screenshot.

---

## API

```js
// Toggle inspector on/off
window.__devInspector.toggle();

// Remove inspector completely
window.__devInspector.destroy();
```

---

## i18n

DevInspector auto-detects `navigator.language` and switches between English and Chinese (中文) for panel labels and clipboard output.

---

## Build

```bash
npm install
npm run build
```

Outputs:
- `dist/dev-inspector.min.js` — minified script
- `dist/bookmarklet.txt` — ready-to-use bookmarklet URL

---

## License

[MIT](LICENSE)
