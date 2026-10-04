/* =========================================================
   BAGUSIN — GLOBAL SITE SCRIPT
   Safe global utilities for every page.
   ========================================================= */
(function () {
  "use strict";

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  onReady(function () {
    document.documentElement.classList.add("js");
    document.documentElement.classList.remove("no-js");

    /* Current year */
    document.querySelectorAll("[data-current-year]").forEach(function (element) {
      element.textContent = String(new Date().getFullYear());
    });

    /* Smooth internal anchors with sticky-header offset */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        const href = link.getAttribute("href");
        if (!href || href === "#" || href.length <= 1) return;

        let target;
        try {
          target = document.querySelector(href);
        } catch (_) {
          return;
        }
        if (!target) return;

        event.preventDefault();

        const header = document.querySelector("#site-header");
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          16;

        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: reduceMotion ? "auto" : "smooth"
        });

        const hadTabindex = target.hasAttribute("tabindex");
        if (!hadTabindex) target.setAttribute("tabindex", "-1");
        window.setTimeout(function () {
          target.focus({ preventScroll: true });
          if (!hadTabindex) target.removeAttribute("tabindex");
        }, reduceMotion ? 0 : 350);
      });
    });

    /* Safe treatment for true external links */
    document.querySelectorAll("a[href]").forEach(function (link) {
      const href = link.getAttribute("href");
      if (!href || !/^https?:\/\//i.test(href)) return;

      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) {
          link.setAttribute("target", "_blank");
          link.setAttribute("rel", "noopener noreferrer");
        }
      } catch (_) {}
    });

    /* Image performance + graceful error state.
       Keep the first content image discoverable for LCP; lazy-load the rest.
       This is a fallback for future pages that add real image assets. */
    const images = Array.from(document.images);
    images.forEach(function (image, index) {
      if (!image.hasAttribute("loading")) {
        image.setAttribute("loading", index === 0 ? "eager" : "lazy");
      }
      if (!image.hasAttribute("decoding")) image.setAttribute("decoding", "async");
      if (index === 0 && !image.hasAttribute("fetchpriority")) {
        image.setAttribute("fetchpriority", "high");
      }

      image.addEventListener(
        "error",
        function () {
          image.classList.add("is-image-error");
          image.setAttribute("data-image-error", "true");
        },
        { once: true }
      );
    });

    /* Details / summary accessibility state */
    document.querySelectorAll("details").forEach(function (item) {
      const summary = item.querySelector("summary");
      if (!summary) return;

      summary.setAttribute("role", "button");
      summary.setAttribute("aria-expanded", item.open ? "true" : "false");

      item.addEventListener("toggle", function () {
        summary.setAttribute("aria-expanded", item.open ? "true" : "false");
      });
    });

    /* Form submission state */
    document.querySelectorAll("form").forEach(function (form) {
      form.addEventListener("submit", function () {
        form.classList.add("is-submitting");
      });
    });

    /* Optional back-to-top control */
    const backToTop = document.querySelector("[data-back-to-top]");
    if (backToTop) {
      const updateBackToTop = function () {
        backToTop.toggleAttribute("hidden", window.scrollY <= window.innerHeight);
      };

      window.addEventListener("scroll", updateBackToTop, { passive: true });
      updateBackToTop();

      backToTop.addEventListener("click", function () {
        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        window.scrollTo({
          top: 0,
          behavior: reduceMotion ? "auto" : "smooth"
        });
      });
    }

    document.dispatchEvent(new CustomEvent("bagusin:ready"));
  });
})();