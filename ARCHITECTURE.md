# Bagusin — Architecture and Editing Rules

Last reviewed: 30 October 2026.

## 1. Project model

Bagusin is a static website published on GitHub Pages. The public site base is `/bagusin/`. Each public route remains a folder with an `index.html` entry point unless a future migration is explicitly planned and tested.

This repository is being modularized gradually. It is **not** yet a fully componentized application: some page families still repeat their header/footer markup, and the shared CSS/JS directories are currently flat. Do not assume a shared component is active on every page.

## 2. Non-negotiable boundaries

- **Protect the homepage.** Changes to another page must not change `index.html`, its section order, or its homepage-only CSS.
- Keep the current clean editorial visual language and preserve approved page designs. A structural change is not permission to redesign.
- Preserve public URLs, canonical URLs, hreflang, sitemap entries, internal links, asset paths, and query-string handoffs.
- Do not create a Complete Business / Website Sistem Lengkap detail flow unless specifically requested. The current category entry is only the existing catalogue page.
- Keep checkout, template demos/previews, and other special-purpose experiences independent when their UX requires it.
- Do not move or rename files until all references and tests have been checked.
- Do not claim visual or deployment success based only on source edits.

## 3. Current repository layout

```text
/
├── index.html                    # Protected Indonesian homepage
├── en/                           # English public routes
├── about/, contact/, author/     # Informational and contact routes
├── blog/<slug>/                  # Public article routes
├── collections/                  # Catalogue overview and category catalogues
├── work/<service>/               # Service hub and service detail routes
├── templates/                    # Template store, detail, preview and checkout
├── demos/                        # Standalone demos
├── checkout/                     # Service/project brief and checkout flow
├── learning/                     # Learning catalogue and course pages
├── legal/                        # Policy pages
├── assets/                       # Images and other static assets
├── css/                          # Shared foundations and page-family styles
├── js/                           # Shared utilities and page controllers
├── content/                      # Editorial and catalogue planning/source material
├── scripts/                      # Static and browser regression checks
└── docs/                          # Project decisions, checklist and architecture
```

See [Repository Map](docs/architecture/REPOSITORY-MAP.md) for the page-family ownership map.

## 4. CSS ownership and loading order

The common foundation is normally loaded in this order:

1. `reset.css` — browser normalization.
2. `variables.css` — design tokens.
3. `global.css` — document, containers, typography and base layout.
4. `components.css` — reusable primitives.
5. `header.css` and `footer.css` — shared chrome.
6. `responsive.css` — shared responsive rules.
7. The page-family stylesheet(s) — the page's final visual decisions.

The homepage has additional ordered stylesheets such as `home.css`, `home-pathfinder.css`, and its later homepage refinements. Their order is intentional until a dedicated homepage audit approves a change. Never reorder them as cleanup.

Category catalogue pages use:
- Root: `#app.catalog-category-page`
- Styles: `css/catalog-category-page.css`
- Controller: `js/catalog-category-page.js`

That category stylesheet must remain loaded only by category catalogue routes. Before consolidating its layered refinements, capture and pass a visual baseline at all required viewport widths.

### CSS rules for new work

- Put page-specific styles in the page-family stylesheet, not in `global.css`, `components.css`, or `responsive.css`.
- Scope new page selectors under that page's root class (for example `.catalog-category-page .category-hero`).
- Prefer component classes over broad selectors such as `section`, `article`, `[class*="grid"]`, or `main *`.
- Use `minmax(0, 1fr)`, `min-width: 0`, and bounded media sizing where grid/flex children may otherwise force overflow.
- Do not use global `!important` overrides to fix a single page.
- Add mobile/tablet breakpoints to the owning page stylesheet; do not change another page family to solve one page's issue.

## 5. JavaScript ownership

- `js/main.js`: shared site utilities only.
- `js/navigation.js`: navigation and global header interactions.
- `js/catalog-category-page.js`: category catalogue filter and empty-state behavior only.
- `js/template-*.js`, `js/collection-*.js`, `js/article*.js`: their respective page families.
- `scripts/`: local/CI quality gates; browser tests must cover behavior, not just route loading.

Do not place page-specific copy or selectors in a global controller. Initialize interactions only after the relevant markup exists. If a page uses asynchronously loaded fragments, its controller must wait for a documented ready event and must have a tested failure/fallback state.

## 6. Shared header and footer status

Header/footer markup is still duplicated in some page families. The existing category pages currently render their own shell markup. Until a shared-shell migration has passed browser checks on every migrated route, keep the current markup in place. Do not add an unverified asynchronous shell loader or migrate all pages in one change.

When shared shell work is approved, migrate one page family at a time and verify mobile menu, search, focus behavior, sticky positioning, footer links, and language variants before expanding.

## 7. Adding or changing a page safely

1. Read `docs/PROJECT-CHECKLIST.md` and this file.
2. Find the current page entry point in the Repository Map.
3. Inspect its linked stylesheets, scripts, images, canonical/hreflang and incoming/outgoing links.
4. Change only the owning page, stylesheet, controller, or data source.
5. Keep the homepage untouched unless the request explicitly concerns it.
6. Run:
   - `node scripts/audit-static-site.mjs`
   - `node scripts/responsive-smoke.mjs`
7. Check all viewport widths: 320, 375, 390, 768, 1024 and 1440 px.
8. Review the diff and workflow results. After merge, verify the deployed GitHub Pages URL. A green CI run is not a substitute for real-device visual QA.

## 8. Current known limitations

- The shared CSS and JS directories are flat and contain legacy naming; gradual organization is safer than a bulk move.
- Some stylesheets contain layered historical overrides. Preserve their cascade until a screenshot/browser baseline is available.
- Header/footer are not yet sourced from one universal component.
- Article body/content data is not fully separated from individual HTML pages.
- GitHub Pages is static: do not add backend-dependent claims or flows unless the requested infrastructure exists.
