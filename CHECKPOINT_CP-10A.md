# CP-10A — Integrity, Hero & Footer Checkpoint

Branch: `redesign/cp-10a-hero-footer`

## Scope
- Protected routes remain: `/journal/`, `/destinations/`, `/work/`, `/portfolio/`, `/youtube/`.
- Correct canonical/hreflang mapping for Blog and Places.
- Correct Indonesian Work/Portfolio language mapping.
- Correct Places stylesheet reference.
- 404 assets and navigation use relative paths so both custom-domain root hosting and GitHub Pages project hosting can resolve them.
- Shared page heroes receive a restrained editorial visual background without external stock-image dependency.
- Homepage hero receives a stronger visual layer while preserving the existing identity and content hierarchy.
- Footer receives a single visual treatment at the global CSS level and the 404 page now has the same footer shell.

## Important UX decision
The hero visual is CSS-generated: gradients, grid lines, rings, and depth. This keeps the launch lightweight and avoids generic stock photography. Real photography can later replace individual visual surfaces when there is genuine BagusIn material to show.

## Browser verification still required
Test at 320, 375, 390, 768, 1024, and 1440px, including:
- homepage hero
- inner-page hero
- article cover/header
- footer
- mobile navigation
- search
- overflow and long labels
- 404 page on both hosting paths

## Not changed in this checkpoint
No framework migration, backend, CMS, authentication, or broad information-architecture rewrite.
