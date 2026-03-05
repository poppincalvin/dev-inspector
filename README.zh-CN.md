[English](README.md) | 中文

# DevInspector

> 悬停、检查、复制 — 将结构化 UI 信息粘贴给你的 AI 编程助手。

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![No Dependencies](https://img.shields.io/badge/dependencies-0-green.svg)](#)

AI 编程助手需要的是**结构化的元素数据**，不是截图。
一张截图消耗 ~3000 tokens，DevInspector 的剪贴板输出只要 **~150 tokens**。

---

## 安装

### Bookmarklet（推荐）

1. 运行 `npm install && npm run build`
2. 复制 `dist/bookmarklet.txt` 的内容
3. 新建书签，粘贴为 URL

### 控制台粘贴

打开 DevTools 控制台，粘贴 `src/dev-inspector.js` 的内容即可。

### Script 标签

```html
<script src="https://unpkg.com/dev-inspector/src/dev-inspector.js"></script>
```

---

## 使用

1. **⌥A** (Alt+A) 切换检查器 — 或点击右上角标记
2. **悬停** 任意元素查看高亮 + 属性面板
3. **点击** 元素复制结构化信息到剪贴板
4. **粘贴** 到你的 AI 助手（Claude Code、Cursor、Copilot Chat 等）
5. **ESC** 关闭检查器

---

## 剪贴板格式

```
[DevInspector]
组件: App > Header > NavBar
元素: nav.main-nav.sticky
位置: (0, 0) 1440×64
字号: 14px | 行高: 20px | 颜色: #1a1a2e
内边距: 12px 24px | 外边距: 0px | 圆角: 0px
背景: #ffffff
```

---

## 框架支持

| 框架        | 检测方式                                            |
| ----------- | --------------------------------------------------- |
| **React**   | Fiber 树 → 组件链（自动过滤 Router/Redux 内部组件） |
| **Vue 2/3** | `__vue__` / `__vueParentComponent` → 组件名         |
| **Angular** | `__ng*` 属性检测                                    |
| **Svelte**  | `__svelte_meta` 检测                                |

---

## 配合 AI 助手使用

### Claude Code

```
看看这个元素，帮我优化样式：

[DevInspector]
组件: App > ProductCard
元素: div.card.shadow-md
位置: (120, 340) 320×180
字号: 16px | 行高: 24px | 颜色: #333333
内边距: 16px | 外边距: 0px 8px | 圆角: 12px
背景: #ffffff
```

### Cursor / Copilot Chat

直接粘贴 DevInspector 输出到对话框 — AI 无需截图就能获得精确的元素上下文。

---

## API

```js
// 切换检查器开关
window.__devInspector.toggle();

// 完全移除检查器
window.__devInspector.destroy();
```

---

## 国际化

DevInspector 自动检测 `navigator.language`，在中英文之间切换面板标签和剪贴板输出。

---

## 构建

```bash
npm install
npm run build
```

输出：

- `dist/dev-inspector.min.js` — 压缩脚本
- `dist/bookmarklet.txt` — 可直接使用的 bookmarklet URL

---

## 许可证

[MIT](LICENSE)
