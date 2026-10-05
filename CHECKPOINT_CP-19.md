# CHECKPOINT CP-19 — Hero rail and search consistency

## Fixed
- Homepage hero now uses box-sizing:border-box, so its viewport minimum includes padding and matches inner-page hero height.
- Header, homepage hero, inner-page hero, and footer container use the same --content-width / --page-padding rail.
- Desktop quick-search flexes only in the available space between BagusIn and Blog/Work navigation.
- Search no longer has a page-specific maximum width that changes its visual size.
- Places hero title/dek width is normalized to the same 48rem reading rail used by the global hero.
- Desktop intermediate widths (56–72rem) get tighter navigation spacing while retaining the same outer rail.
- Mobile/tablet hero spacing remains shared and content-driven.

## Manual QA still required
320, 375, 390, 768, 1024, 1440px, including custom domain and GitHub Pages.
