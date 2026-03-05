[English](README.md) | 中文

# DevInspector

> 零依赖元素检查器。悬停、点击、复制 — 为 AI 编程助手提供结构化 UI 数据。

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![No Dependencies](https://img.shields.io/badge/dependencies-0-green.svg)](#) [![Chrome Extension](https://img.shields.io/badge/chrome-extension-brightgreen.svg)](#chrome-扩展推荐)

**AI 助手需要结构化数据，不是截图。**
一张截图消耗 ~3000 tokens，DevInspector 输出只要 **~150 tokens**。

## 安装

### Chrome 扩展（推荐）

常驻后台，所有页面自动生效，无需手动激活。

1. 克隆仓库（或下载 ZIP）
2. 打开 `chrome://extensions/` → 开启**开发者模式**
3. 点击**加载已解压的扩展程序** → 选择项目文件夹
4. 刷新任意页面 → **Alt+A** 切换

### Bookmarklet

1. `npm install && npm run build`
2. 复制 `dist/bookmarklet.txt` 内容
3. 新建书签 → 粘贴为 URL → 点击即可在任意页面激活

### 控制台粘贴

打开 DevTools → 粘贴 `src/dev-inspector.js` → 立即生效。

## 使用

| 按键           | 操作                    |
| -------------- | ----------------------- |
| **Alt+A** (⌥A) | 切换检查器开关          |
| **悬停**       | 高亮元素 + 显示属性面板 |
| **点击**       | 复制结构化信息到剪贴板  |
| **ESC**        | 关闭检查器              |

将复制的内容粘贴到 Claude Code、Cursor、Copilot Chat 或任意 AI 助手。

## 输出格式

```
[DevInspector]
组件: App > Header > NavBar
元素: nav.main-nav.sticky
位置: (0, 0) 1440×64
字号: 14px | 行高: 20px | 颜色: #1a1a2e
内边距: 12px 24px | 外边距: 0px | 圆角: 0px
背景: #ffffff
```

~150 tokens — 比截图省 20 倍。

## 框架支持

| 框架        | 检测方式                                            |
| ----------- | --------------------------------------------------- |
| **React**   | Fiber 树 → 组件链（自动过滤 Router/Redux 内部组件） |
| **Vue 2/3** | `__vue__` / `__vueParentComponent` → 组件名         |
| **Angular** | `__ng*` 属性检测                                    |
| **Svelte**  | `__svelte_meta` 检测                                |

## 国际化

自动检测 `navigator.language`，中英文自动切换面板标签和剪贴板输出。

## API

```js
window.__devInspector.toggle(); // 切换开关
window.__devInspector.destroy(); // 完全移除
```

## 构建

```bash
npm install && npm run build
```

输出 `dist/dev-inspector.min.js`（压缩版）和 `dist/bookmarklet.txt`。

## 许可证

[MIT](LICENSE)
