/* Bagusin homepage: mixed "what's new" carousel.
   Add only items that are genuinely published/available. publishedAt is the public release date.
   Items expire from this homepage shelf after 30 days; newest first; never show more than 6.
   Supported types are intentionally generic: service, product, template, demo, code, app, article, course.
*/
(function () {
  "use strict";
  const root = document.querySelector("[data-whats-new]");
  if (!root) return;

  const items = [
    {
      id: "bagus-ink-demo",
      type: "demo",
      title: "Website studio tato",
      eyebrow: "Bagus Ink · Bali Tattoo Studio",
      description: "Konsep premium dengan galeri karya, informasi studio, dan jalur kontak.",
      href: "/bagusin/demos/starter/tattoo-studio/",
      image: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=900&q=80",
      imageAlt: "Contoh desain untuk studio tato",
      publishedAt: "2026-10-12"
    },
    {
      id: "sewa-mobil-bali-demo",
      type: "demo",
      title: "Website rental mobil",
      eyebrow: "Demo website · Otomotif",
      description: "Lihat contoh tampilan dan alur website untuk usaha rental mobil.",
      href: "https://baguskristiansianturi.github.io/Sewa-Mobil-Bali/",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85",
      imageAlt: "Mobil sebagai contoh demo website rental",
      publishedAt: "2026-10-12"
    },
    {
      id: "template-collection",
      type: "template",
      title: "Template dan desain",
      eyebrow: "Koleksi · Produk digital",
      description: "Jelajahi contoh desain dan template yang bisa dikembangkan sesuai kebutuhan.",
      href: "/bagusin/collections/",
      image: "https://images.unsplash.com/photo-1460925895917-afdab8277c52?auto=format&fit=crop&w=900&q=80",
      imageAlt: "Tampilan antarmuka produk digital",
      publishedAt: "2026-10-12"
    }
  ];

  const DAY = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const visible = items
    .filter(item => {
      const date = Date.parse(item.publishedAt + "T00:00:00");
      return item.id && item.title && item.href && Number.isFinite(date) &&
        date <= now && now < date + 30 * DAY;
    })
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, 6);

  const track = root.querySelector("[data-whats-new-track]");
  const status = root.querySelector("[data-whats-new-status]");
  const prev = root.querySelector("[data-whats-new-prev]");
  const next = root.querySelector("[data-whats-new-next]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timer = null;

  const typeLabels = {
    service: "Layanan baru", product: "Produk baru", template: "Template baru",
    demo: "Demo terbaru", code: "Kode & proyek", app: "Aplikasi", article: "Artikel",
    course: "Course"
  };

  if (!visible.length) {
    root.hidden = true;
    return;
  }

  track.innerHTML = visible.map(item => {
    const safe = value => String(value).replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
    const external = /^https?:\/\//i.test(item.href) && !item.href.includes("baguskristiansianturi.github.io/bagusin/");
    return `<article class="whats-new-card">
      <a class="whats-new-card__link" href="${safe(item.href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>
        <span class="whats-new-card__media"><img src="${safe(item.image)}" alt="${safe(item.imageAlt || "")}" loading="lazy" width="900" height="620"><span class="whats-new-card__badge">${safe(typeLabels[item.type] || "Baru di Bagusin")}</span></span>
        <span class="whats-new-card__body"><span class="whats-new-card__eyebrow">${safe(item.eyebrow || "")}</span><strong class="whats-new-card__title">${safe(item.title)}</strong><span class="whats-new-card__description">${safe(item.description || "")}</span><span class="whats-new-card__action">Lihat selengkapnya <span aria-hidden="true">↗</span></span></span>
      </a>
    </article>`;
  }).join("");

  const cards = () => [...track.querySelectorAll(".whats-new-card")];
  function step(direction) {
    const first = cards()[0];
    if (!first) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 16;
    track.scrollBy({ left: direction * (first.getBoundingClientRect().width + gap), behavior: reduceMotion ? "auto" : "smooth" });
  }
  function stop() { if (timer) window.clearInterval(timer); timer = null; }
  function start() {
    stop();
    if (reduceMotion || visible.length < 2 || root.matches(":hover") || root.contains(document.activeElement)) return;
    timer = window.setInterval(() => {
      const end = track.scrollWidth - track.clientWidth - 4;
      if (track.scrollLeft >= end) track.scrollTo({ left: 0, behavior: "smooth" });
      else step(1);
    }, 6000);
  }

  prev.addEventListener("click", () => { step(-1); start(); });
  next.addEventListener("click", () => { step(1); start(); });
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", event => { if (!root.contains(event.relatedTarget)) start(); });
  track.addEventListener("scroll", () => {
    const count = cards().length;
    const index = Math.min(count, Math.floor((track.scrollLeft + 8) / (cards()[0]?.getBoundingClientRect().width + 16 || 1)) + 1);
    status.textContent = count ? `${index} dari ${count}` : "";
  }, { passive: true });
  status.textContent = `1 dari ${visible.length}`;
  start();
})();