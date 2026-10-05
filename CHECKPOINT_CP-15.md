# CP-15 — Global Horizontal Alignment

## Changes
- Homepage hero content is explicitly locked to the same global `--content-width` and `--page-padding` rail used by the rest of the site.
- Desktop header uses the exact same horizontal container formula as `.container` and the footer.
- Desktop quick search now flexes only through the available space between the brand and Blog/navigation.
- Blog/navigation/actions stay anchored to the right side of the shared content rail instead of being pushed left by the search width.
- No content copy, IA, routes, or mobile layout changes.

## Verification
Manual browser verification remains required at 320, 375, 390, 768, 1024 and 1440px, especially header/content/footer left and right edges.