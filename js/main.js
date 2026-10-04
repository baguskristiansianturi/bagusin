/* =========================================================
BAGUSIN
GLOBAL SITE SCRIPT
Phase 09 — Global Navigation
========================================================= */

(function () {
"use strict";

/* =======================================================
DOM READY
======================================================= */

function onReady(callback) {

```
if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    callback,
    {
      once: true
    }
  );

} else {

  callback();

}
```

}

onReady(function () {

```
/* =====================================================
   SITE READY STATE
   ===================================================== */

document.documentElement.classList.add(
  "js"
);

document.documentElement.classList.remove(
  "no-js"
);


/* =====================================================
   CURRENT YEAR
   ===================================================== */

const yearElements =
  document.querySelectorAll(
    "[data-current-year]"
  );

const currentYear =
  new Date().getFullYear();


yearElements.forEach(
  function (element) {

    element.textContent =
      String(currentYear);

  }
);


/* =====================================================
   SMOOTH INTERNAL ANCHOR
   ===================================================== */

const anchorLinks =
  document.querySelectorAll(
    'a[href^="#"]'
  );


anchorLinks.forEach(
  function (link) {

    link.addEventListener(
      "click",
      function (event) {

        const href =
          link.getAttribute("href");


        if (
          !href ||
          href === "#" ||
          href.length <= 1
        ) {
          return;
        }


        const target =
          document.querySelector(href);


        if (!target) {
          return;
        }


        event.preventDefault();


        const header =
          document.querySelector(
            "#site-header"
          );


        const headerHeight =
          header
            ? header.offsetHeight
            : 0;


        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          16;


        window.scrollTo({
          top: Math.max(
            0,
            targetPosition
          ),
          behavior:
            window.matchMedia(
              "(prefers-reduced-motion: reduce)"
            ).matches
              ? "auto"
              : "smooth"
        });


        target.setAttribute(
          "tabindex",
          "-1"
        );


        window.setTimeout(
          function () {

            target.focus({
              preventScroll: true
            });

          },
          350
        );

      }
    );

  }
);


/* =====================================================
   EXTERNAL LINKS
   ===================================================== */

const links =
  document.querySelectorAll(
    "a[href]"
  );


links.forEach(
  function (link) {

    const href =
      link.getAttribute("href");


    if (!href) {
      return;
    }


    const isExternal =
      /^https?:\/\//i.test(
        href
      );


    if (!isExternal) {
      return;
    }


    try {

      const url =
        new URL(href);


      if (
        url.origin !==
        window.location.origin
      ) {

        link.setAttribute(
          "target",
          "_blank"
        );

        link.setAttribute(
          "rel",
          "noopener noreferrer"
        );

      }

    } catch (error) {

      /* Invalid URL:
         leave the original link untouched. */

    }

  }
);


/* =====================================================
   LAZY IMAGE SAFETY
   ===================================================== */

const images =
  document.querySelectorAll(
    "img"
  );


images.forEach(
  function (image) {

    if (
      !image.hasAttribute(
        "loading"
      )
    ) {

      image.setAttribute(
        "loading",
        "lazy"
      );

    }


    if (
      !image.hasAttribute(
        "decoding"
      )
    ) {

      image.setAttribute(
        "decoding",
        "async"
      );

    }

  }
);


/* =====================================================
   IMAGE ERROR HANDLING
   ===================================================== */

images.forEach(
  function (image) {

    image.addEventListener(
      "error",
      function () {

        image.classList.add(
          "is-image-error"
        );

        image.setAttribute(
          "data-image-error",
          "true"
        );

      },
      {
        once: true
      }
    );

  }
);


/* =====================================================
   DETAILS / SUMMARY ACCESSIBILITY
   ===================================================== */

const details =
  document.querySelectorAll(
    "details"
  );


details.forEach(
  function (item) {

    const summary =
      item.querySelector(
        "summary"
      );


    if (!summary) {
      return;
    }


    summary.setAttribute(
      "role",
      "button"
    );


    summary.setAttribute(
      "aria-expanded",
      item.open
        ? "true"
        : "false"
    );


    item.addEventListener(
      "toggle",
      function () {

        summary.setAttribute(
          "aria-expanded",
          item.open
            ? "true"
            : "false"
        );

      }
    );

  }
);


/* =====================================================
   EXTERNAL FORM PROTECTION
   ===================================================== */

const forms =
  document.querySelectorAll(
    "form"
  );


forms.forEach(
  function (form) {

    form.addEventListener(
      "submit",
      function () {

        form.classList.add(
          "is-submitting"
        );

      }
    );

  }
);


/* =====================================================
   BACK TO TOP
   ===================================================== */

const backToTop =
  document.querySelector(
    "[data-back-to-top]"
  );


if (backToTop) {

  function updateBackToTop() {

    const visible =
      window.scrollY >
      window.innerHeight;


    backToTop.toggleAttribute(
      "hidden",
      !visible
    );

  }


  window.addEventListener(
    "scroll",
    updateBackToTop,
    {
      passive: true
    }
  );


  updateBackToTop();


  backToTop.addEventListener(
    "click",
    function () {

      window.scrollTo({
        top: 0,
        behavior:
          window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches
            ? "auto"
            : "smooth"
      });

    }
  );

}


/* =====================================================
   ANNOUNCE PAGE READY
   ===================================================== */

document.dispatchEvent(
  new CustomEvent(
    "bagusin:ready"
  )
);
```

});

})();
