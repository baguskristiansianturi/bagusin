# Shared components

This folder holds the single source of truth for the shared shell pilot and future reusable UI patterns. The first migrated pages are the three service-category catalogues.

## Rules
- Navbar/mobile navigation and footer belong here once the shared-shell pilot is wired up.
- Keep reusable markup separate from `css/` and `js/`; component styles/behavior should have explicit files.
- Do not paste a fragment into a page and call it shared: all consumers must load or generate it from the same source.
- Pilot migrations must preserve existing layout, route links, search, mobile menu, accessibility, and page-specific active states.
- Checkout and demos may intentionally retain a distinct shell.
