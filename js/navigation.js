/* =========================================================
   BAGUSIN — GLOBAL NAVIGATION
   Integrated mobile / search / dropdown / language
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector("[data-site-header], .site-header");

    /* CP-18 — normalize the shared header before binding interactions.
       Older pages were carrying slightly different header markup. Build one
       navigation contract at runtime so every route exposes the same paths,
       Work menu, search, language switcher, and mobile menu. */
    function getSiteContext() {
      const rawPath = (window.location.pathname || "/").split("?")[0].split("#")[0];
      const isProjectHost = window.location.hostname.endsWith("github.io");
      const projectPrefix = isProjectHost ? "/bagusin" : "";
      const isEnglish = rawPath === "/en/" || rawPath.startsWith("/en/") ||
        rawPath.startsWith("/bagusin/en/") || rawPath === "/bagusin/en";
      return { projectPrefix, isEnglish };
    }

    function normalizeHeaderMarkup() {
      if (!header) return;
      const context = getSiteContext();
      const p = context.projectPrefix;
      const lang = context.isEnglish ? "en/" : "";
      const labels = context.isEnglish ? {
        blog: "Blog", places: "Places", services: "Services",
        work: "Work", servicesNote: "Professional project-based work",
        workNote: "Projects, concepts & experiments",
        youtube: "YouTube", about: "About", contact: "Contact",
        menu: "Menu", search: "Search BagusIn", searchButton: "Search",
        openSearch: "Open search", closeSearch: "Close search"
      } : {
        blog: "Blog", places: "Places", services: "Services",
        work: "Work", servicesNote: "Professional project-based work",
        workNote: "Projects, concepts & experiments",
        youtube: "YouTube", about: "About", contact: "Contact",
        menu: "Menu", search: "Cari BagusIn", searchButton: "Cari",
        openSearch: "Buka pencarian", closeSearch: "Tutup pencarian"
      };

      const desktopNav = header.querySelector(".site-nav__list");
      if (desktopNav) {
        desktopNav.innerHTML =
          '<li class="site-nav__item"><a class="site-nav__link" href="' + p + "/" + lang + 'journal/">' + labels.blog + '</a></li>' +
          '<li class="site-nav__item"><a class="site-nav__link" href="' + p + "/" + lang + 'destinations/">' + labels.places + '</a></li>' +
          '<li class="site-nav__item">' +
            '<button class="nav-dropdown-toggle" type="button" aria-expanded="false" aria-controls="work-dropdown">' + labels.work + ' <span aria-hidden="true">⌄</span></button>' +
            '<div class="nav-dropdown" id="work-dropdown" hidden>' +
              '<a class="nav-dropdown__link" href="' + p + "/" + lang + 'work/"><strong>' + labels.services + '</strong><small>' + labels.servicesNote + '</small></a>' +
              '<a class="nav-dropdown__link" href="' + p + "/" + lang + 'portfolio/"><strong>' + labels.work + '</strong><small>' + labels.workNote + '</small></a>' +
            '</div>' +
          '</li>' +
          '<li class="site-nav__item"><a class="site-nav__link" href="' + p + "/" + lang + 'youtube/">' + labels.youtube + '</a></li>' +
          '<li class="site-nav__item"><a class="site-nav__link" href="' + p + "/" + lang + 'about/">' + labels.about + '</a></li>' +
          '<li class="site-nav__item"><a class="site-nav__link" href="' + p + "/" + lang + 'contact/">' + labels.contact + '</a></li>';
      }

      const mobileList = header.parentElement?.querySelector(".mobile-nav__list");
      if (mobileList) {
        mobileList.innerHTML =
          '<li><a class="mobile-nav__link" href="' + p + "/" + lang + 'journal/">' + labels.blog + '</a></li>' +
          '<li><a class="mobile-nav__link" href="' + p + "/" + lang + 'destinations/">' + labels.places + '</a></li>' +
          '<li class="mobile-nav__group"><span class="mobile-nav__label">' + labels.work + '</span>' +
            '<a class="mobile-nav__link" href="' + p + "/" + lang + "work/">' + labels.services + '</a>' +
            '<a class="mobile-nav__link" href="' + p + "/" + lang + "portfolio/">' + labels.work + '</a>' +
          '</li>' +
          '<li><a class="mobile-nav__link" href="' + p + "/" + lang + 'youtube/">' + labels.youtube + '</a></li>' +
          '<li><a class="mobile-nav__link" href="' + p + "/" + lang + 'about/">' + labels.about + '</a></li>' +
          '<li><a class="mobile-nav__link" href="' + p + "/" + lang + 'contact/">' + labels.contact + '</a></li>';
      }

      let quickSearch = header.querySelector(".header-quick-search");
      if (!quickSearch) {
        quickSearch = document.createElement("form");
        quickSearch.className = "header-quick-search";
        quickSearch.setAttribute("role", "search");
        quickSearch.innerHTML =
          '<label class="sr-only" for="header-quick-search-input">' + labels.search + '</label>' +
          '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4.2 4.2"></path></svg>' +
          '<input id="header-quick-search-input" name="q" type="search" placeholder="' + labels.search + '" autocomplete="off">';
        const brand = header.querySelector(".site-brand");
        brand?.insertAdjacentElement("afterend", quickSearch);
      }
      quickSearch.setAttribute("action", p + "/" + lang + "search/");
      const languageMenu = header.querySelector("#language-menu");
      if (languageMenu) {
        const rawPath = (window.location.pathname || "/").replace(/^\\/bagusin(?=\\/|$)/, "") || "/";
        const sectionPath = rawPath.startsWith("/en/") ? rawPath.slice(3) : rawPath;
        const normalizedSection = sectionPath === "" ? "/" : (sectionPath.startsWith("/") ? sectionPath : "/" + sectionPath);
        const idLink = languageMenu.querySelector('[lang="id"]');
        const enLink = languageMenu.querySelector('[lang="en"]');
        if (idLink) idLink.href = p + normalizedSection;
        if (enLink) enLink.href = p + "/en" + (normalizedSection === "/" ? "/" : normalizedSection);
      }

      quickSearch.addEventListener("submit", function (event) {
        const input = quickSearch.querySelector("input[name=\"q\"]");
        const query = (input?.value || "").trim();
        if (!query) {
          event.preventDefault();
          input?.focus();
        }
      });
    }

    normalizeHeaderMarkup();
    const mobileToggle = document.querySelector("[data-mobile-menu-toggle]");
    const mobileNav = document.getElementById("mobile-navigation");
    const mobileOverlay = document.querySelector("[data-mobile-overlay]");
    const mobileClose = document.querySelector("[data-mobile-menu-close]");
    const searchToggle = document.querySelector("[data-search-toggle]");
    const searchPanel = document.getElementById("header-search");
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
      const projectPrefix = window.location.hostname.endsWith("github.io") ? "/bagusin" : "";
      const searchBase = window.location.pathname.startsWith("/bagusin/en/") || window.location.pathname.startsWith("/en/") ? projectPrefix + "/en/search/" : projectPrefix + "/search/";
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

    const currentPath = normalizePath(window.location.pathname.replace(/^\\/bagusin(?=\\/|$)/, ""));

    // Keep the language control truthful to the current section.
    const languageCode = languageToggle?.querySelector("span:first-child");
    const isEnglish = currentPath === "/en/" || currentPath.startsWith("/en/");
    if (languageCode) languageCode.textContent = isEnglish ? "EN" : "ID";
    languageToggle?.setAttribute("aria-label", isEnglish ? "Choose language · English" : "Pilih bahasa · Indonesia");
    document.querySelectorAll(".site-nav a, .mobile-nav a").forEach(function (link) {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http")) return;
      try {
        const path = normalizePath(new URL(href, window.location.origin).pathname.replace(/^\\/bagusin(?=\\/|$)/, ""));
        const active = path === "/" ? currentPath === "/" : currentPath === path || currentPath.startsWith(path);
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      } catch (_) {}
    });

    // "Work" is a grouped navigation item, so expose its active state
    // when the visitor is inside either Services or Work.
    dropdownToggles.forEach(function (toggle) {
      const item = toggle.closest(".site-nav__item");
      if (!item) return;
      const isWorkArea = currentPath.startsWith("/work/") || currentPath.startsWith("/portfolio/") ||
        currentPath.startsWith("/en/work/") || currentPath.startsWith("/en/portfolio/");
      toggle.classList.toggle("is-active", isWorkArea);
      if (isWorkArea) toggle.setAttribute("aria-current", "page");
      else toggle.removeAttribute("aria-current");
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