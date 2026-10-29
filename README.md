# Bagusin

Bagusin is a static website published with GitHub Pages.

## Start here when editing in VS Code
1. Read [Architecture Rules](ARCHITECTURE.md).
2. Use [Repository Map](docs/architecture/REPOSITORY_MAP.md) to find the page and its assets.
3. Read [Modularization Plan](docs/architecture/MODULARIZATION-PLAN.md) before moving files or changing shared components.
4. Read [Project Checklist](docs/PROJECT-CHECKLIST.md) and [Roadmap](ROADMAP.md) for current status and next steps.

## Where to edit
- Homepage layout/copy: `index.html` and its scoped `css/home*.css` files. Treat homepage as protected when working on other pages.
- Service pages: `work/<service>/index.html` and relevant page CSS/JS.
- Category catalogue pages: `collections/<slug>/index.html`, shared styles in `css/catalog-category-page.css`, interactions in `js/catalog-category-page.js`.
- Blog/article pages: `blog/<slug>/index.html`; article-source organization is being prepared under `content/articles/`.
- Shared styles: `css/variables.css`, `css/global.css`, `css/components.css`, `css/header.css`, `css/footer.css`. Header/footer are still duplicated in some page HTML until the shared-shell migration is complete.
- Page-specific styles and interactions should remain scoped; avoid adding one-page rules to global styles.

## Checks
Run the tasks in VS Code (Terminal > Run Task) or from a terminal:
```sh
node scripts/audit-static-site.mjs
node scripts/responsive-smoke.mjs
```
These checks require the runtime/dependencies used by the repository. A passing source audit is not a substitute for verifying the deployed page in a browser.

## Deployment
Production site: https://baguskristiansianturi.github.io/bagusin/
