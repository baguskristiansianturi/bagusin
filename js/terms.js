document.addEventListener("DOMContentLoaded", () => {
  "use strict";
  const params = new URLSearchParams(location.search);
  const topic = (params.get("topic") || "").toLowerCase();
  const banner = document.getElementById("context-banner");
  const title = document.getElementById("context-title");
  const clear = document.getElementById("clear-context");
  const map = {
    copywriting: ["Copywriting", "copywriting"],
    "seo-content": ["Penulisan Konten & SEO", "seo-content"],
    "landing-pages": ["Landing Page & Iklan", "landing-pages"],
    websites: ["Website & Template", "websites"],
    website: ["Website & Template", "websites"],
    "web-applications": ["Aplikasi Web & Sistem Basis Data", "web-applications"],
    "web-application": ["Aplikasi Web & Sistem Basis Data", "web-applications"],
    "maintenance-uiux": ["Pemeliharaan, Peningkatan & UI/UX", "maintenance-uiux"],
    "google-ads": ["Google Ads", "google-ads"],
    "mobile-apps": ["Aplikasi Mobile", "mobile-apps"],
    course: ["Course Privat", "courses"],
    courses: ["Course Privat", "courses"],
    "digital-product": ["Produk Digital", "digital-products"],
    "digital-products": ["Produk Digital", "digital-products"],
    payment: ["Pembayaran", "payment"],
    refund: ["Pembatalan & Pengembalian Dana", "cancellation"],
    cancellation: ["Pembatalan & Pengembalian Dana", "cancellation"],
    revision: ["Revisi", "revision"],
    terms: ["Ketentuan Umum", "general"],
    general: ["Ketentuan Umum", "general"]
  };
  const selected = map[topic];
  const targetId = selected ? selected[1] : "";
  if (selected && banner && title) {
    banner.hidden = false;
    title.textContent = selected[0];
    requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
  clear?.addEventListener("click", () => {
    history.replaceState(null, "", location.pathname);
    if (banner) banner.hidden = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  const input = document.getElementById("terms-filter");
  const links = [...document.querySelectorAll("#terms-nav a")];
  const sections = [...document.querySelectorAll(".terms-content section[id]")];
  const normalize = (value) => String(value || "").toLocaleLowerCase("id").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  input?.addEventListener("input", () => {
    const query = normalize(input.value.trim());
    links.forEach((link) => {
      const target = document.querySelector(link.getAttribute("href"));
      const haystack = normalize((link.textContent || "") + " " + (target?.textContent || ""));
      link.hidden = Boolean(query && !haystack.includes(query));
    });
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.classList.toggle("is-current", link.getAttribute("href") === "#" + entry.target.id));
    }), { rootMargin: "-25% 0px -65% 0px" });
    sections.forEach((section) => observer.observe(section));
  }
});