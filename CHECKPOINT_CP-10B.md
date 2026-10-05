# CP-10B — UX Flow Checkpoint

## Purpose
Refine how people enter, explore, move between, and leave BagusIn without turning the site into a sales funnel.

## Changes
- Global navigation path normalization no longer depends on the hosting prefix for active-state logic.
- Work remains a grouped area: Services + Work.
- Mobile Work group has stronger hierarchy and separation.
- Mobile search suggestions are horizontally scrollable instead of wrapping into an awkward block.
- Search input language is more human and broader than "article" terminology.
- Search language detection works across custom-domain and GitHub Pages project paths.
- Touch targets remain large enough for mobile use.

## UX principle
Home is the living room. Blog, Places, Work and Services are rooms. Search is a quiet way to find something specific. Contact is a direct exit/connection path. The navigation should help people move naturally between these rooms without competing for attention.

## Verification still required
Check:
- Home → Blog → article → related content → back
- Home → Places → entry → back
- Home → Work → Services / Work
- Home → Contact
- Search from Indonesian and English pages
- Mobile menu open/close, Escape, focus trap and scroll lock
- Desktop dropdown and language menu
- 320–1440px widths
