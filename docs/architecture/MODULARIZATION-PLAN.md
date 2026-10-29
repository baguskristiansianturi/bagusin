# Bagusin Modularization Plan

## Goal
Make routine edits in VS Code predictable: one owner for each concern, explicit file paths, preserved public URLs, and minimal cross-page regressions.

## Phase A — Inventory and guardrails
- [x] Create architecture rules and repository map.
- [x] Record homepage protection, Complete Business exclusion, current URL constraints, and category template reuse.
- [ ] Capture baseline results from static audit and responsive smoke tests on the working branch.
- [ ] Add a complete route-to-assets dependency inventory.

## Phase B — Shared shell pilot
- [x] Establish one shared navbar/mobile navigation source and one footer source for the category-page pilot.
- [x] Keep component CSS separate from page CSS by reusing existing shared `css/header.css` and `css/footer.css`.
- [x] Migrate the three service-category pages as the first pilot.
- [x] Ensure navigation behavior initializes after shell render and the mobile menu remains wired.
- [ ] Run the new category routes through responsive browser smoke tests and verify visual parity before broader migration.
- [ ] Verify visual parity at mobile and desktop sizes before migrating other page families.
- [ ] Keep checkout and demo pages out of the shared-shell pilot unless their UX explicitly calls for it.

## Phase C — Content and page modules
- [ ] Define article records (slug, title, description, language, category, date, cover, body, related links and SEO metadata) in `content/articles/`.
- [ ] Keep public article URLs as stable entry points; don't bulk-move articles.
- [ ] Separate catalogue taxonomy/data from rendering in `content/catalog/`.
- [ ] Put page-specific behavior in page controllers; shared code should not contain article- or category-specific copy.
- [ ] Add starter templates for a new article, service page, and category page.

## Phase D — CSS/JS organization
- [ ] Gradually move reusable components to `assets/css/components/` and `assets/js/components/`; page controllers to `assets/js/pages/`.
- [ ] Keep current `css/` and `js/` paths working until all references and cache-busters are updated.
- [ ] Scope page styles and eliminate accidental cross-page selectors before moving any file.
- [ ] Add a small manifest/dependency map for every migrated page family.

## Phase E — Quality and handoff
- [ ] VS Code workspace defaults, formatting rules, and tasks for static audit/smoke tests.
- [ ] Update architecture map, project checklist, and roadmap when a phase actually passes.
- [ ] Migrate in small PRs; don't merge or claim deployment without passing checks and live verification.

## Acceptance criteria
- Changing shared navbar source changes every migrated page and doesn't require editing each page.
- Page-specific CSS/JS edits do not alter unrelated pages.
- Article copy can be changed without editing generic layout/rendering logic.
- Existing public URLs, canonical/hreflang, internal links and sitemap remain valid.
- Homepage design and Complete Business scope remain unchanged.
- Static audit and responsive smoke checks pass; deployment status is checked.
