/* =========================================================
BAGUSIN
GLOBAL NAVIGATION
Phase 09 — Integrated Version
========================================================= */

(function () {
"use strict";

/* =======================================================
DOM
======================================================= */

const header =
document.querySelector("#site-header");

const mobileMenuToggle =
document.querySelector(
"[data-mobile-menu-toggle]"
);

const mobileMenuClose =
document.querySelector(
"[data-mobile-menu-close]"
);

const mobileNav =
document.querySelector(
"#mobile-navigation"
);

const mobileOverlay =
document.querySelector(
"[data-mobile-overlay]"
);

const searchToggle =
document.querySelector(
"[data-search-toggle]"
);

const searchPanel =
document.querySelector(
"#header-search"
);

const languageToggle =
document.querySelector(
"[data-language-toggle]"
);

const languageMenu =
document.querySelector(
"#language-menu"
);

const dropdownToggles =
document.querySelectorAll(
".nav-dropdown-toggle"
);

/* =======================================================
STATE
======================================================= */

let mobileMenuOpen = false;
let searchOpen = false;
let languageOpen = false;

/* =======================================================
HELPERS
======================================================= */

function show(element) {

```
if (!element) {
  return;
}

element.removeAttribute("hidden");
```

}

function hide(element) {

```
if (!element) {
  return;
}

element.setAttribute(
  "hidden",
  ""
);
```

}

function setExpanded(
element,
value
) {

```
if (!element) {
  return;
}

element.setAttribute(
  "aria-expanded",
  String(value)
);
```

}

function closeDropdowns(
except = null
) {

```
dropdownToggles.forEach(
  function (toggle) {

    if (toggle === except) {
      return;
    }

    const id =
      toggle.getAttribute(
        "aria-controls"
      );

    const dropdown =
      id
        ? document.getElementById(id)
        : null;

    hide(dropdown);

    setExpanded(
      toggle,
      false
    );

    toggle
      .closest(".site-nav__item")
      ?.classList.remove(
        "is-open"
      );

  }
);
```

}

/* =======================================================
STICKY HEADER
======================================================= */

function updateStickyHeader() {

```
if (!header) {
  return;
}

header.classList.toggle(
  "is-sticky",
  window.scrollY > 8
);
```

}

window.addEventListener(
"scroll",
updateStickyHeader,
{
passive: true
}
);

updateStickyHeader();

/* =======================================================
MOBILE MENU
======================================================= */

function openMobileMenu() {

```
if (!mobileNav) {
  return;
}

mobileMenuOpen = true;

show(mobileNav);
show(mobileOverlay);

mobileNav.setAttribute(
  "aria-hidden",
  "false"
);

setExpanded(
  mobileMenuToggle,
  true
);

mobileMenuToggle?.setAttribute(
  "aria-label",
  "Tutup menu"
);

document.body.classList.add(
  "menu-open"
);

document.body.style.overflow =
  "hidden";

requestAnimationFrame(
  function () {

    mobileNav.classList.add(
      "is-open"
    );

    mobileOverlay?.classList.add(
      "is-visible"
    );

  }
);
```

}

function closeMobileMenu() {

```
if (!mobileNav) {
  return;
}

mobileMenuOpen = false;

mobileNav.classList.remove(
  "is-open"
);

mobileOverlay?.classList.remove(
  "is-visible"
);

mobileNav.setAttribute(
  "aria-hidden",
  "true"
);

setExpanded(
  mobileMenuToggle,
  false
);

mobileMenuToggle?.setAttribute(
  "aria-label",
  "Buka menu"
);

document.body.classList.remove(
  "menu-open"
);

document.body.style.overflow =
  "";

window.setTimeout(
  function () {

    if (!mobileMenuOpen) {

      hide(mobileNav);
      hide(mobileOverlay);

    }

  },
  350
);
```

}

mobileMenuToggle?.addEventListener(
"click",
function () {

```
  if (mobileMenuOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }

}
```

);

mobileMenuClose?.addEventListener(
"click",
closeMobileMenu
);

mobileOverlay?.addEventListener(
"click",
closeMobileMenu
);

/* =======================================================
MOBILE NAV LINKS
======================================================= */

mobileNav
?.querySelectorAll("a")
.forEach(
function (link) {

```
    link.addEventListener(
      "click",
      function () {

        closeMobileMenu();

      }
    );

  }
);
```

/* =======================================================
DESKTOP DROPDOWNS
======================================================= */

dropdownToggles.forEach(
function (toggle) {

```
  toggle.addEventListener(
    "click",
    function (event) {

      event.stopPropagation();

      const id =
        toggle.getAttribute(
          "aria-controls"
        );

      const dropdown =
        id
          ? document.getElementById(id)
          : null;

      if (!dropdown) {
        return;
      }

      const currentlyOpen =
        !dropdown.hasAttribute(
          "hidden"
        );


      closeDropdowns(toggle);


      if (currentlyOpen) {

        hide(dropdown);

        setExpanded(
          toggle,
          false
        );

        toggle
          .closest(".site-nav__item")
          ?.classList.remove(
            "is-open"
          );

        return;

      }


      show(dropdown);

      setExpanded(
        toggle,
        true
      );

      toggle
        .closest(".site-nav__item")
        ?.classList.add(
          "is-open"
        );

    }
  );

}
```

);

/* =======================================================
SEARCH
======================================================= */

function openSearch() {

```
if (!searchPanel) {
  return;
}

searchOpen = true;

closeDropdowns();
closeLanguage();

show(searchPanel);

setExpanded(
  searchToggle,
  true
);

searchToggle?.setAttribute(
  "aria-label",
  "Tutup pencarian"
);

requestAnimationFrame(
  function () {

    searchPanel.classList.add(
      "is-open"
    );

  }
);


const input =
  searchPanel.querySelector(
    'input[type="search"]'
  );


window.setTimeout(
  function () {

    input?.focus();

  },
  80
);
```

}

function closeSearch() {

```
if (!searchPanel) {
  return;
}

searchOpen = false;

searchPanel.classList.remove(
  "is-open"
);

setExpanded(
  searchToggle,
  false
);

searchToggle?.setAttribute(
  "aria-label",
  "Buka pencarian"
);


window.setTimeout(
  function () {

    if (!searchOpen) {
      hide(searchPanel);
    }

  },
  220
);
```

}

searchToggle?.addEventListener(
"click",
function (event) {

```
  event.stopPropagation();

  if (searchOpen) {
    closeSearch();
  } else {
    openSearch();
  }

}
```

);

/* =======================================================
LANGUAGE
======================================================= */

function openLanguage() {

```
if (!languageMenu) {
  return;
}

languageOpen = true;

closeDropdowns();
closeSearch();

show(languageMenu);

setExpanded(
  languageToggle,
  true
);

languageToggle
  ?.closest(".language-switcher")
  ?.classList.add(
    "is-open"
  );
```

}

function closeLanguage() {

```
if (!languageMenu) {
  return;
}

languageOpen = false;

hide(languageMenu);

setExpanded(
  languageToggle,
  false
);

languageToggle
  ?.closest(".language-switcher")
  ?.classList.remove(
    "is-open"
  );
```

}

languageToggle?.addEventListener(
"click",
function (event) {

```
  event.stopPropagation();

  if (languageOpen) {
    closeLanguage();
  } else {
    openLanguage();
  }

}
```

);

/* =======================================================
OUTSIDE CLICK
======================================================= */

document.addEventListener(
"click",
function (event) {

```
  const target =
    event.target;


  if (
    !target.closest(
      ".site-nav"
    )
  ) {

    closeDropdowns();

  }


  if (
    !target.closest(
      ".language-switcher"
    )
  ) {

    closeLanguage();

  }


  if (
    searchOpen &&
    !target.closest(
      ".header-search"
    ) &&
    !target.closest(
      "[data-search-toggle]"
    )
  ) {

    closeSearch();

  }

}
```

);

/* =======================================================
ESCAPE
======================================================= */

document.addEventListener(
"keydown",
function (event) {

```
  if (
    event.key !== "Escape"
  ) {
    return;
  }


  if (mobileMenuOpen) {

    closeMobileMenu();

    mobileMenuToggle?.focus();

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

}
```

);

/* =======================================================
VIEWPORT
======================================================= */

const desktopQuery =
window.matchMedia(
"(min-width: 64rem)"
);

function handleViewportChange() {

```
if (
  desktopQuery.matches &&
  mobileMenuOpen
) {

  closeMobileMenu();

}
```

}

if (
typeof desktopQuery.addEventListener ===
"function"
) {

```
desktopQuery.addEventListener(
  "change",
  handleViewportChange
);
```

}

window.addEventListener(
"resize",
handleViewportChange,
{
passive: true
}
);

/* =======================================================
ACTIVE NAVIGATION
======================================================= */

function normalizePath(path) {

```
if (!path) {
  return "/";
}

let result =
  path
    .split("?")[0]
    .split("#")[0];


if (
  result.length > 1 &&
  !result.endsWith("/")
) {

  result += "/";

}


return result;
```

}

function updateActiveLinks() {

```
const current =
  normalizePath(
    window.location.pathname
  );


document
  .querySelectorAll(
    ".site-nav a, .mobile-nav a"
  )
  .forEach(
    function (link) {

      const href =
        link.getAttribute(
          "href"
        );


      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http")
      ) {
        return;
      }


      let path;


      try {

        path =
          normalizePath(
            new URL(
              href,
              window.location.origin
            ).pathname
          );

      } catch (error) {

        return;

      }


      const active =
        path === "/"
          ? current === "/"
          : (
              current === path ||
              current.startsWith(path)
            );


      link.classList.toggle(
        "is-active",
        active
      );


      if (active) {

        link.setAttribute(
          "aria-current",
          "page"
        );

      } else {

        link.removeAttribute(
          "aria-current"
        );

      }

    }
  );
```

}

updateActiveLinks();

/* =======================================================
INITIAL STATE
======================================================= */

hide(searchPanel);
hide(languageMenu);
hide(mobileNav);
hide(mobileOverlay);

closeDropdowns();

setExpanded(
searchToggle,
false
);

setExpanded(
languageToggle,
false
);

setExpanded(
mobileMenuToggle,
false
);

})();
