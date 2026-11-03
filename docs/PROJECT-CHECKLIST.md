# Bagusin Project Checklist & Session Handoff

## Session handoff — 2026-10-31: first Company Profile product demo

**Active work:** Company Profile product BG-WEB-CMP-002 — Nara Ink Studio (Tattoo & Body Art).

- Working branch: feat/company-profile-tattoo-studio-001-final, based on the current production branch after the 31 October catalog-footer update.
- Product is isolated at demos/company-profile/tattoo-studio-001/ with its own HTML, CSS, JavaScript, product metadata, README, and asset guidance.
- Company Profile catalog reads data/company-profile-products.json and renders the available product card through js/company-profile-catalog.js; product card styles are isolated in css/company-profile-products.css.
- Added the Tattoo & Body Art industry filter to the Company Profile category page.
- Demo content is complete concept copy, with clearly disclosed illustrative business details, prices, artist identities, contact data, and policies. Gallery images are remote reference imagery and must be replaced with client-owned/licensed images before commercial launch.
- Booking form is a three-step front-end interaction with validation and a WhatsApp handoff. It does not store appointments, check availability, accept deposits, or confirm bookings.
- Not yet verified: browser visual QA, mobile interaction QA, external image availability, automated workflow results, PR review, and live GitHub Pages deployment.
- Next actions: finish static checks, open a focused PR, inspect CI/workflow results, fix any failures, then merge only after review and verify the live catalog and demo URLs.

---
> Persistent working memory for AI sessions. Update after each meaningful phase. Repository and test evidence are the source of truth, not old chat summaries.

## Project identity and guardrails
- [ ] Project is **Bagusin**, not Bali Bagus Dev Studio.
- [ ] Preserve clean, premium, modern-classic, restrained, readable, lightweight design.
- [ ] Keep navigation, typography, cards, spacing, buttons, article layout, footer, and responsive behavior consistent.
- [ ] Write original content. Sources support verified facts; do not copy other publishers' articles.
- [ ] Never invent testimonials, credentials, reviews, analytics, or delivery guarantees.
- [ ] Use focused branches, small commits, pull requests; protect `main` and known-good commits.
- [ ] A phase is not complete until acceptance criteria and tests pass; record blockers honestly.

## Required order — finish and verify each phase before moving on
- [ ] **Phase 0 — Baseline and safety:** inspect recent commits, branches, open PRs, deployment config, project structure, available tests; identify rollback point and baseline failures.
- [ ] **Phase 1 — Homepage:** clarify who Bagusin helps and what visitors can do; needs-based routing should lead to relevant service/collection/detail, not force everyone into consultation; check hero, CTAs, service cards, latest content, blog, portfolio/current areas, search, footer, mobile navigation, no duplicate sections.
- [ ] **Phase 2 — Services and categories:** category pages display relevant existing/latest demos and collections, latest first; labels and cards are consistent; every CTA goes to the right destination.
- [ ] **Phase 3 — Collections, templates, demos, portfolio:** test cards, detail pages, previews, responsive layout, links, and inquiry/checkout handoff; no empty category when relevant content exists.
- [ ] **Phase 4 — Blog and articles:** original useful writing; consistent category labels/taxonomy, readable article width, TOC/progress/share where present, related articles, global navigation/search.
- [ ] **Phase 5 — Contact and inquiry:** service preselection, concise brief guidance, accessible validation, honest delivery/error fallback; never falsely claim delivery.
- [ ] **Phase 6 — Checkout/agreement:** validate step transitions, review data, safe escaping, consent, clear terms, and honest non-payment status.
- [ ] **Phase 7 — English parity:** equivalent structure/functionality, localized copy, valid CSS/JS paths, canonical/hreflang/language metadata.
- [ ] **Phase 8 — SEO/content:** titles/descriptions, headings, canonicals, hreflang, robots, sitemap, structured data, alt text, internal links, broken links/assets, indexability, original writing and sourced facts.
- [ ] **Phase 9 — Accessibility/performance/responsive:** keyboard/focus, labels, contrast, image weight, scripts, no horizontal overflow/clipping at 320/375/390/768/1024/1440 px.
- [ ] **Phase 10 — Release:** CI green; review diff; merge approved PR; verify Pages/production deployment and smoke-test live URLs.

## Current state — update first on every session
**Last updated:** 2026-10-31

**Active phase:** focused Blog index and article-detail responsive UX correction.

**Baseline main head:** `c045c8410d799bf7ce7e5936932a6227c6d7b3ec`.
**Working branch:** `fix/blog-article-responsive-ux-20261031`.

**Scope and implementation notes:**
- Blog index uses its own `blog.css`; the unused legacy `article.css`, `article.js`, and `share.js` includes were removed from the Blog index only. Global navigation and footer remain the shared shell.
- Blog terminology is “Blog” (not “Journal/Jurnal”) in the visible index labels. Search controls, breadcrumb, category icons, and compact topic chips are scoped to `.blog-editorial`.
- Article detail keeps the article engine and the premium article template. A visible breadcrumb was added; metadata icons and share controls use compact SVGs with accessible labels.
- The article layout has separate sidebar/content columns with responsive safeguards. Reading progress and curated TOC hooks now match the markup used by the premium article template.
- Changes are isolated to Blog/article assets and the checklist; homepage, global navigation, global footer, and other page designs are not intentionally modified.

