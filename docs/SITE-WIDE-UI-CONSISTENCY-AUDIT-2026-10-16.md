# Bagusin — Cross-page UI consistency audit
**Date:** 16 October 2026  
**Branch:** `ux/homepage-newest-carousel-20261015-main`  
**Status:** In progress; do not merge until latest CI and visual review are complete.

## Scope inspected
- Repository tree: approximately 96–97 HTML files and 41 CSS files at the time of inspection.
- Representative pages: homepage, services, collections, template catalog and template detail, blog index and article, contact, about, learning, legal, portfolio, checkout, YouTube, and English routes.
- Shared files: `js/navigation.js`, `css/header.css`, `css/footer.css`, `css/global.css`, `css/responsive.css`, `css/ux-polish.css`, `css/final-responsive.css`, `css/site-consistency.css`, static audit, and responsive browser smoke tests.

## Findings and fixes made
1. **Navigation labels/order drifted across page templates.** Some pages used “Destinations”, “About”, “Template & Demo”, or “Blog & panduan” while equivalent routes used Indonesian labels. Shared navigation now normalizes labels by destination and language, adds missing common links, and applies a predictable order.
2. **Template store and template detail had custom headers.** The store/detail pages did not share the full mobile navigation controls. The detail also used a standalone `store-footer` and omitted `footer.css`. The detail now uses the shared responsive header and shared footer; the template-store homepage was aligned to the same header in this branch.
3. **Breadcrumb detection was too narrow.** The runtime guard only looked for `data-site-breadcrumbs`. It now recognizes the shared component and common legacy breadcrumb selectors to avoid adding a second trail.
4. **Title/subtitle spacing was fragmented.** Global heading scale exists, but page-specific CSS sets independent margins. Shared consistency rules now define common heading-to-description and kicker-to-heading spacing for standard heading wrappers, hero content, and product copy.
5. **Global CSS layering is complex.** `navigation.js` dynamically loads three shared polish/consistency stylesheets, and `final-responsive.css` contains broad defensive rules. This may explain why spacing can still feel uneven. Do not delete these overrides blindly; identify usage and consolidate by component family in a separate, reviewable pass.

## Verification gates
- Static audit checks pages using `navigation.js` for exactly one shared header, main landmark, footer, and H1, plus the shared header/footer stylesheets.
- Browser smoke checks shared navigation labels/order, mobile menu availability, one breadcrumb trail on interior pages, and footer structure on representative routes at 390px.
- Existing responsive matrix continues checking 320, 375, 390, 768, 1024, and 1440px for horizontal overflow.
- **CI status for the newest head must be read from GitHub Actions before merge.** Earlier passing runs on older commits are not evidence for the current head.
- **Manual visual QA is still required** on the real GitHub Pages deployment, especially navbar sticky behavior, menu interactions, breadcrumb placement, heading/subtitle rhythm, footer, and narrow mobile spacing.

## Next sequence
1. Fix any failures from the latest static audit/browser smoke.
2. Review services/details, catalog/template, article, learning/course, legal/contact, and EN/ID page families with the same checklist.
3. Consolidate global CSS only after identifying which overrides are redundant.
4. Update this report and `docs/PROJECT-CHECKLIST.md` with the exact tested commit and outcomes.
5. Keep PR #138 draft until CI and manual visual gates are satisfied.
