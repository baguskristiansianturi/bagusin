# CHECKPOINT CP-21 — Global Shell Consistency

Date: 2026-10-06

## Fix
The browser should see one consistent BagusIn shell on every route.

### Hero
- Homepage remains the authoritative desktop hero height reference.
- All inner `section.page-hero` sections use the same minimum height and vertical centering.
- Page-specific outer margins are neutralized.
- Long content can expand naturally.
- Hero content remains on the global content rail.

### Header / Search
- Desktop header is explicitly one flex rail: Brand → Quick Search → Navigation → Actions.
- Quick Search is forced visible at desktop on every route.
- Navigation remains anchored instead of being pushed around by search.
- If a page is missing the latest search panel markup, `navigation.js` creates the shared panel automatically.
- Search panel, suggestions, routing and language behavior remain shared.

## QA still required
Browser verification at 320, 375, 390, 768, 1024 and 1440px, including navigation dropdown, mobile menu, search submit, search suggestions and language switching.