**Validation status:**
- Static source review is in progress. Automated workflow results, browser viewport checks (320/375/390/768/1024/1440 px), and GitHub Pages behavior are not yet verified for this branch.
- Do not mark this phase complete or merge until CI passes and the resulting diff is reviewed. Visual review on the live site is still required after deployment.

**Immediate next actions:**
1. Validate modified HTML/CSS/JS for syntax, duplicate imports, broken selectors, and path correctness.
2. Run the repository's responsive smoke and static-site audit workflows against this branch; resolve failures rather than weakening assertions.
3. Review the complete branch diff and open a focused PR with test evidence and known limitations.
4. After approved integration and Pages deployment, inspect Blog and an article on a real phone plus tablet/desktop; verify navbar/footer remain unchanged.
5. Continue the wider site roadmap only after this focused page-family correction is reviewed.

## Homepage acceptance checklist
- [ ] Clear, original H1 and concise explanation of what Bagusin can help with.
- [ ] Visitors choose their need and get a relevant next step; consultation is optional when direct service/demo information is more useful.
- [ ] Each service/collection card explains its purpose and links to a working relevant page.
- [ ] Latest content is useful, non-duplicative, and links to its canonical article/detail.
- [ ] Search, desktop navigation, mobile menu, language links, and footer work.
- [ ] No overlap, clipping, overflow, broken CSS/JS/images, or misleading button affordances.
- [ ] Mobile at 320/375/390 and desktop at 768/1024/1440 px checked.
- [ ] Accurate title/description, canonical, language metadata, semantic heading structure, valid internal links.
- [ ] Relevant automated tests pass; limitations documented.

## Session completion template
Update this file before ending a work session:
- **Phase/objective:**
- **Branch/PR:**
- **Commits:**
- **Files changed:**
- **Tests and exact results:**
- **Known issues/not verified:**
- **Next exact action:**
- **Rollback reference/known-good SHA:**

A new AI session must read this file, verify current repository state, and continue from "Immediate next actions" rather than restarting or assuming earlier work succeeded.


## Session handoff — 2026-11-01: global sticky navigation and collection category rail

- **Objective:** keep the shared Bagusin navbar sticky on all viewports and keep the industry category carousel sticky immediately beneath it on category collection pages.
- **Branch:** `fix/global-sticky-header-collection-rail` (based on current `main`).
- **Files changed:** `css/header.css`, `css/catalog-category-page.css`.
- **Implementation:** reinforced the shared header sticky contract in the global header stylesheet; corrected the category rail's mobile `top: 0` behavior so it uses the mobile header height, while desktop uses the global header height. Kept category rail below the header in stacking order and added matching scroll offsets.
- **Scope guard:** no page markup, catalog data, product cards, filters, prices, homepage, or footer changed.
- **Tests:** not yet run in a browser; test 320/375/390/768/1024/1440 px, including scroll on all category pages and menu/search overlays.
- **Known limitation:** navbar markup is still repeated across static HTML pages; shared behavior and styling are provided by global `header.css` and `navigation.js`. A full componentization of markup is a separate architecture task and is intentionally not bundled into this focused sticky fix.
- **Next action:** run CI/browser smoke tests, open a focused PR, and verify GitHub Pages on a real mobile device after merge. Do not claim live deployment before the workflow and browser check pass.


## Session handoff — 2026-11-02: Supabase Auth frontend integration

- **Objective:** connect the existing static Bagusin frontend to the live Supabase project without redesigning existing pages.
- **Branch:** `feat/supabase-auth-integration` (based on main `444b95eca5f887c0f42ca190a561220c3f75f6a6`).
- **Supabase project:** `bagusin` / `hpmeoxynftankklwgntb`, status ACTIVE_HEALTHY.
- **Frontend work:** added a pinned Supabase JS browser adapter, global account links for desktop/mobile navigation, Indonesian and English account pages, sign-up/sign-in/sign-out, email confirmation, password reset, and self-service profile editing.
- **Database work:** added `profiles.role` defaulting to `member`; Auth trigger creates a profile and copies the optional display name; a private-schema trigger prevents members from changing their own role. RLS remains enabled on all ten existing public tables.
- **Files added:** `js/supabase-auth.js`, `css/supabase-auth.css`, `account/index.html`, `en/account/index.html`, `supabase/README.md`, `docs/SUPABASE-AUTH-INTEGRATION.md`, and the four version-matched SQL migrations under `supabase/migrations/`.
- **Files changed:** `js/main.js` loads the auth adapter site-wide.
- **Live DB verification:** role column exists; Auth profile trigger runs from private schema as SECURITY DEFINER; role guard and updated-at triggers run as SECURITY INVOKER; anon can read profiles but cannot update them; authenticated users have profile update grants, still constrained by RLS.
- **Not yet verified:** real email delivery/confirmation, password reset, Android browser session, live Pages deployment, and end-to-end browser UI. Supabase Auth Site URL and the two account redirect URLs must be configured in Dashboard before email links are expected to return to GitHub Pages.
- **Not included:** Storage upload, Explore feed UI, comments/reactions/community UI, admin dashboard, and migration of current static content.
- **Next actions:** run CI/static/browser smoke checks on the PR; configure Auth redirect URLs; after merge/deploy, test a real owner registration, confirm email, promote the owner manually in SQL Editor, and test profile editing on Android.
- **Rollback:** revert the auth integration commit(s) on the feature branch; the database role migration is additive and can remain without affecting the public static pages.
