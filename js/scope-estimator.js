/* BAGUSIN — scope estimator. Produces a brief, not a price or delivery promise. */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-scope-estimator]").forEach((form) => {
    const service = form.dataset.service;
    const summary = form.querySelector("[data-scope-summary]");
    const link = form.querySelector("[data-scope-cta]");
    const notes = form.querySelector("[data-scope-notes]");
    const selectedItems = () => [...form.querySelectorAll("[data-scope-item]:checked")].map((input) => input.value);
    const buildScope = () => {
      const items = selectedItems();
      const priority = form.querySelector("[name='scope_priority']")?.value || "Belum ditentukan";
      const extra = notes?.value.trim();
      const parts = [
        "Layanan: " + (form.dataset.serviceLabel || service),
        "Kebutuhan yang dipilih: " + (items.length ? items.join(", ") : "Belum dipilih"),
        "Prioritas utama: " + priority
      ];
      if (extra) parts.push("Catatan tambahan: " + extra);
      return parts.join(" | ");
    };
    const refresh = () => {
      const scope = buildScope();
      if (summary) summary.textContent = scope.replaceAll(" | ", "\n");
      if (link) {
        const base = window.location.pathname.split("/").includes("en") ? "/bagusin/en/contact/" : "/bagusin/contact/";
        link.href = base + "?" + new URLSearchParams({service, mode:"quote", scope, source:"service-scope-estimator"}).toString();
      }
    };
    form.addEventListener("change", refresh);
    notes?.addEventListener("input", refresh);
    refresh();
  });
});
