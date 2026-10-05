# BagusIn — CP-08 Audit Notes

Baseline: `f421a1237b6e33fa9a4162ed104423c6a7b08988`

## Scope

This pass hardens the shared static-site foundation before launch:

- 320–479px mobile
- 480–767px mobile
- 768–1023px tablet
- 1024–1439px desktop
- 1440px+ large desktop
- keyboard/focus behavior
- mobile navigation state
- reduced-motion behavior
- form controls and touch targets
- global overflow safety
- grouped Work navigation state
- protected deployed routes

## Findings addressed

### Responsive
- Kept a single global container/padding system instead of adding page-specific viewport hacks.
- Added mobile text/input safety so iOS/Android browsers do not zoom unexpectedly on form controls.
- Added horizontal-scroll protection for compact suggestion rows.
- Hardened mobile brand/header sizing so long labels cannot force the header wider than the viewport.
- Preserved 44px+ touch targets.

### Accessibility
- Existing skip links, visible focus rings, reduced-motion support, mobile focus management, Escape handling, and keyboard navigation remain intact.
- Grouped **Work** navigation now exposes an active state when the visitor is inside Services or Work, including the English routes.
- Mobile navigation remains non-interactive while closed through `inert` when supported.

### Performance
- Existing global script keeps first image eager/high-priority and later images lazy.
- No new framework, dependency, or heavy client-side library was introduced.
- Monetization pages remain static HTML/CSS.
- Reduced-motion mode disables expensive visual transitions/backdrop effects.

### Route discipline
Protected routes remain:
- Blog: `/journal/`
- Places: `/destinations/`
- Services: `/work/`
- Work: `/portfolio/`
- YouTube: `/youtube/`

No route rename was introduced during CP-08.

## Manual browser matrix

Before launch, check these widths in a real browser:

| Width | Priority |
|---|---|
| 320px | header, forms, long words |
| 375px | homepage, article, navigation |
| 390px | homepage, services, contact |
| 768px | tablet navigation/grid transitions |
| 1024px | desktop navigation + content width |
| 1440px | whitespace, max-width, footer |

## Launch gate

CP-08 is not a claim of automated Lighthouse/browser completion. The repository-side hardening is complete, but final visual verification should still be performed in Chrome/Edge at the matrix above before CP-09 launch readiness.
