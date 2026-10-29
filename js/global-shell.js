/* Shared shell loader. Only pages with explicit placeholders use this component. */
(() => {
  "use strict";
  const base = "/bagusin";
  async function load(target, path) {
    const host = document.querySelector(target);
    if (!host) return;
    try {
      const response = await fetch(base + path, { credentials: "same-origin" });
      if (!response.ok) throw new Error("Shared component request failed: " + path);
      host.innerHTML = await response.text();
    } catch (error) {
      host.setAttribute("data-shell-error", "true");
      console.error("[Bagusin shell]", error);
    }
  }
  Promise.all([
    load("[data-global-header]", "/components/site-header.html"),
    load("[data-global-footer]", "/components/site-footer.html")
  ]).then(() => {
    document.querySelectorAll("[data-current-year]").forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });
    document.dispatchEvent(new CustomEvent("bagusin:shell-ready"));
  });
})();
