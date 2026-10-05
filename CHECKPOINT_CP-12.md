# CHECKPOINT CP-12 — UI / UX Navbar & Homepage Hero

## Status
Implementation complete on branch `fix/cp-12-ui-ux-navbar-hero`.

## Fixed
- Reduced homepage hero vertical padding and headline scale so the opening content fits more naturally in the first viewport.
- Reduced hero lead width/line-height and action spacing.
- Balanced hero aside spacing and mobile stacking.
- Standardized homepage section rhythm so sections do not feel unnecessarily separated.
- Removed duplicate desktop search affordance at wide widths: quick search remains the primary desktop search control; icon search remains available at narrower desktop/mobile widths.
- Reduced navbar spacing at 896–1151px where the previous combination could become crowded.
- Preserved 44px+ touch targets.
- Improved mobile Work grouping hierarchy and scroll behavior.
- Made the language indicator switch between ID and EN based on the current route.
- Repaired the Work grouped active-state logic on custom-domain paths.
- Added sticky-header-aware anchor scroll spacing.

## Verification required
Manual browser QA remains required at 320, 375, 390, 768, 1024 and 1440px, including menu, Work dropdown, language, search, anchors and all primary links. No browser automation is claimed.
