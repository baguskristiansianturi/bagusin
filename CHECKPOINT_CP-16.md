# CHECKPOINT CP-16 — Global Header & Hero Rhythm

## Goal
Make the navbar/search and hero system consistent across BagusIn pages.

## Changes
- Kept the global header/search rail unchanged and shared across pages.
- Added one global `--hero-min-height` design token.
- Homepage hero now consumes the shared token.
- Inner `.page-hero` now consumes the same minimum height.
- Short hero content therefore lands at the same visual height as the homepage on desktop.
- Long hero descriptions naturally expand the hero downward; no fixed height or clipping is introduced.
- Tablet/mobile use content-driven hero sizing with the same spacing rhythm as the homepage.
- Hero horizontal content width remains the existing global `--content-width`; it is not widened.
- No route, copy, IA, or mobile navigation changes.

## Verification status
Code-level consistency implemented. Manual browser QA remains required at:
- 320px
- 375px
- 390px
- 768px
- 1024px
- 1440px

Also verify desktop search remains between brand and Blog and that header/content/footer share the same left/right rail.
