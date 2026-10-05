# CP-14 — Hero Proportion & Link Polish

## Scope
Small visual refinement after CP-13. No IA or route changes.

## Changes
- Desktop homepage hero (`>= 64rem`) now uses nearly the available viewport height.
- Hero remains content-driven on tablet/mobile; no viewport-height forcing below desktop.
- Desktop hero content remains vertically centered.
- Homepage destination/action links no longer use underlines.
- Clickability remains clear through typography, accent color, spacing, hover state and arrow treatment.
- Existing CP-13 search, Right now, navigation and responsive behavior are preserved.

## Verification note
Code-level change completed. Manual browser verification is still required at:
- 320px
- 375px
- 390px
- 768px
- 1024px
- 1440px

Pay particular attention to desktop hero height/centering and mobile overflow.