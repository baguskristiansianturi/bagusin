# Bagusin — Repository Map

Last reviewed: 30 October 2026. This map describes current production paths, not a proposed bulk migration.

## Public page families

| Page family | Public entry point | Primary owner | Notes |
|---|---|---|---|
| Homepage (ID) | `index.html` | `css/home*.css`, `js/home-recommender.js` | Protected; keep existing style order |
| Homepage (EN) | `en/index.html` | English page assets | Keep language parity and metadata |
| Services | `work/index.html`, `work/<slug>/index.html` | `css/service-*.css`, `js/service-*.js` | Service-specific copy and interactions |
| Catalogue overview | `collections/index.html` | `css/template-catalog.css`, `js/template-catalog.js` | Catalogue/product cards |
| Company Profile | `collections/company-profile/index.html` | `css/catalog-category-page.css`, `js/catalog-category-page.js` | Shared category visual/controller |
| Landing Page | `collections/landing-page/index.html` | Same category assets | Shared industry selector and empty state |
| Website Kompleks (legacy route) | `collections/complex-website/index.html` | Same category assets | Preserve existing URL |
| Website Kompleks | `collections/website-kompleks/index.html` | Same category assets | Current homepage category destination |
| Website Sistem Lengkap | `collections/website-sistem-lengkap/index.html` | Same category assets | Category catalogue entry; no separate product flow implied |
| Blog listing | `blog/index.html` | `css/blog.css`, `js/blog-catalog.js` | Editorial index |
| Articles | `blog/<slug>/index.html` | `css/article*.css`, `js/article*.js` | Public URLs must remain stable |
| Template store | `templates/index.html` | `css/template-catalog.css`, `js/template-catalog.js` | Store/filter journey |
| Template detail/preview | `templates/detail/`, `templates/preview/` | `css/template-preview.css`, `js/template-detail.js` | Product-specific |
| Template checkout | `templates/checkout/` | `css/checkout.css`, checkout controller | Keep isolated |
| Service checkout | `checkout/index.html` | `css/checkout.css`, `js/checkout.js` | Keep standalone flow |
| Demos | `demos/` | Demo-specific assets | Do not force shared shell |
| Learning | `learning/`, `en/learning/` | `css/learning.css`, learning controllers | Maintain ID/EN parity |
| Contact | `contact/index.html` | `css/contact*.css`, `js/contact-form.js` | Preserve service preselection |
| Legal | `legal/`, `en/legal/` | `css/legal.css`, `css/terms.css` | Policy content and localized routes |

## Shared foundations

| Path | Responsibility | Change risk |
|---|---|---|
| `css/reset.css`, `css/variables.css` | Reset and design tokens | Very high |
| `css/global.css` | Document defaults, typography, containers | Very high |
| `css/components.css` | Shared buttons/cards/primitives | High |
| `css/header.css`, `css/footer.css` | Shared shell styling | High |
| `css/responsive.css` | Shared responsive behavior | Very high |
| `js/main.js` | Shared site utilities | High |
| `js/navigation.js` | Navigation interactions | High |
| `css/catalog-category-page.css` | Category catalogue family only | Medium |
| `js/catalog-category-page.js` | Category industry selector only | Medium |

## Quality gates

- `scripts/audit-static-site.mjs`: routes, local assets, canonical URLs, sitemap and robots checks; also validates category-page ownership.
- `scripts/responsive-smoke.mjs`: browser route checks at 320/375/390/768/1024/1440 px plus selected interaction journeys.
- GitHub Pages workflow: deployment pipeline; always verify the public route after deployment.

## Safe editing rule

A page's HTML owns its structure and copy; its page-family CSS owns its visual presentation; its page controller owns its interactions. Shared foundations are changed only when the issue genuinely applies across page families and the regression suite covers those families.
