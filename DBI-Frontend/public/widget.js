/**
 * DBI Bot embeddable chat widget.
 *
 * Usage (add before </body> on any website):
 *   <script src="https://<this-app-domain>/widget.js" async></script>
 *
 * Optional overrides via data attributes on the script tag:
 *   data-dbi-url   - base URL of the DBI Bot app (defaults to this script's own origin)
 *   data-position  - "bottom-right" (default) or "bottom-left"
 *   data-color     - brand color for the launcher/header (default "#3D81F6")
 *   data-title     - header title text (default "DBI Bot")
 */
(function () {
  if (window.__dbiChatWidgetLoaded) return;
  window.__dbiChatWidgetLoaded = true;

  var scriptEl =
    document.currentScript ||
    document.querySelector('script[src*="widget.js"]');

  var scriptOrigin = "";
  try {
    scriptOrigin = new URL(scriptEl.src).origin;
  } catch (e) {
    scriptOrigin = window.location.origin;
  }

  var config = {
    baseUrl: (scriptEl.getAttribute("data-dbi-url") || scriptOrigin).replace(/\/$/, ""),
    position: scriptEl.getAttribute("data-position") || "bottom-right",
    color: scriptEl.getAttribute("data-color") || "#3D81F6",
    title: scriptEl.getAttribute("data-title") || "DBI Bot",
  };

  var isLeft = config.position === "bottom-left";
  var sideCss = isLeft ? "left: 20px;" : "right: 20px;";

  var ROOT_ID = "dbi-chat-widget-root";
  if (document.getElementById(ROOT_ID)) return;

  var root = document.createElement("div");
  root.id = ROOT_ID;
  document.body.appendChild(root);

  var style = document.createElement("style");
  style.textContent =
    "#" + ROOT_ID + " * { box-sizing: border-box; }" +
    "#" + ROOT_ID + " .dbi-launcher {" +
    "  position: fixed; bottom: 20px; " + sideCss +
    "  width: 60px; height: 60px; border-radius: 50%;" +
    "  background: " + config.color + "; box-shadow: 0 8px 24px rgba(0,0,0,0.25);" +
    "  display: flex; align-items: center; justify-content: center;" +
    "  cursor: pointer; z-index: 2147483000; border: none; transition: transform 0.15s ease;" +
    "}" +
    "#" + ROOT_ID + " .dbi-launcher:hover { transform: scale(1.06); }" +
    "#" + ROOT_ID + " .dbi-panel {" +
    "  position: fixed; bottom: 92px; " + sideCss +
    "  width: 380px; max-width: calc(100vw - 40px);" +
    "  height: 600px; max-height: calc(100vh - 120px);" +
    "  background: #fff; border-radius: 16px; overflow: hidden;" +
    "  box-shadow: 0 12px 40px rgba(0,0,0,0.3);" +
    "  display: none; flex-direction: column; z-index: 2147483000;" +
    "}" +
    "#" + ROOT_ID + " .dbi-panel.dbi-open { display: flex; }" +
    "#" + ROOT_ID + " .dbi-header {" +
    "  background: " + config.color + "; color: #fff; flex-shrink: 0;" +
    "  display: flex; align-items: center; justify-content: space-between;" +
    "  padding: 12px 16px; font-family: Arial, sans-serif;" +
    "}" +
    "#" + ROOT_ID + " .dbi-header-title { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; }" +
    "#" + ROOT_ID + " .dbi-header img { width: 22px; height: 22px; }" +
    "#" + ROOT_ID + " .dbi-close {" +
    "  background: transparent; border: none; color: #fff; cursor: pointer;" +
    "  font-size: 20px; line-height: 1; padding: 4px; opacity: 0.9;" +
    "}" +
    "#" + ROOT_ID + " .dbi-close:hover { opacity: 1; }" +
    "#" + ROOT_ID + " .dbi-panel iframe { flex: 1; width: 100%; border: none; }" +
    "@media (max-width: 480px) {" +
    "  #" + ROOT_ID + " .dbi-panel {" +
    "    bottom: 0; right: 0; left: 0; top: 0; width: 100vw; height: 100vh;" +
    "    max-width: 100vw; max-height: 100vh; border-radius: 0;" +
    "  }" +
    "}";
  document.head.appendChild(style);

  var launcher = document.createElement("button");
  launcher.className = "dbi-launcher";
  launcher.setAttribute("aria-label", "Open " + config.title + " chat");
  launcher.innerHTML =
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M4 4h16v12H7l-3 3V4z" fill="#fff"/>' +
    "</svg>";

  var panel = document.createElement("div");
  panel.className = "dbi-panel";

  var header = document.createElement("div");
  header.className = "dbi-header";
  header.innerHTML =
    '<div class="dbi-header-title"><img src="' + config.baseUrl + '/favicon.svg" alt="" />' + config.title + "</div>";

  var closeBtn = document.createElement("button");
  closeBtn.className = "dbi-close";
  closeBtn.setAttribute("aria-label", "Close chat");
  closeBtn.innerHTML = "&times;";
  header.appendChild(closeBtn);

  var iframe = document.createElement("iframe");
  iframe.title = config.title;
  var iframeLoaded = false;

  panel.appendChild(header);
  panel.appendChild(iframe);
  root.appendChild(panel);
  root.appendChild(launcher);

  function openPanel() {
    if (!iframeLoaded) {
      iframe.src = config.baseUrl + "/";
      iframeLoaded = true;
    }
    panel.classList.add("dbi-open");
    launcher.setAttribute("aria-expanded", "true");
  }

  function closePanel() {
    panel.classList.remove("dbi-open");
    launcher.setAttribute("aria-expanded", "false");
  }

  launcher.addEventListener("click", function () {
    if (panel.classList.contains("dbi-open")) {
      closePanel();
    } else {
      openPanel();
    }
  });

  closeBtn.addEventListener("click", closePanel);
})();
