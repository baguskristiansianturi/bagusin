(function(){if(!document.querySelector('link[data-final-responsive]')){const base=window.location.pathname.startsWith("/bagusin/")||window.location.pathname==="/bagusin"?"/bagusin":"";const l=document.createElement("link");l.rel="stylesheet";l.href=base+"/css/final-responsive.css?v=20261008-4";l.dataset.finalResponsive="";document.head.appendChild(l)}})();
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
      const siteBase = window.location.pathname.startsWith("/bagusin/") || window.location.pathname === "/bagusin" ? "/bagusin" : "";\n      const isEnglishPage = /^\/(?:bagusin\/)?en(?:\/|$)/.test(window.location.pathname);
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
      const en = /^\/bagusin\/en(?:\/|$)/.test(window.location.pathname);
      const base = en ? "/bagusin/en" : "/bagusin";
      const checkoutBase = "/bagusin/checkout";
      const t = en ? {
        explore:"Explore", work:"Work", start:"Start", legal:"Legal",
        blog:"Blog", destinations:"Destinations", youtube:"YouTube", about:"About",
        workWithMe:"Work With Me", services:"Services", portfolio:"Portfolio",
        startProject:"Start a Project", help:"Help Me Choose", contact:"Contact",
        privacy:"Privacy Policy", terms:"Terms", disclaimer:"Disclaimer", editorial:"Editorial Policy",
        description:"Stories, journeys, work, and things being built along the way.",
        ctaTitle:"Have a project in mind?",
        ctaText:"Start with the problem. If you know what you need, start a project. If not, ask for help choosing the right path."
      } : {
        explore:"Jelajahi", work:"Layanan", start:"Mulai", legal:"Informasi",
        blog:"Blog", destinations:"Destinasi", youtube:"YouTube", about:"Tentang",
        workWithMe:"Lihat Layanan", services:"Layanan", portfolio:"Portofolio",
        startProject:"Mulai Proyek", help:"Bantu Pilihkan", contact:"Kontak",
        privacy:"Kebijakan Privasi", terms:"Ketentuan", disclaimer:"Penafian", editorial:"Kebijakan Editorial",
        description:"Blog personal tentang perjalanan, pekerjaan, proyek, dan hal-hal yang dibangun dari berbagai tempat.",
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
                  <span class="site-footer__brand-text"><span class="site-footer__brand-name">BagusIn</span><span class="site-footer__brand-tagline">Work. Travel. Build.</span></span>
                </a>
                <p class="site-footer__description">${t.description}</p>
                <div class="site-footer__social" aria-label="Social media">${social}</div>
              </div>
              <div class="site-footer__column"><h2 class="site-footer__title">${t.explore}</h2><ul class="site-footer__links">
                <li><a class="site-footer__link" href="${base}/blog/">${t.blog}</a></li><li><a class="site-footer__link" href="${base}/destinations/">${t.destinations}</a></li><li><a class="site-footer__link" href="${base}/youtube/">${t.youtube}</a></li><li><a class="site-footer__link" href="${base}/about/">${t.about}</a></li>
              </ul></div>
              <div class="site-footer__column"><h2 class="site-footer__title">${t.work}</h2><ul class="site-footer__links">
                <li><a class="site-footer__link" href="${base}/work/">${t.workWithMe}</a></li><li><a class="site-footer__link" href="${base}/work/">${t.services}</a></li><li><a class="site-footer__link" href="${base}/portfolio/">${t.portfolio}</a></li>
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
            <div class="site-footer__bottom"><div class="site-footer__bottom-inner"><p class="site-footer__copyright">© <span data-current-year>2026</span> BagusIn.</p><div class="site-footer__legal"><a class="site-footer__legal-link" href="${base}/legal/privacy/">${t.privacy}</a><a class="site-footer__legal-link" href="${base}/legal/terms/">${t.terms}</a><a class="site-footer__legal-link" href="${base}/contact/">${t.contact}</a></div></div></div>
          </div>
        </div>`;
    }

    renderSiteFooter();

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
      const searchBase = window.location.pathname.startsWith("/bagusin/en/") ? "/bagusin/en/search/" : "/bagusin/search/";
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