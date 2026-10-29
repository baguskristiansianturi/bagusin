# Bagusin — Repository Map

Last reviewed: 29 October 2026. This is an index, not a guarantee that every dependency has been traced. Check actual imports and links before moving files.

## Public entry points
| Family | Entry point / pattern | Notes |
|---|---|---|
| Homepage | `index.html` | Protected layout; don't edit as a side effect of another page |
| English homepage | `en/index.html` | Keep language parity and hreflang accurate |
| Blog listing | `blog/index.html` | Public article archive |
| Article pages | `blog/<slug>/index.html` | Existing URLs must remain stable |
| Journal | `journal/index.html`, `journal/<slug>/index.html` | Separate editorial family |
| Service hub/detail | `work/index.html`, `work/<slug>/index.html` | Service-specific copy and CSS |
| Design catalogue | `collections/index.html` | Catalogue overview; routes to service categories |
| Service category catalogue | `collections/company-profile/index.html`, `collections/landing-page/index.html`, `collections/complex-website/index.html` | Shared approved visual template and same industry taxonomy |
| Template store | `templates/`, `templates/detail/`, `templates/preview/` | Distinct product/demo flows |
| Demos | `demos/` | Preserve demo-specific visual and interactions |
| Contact | `contact/index.html` | Inquiry form and service preselection |
| Checkout | `checkout/index.html`, `templates/checkout/index.html` | Keep standalone/transaction behavior isolated |
| Learning | `learning/`, `en/learning/` | Course/learning pages |
| Legal | `legal/`, `en/legal/` | Policy pages |
| Other sections | `about/`, `author/`, `destinations/`, `portfolio/`, `search/`, `youtube/`, `terms/` | Verify navigation and metadata when changing shared files |

## Existing shared assets (current production paths)
| Path | Responsibility | Risk |
|---|---|---|
| `css/reset.css`, `css/variables.css`, `css/global.css`, `css/components.css` | Base styles, tokens, primitives | High |
| `css/header.css`, `css/footer.css`, `css/responsive.css` | Shared shell styles and responsive rules | High |
| `js/navigation.js` | Navigation interactions, shared search additions, navigation fixes | High |
| `js/main.js` | Site-wide utilities and global interactions | High |
| `css/catalog-category-page.css` | Approved shared category template | Scoped |
| `js/catalog-category-page.js` | Category filter/empty-state behavior | Scoped |
| `css/home*.css` | Homepage-specific styling | Homepage protected |
| `js/article*.js`, `js/blog-catalog.js` | Article and blog features | Article family |
| `js/template-*.js`, `js/catalog-*.js` | Catalogue, product and template interactions | Catalogue family |
| `scripts/audit-static-site.mjs` | Static routes/SEO/content audit | Release gate |
| `scripts/responsive-smoke.mjs` | Responsive/browser smoke checks | Release gate |

## Current architectural risks
- There are approximately 100 HTML entry files; they do not all use identical header/footer markup.
- Header and footer markup is repeated in multiple page families.
- Styles and scripts are split across flat `css/` and `js/` directories, often with legacy naming.
- Some pages are deliberately standalone (checkout and demos); they should not be forced into one generic layout without review.
- Blog/article text is currently rendered in individual HTML pages as well as catalog data; article-source migration needs a deliberate content model.
- The three service-category pages now share a visual template but still contain page-specific HTML copy. Their taxonomy must stay aligned.

## Safe edit guide
1. Change a page's wording/sections in its own HTML or future content record.
2. Change a page's appearance in its scoped stylesheet.
3. Change page-specific interactions in its controller.
4. Change the navbar/footer only after shared-shell migration is implemented for the target page family; do not edit repeated snippets and assume every route follows.
5. Never rename/move files without searching links, `src`/ `href`, canonical/hreflang, forms, sitemap and workflow references.
