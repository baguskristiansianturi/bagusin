/* =========================================================
   BAGUSIN — GLOBAL NAVIGATION
   Integrated mobile / search / dropdown / language
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector("[data-site-header], .site-header");
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

    function closeMenu() {
      menuOpen = false;
      setExpanded(mobileToggle, false);
      mobileToggle?.setAttribute("aria-label", "Buka menu");
      mobileNav?.classList.remove("is-open");
      mobileNav?.setAttribute("aria-hidden", "true");
      setHidden(mobileOverlay, true);
      document.body.classList.remove("menu-open");
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
      setHidden(mobileOverlay, false);
      document.body.classList.add("menu-open");
    }

    mobileToggle?.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      menuOpen ? closeMenu() : openMenu();
    });

    mobileClose?.addEventListener("click", closeMenu);
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
      if (event.key !== "Escape") return;

      if (menuOpen) {
        closeMenu();
        mobileToggle?.focus();
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
    setExpanded(searchToggle, false);
    setExpanded(languageToggle, false);
    setExpanded(mobileToggle, false);
  });
})();