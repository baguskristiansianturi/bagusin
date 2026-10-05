# CHECKPOINT CP-20 — Homepage Hero as Global Reference

Date: 2026-10-06

## Goal
Make the homepage hero the authoritative reference for hero height across BagusIn.

## Implementation
- Added a single `--hero-height-reference` token derived from the existing homepage/desktop hero rhythm.
- Short inner-page heroes now use the same desktop minimum height as the homepage.
- Long hero content grows naturally without fixed-height clipping.
- Hero content width remains the global `--content-width`; hero height never widens the content rail.
- Desktop hero alignment is vertically centered consistently.
- Tablet/mobile remain content-driven with the same responsive spacing contract.
- Existing page-specific visual backgrounds and typography remain intact.

## Expected result
- Home, Blog, Places, Services, Work, About, Contact, YouTube and monetization pages share one hero-height rhythm.
- A short hero looks like the homepage.
- A long hero becomes taller only when its content genuinely requires it.
- Header, hero, content and footer retain the same horizontal rail.

## Verification
Manual browser QA is still required at 320px, 375px, 390px, 768px, 1024px and 1440px.

Also verify mobile menu, desktop Work dropdown, search on every page, language switching, GitHub Pages project URL and custom domain.