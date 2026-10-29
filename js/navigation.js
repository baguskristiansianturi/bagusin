(function(){if(!document.querySelector('link[data-ux-polish]')){const base=window.location.pathname.startsWith("/bagusin/")||window.location.pathname==="/bagusin"?"/bagusin":"";const l=document.createElement("link");l.rel="stylesheet";l.href=base+"/css/ux-polish.css?v=20261011-1";l.dataset.uxPolish="";document.head.appendChild(l)}})();
(function(){if(!document.querySelector('link[data-final-responsive]')){const base=window.location.pathname.startsWith("/bagusin/")||window.location.pathname==="/bagusin"?"/bagusin":"";const l=document.createElement("link");l.rel="stylesheet";l.href=base+"/css/final-responsive.css?v=20261011-6";l.dataset.finalResponsive="";document.head.appendChild(l)}})();
(function(){if(!document.querySelector('link[data-site-consistency]')){const base=window.location.pathname.startsWith("/bagusin/")||window.location.pathname==="/bagusin"?"/bagusin":"";const l=document.createElement("link");l.rel="stylesheet";l.href=base+"/css/site-consistency.css?v=20261029-1";l.dataset.siteConsistency="";document.head.appendChild(l)}})();
(function(){if(!document.querySelector('link[data-global-footer]')){const base=window.location.pathname.startsWith("/bagusin/")||window.location.pathname==="/bagusin"?"/bagusin":"";const l=document.createElement("link");l.rel="stylesheet";l.href=base+"/css/footer.css?v=20261029-3";l.dataset.globalFooter="";document.head.appendChild(l)}})();
/* =========================================================
   BAGUSIN — GLOBAL NAVIGATION
   Integrated mobile / search / dropdown / language
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector("[data-site-header], .site-header");

    // Template catalog and live demo routes are paused while the core site is being cleaned up.
    // Remove their navigation entries everywhere instead of leaving dead-end menu links.
    if (header) {
      header.querySelectorAll('a[href]').forEach(function (link) {
        let pathname = "";
        try { pathname = new URL(link.href, window.location.href).pathname; } catch (_) {}
        if (/\/(?:collections|templates|demos)(?:\/|$)/.test(pathname)) {
          const item = link.closest("li");
          if (item) item.remove();
          else link.remove();
        }
      });
    }

    // Older content pages may have the search button without its panel. Add the shared
    // panel once so the global search works consistently across all routes.
    let searchPanel = document.getElementById("header-search");
    if (!searchPanel && header) {
      const siteBase = window.location.pathname.startsWith("/bagusin/") || window.location.pathname === "/bagusin" ? "/bagusin" : "";
      const isEnglishPage = /^\/(?:bagusin\/)?en(?:\/|$)/.test(window.location.pathname);
      searchPanel = document.createElement("div");
      searchPanel.className = "header-search";
      searchPanel.id = "header-search";
      searchPanel.hidden = true;
      const searchInner = document.createElement("div");
      searchInner.className = "header-search__inner container";
      const form = document.createElement("form");
      form.className = "search-field";
      form.method = "get";
      form.action = siteBase + (isEnglishPage ? "/en/search/" : "/search/");
      form.setAttribute("role", "search");
      const label = document.createElement("label");
      label.className = "sr-only";
      label.htmlFor = "global-search";
      label.textContent = isEnglishPage ? "Search the site" : "Cari di situs";
      const input = document.createElement("input");
      input.id = "global-search";
      input.name = "q";
      input.type = "search";
      input.autocomplete = "off";
      input.placeholder = isEnglishPage ? "Search stories, places, work..." : "Cari cerita, tempat, pekerjaan...";
      const submit = document.createElement("button");
      submit.className = "button button--accent button--small";
      submit.type = "submit";
      submit.textContent = isEnglishPage ? "Search" : "Cari";
      form.append(label, input, submit);
      const suggestions = document.createElement("div");
      suggestions.className = "header-search__suggestions";
      suggestions.setAttribute("aria-label", isEnglishPage ? "Search suggestions" : "Saran pencarian");
      const suggestionLabels = isEnglishPage ? ["Bali", "Remote work", "Projects", "Travel"] : ["Bali", "Kerja fleksibel", "Proyek", "Perjalanan"];
      suggestionLabels.forEach(function (value) {
        const button = document.createElement("button");
        button.className = "header-search__suggestion";
        button.type = "button";
        button.setAttribute("data-search-suggestion", value);
        button.textContent = value;
        suggestions.appendChild(button);
      });
      searchInner.append(form, suggestions);
      searchPanel.appendChild(searchInner);
      header.insertAdjacentElement("afterend", searchPanel);
    }

    // Keep the new Collections destination discoverable on older pages that still use legacy nav markup.
    const navEnglish = /^\/(?:bagusin\/)?en(?:\/|$)/.test(window.location.pathname);
    const navProjectBase = window.location.pathname.startsWith("/bagusin/") || window.location.pathname === "/bagusin" ? "/bagusin" : "";
    const navBase = navProjectBase + (navEnglish ? "/en" : "");
    const desktopList = document.querySelector(".site-nav__list");
    const mobileList = document.querySelector(".mobile-nav__list");
    // Travel and destinations belong to blog taxonomy, not a separate top-level section.
    document.querySelectorAll('.site-nav__list a[href$="/destinations/"], .mobile-nav__list a[href$="/destinations/"]').forEach(function (link) { if (link.closest("li")) link.closest("li").remove(); });
    function addCollectionsLink(list, mobile) {
      if (!list || list.querySelector('a[href$="/collections/"]')) return;
      const item = document.createElement("li");
      if (mobile) {
        const link = document.createElement("a");
        link.className = "mobile-nav__link";
        link.href = navBase + "/collections/";
        link.textContent = navEnglish ? "Collection" : "Koleksi";
        item.appendChild(link);
      } else {
        item.className = "site-nav__item";
        const link = document.createElement("a");
        link.className = "site-nav__link";
        link.href = navBase + "/collections/";
        link.textContent = navEnglish ? "Collection" : "Koleksi";
        item.appendChild(link);
      }
      const blogItem = Array.from(list.children).find(function (li) {
        return li.querySelector('a[href$="/blog/"]');
      });
      if (blogItem && blogItem.nextSibling) list.insertBefore(item, blogItem.nextSibling);
      else list.appendChild(item);
    }
    addCollectionsLink(desktopList, false);
    addCollectionsLink(mobileList, true);

    function addTemplateCatalogLink(list, mobile) {
      if (!list || list.querySelector('a[href$="/templates/"]')) return;
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.className = mobile ? "mobile-nav__link" : "site-nav__link";
      link.href = navBase + "/templates/";
      link.textContent = navEnglish ? "Template Catalog" : "Katalog template";
      item.className = mobile ? "" : "site-nav__item";
      item.appendChild(link);
      const collectionItem = Array.from(list.children).find(function (li) {
        return li.querySelector('a[href$="/collections/"]');
      });
      const blogItem = Array.from(list.children).find(function (li) {
        return li.querySelector('a[href$="/blog/"]');
      });
      const reference = collectionItem || blogItem;
      if (reference && reference.nextSibling) list.insertBefore(item, reference.nextSibling);
      else list.appendChild(item);
    }
    addTemplateCatalogLink(desktopList, false);
    addTemplateCatalogLink(mobileList, true);

    // Portfolio discovery is paused for now. Keep the archive intact but remove
    // its navigation links; convert the old one-item Work dropdown into a direct link.
    document.querySelectorAll('.site-nav__list a[href$="/portfolio/"], .mobile-nav__list a[href$="/portfolio/"]').forEach(function (link) {
      link.remove();
    });
    document.querySelectorAll(".site-nav__list .nav-dropdown-toggle").forEach(function (toggle) {
      const id = toggle.getAttribute("aria-controls");
      const dropdown = id ? document.getElementById(id) : null;
      const links = dropdown ? Array.from(dropdown.querySelectorAll("a")) : [];
      if (links.length !== 1 || !/\/work\/$/.test(links[0].getAttribute("href") || "")) return;
      const directLink = document.createElement("a");
      directLink.className = "site-nav__link";
      directLink.href = links[0].getAttribute("href");
      directLink.textContent = navEnglish ? "Services" : "Layanan";
      toggle.replaceWith(directLink);
      dropdown.remove();
    });
    document.querySelectorAll(".mobile-nav__group").forEach(function (group) {
      const label = group.querySelector(".mobile-nav__label");
      if (label && /karya|portfolio|work/i.test(label.textContent)) label.textContent = navEnglish ? "Services" : "Layanan";
      if (!group.querySelector("a")) group.remove();
    });

    function addLearningLink(list, mobile) {
      if (!list || list.querySelector('a[href$="/learning/"]')) return;
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.className = mobile ? "mobile-nav__link" : "site-nav__link";
      link.href = navBase + "/learning/";
      link.textContent = navEnglish ? "Courses" : "Kursus";
      item.className = mobile ? "" : "site-nav__item";
      item.appendChild(link);
      const blogItem = Array.from(list.children).find(function (li) {
        return li.querySelector('a[href$="/blog/"]');
      });
      const collectionItem = Array.from(list.children).find(function (li) {
        return li.querySelector('a[href$="/collections/"]');
      });
      const reference = collectionItem || blogItem;
      if (reference && reference.nextSibling) list.insertBefore(item, reference.nextSibling);
      else list.appendChild(item);
    }
    addLearningLink(desktopList, false);
    addLearningLink(mobileList, true);

    const mobileToggle = document.querySelector("[data-mobile-menu-toggle]");
    const mobileNav = document.getElementById("mobile-navigation");
    const mobileOverlay = document.querySelector("[data-mobile-overlay]");
    const mobileClose = document.querySelector("[data-mobile-menu-close]");
    const searchToggle = document.querySelector("[data-search-toggle]");
    const searchInput = document.getElementById("global-search");
    const searchForm = searchPanel ? searchPanel.querySelector("form") : null;
    const languageToggle = document.querySelector("[data-language-toggle]");
    const languageMenu = document.getElementById("language-menu");
    const dropdownToggles = document.querySelectorAll(".nav-dropdown-toggle");

    let menuOpen = false;
    let searchOpen = false;
    let languageOpen = false;

    function setExpanded(element, value) {
      if (element) element.setAttribute("aria-expanded", String(value));
    }

    function setHidden(element, value) {
      if (!element) return;
      element.hidden = value;
    }

    function closeDropdowns(except) {
      dropdownToggles.forEach(function (toggle) {
        if (toggle === except) return;
        const id = toggle.getAttribute("aria-controls");
        const dropdown = id ? document.getElementById(id) : null;
        setExpanded(toggle, false);
        if (toggle.closest(".site-nav__item")) toggle.closest(".site-nav__item").classList.remove("is-open");
        if (dropdown) setHidden(dropdown, true);
      });
    }

    function closeLanguage() {
      languageOpen = false;
      setExpanded(languageToggle, false);
      setHidden(languageMenu, true);
    }

    function closeSearch() {
      searchOpen = false;
      setExpanded(searchToggle, false);
      if (searchToggle) searchToggle.setAttribute("aria-label", "Buka pencarian");
      setHidden(searchPanel, true);
    }

    function renderSiteFooter() {
      // One shared footer across all pages that load the global navigation bundle.
      // Create the mount point when a legacy page has no footer placeholder.
      let footer = document.querySelector(".site-footer");
      if (!footer) {
        footer = document.createElement("footer");
        footer.className = "site-footer";
        const main = document.querySelector("main#main-content, main");
        const app = document.querySelector("#app");
        if (main) main.insertAdjacentElement("afterend", footer);
        else if (app) app.appendChild(footer);
        else document.body.appendChild(footer);
      }
      // Prevent duplicated global footers if a page accidentally contains more than one.
      document.querySelectorAll(".site-footer").forEach(function (candidate) {
        if (candidate !== footer) candidate.remove();
      });
      const usesProjectBase = window.location.pathname.startsWith("/bagusin/") || window.location.pathname === "/bagusin";
      const en = /^\/(?:bagusin\/)?en(?:\/|$)/.test(window.location.pathname);
      const base = (usesProjectBase ? "/bagusin" : "") + (en ? "/en" : "");
      const checkoutBase = (usesProjectBase ? "/bagusin" : "") + "/checkout";
      const t = en ? {
        explore:"Explore", work:"Services", start:"Get started", legal:"Information",
        blog:"Blog", collections:"Design Catalog", learning:"Courses", youtube:"YouTube", about:"About Bagusin", templates:"Design Catalog",
        services:"Services", store:"Store", comingSoon:"Coming soon",
        advertising:"Advertising & Ads", copyContent:"Copy & Content Writing", website:"Website Development",
        android:"Android Apps", uiux:"UI/UX Design", systems:"Digital Systems & Modules", consultation:"Consultation",
        startProject:"Start a Project", help:"Book a Consultation", appointment:"Schedule a Meeting", contact:"Contact",
        privacy:"Privacy Policy", terms:"Terms of Service", disclaimer:"Disclaimer", editorial:"Editorial Policy", faq:"Contact & Help",
        paymentNote:"Payment details are confirmed in your project invoice.",
        description:"Practical digital services, useful learning, and creative work built around real needs.",
        ctaTitle:"Have something you want to build?",
        ctaText:"Start a project directly, or schedule a consultation if you need help deciding what fits."
      } : {
        explore:"Jelajahi", work:"Layanan", start:"Mulai", legal:"Informasi",
        blog:"Blog", collections:"Katalog Design", learning:"Course", youtube:"YouTube", about:"Tentang Bagusin", templates:"Katalog Design",
        services:"Layanan", store:"Store", comingSoon:"Segera hadir",
        advertising:"Advertising & Iklan", copyContent:"Copywriting & Penulisan Konten", website:"Pembuatan Website",
        android:"Aplikasi Android", uiux:"Desain UI/UX", systems:"Sistem & Modul Digital", consultation:"Konsultasi",
        startProject:"Mulai Proyek", help:"Konsultasi", appointment:"Atur Janji Temu", contact:"Kontak",
        privacy:"Kebijakan Privasi", terms:"Syarat & Ketentuan", disclaimer:"Penafian", editorial:"Kebijakan Editorial", faq:"Kontak & Bantuan",
        paymentNote:"Detail pembayaran dikonfirmasi melalui invoice proyek.",
        description:"Layanan digital praktis, materi belajar, dan karya kreatif yang disusun sesuai kebutuhan nyata.",
        ctaTitle:"Ada sesuatu yang ingin kamu bangun?",
        ctaText:"Mulai proyek secara langsung, atau atur konsultasi jika masih perlu menentukan solusi yang tepat."
      };
      const social = [
        '<a class="site-footer__social-link" href="https://instagram.com/bagusin" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2"></rect><circle cx="12" cy="12" r="4.1"></circle><circle cx="17.7" cy="6.4" r="1.05" fill="currentColor" stroke="none"></circle></svg></a>',
        '<a class="site-footer__social-link" href="https://x.com/bagusin" target="_blank" rel="noopener noreferrer" aria-label="X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h4.8l11.2 18h-4.8L4 3Z" fill="currentColor" stroke="none"></path><path d="M20 3 4 21" stroke="currentColor" stroke-width="2.2"></path></svg></a>',
        '<a class="site-footer__social-link" href="https://www.linkedin.com/in/bagusin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 8.7H2.8V21h2.4V8.7ZM4 2.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8ZM9 8.7H6.7V21H9v-6.1c0-1.6.3-3.1 2.3-3.1s2 1.8 2 3.2V21h2.4v-6.8c0-3.3-.7-5.8-4.3-5.8-1.7 0-2.9.9-3.4 1.8H9V8.7Z" fill="currentColor" stroke="none"/></svg></a>',
        '<a class="site-footer__social-link" data-icon="youtube" href="https://www.youtube.com/@BagusInOfficial" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23 7.1a3 3 0 0 0-2.1-2.1C19.1 4.5 12 4.5 12 4.5s-7.1 0-8.9.5A3 3 0 0 0 1 7.1 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.9 3 3 0 0 0 2.1 2.1c1.8.5 8.9.5 8.9.5s7.1 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.9 31 31 0 0 0-.5-4.9ZM9.6 15.5v-7l6 3.5-6 3.5Z" fill="currentColor" stroke="none"/></svg></a>'
      ].join("");
      footer.innerHTML = `
        <div class="site-footer__main">
          <div class="site-footer__inner container">
            <div class="site-footer__top">
              <div class="site-footer__brand">
                <a class="site-footer__brand-link" href="${base}/" aria-label="BagusIn">
                  <span class="site-footer__brand-mark" aria-hidden="true">B</span>
                  <span class="site-footer__brand-text"><span class="site-footer__brand-name">Bagusin</span><span class="site-footer__brand-tagline">Work. Travel. Build.</span></span>
                </a>
                <p class="site-footer__description">${t.description}</p>
                <div class="site-footer__social" aria-label="Social media">${social}</div>
              </div>
              <div class="site-footer__column"><h2 class="site-footer__title">${t.explore}</h2><ul class="site-footer__links">
                <li><a class="site-footer__link" href="${base}/blog/">${t.blog}</a></li><li><a class="site-footer__link" href="${base}/learning/">${t.learning}</a></li><li><span class="site-footer__link site-footer__link--soon" aria-label="${t.store}, ${t.comingSoon}">${t.store}<span class="site-footer__soon-label">${t.comingSoon}</span></span></li><li><span class="site-footer__link site-footer__link--soon" aria-label="${t.templates}, ${t.comingSoon}">${t.templates}<span class="site-footer__soon-label">${t.comingSoon}</span></span></li>
              </ul></div>
              <div class="site-footer__column"><h2 class="site-footer__title">${t.work}</h2><ul class="site-footer__links">
                <li><a class="site-footer__link" href="${base}/contact/?service=google-ads">${t.advertising}</a></li><li><a class="site-footer__link" href="${base}/contact/?service=seo-content">${t.copyContent}</a></li><li><a class="site-footer__link" href="${base}/contact/?service=websites">${t.website}</a></li><li><a class="site-footer__link" href="${base}/contact/?service=mobile-apps">${t.android}</a></li><li><a class="site-footer__link" href="${base}/contact/?service=maintenance-uiux">${t.uiux}</a></li><li><a class="site-footer__link" href="${base}/contact/?service=web-applications">${t.systems}</a></li>
              </ul></div>
              <div class="site-footer__column"><h2 class="site-footer__title">${t.start}</h2><ul class="site-footer__links">
                <li><a class="site-footer__link" href="${checkoutBase}/">${t.startProject}</a></li><li><a class="site-footer__link" href="${base}/contact/?mode=consultation">${t.consultation}</a></li><li><a class="site-footer__link" href="${base}/contact/?mode=consultation&meeting=in-person#meeting-preference">${t.appointment}</a></li><li><a class="site-footer__link" href="${base}/contact/">${t.contact}</a></li>
              </ul></div>
              <div class="site-footer__column"><h2 class="site-footer__title">${t.legal}</h2><ul class="site-footer__links">
                <li><a class="site-footer__link" href="${base}/about/">${t.about}</a></li><li><a class="site-footer__link" href="${base}/legal/privacy/">${t.privacy}</a></li><li><a class="site-footer__link" href="${base}/legal/terms/">${t.terms}</a></li><li><a class="site-footer__link" href="${base}/legal/disclaimer/">${t.disclaimer}</a></li><li><a class="site-footer__link" href="${base}/legal/editorial-policy/">${t.editorial}</a></li><li><a class="site-footer__link" href="${base}/contact/">${t.faq}</a></li>
              </ul></div>
            </div>
            <div class="site-footer__cta"><div class="site-footer__cta-content"><h2 class="site-footer__cta-title">${t.ctaTitle}</h2><p class="site-footer__cta-description">${t.ctaText}</p></div>
              <div class="site-footer__cta-action"><a class="button button--light" href="${checkoutBase}/">${t.startProject}</a><a class="button button--footer-ghost" href="${base}/contact/?mode=consultation">${t.help}</a></div>
            </div>
            <div class="site-footer__payments" aria-label="${en ? "Payment information" : "Informasi pembayaran"}"><span class="site-footer__payments-label">${en ? "Payment" : "Pembayaran"}</span><span class="site-footer__payment-mark" aria-hidden="true">BANK</span><span class="site-footer__payment-mark" aria-hidden="true">QR</span><span class="site-footer__payment-note">${t.paymentNote}</span></div>
            <div class="site-footer__bottom"><div class="site-footer__bottom-inner"><p class="site-footer__copyright">© <span data-current-year>2026</span> Bagusin. ${en ? "All rights reserved." : "Hak cipta dilindungi."}</p><div class="site-footer__legal"><a class="site-footer__legal-link" href="${base}/legal/privacy/">${t.privacy}</a><a class="site-footer__legal-link" href="${base}/legal/terms/">${t.terms}</a><a class="site-footer__legal-link" href="${base}/contact/">${t.contact}</a></div></div></div>
          </div>
        </div>`;
    }

    renderSiteFooter();

    // Shared compact chat entry point. It opens the contact flow until a live-chat provider is configured.
    if (!document.querySelector("[data-footer-chat]")) {
      const chat = document.createElement("a");
      chat.className = "site-footer-chat";
      chat.href = (window.location.pathname.startsWith("/bagusin/") || window.location.pathname === "/bagusin" ? "/bagusin" : "") + (/^\/(?:bagusin\/)?en(?:\/|$)/.test(window.location.pathname) ? "/en" : "") + "/contact/";
      chat.setAttribute("data-footer-chat", "");
      chat.setAttribute("aria-label", /^\/(?:bagusin\/)?en(?:\/|$)/.test(window.location.pathname) ? "Chat with Bagusin — contact page" : "Chat dengan Bagusin — halaman kontak");
      chat.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-6.5A7.5 7.5 0 1 1 20 11.5Z"></path><path d="M8 11.5h8M8 14.5h5"></path></svg><span>Chat</span>';
      document.body.appendChild(chat);
    }

    // Add one consistent, accessible breadcrumb trail to interior pages.
    // The homepage stays clean; existing breadcrumbs are preserved rather than duplicated.
    (function renderBreadcrumbs() {
      const main = document.querySelector("main#main-content, main");
      if (!main || main.querySelector("[data-site-breadcrumbs]") || document.querySelector("[data-site-breadcrumbs]")) return;
      const rawPath = window.location.pathname;
      const projectBase = rawPath === "/bagusin" || rawPath.startsWith("/bagusin/") ? "/bagusin" : "";
      let route = projectBase ? rawPath.slice(projectBase.length) : rawPath;
      route = route.split("/").filter(Boolean).join("/");
      if (route.toLowerCase().endsWith("index.html")) route = route.slice(0, -10).split("/").filter(Boolean).join("/");
      if (!route) return;
      const parts = route.split("/").filter(Boolean);
      const english = parts[0] === "en";
      if (english) parts.shift();
      if (!parts.length) return;

      const labels = english ? {
        blog:"Blog", collections:"Collections", templates:"Template Catalog", work:"Services",
        learning:"Courses", about:"About", contact:"Contact", destinations:"Destinations",
        terms:"Terms & Conditions", legal:"Legal", privacy:"Privacy Policy", disclaimer:"Disclaimer",
        "editorial-policy":"Editorial Policy", checkout:"Checkout", portfolio:"Portfolio",
        youtube:"YouTube", search:"Search", guides:"Guides", services:"Services", demos:"Demos",
        "blogger-editorial":"Blogger Editorial Template", categories:"Categories", tags:"Tags"
      } : {
        blog:"Blog", collections:"Koleksi", templates:"Katalog template", work:"Layanan",
        learning:"Kursus", about:"Tentang", contact:"Kontak", destinations:"Destinasi",
        terms:"Syarat dan ketentuan", legal:"Informasi legal", privacy:"Kebijakan privasi",
        disclaimer:"Penafian", "editorial-policy":"Kebijakan editorial", checkout:"Pemesanan",
        portfolio:"Portofolio", youtube:"YouTube", search:"Pencarian", guides:"Panduan",
        services:"Layanan", demos:"Demo", "blogger-editorial":"Template editorial Blogger",
        categories:"Kategori", tags:"Tag"
      };
      const prettify = function(value) {
        if (labels[value]) return labels[value];
        return value.split("-").map(function(word){return word ? word.charAt(0).toUpperCase()+word.slice(1) : word;}).join(" ");
      };
      const nav = document.createElement("nav");
      nav.className = "site-breadcrumbs container";
      nav.dataset.siteBreadcrumbs = "";
      nav.setAttribute("aria-label", english ? "Breadcrumb" : "Jejak navigasi");
      const list = document.createElement("ol");
      list.className = "site-breadcrumbs__list";
      const home = document.createElement("li");
      const homeLink = document.createElement("a");
      homeLink.href = projectBase + (english ? "/en/" : "/");
      homeLink.textContent = english ? "Home" : "Beranda";
      home.appendChild(homeLink);
      list.appendChild(home);

      let accumulated = projectBase + (english ? "/en" : "");
      parts.forEach(function(part, index) {
        accumulated += "/" + part;
        const item = document.createElement("li");
        const current = index === parts.length - 1;
        if (current) {
          const label = document.createElement("span");
          label.textContent = ((main.querySelector("h1") ? main.querySelector("h1").textContent : "") || "").trim() || prettify(part);
          label.setAttribute("aria-current", "page");
          item.appendChild(label);
        } else {
          const link = document.createElement("a");
          link.href = accumulated + "/";
          link.textContent = prettify(part);
          item.appendChild(link);
        }
        list.appendChild(item);
      });
      nav.appendChild(list);
      main.parentNode.insertBefore(nav, main);
    })();

    function openSearch() {
      if (!searchPanel) return;
      closeDropdowns();
      closeLanguage();
      searchOpen = true;
      setExpanded(searchToggle, true);
      if (searchToggle) searchToggle.setAttribute("aria-label", "Tutup pencarian");
      setHidden(searchPanel, false);
      window.setTimeout(function () {
        if (searchInput) searchInput.focus();
      }, 0);
    }

    function setMobileNavInteractivity(disabled) {
      if (!mobileNav) return;
      if ("inert" in mobileNav) mobileNav.inert = disabled;
    }

    function focusMobileMenu() {
      const target = mobileClose || (mobileNav ? mobileNav.querySelector("a, button, input, select, textarea") : null);
      if (target) target.focus();
    }

    function closeMenu(restoreFocus) {
      menuOpen = false;
      setExpanded(mobileToggle, false);
      if (mobileToggle) mobileToggle.setAttribute("aria-label", "Buka menu");
      if (mobileNav) mobileNav.classList.remove("is-open");
      if (mobileNav) mobileNav.setAttribute("aria-hidden", "true");
      setMobileNavInteractivity(true);
      setHidden(mobileOverlay, true);
      document.body.classList.remove("menu-open");
      if (restoreFocus) if (mobileToggle) mobileToggle.focus();
    }

    function openMenu() {
      if (!mobileNav) return;
      closeSearch();
      closeLanguage();
      closeDropdowns();
      menuOpen = true;
      setExpanded(mobileToggle, true);
      if (mobileToggle) mobileToggle.setAttribute("aria-label", "Tutup menu");
      mobileNav.classList.add("is-open");
      mobileNav.setAttribute("aria-hidden", "false");
      setMobileNavInteractivity(false);
      setHidden(mobileOverlay, false);
      document.body.classList.add("menu-open");
      window.setTimeout(focusMobileMenu, 0);
    }

    if (mobileToggle) mobileToggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      menuOpen ? closeMenu() : openMenu();
    });

    if (mobileClose) mobileClose.addEventListener("click", function () { closeMenu(true); });
    if (mobileOverlay) mobileOverlay.addEventListener("click", closeMenu);

    if (mobileNav) mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    dropdownToggles.forEach(function (toggle) {
      toggle.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        const id = toggle.getAttribute("aria-controls");
        const dropdown = id ? document.getElementById(id) : null;
        if (!dropdown) return;

        const isOpen = toggle.getAttribute("aria-expanded") === "true";
        closeDropdowns();

        if (!isOpen) {
          setHidden(dropdown, false);
          setExpanded(toggle, true);
          if (toggle.closest(".site-nav__item")) toggle.closest(".site-nav__item").classList.add("is-open");
        }
      });
    });

    if (searchToggle) searchToggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      searchOpen ? closeSearch() : openSearch();
    });

    if (searchForm) searchForm.addEventListener("submit", function (event) {
      const query = ((searchInput && searchInput.value) || "").trim();
      if (!query) {
        event.preventDefault();
        if (searchInput) searchInput.focus();
        return;
      }
      event.preventDefault();
      const usesProjectBase = window.location.pathname.startsWith("/bagusin/") || window.location.pathname === "/bagusin";
      const isEnglishPage = /^\/(?:bagusin\/)?en(?:\/|$)/.test(window.location.pathname);
      const searchBase = (usesProjectBase ? "/bagusin" : "") + (isEnglishPage ? "/en/search/" : "/search/");
      window.location.href = searchBase + "?q=" + encodeURIComponent(query);
    });

    if (searchPanel) searchPanel.querySelectorAll("[data-search-suggestion]").forEach(function (button) {
      button.addEventListener("click", function () {
        const value = button.getAttribute("data-search-suggestion") || button.textContent.trim();
        if (searchInput) searchInput.value = value;
        if (searchForm) searchForm.requestSubmit();
      });
    });

    if (languageToggle) languageToggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (!languageMenu) return;

      const isOpen = languageToggle.getAttribute("aria-expanded") === "true";
      closeSearch();
      closeDropdowns();

      if (isOpen) {
        closeLanguage();
      } else {
        languageOpen = true;
        setExpanded(languageToggle, true);
        setHidden(languageMenu, false);
      }
    });

    document.addEventListener("click", function (event) {
      const target = event.target;
      if (!target.closest(".site-nav")) closeDropdowns();
      if (!target.closest(".language-switcher")) closeLanguage();
      if (searchOpen && !target.closest("#header-search") && !target.closest("[data-search-toggle]")) closeSearch();
    });

    document.addEventListener("keydown", function (event) {
      if (menuOpen && event.key === "Tab" && mobileNav) {
        const focusable = Array.from(mobileNav.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter(function (element) {
          return !element.hidden && element.getClientRects().length;
        });

        if (focusable.length) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }

      if (event.key !== "Escape") return;

      if (menuOpen) {
        closeMenu(true);
        return;
      }
      if (searchOpen) {
        closeSearch();
        if (searchToggle) searchToggle.focus();
        return;
      }
      if (languageOpen) {
        closeLanguage();
        if (languageToggle) languageToggle.focus();
        return;
      }
      closeDropdowns();
    });

    let stickyFrame = 0;
    window.addEventListener("scroll", function () {
      if (stickyFrame) return;
      stickyFrame = window.requestAnimationFrame(function () {
        stickyFrame = 0;
        if (header) header.classList.toggle("is-sticky", window.scrollY > 8);
      });
    }, { passive: true });

    const desktopQuery = window.matchMedia("(min-width: 56rem)");
    const handleViewport = function () {
      if (desktopQuery.matches && menuOpen) closeMenu();
    };
    if (desktopQuery.addEventListener) desktopQuery.addEventListener("change", handleViewport);
    window.addEventListener("resize", handleViewport, { passive: true });

    function normalizePath(path) {
      let value = (path || "/").split("?")[0].split("#")[0];
      if (value.length > 1 && !value.endsWith("/")) value += "/";
      return value;
    }

    const currentPath = normalizePath(window.location.pathname);
    document.querySelectorAll(".site-nav a, .mobile-nav a").forEach(function (link) {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http")) return;
      try {
        const path = normalizePath(new URL(href, window.location.origin).pathname);
        const active = path === "/" ? currentPath === "/" : currentPath === path || currentPath.startsWith(path);
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      } catch (_) {}
    });

    setHidden(searchPanel, true);
    setHidden(languageMenu, true);
    setHidden(mobileOverlay, true);
    if (mobileNav) mobileNav.setAttribute("aria-hidden", "true");
    setMobileNavInteractivity(true);
    setExpanded(searchToggle, false);
    setExpanded(languageToggle, false);
    setExpanded(mobileToggle, false);
  });
})();