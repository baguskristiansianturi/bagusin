# Bagusin — Architecture Rules

Last reviewed: 29 October 2026.

## Purpose
Bagusin is a static GitHub Pages website. Keep the public URL structure stable while making source code easier to maintain in VS Code. Prefer explicit modules and clear ownership over one large global file or duplicated markup.

## Non-negotiable boundaries
- The homepage is protected: do not redesign or change its section layout when editing another page.
- Complete Business is not a category page in this phase. Keep its existing destination/CTA unchanged; do not create its future page yet.
- Shared navigation and footer should eventually have one source of truth. Until a page is migrated to the shared shell, its existing markup remains the source of truth; do not claim a global shell is already active everywhere.
- Every page owns scoped styles and page-specific behavior. Global CSS/JS must not contain one-page-only overrides.
- Reuse the approved category template for Company Profile, Landing Page and Website Kompleks. Keep their industry taxonomy identical; only copy, function labels and empty-state copy vary.
- Keep content/data separate from rendering where practical, especially articles, catalogue entries, and service metadata.
- Preserve URLs, canonical tags, hreflang, form destinations and GitHub Pages base path `/bagusin/`.
- Do not move or delete existing files until all references, script/style paths, canonical URLs, forms, sitemap entries and tests have been checked.
- Do not treat source edits as proof of visual or deployment success.

## Target structure
```text
/
├── index.html                    # Protected homepage / current entry point
├── ARCHITECTURE.md
├── HANDOFF.md                    # Current work and verified status
├── ROADMAP.md
├── components/                   # Shared shell source and reusable UI fragments
├── pages/                        # Optional implementation modules; public entry URLs stay in place
├── assets/
│   ├── css/
│   │   ├── base/                 # tokens, reset, shared primitives
│   │   ├── components/           # header, footer, buttons, cards
│   │   └── pages/                # page-scoped styles
│   ├── js/
│   │   ├── core/                 # shared utilities, shell, navigation
│   │   ├── components/           # reusable interactions
│   │   └── pages/                # page controllers
│   └── images/
├── content/
│   ├── articles/                 # article source / editorial metadata
│   ├── catalog/                  # catalogue and industry taxonomy
│   └── services/                 # service copy and metadata
├── blog/                         # Existing public article URLs; preserve
├── collections/                  # Existing public catalogue URLs; preserve
├── css/ and js/                  # Existing production assets during gradual migration
├── scripts/                      # audits, build helpers and smoke tests
├── docs/architecture/            # repository map and migration decisions
└── .vscode/                      # editor settings and safe workspace defaults
```

This is a gradual target, not permission for a bulk move. Existing `css/`, `js/`, and URL directories remain active until a migration is explicitly completed and tested.

## File ownership
- **Global shell:** one shared source for navbar/mobile navigation and footer. Shared-shell edits require homepage, article, category, and mobile navigation regression checks.
- **Page HTML:** semantic structure, page metadata, and the page's unique sections. Public URL entry files remain where they are.
- **Page CSS:** only styles for that page or reusable component, scoped under a root class.
- **Page JS:** only behavior for that page. Shared utilities go in a shared module.
- **Content:** article text, article metadata, catalogue taxonomy and service copy should not be scattered through generic rendering code.
- **SEO:** canonical, hreflang, sitemap and structured data remain aligned with actual public URLs.

## Safe change workflow
1. Read `docs/PROJECT-CHECKLIST.md`, this file, `docs/architecture/REPOSITORY_MAP.md`, and the relevant handoff/roadmap notes.
2. Identify the page entry point and every dependency before editing.
3. Make the smallest scoped change; keep unrelated pages untouched.
4. Run static audit and responsive/browser smoke tests.
5. Check the GitHub Pages workflow and test the deployed URL. If visual/browser verification is unavailable, state that explicitly.
6. Update the map and handoff with only verified outcomes.

## Migration policy
Migration is staged: document and inventory first; build shared component sources and a pilot; validate the pilot; then migrate page families. Do not convert all 100 HTML files in one blind rewrite. Checkout, demo/preview and other deliberately standalone pages may need distinct shells. Any shared navbar/footer change must be regression-tested before rollout.
