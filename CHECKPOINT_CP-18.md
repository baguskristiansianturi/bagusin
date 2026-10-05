# CHECKPOINT CP-18 — Global navigation, search & page shell

Date: 2026-10-05

## Purpose
Make every BagusIn page use the same functional navigation/search contract and the same page-hero height/content rail.

## Fixed

### Global navigation
- Normalized desktop navigation at runtime on every page.
- Consistent routes:
  - Blog → /journal/
  - Places → /destinations/
  - Work → dropdown
    - Services → /work/
    - Work → /portfolio/
  - YouTube → /youtube/
  - About → /about/
  - Contact → /contact/
- English mirrors use the /en/ equivalents.
- Language switcher routes now follow the current section instead of stale page-specific links.
- Mobile navigation uses the same route structure.

### Search
- Desktop quick-search is injected when missing, so it is no longer homepage-only.
- Quick-search sits between BagusIn and the main navigation on desktop.
- Mobile keeps the compact search control/panel.
- Fixed a literal \\n syntax defect in js/search.js that could prevent search execution.
- English search was normalized and expanded.
- GitHub Pages / custom-domain search prefixes are handled.

### Work interaction
- Work dropdown is rebuilt consistently before event listeners bind.
- Services and Work destinations are explicit and functional.
- Active-state logic continues to group Services + Work.

### Hero / Places
- Added a stronger shared .section.page-hero contract.
- Desktop short page heroes use the same viewport-based minimum rhythm as the homepage.
- Long hero copy expands naturally; no fixed height clipping.
- Hero content uses the same global content rail.
- Page-specific hero classes can retain visual/typographic details without changing the shared height/padding.
- Places is explicitly covered by the same contract.

## Verification status
Code-level integrity checked for:
- navigation.js
- search.js
- search-en.js
- no literal escaped-newline syntax defect remains in these scripts.

Manual browser verification is still required at:
- 320px
- 375px
- 390px
- 768px
- 1024px
- 1440px

Also verify:
- desktop Work dropdown opens/closes
- mobile menu opens/closes
- search submission/results
- language switch
- GitHub Pages project URL
- bagusin.com custom domain
