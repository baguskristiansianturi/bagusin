# Bagusin

Bagusin is a static website published with GitHub Pages.

## Start here before editing

1. Read [Architecture and Editing Rules](ARCHITECTURE.md).
2. Find the relevant page in [Repository Map](docs/architecture/REPOSITORY-MAP.md).
3. Read [Project Checklist and Session Handoff](docs/PROJECT-CHECKLIST.md).
4. Keep changes inside the owning page family. Do not redesign the homepage while working on another page.

## Main source locations

- Homepage: `index.html` and the ordered `css/home*.css` files.
- Service pages: `work/<service>/index.html` and `css/service-*.css`.
- Category catalogues: `collections/<category>/index.html`, `css/catalog-category-page.css`, and `js/catalog-category-page.js`.
- Blog/articles: `blog/`, `css/blog.css`, and `css/article*.css`.
- Shared foundations: `css/variables.css`, `css/global.css`, `css/components.css`, `css/header.css`, `css/footer.css`, `css/responsive.css`.
- Shared interactions: `js/main.js` and `js/navigation.js`.
- Quality checks: `scripts/audit-static-site.mjs` and `scripts/responsive-smoke.mjs`.

## Local checks

Run from the repository root:

```sh
node scripts/audit-static-site.mjs
node scripts/responsive-smoke.mjs
```

The browser smoke test requires Playwright and Chromium to be installed. A passing static audit does not prove visual correctness.

## Production

https://baguskristiansianturi.github.io/bagusin/
