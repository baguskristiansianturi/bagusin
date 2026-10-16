(function(){if(!document.querySelector('link[data-ux-polish]')){const base=window.location.pathname.startsWith("/bagusin/")||window.location.pathname==="/bagusin"?"/bagusin":"";const l=document.createElement("link");l.rel="stylesheet";l.href=base+"/css/ux-polish.css?v=20261011-1";l.dataset.uxPolish="";document.head.appendChild(l)}})();
(function(){if(!document.querySelector('link[data-final-responsive]')){const base=window.location.pathname.startsWith("/bagusin/")||window.location.pathname==="/bagusin"?"/bagusin":"";const l=document.createElement("link");l.rel="stylesheet";l.href=base+"/css/final-responsive.css?v=20261011-6";l.dataset.finalResponsive="";document.head.appendChild(l)}})();
(function(){if(!document.querySelector('link[data-site-consistency]')){const base=window.location.pathname.startsWith("/bagusin/")||window.location.pathname==="/bagusin"?"/bagusin":"";const l=document.createElement("link");l.rel="stylesheet";l.href=base+"/css/site-consistency.css?v=20261016-2";l.dataset.siteConsistency="";document.head.appendChild(l)}})();
/* =========================================================
   BAGUSIN — GLOBAL NAVIGATION
   Integrated mobile / search / dropdown / language
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector("[data-site-header], .site-header");

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
    document.querySelectorAll('.site-nav__list a[href$="/destinations/"], .mobile-nav__list a[href$="/destinations/"]').forEach(function (link) { link.closest("li")?.remove(); });
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

    // Normalize the shared navigation across older page templates. Keep labels
    // localized and use one predictable destination order regardless of the
    // original page's legacy header markup.
    const canonicalNavItems = [
      { path: "/blog/", id: "Blog", en: "Blog" },
      { path: "/collections/", id: "Koleksi", en: "Collections" },
      { path: "/learning/", id: "Kursus", en: "Courses" },
      { path: "/templates/", id: "Katalog template", en: "Template catalog" },
      { path: "/work/", id: "Layanan", en: "Services" },
      { path: "/youtube/", id: "YouTube", en: "YouTube" },
      { path: "/about/", id: "Tentang", en: "About" },
      { path: "/contact/", id: "Kontak", en: "Contact" }
    ];
    const navOrder = ["/", ...canonicalNavItems.map(function (item) { return item.path; })];

    function canonicalRoute(href) {
      if (!href) return "";
      let pathname = href;
      try { pathname = new URL(href, window.location.origin).pathname; } catch (_) {}
      pathname = pathname.replace(/\/+$/, "") || "/";
      return navOrder.find(function (route) { return route !== "/" && pathname.endsWith(route.replace(/\/$/, "")); }) || (pathname === navBase || pathname === "/" ? "/" : "");
    }

    function setNavLabel(link, label) {
      if (!link || !label) return;
      const target = link.matches(".nav-dropdown__link") ? (link.querySelector("strong") || link) : link;
      const directTextNodes = Array.from(target.childNodes).filter(function (node) {
        return node.nodeType === 3 && node.textContent.trim();
      });
      if (directTextNodes.length) {
        directTextNodes[0].textContent = label;
        directTextNodes.slice(1).forEach(function (node) { node.remove(); });
        return;
      }
      const labelElement = Array.from(target.children).find(function (child) {
        return !child.matches("svg,[aria-hidden='true'],.nav-dropdown__icon");
      });
      if (labelElement && labelElement.tagName === "SPAN") labelElement.textContent = label;
      else if (!target.children.length) target.textContent = label;
      else target.insertBefore(document.createTextNode(label + " "), target.firstChild);
    }

    function ensureNavLink(list, item, mobile) {
      if (!list || list.querySelector('a[href$="' + item.path + '"]')) return;
      const li = document.createElement("li");
      if (!mobile) li.className = "site-nav__item";
      const link = document.createElement("a");
      link.className = mobile ? "mobile-nav__link" : "site-nav__link";
      link.href = navBase + item.path;
      link.textContent = navEnglish ? item.en : item.id;
      li.appendChild(link);
      list.appendChild(li);
    }

    function normalizeNavList(list, mobile) {
      if (!list) return;
      canonicalNavItems.forEach(function (item) {
        if (mobile || item.path !== "/contact/") ensureNavLink(list, item, mobile);
      });
      if (mobile) {
        const homeLink = list.querySelector('a[href="' + navBase + '/"], a[href="/bagusin/"], a[href="/"]');
        if (homeLink) { homeLink.setAttribute("href", navBase + "/"); setNavLabel(homeLink, navEnglish ? "Home" : "Beranda"); }
      }
      list.querySelectorAll("a.site-nav__link, a.mobile-nav__link, a.nav-dropdown__link").forEach(function (link) {
        const route = canonicalRoute(link.getAttribute("href"));
        const item = canonicalNavItems.find(function (candidate) { return candidate.path === route; });
        if (item) {
          link.setAttribute("href", navBase + item.path);
          setNavLabel(link, navEnglish ? item.en : item.id);
        }
      });
      const rank = function (li) {
        const link = li.querySelector("a[href]");
        const route = link ? canonicalRoute(link.getAttribute("href")) : "";
        const index = navOrder.indexOf(route);
        return index < 0 ? 999 : index;
      };
      Array.from(list.children).sort(function (a, b) { return rank(a) - rank(b); }).forEach(function (item) {
        list.appendChild(item);
      });
    }
    normalizeNavList(desktopList, false);
    normalizeNavList(mobileList, true);

    // Keep utility actions in the header language-aware as well as the menu links.
    const sharedSearchForm = document.querySelector("#header-search form");
    if (sharedSearchForm) sharedSearchForm.setAttribute("action", navBase + "/search/");
    document.querySelectorAll(".site-header__actions a[href]").forEach(function (link) {
      if (canonicalRoute(link.getAttribute("href")) !== "/contact/") return;
      const currentUrl = new URL(link.href, window.location.origin);
      link.setAttribute("href", navBase + "/contact/" + currentUrl.search + currentUrl.hash);
      setNavLabel(link, navEnglish ? "Contact" : "Kontak");
    });

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
        toggle.closest(".site-nav__item")?.classList.remove("is-open");
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
      searchToggle?.setAttribute("aria-label", "Buka pencarian");
      setHidden(searchPanel, true);
    }

    function renderSiteFooter() {
      const footer = document.querySelector(".site-footer");
      if (!footer) return;
      const usesProjectBase = window.location.pathname.startsWith("/bagusin/") || window.location.pathname === "/bagusin";
      const en = /^\/(?:bagusin\/)?en(?:\/|$)/.test(window.location.pathname);
      const base = (usesProjectBase ? "/bagusin" : "") + (en ? "/en" : "");
      const checkoutBase = (usesProjectBase ? "/bagusin" : "") + "/checkout";
      const t = en ? {
        explore:"Explore", work:"Work", start:"Start", legal:"Legal",
        blog:"Blog", collections:"Collection", learning:"Courses", youtube:"YouTube", about:"About", templates:"Template Catalog",
        services:"Services",
        startProject:"Start a Project", help:"Help Me Choose", contact:"Contact",
        privacy:"Privacy Policy", terms:"Terms", disclaimer:"Disclaimer", editorial:"Editorial Policy",
        description:"Stories, journeys, work, and things being built along the way.",
        ctaTitle:"Have a project in mind?",
        ctaText:"Start with the problem. If you know what you need, start a project. If not, ask for help choosing the right path."
      } : {
        explore:"Jelajahi", work:"Layanan", start:"Mulai", legal:"Informasi",
        blog:"Blog", collections:"Koleksi", learning:"Kursus", youtube:"YouTube", about:"Tentang", templates:"Katalog template",
        services:"Layanan",
        startProject:"Mulai Proyek", help:"Bantu Pilihkan", contact:"Kontak",
        privacy:"Kebijakan Privasi", terms:"Ketentuan", disclaimer:"Penafian", editorial:"Kebijakan Editorial",
        description:"Ruang pribadi untuk cerita, perjalanan, pekerjaan, panduan, dan karya yang sedang dibangun.",
        ctaTitle:"Punya proyek atau masalah yang perlu diselesaikan?",
        ctaText:"Mulai dari masalahnya. Jika sudah tahu kebutuhannya, mulai proyek. Jika belum yakin, saya bantu menentukan jalur yang paling tepat."
      };
      const social = [
        '<a class="site-footer__social-link" href="https://instagram.com/bagusin" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.4" cy="6.7" r="1"></circle></svg></a>',
        '<a class="site-footer__social-link" href="https://x.com/bagusin" target="_blank" rel="noopener noreferrer" aria-label="X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4l14 16M19 4 5 20"></path></svg></a>',
        '<a class="site-footer__social-link" href="https://www.linkedin.com/in/bagusin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"></rect><path d="M8 10v6M8 8v.1M11 16v-6M11 13.2c0-2 1-3.2 2.8-3.2 1.7 0 2.2 1.2 2.2 3.1V16"></path></svg></a>',
        '<a class="site-footer__social-link" data-icon="youtube" href="https://www.youtube.com/@BagusInOfficial" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8.2a2.7 2.7 0 0 0-1.9-1.9C17.4 5.8 12 5.8 12 5.8s-5.4 0-7.1.5A2.7 2.7 0 0 0 3 8.2 28 28 0 0 0 2.5 12 28 28 0 0 0 3 15.8a2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.1.5 7.1.5s5.4 0 7.1-.5a2.7 2.7 0 0 0 1.9-1.9 28 28 0 0 0 .5-3.8 28 28 0 0 0-.5-3.8Z"></path><path d="m10 15 5-3-5-3v6Z" fill="currentColor"></path></svg></a>'
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
                <li><a class="site-footer__link" href="${base}/blog/">${t.blog}</a></li><li><a class="site-footer__link" href="${base}/collections/">${t.collections}</a></li><li><a class="site-footer__link" href="${base}/learning/">${t.learning}</a></li><li><a class="site-footer__link" href="${base}/youtube/">${t.youtube}</a></li><li><a class="site-footer__link" href="${base}/about/">${t.about}</a></li>
              </ul></div>
              <div class="site-footer__column"><h2 class="site-footer__title">${t.work}</h2><ul class="site-footer__links">
                <li><a class="site-footer__link" href="${base}/work/">${t.services}</a></li><li><a class="site-footer__link" href="${base}/templates/">${t.templates}</a></li>
              </ul></div>
              <div class="site-footer__column"><h2 class="site-footer__title">${t.start}</h2><ul class="site-footer__links">
                <li><a class="site-footer__link" href="${checkoutBase}/">${t.startProject}</a></li><li><a class="site-footer__link" href="${base}/contact/?mode=consultation">${t.help}</a></li><li><a class="site-footer__link" href="${base}/contact/">${t.contact}</a></li>
              </ul></div>
              <div class="site-footer__column"><h2 class="site-footer__title">${t.legal}</h2><ul class="site-footer__links">
                <li><a class="site-footer__link" href="${base}/legal/privacy/">${t.privacy}</a></li><li><a class="site-footer__link" href="${base}/legal/terms/">${t.terms}</a></li><li><a class="site-footer__link" href="${base}/legal/disclaimer/">${t.disclaimer}</a></li><li><a class="site-footer__link" href="${base}/legal/editorial-policy/">${t.editorial}</a></li>
              </ul></div>
            </div>
            <div class="site-footer__cta"><div class="site-footer__cta-content"><h2 class="site-footer__cta-title">${t.ctaTitle}</h2><p class="site-footer__cta-description">${t.ctaText}</p></div>
              <div class="site-footer__cta-action"><a class="button button--light" href="${checkoutBase}/">${t.startProject}</a><a class="button button--footer-ghost" href="${base}/contact/?mode=consultation">${t.help}</a></div>
            </div>
            <div class="site-footer__bottom"><div class="site-footer__bottom-inner"><p class="site-footer__copyright">© <span data-current-year>2026</span> Bagusin.</p><div class="site-footer__legal"><a class="site-footer__legal-link" href="${base}/legal/privacy/">${t.privacy}</a><a class="site-footer__legal-link" href="${base}/legal/terms/">${t.terms}</a><a class="site-footer__legal-link" href="${base}/contact/">${t.contact}</a></div></div></div>
          </div>
        </div>`;
    }

    renderSiteFooter();

    // Add one consistent, accessible breadcrumb trail to interior pages.
    // The homepage stays clean; existing breadcrumbs are preserved rather than duplicated.
    (function renderBreadcrumbs() {
      const main = document.querySelector("main#main-content, main");
      if (!main || document.querySelector("[data-site-breadcrumbs], .site-breadcrumbs, nav.breadcrumb, nav.breadcrumbs, .breadcrumb, .breadcrumbs, nav[aria-label=\"Breadcrumb\"], nav[aria-label=\"Jejak navigasi\"]")) return;
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
          label.textContent = (main.querySelector("h1")?.textContent || "").trim() || prettify(part);
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
      searchToggle?.setAttribute("aria-label", "Tutup pencarian");
      setHidden(searchPanel, false);
      window.setTimeout(function () {
        searchInput?.focus();
      }, 0);
    }

    function setMobileNavInteractivity(disabled) {
      if (!mobileNav) return;
      if ("inert" in mobileNav) mobileNav.inert = disabled;
    }

    function focusMobileMenu() {
      const target = mobileClose || mobileNav?.querySelector("a, button, input, select, textarea");
      target?.focus();
    }

    function closeMenu(restoreFocus) {
      menuOpen = false;
      setExpanded(mobileToggle, false);
      mobileToggle?.setAttribute("aria-label", "Buka menu");
      mobileNav?.classList.remove("is-open");
      mobileNav?.setAttribute("aria-hidden", "true");
      setMobileNavInteractivity(true);
      setHidden(mobileOverlay, true);
      document.body.classList.remove("menu-open");
      if (restoreFocus) mobileToggle?.focus();
    }

    function openMenu() {
      if (!mobileNav) return;
      closeSearch();
      closeLanguage();
      closeDropdowns();
      menuOpen = true;
      setExpanded(mobileToggle, true);
      mobileToggle?.setAttribute("aria-label", "Tutup menu");
      mobileNav.classList.add("is-open");
      mobileNav.setAttribute("aria-hidden", "false");
      setMobileNavInteractivity(false);
      setHidden(mobileOverlay, false);
      document.body.classList.add("menu-open");
      window.setTimeout(focusMobileMenu, 0);
    }

    mobileToggle?.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      menuOpen ? closeMenu() : openMenu();
    });

    mobileClose?.addEventListener("click", function () { closeMenu(true); });
    mobileOverlay?.addEventListener("click", closeMenu);

    mobileNav?.querySelectorAll("a").forEach(function (link) {
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
          toggle.closest(".site-nav__item")?.classList.add("is-open");
        }
      });
    });

    searchToggle?.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      searchOpen ? closeSearch() : openSearch();
    });

    searchForm?.addEventListener("submit", function (event) {
      const query = (searchInput?.value || "").trim();
      if (!query) {
        event.preventDefault();
        searchInput?.focus();
        return;
      }
      event.preventDefault();
      const usesProjectBase = window.location.pathname.startsWith("/bagusin/") || window.location.pathname === "/bagusin";
      const isEnglishPage = /^\/(?:bagusin\/)?en(?:\/|$)/.test(window.location.pathname);
      const searchBase = (usesProjectBase ? "/bagusin" : "") + (isEnglishPage ? "/en/search/" : "/search/");
      window.location.href = searchBase + "?q=" + encodeURIComponent(query);
    });

    searchPanel?.querySelectorAll("[data-search-suggestion]").forEach(function (button) {
      button.addEventListener("click", function () {
        const value = button.getAttribute("data-search-suggestion") || button.textContent.trim();
        if (searchInput) searchInput.value = value;
        searchForm?.requestSubmit();
      });
    });

    languageToggle?.addEventListener("click", function (event) {
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
        searchToggle?.focus();
        return;
      }
      if (languageOpen) {
        closeLanguage();
        languageToggle?.focus();
        return;
      }
      closeDropdowns();
    });

    let stickyFrame = 0;
    window.addEventListener("scroll", function () {
      if (stickyFrame) return;
      stickyFrame = window.requestAnimationFrame(function () {
        stickyFrame = 0;
        header?.classList.toggle("is-sticky", window.scrollY > 8);
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
    mobileNav?.setAttribute("aria-hidden", "true");
    setMobileNavInteractivity(true);
    setExpanded(searchToggle, false);
    setExpanded(languageToggle, false);
    setExpanded(mobileToggle, false);
  });
})();