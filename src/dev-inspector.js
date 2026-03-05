// DevInspector — Zero-dependency element inspector for any webpage
// Hover to inspect, click to copy structured info for AI coding assistants
// Usage: bookmarklet | console paste | script tag
(function () {
  "use strict";

  // Prevent duplicate injection
  if (window.__devInspector) {
    window.__devInspector.toggle();
    return;
  }

  // ── i18n ──
  var isZh = /^zh/i.test(navigator.language);
  var T = {
    badge: isZh ? "🔍 Inspector" : "🔍 Inspector",
    badgeOn: isZh ? "🔍 Inspector ON (⌥A)" : "🔍 Inspector ON (⌥A)",
    copied: isZh ? "✅ 已复制到剪贴板" : "✅ Copied to clipboard",
    clickHint: isZh ? "👆 点击元素复制信息" : "👆 Click to copy",
    component: isZh ? "组件" : "Component",
    framework: isZh ? "框架" : "Framework",
    element: isZh ? "元素" : "Element",
    position: isZh ? "位置" : "Position",
    fontSize: isZh ? "字号" : "Font size",
    lineHeight: isZh ? "行高" : "Line height",
    color: isZh ? "颜色" : "Color",
    padding: isZh ? "内边距" : "Padding",
    margin: isZh ? "外边距" : "Margin",
    borderRadius: isZh ? "圆角" : "Radius",
    background: isZh ? "背景" : "Background",
  };

  // ── Style property map ──
  var PROPS = [
    [T.fontSize, "font-size"],
    [T.lineHeight, "line-height"],
    ["font-weight", "font-weight"],
    [T.color, "color"],
    [T.background, "background-color"],
    [T.padding, "padding"],
    [T.margin, "margin"],
    [T.borderRadius, "border-radius"],
    ["width", "width"],
    ["height", "height"],
    ["position", "position"],
    ["display", "display"],
    ["opacity", "opacity"],
    ["overflow", "overflow"],
    ["gap", "gap"],
  ];

  // ── Internal component filter ──
  var INTERNAL_NAMES = [
    "Router",
    "Routes",
    "Route",
    "RenderedRoute",
    "Provider",
    "Navigation",
    "Location",
    "PresenceChild",
    "AnimatePresence",
    "BrowserRouter",
    "HashRouter",
    "MemoryRouter",
    "Navigate",
    "Outlet",
    "RouterProvider",
    "StaticRouter",
    "Link",
    "ConnectedRouter",
    "Connect",
  ];
  var INTERNAL_SET = {};
  INTERNAL_NAMES.forEach(function (n) {
    INTERNAL_SET[n] = true;
  });

  // ── Utilities ──
  function fmtColor(v) {
    if (!v || v === "rgba(0, 0, 0, 0)" || v === "transparent")
      return "transparent";
    var m = v.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (m) {
      var h = function (n) {
        return parseInt(n).toString(16).padStart(2, "0");
      };
      return "#" + h(m[1]) + h(m[2]) + h(m[3]);
    }
    return v;
  }

  function getStyleVal(comp, css) {
    var v = comp.getPropertyValue(css);
    return css === "color" || css === "background-color" ? fmtColor(v) : v;
  }

  function getSelector(el) {
    var tag = el.tagName.toLowerCase();
    var cls = Array.from(el.classList).slice(0, 5).join(".");
    return cls ? tag + "." + cls : tag;
  }

  function getReactChain(el) {
    var key = Object.keys(el).find(function (k) {
      return (
        k.startsWith("__reactFiber$") ||
        k.startsWith("__reactInternalInstance$")
      );
    });
    if (!key) return null;
    var fiber = el[key],
      chain = [];
    while (fiber) {
      if (fiber.type && typeof fiber.type === "function") {
        var name = fiber.type.displayName || fiber.type.name;
        if (
          name &&
          name[0] !== "_" &&
          name !== "Fragment" &&
          !INTERNAL_SET[name]
        ) {
          chain.unshift(name);
        }
      } else if (
        fiber.type &&
        typeof fiber.type === "object" &&
        fiber.type.$$typeof
      ) {
        var inner = fiber.type.render || fiber.type.type;
        var n =
          (inner && (inner.displayName || inner.name)) ||
          fiber.type.displayName;
        if (n && !INTERNAL_SET[n]) chain.unshift(n);
      }
      fiber = fiber.return;
    }
    return chain.length ? chain : null;
  }

  // ── Framework detection (Vue / Angular / Svelte) ──
  function getFrameworkInfo(el) {
    // Vue 2/3
    if (el.__vue__)
      return (
        "Vue: " +
        (el.__vue__.$options.name ||
          el.__vue__.$options._componentTag ||
          "Anonymous")
      );
    if (el.__vueParentComponent) {
      var c = el.__vueParentComponent;
      return "Vue: " + (c.type.name || c.type.__name || "Anonymous");
    }
    // Angular
    var ngKey = Object.keys(el).find(function (k) {
      return k.startsWith("__ng");
    });
    if (ngKey) return "Angular component";
    // Svelte
    if (el.__svelte_meta) return "Svelte component";
    return null;
  }

  // ── DOM setup ──
  var root = document.createElement("div");
  root.setAttribute("data-dev-inspector", "");
  root.style.cssText =
    "pointer-events:none;position:fixed;top:0;left:0;width:0;height:0;z-index:99999;";
  document.body.appendChild(root);

  // Badge
  var badge = document.createElement("div");
  badge.style.cssText =
    "position:fixed;top:8px;right:8px;z-index:99999;padding:4px 10px;border-radius:6px;" +
    "font:12px system-ui,sans-serif;background:rgba(0,0,0,0.5);color:#fff;" +
    "pointer-events:auto;cursor:pointer;user-select:none;transition:background 0.2s;";
  badge.textContent = T.badge;
  root.appendChild(badge);

  // Highlight overlay
  var highlight = document.createElement("div");
  highlight.style.cssText =
    "position:fixed;pointer-events:none;border:2px solid #E07050;border-radius:2px;" +
    "background:rgba(224,112,80,0.08);z-index:99997;display:none;";
  root.appendChild(highlight);

  // Info panel
  var panel = document.createElement("div");
  panel.setAttribute("data-dev-inspector", "");
  panel.style.cssText =
    "position:fixed;width:320px;max-height:420px;overflow-y:auto;z-index:99998;" +
    "background:rgba(15,15,25,0.95);backdrop-filter:blur(8px);color:#e0e0e0;" +
    "border-radius:8px;padding:10px 12px;font:12px/1.6 'SF Mono','Fira Code',Consolas,monospace;" +
    "border:1px solid rgba(224,112,80,0.4);box-shadow:0 8px 32px rgba(0,0,0,0.5);" +
    "pointer-events:none;display:none;";
  root.appendChild(panel);

  // Copy toast
  var toast = document.createElement("div");
  toast.style.cssText =
    "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:100000;" +
    "padding:12px 24px;border-radius:8px;font:14px system-ui,sans-serif;" +
    "background:rgba(15,15,25,0.95);color:#4ade80;pointer-events:none;display:none;" +
    "border:1px solid rgba(74,222,128,0.3);";
  toast.textContent = T.copied;
  root.appendChild(toast);

  // ── State ──
  var active = false;
  var hoveredEl = null;

  function setActive(v) {
    active = v;
    badge.style.background = v ? "#E07050" : "rgba(0,0,0,0.5)";
    badge.textContent = v ? T.badgeOn : T.badge;
    if (!v) {
      highlight.style.display = "none";
      panel.style.display = "none";
      hoveredEl = null;
    }
  }

  // ── Panel update ──
  function updatePanel(el) {
    var rect = el.getBoundingClientRect();
    var comp = getComputedStyle(el);
    var chain = getReactChain(el);
    var fw = getFrameworkInfo(el);

    // Highlight
    highlight.style.display = "block";
    highlight.style.left = rect.left - 1 + "px";
    highlight.style.top = rect.top - 1 + "px";
    highlight.style.width = rect.width + 2 + "px";
    highlight.style.height = rect.height + 2 + "px";

    // Panel content
    var html = "";
    if (chain)
      html +=
        '<div style="color:#80b0ff;margin-bottom:4px">🧩 React: ' +
        chain.join(" &gt; ") +
        "</div>";
    if (fw)
      html +=
        '<div style="color:#a78bfa;margin-bottom:4px">🧩 ' + fw + "</div>";
    html +=
      '<div style="color:#c0c0c0;margin-bottom:4px">📍 &lt;' +
      el.tagName.toLowerCase() +
      ' class="' +
      Array.from(el.classList).slice(0, 6).join(" ") +
      '"&gt;</div>';

    // Position & size line
    html +=
      '<div style="color:#4ade80;margin-bottom:8px">📐 (' +
      Math.round(rect.x) +
      ", " +
      Math.round(rect.y) +
      ") " +
      Math.round(rect.width) +
      "×" +
      Math.round(rect.height) +
      "</div>";

    html +=
      '<div style="border-top:1px solid rgba(255,255,255,0.1);margin-bottom:6px"></div>';

    PROPS.forEach(function (p) {
      var v = getStyleVal(comp, p[1]);
      if (v && v !== "none" && v !== "normal" && v !== "auto") {
        html +=
          '<div style="display:flex;justify-content:space-between;padding:2px 0">' +
          '<span style="color:#999">' +
          p[0] +
          " " +
          p[1] +
          "</span>" +
          '<span style="color:#f0d080;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' +
          v +
          "</span></div>";
      }
    });

    // Click hint
    html +=
      '<div style="border-top:1px solid rgba(255,255,255,0.1);margin-top:6px;padding-top:6px;' +
      'color:#666;text-align:center;font-size:11px">' +
      T.clickHint +
      "</div>";

    panel.innerHTML = html;
    panel.style.display = "block";

    // Panel positioning
    var pw = 320,
      ph = 420,
      g = 8;
    if (rect.right + g + pw < window.innerWidth)
      panel.style.left = rect.right + g + "px";
    else if (rect.left - g - pw > 0)
      panel.style.left = rect.left - g - pw + "px";
    else
      panel.style.left = Math.min(rect.left, window.innerWidth - pw - 8) + "px";
    panel.style.top =
      Math.max(8, Math.min(rect.top, window.innerHeight - ph - 8)) + "px";
  }

  // ── Copy info ──
  function copyInfo(el) {
    var rect = el.getBoundingClientRect();
    var comp = getComputedStyle(el);
    var chain = getReactChain(el);
    var fw = getFrameworkInfo(el);
    var sel = getSelector(el);

    var lines = ["[DevInspector]"];
    if (chain) lines.push(T.component + ": " + chain.join(" > "));
    if (fw) lines.push(T.framework + ": " + fw);
    lines.push(T.element + ": " + sel);
    lines.push(
      T.position +
        ": (" +
        Math.round(rect.x) +
        ", " +
        Math.round(rect.y) +
        ") " +
        Math.round(rect.width) +
        "×" +
        Math.round(rect.height),
    );

    var fs = comp.getPropertyValue("font-size");
    var lh = comp.getPropertyValue("line-height");
    var col = fmtColor(comp.getPropertyValue("color"));
    lines.push(
      T.fontSize +
        ": " +
        fs +
        " | " +
        T.lineHeight +
        ": " +
        lh +
        " | " +
        T.color +
        ": " +
        col,
    );

    var pad = comp.getPropertyValue("padding");
    var mar = comp.getPropertyValue("margin");
    var br = comp.getPropertyValue("border-radius");
    lines.push(
      T.padding +
        ": " +
        pad +
        " | " +
        T.margin +
        ": " +
        mar +
        " | " +
        T.borderRadius +
        ": " +
        br,
    );

    var bg = fmtColor(comp.getPropertyValue("background-color"));
    lines.push(T.background + ": " + bg);

    navigator.clipboard.writeText(lines.join("\n")).then(function () {
      toast.style.display = "block";
      setTimeout(function () {
        toast.style.display = "none";
      }, 1200);
    });
  }

  // ── Event handlers ──
  function onMove(e) {
    if (!active) return;
    var el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el || el.closest("[data-dev-inspector]")) return;
    if (el === hoveredEl) return;
    hoveredEl = el;
    updatePanel(el);
  }

  function onClick(e) {
    if (!active || !hoveredEl) return;
    var el = hoveredEl;
    if (el.closest("[data-dev-inspector]")) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    copyInfo(el);
  }

  function onKey(e) {
    if (e.altKey && e.code === "KeyA") {
      e.preventDefault();
      setActive(!active);
      return;
    }
    if (
      active &&
      (e.key === "Escape" || e.code === "Escape" || e.keyCode === 27)
    ) {
      e.preventDefault();
      e.stopPropagation();
      setActive(false);
    }
  }

  document.addEventListener("mousemove", onMove, true);
  document.addEventListener("click", onClick, true);
  window.addEventListener("keydown", onKey, true);

  badge.addEventListener("click", function (e) {
    e.stopPropagation();
    setActive(!active);
  });

  // ── Public API ──
  window.__devInspector = {
    toggle: function () {
      setActive(!active);
    },
    destroy: function () {
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKey, true);
      root.remove();
      delete window.__devInspector;
    },
  };
})();
