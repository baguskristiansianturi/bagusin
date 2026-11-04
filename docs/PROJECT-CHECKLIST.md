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
**Last updated:** 2026-10-15

**Active phase:** finish live mobile UX review and re-port the homepage changes onto the current main. PR #136 has been merged; do not assume older PR branches are safe to merge.

**Latest verified main head:** `b18dbe9cc821cd599a8cc66220c33c82682ea106`.
- Responsive browser smoke test run #948: success.
- Static site audit run #996: success.
- GitHub Pages deployment run #1490: success.
- PR #136 pre-merge browser smoke #947 and static audit #995 also passed.
- Demo **Bagus Rental Mobil #002** and its `templates/catalog.json` entry remain present after integration.
- Browser tooling could not open the public GitHub Pages URLs. The deployment workflow passed, but visual QA on Bagus's phone is still pending.
- PR #135 and PR #125 are closed as superseded by PR #136. PR #127 and #128 are drafts because their older test/filter expectations need correction. PR #130 and #126 remain draft and must be re-ported from current main.
- Future backend remains Go; Google Cloud is not active. No live email delivery, payment processing, or real checkout transaction has been verified.

**Immediate next actions:**
1. Check GitHub Pages on a real phone: sticky navbar while scrolling; mobile platform/industry filter reach; result heading below sticky chrome; breadcrumbs; shared footer links; ID/EN contact forms and contextual service prefill. Record specific failures rather than redesigning by intuition.
2. Re-port homepage PR #130 onto current main after that review. Preserve the service-first homepage, the current pathfinder behavior, clear access to the catalog and demo, honest course status, and avoid returning to an article-first homepage. Test carousel keyboard and reduced-motion behavior.
3. Re-port service PR #126 after the homepage; verify service registry, ID/EN selectors, terms topics, sitemap, detail copy, and brief-first CTA.
4. Rework the useful sticky collection/filter parts of PR #128 without an initial 15-item cap. All Category + All Level must show every real available item by default; filters narrow the set; zero matches must show an honest empty state.
5. Audit PR #102 tests for still-valid recommender keyboard/reset, consultation handoff, and contact-prefill coverage. Do not copy stale homepage label assertions.
6. Consolidate docs and close superseded PRs only after unique useful content has been preserved. Use small branches based on current main, rerun CI, and verify Pages after merge.

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


## Session handoff — 2026-11-03: Bagusin CMS backend foundation

- **Scope correction:** Bagusin is the digital studio/CMS for services, articles, design catalogue, portfolio/demos, courses, enquiries and admin operations. My Bali social discovery/Explore concepts do not belong here.
- **Production baseline:** main at `acce330b652d8555c9634ac9e3451616dc9ff249`; Supabase project `hpmeoxynftankklwgntb` in eu-west-2, PostgreSQL 17.11.
- **Working branch:** `feat/bagusin-cms-backend-foundation`, created from current main.
- **Live Supabase migrations applied:** `20261103121830_bagusin_cms_backend_foundation_v1`, `20261103121901_bagusin_cms_policy_index_refinement`, `20261103122045_bagusin_design_private_file_security`, and `20261103122102_bagusin_private_file_index_and_media_mime`.
- **New CMS tables:** article_categories, article_tags, article_tag_assignments, service_categories, services, portfolio_projects, course_categories, courses, course_curriculum, inquiries, media_assets, site_settings. Existing articles/design_items gained CMS metadata fields.
- **Storage:** created public `bagusin-public` (8 MiB, JPEG/PNG/WebP/AVIF) and private `bagusin-private` (15 MiB, PDF/Office/image allowlist). Upload and management policies are admin-only. Private template source files use a separate admin-only table.
- **Access:** anonymous visitors can read published content and submit new enquiries; only admins can manage CMS data and view/update enquiries. Existing social/community tables are retained for rollback safety but API grants are revoked. No data was dropped.
- **Verification:** all new tables have RLS enabled; security advisor returned no findings. A privilege check confirms anon/authenticated cannot SELECT the legacy `design_items.resource_url`, while public preview columns remain selectable. Performance advisor no longer reports missing FK indexes or overlapping permissive policies; remaining notices are unused indexes on empty tables.
- **Not verified yet:** real signup/email confirmation, Android session, owner admin promotion, public inquiry submission, upload/download, and frontend CMS CRUD. No Auth users existed at the time of audit.
- **Next phase:** build a restrained admin CMS interface after owner account is confirmed/promoted; then migrate existing static article/service/course/catalog data in reviewed batches while preserving current URLs and visual layout. Integrate inquiry form only after spam/rate-limit/email-handling plan.
- **Deferred:** payment gateway/orders, customer LMS, certificates, automated transactional email, and deleting legacy social tables.
- **Rollback:** additive schema migrations; no existing rows deleted. Do not drop tables or buckets as part of routine rollback.


## Session handoff — 2026-11-03: Bagusin member area and commerce foundation

- **Scope:** extend the CMS foundation for Bagusin only. No My Bali, social feed, Explore, posts, reactions or communities.
- **Branch / PR:** `feat/bagusin-cms-backend-foundation` / PR #160 (draft; not merged).
- **Supabase project:** `hpmeoxynftankklwgntb`.
- **New live domain tables:** orders, order_items, order_status_history, invoices, payments, payment_methods, shipments, store_products, store_product_variants, product_reviews, notification_outbox, customer_addresses, course_enrollments, course_sessions, digital_entitlements.
- **CMS foundation:** article categories/tags, services, portfolio projects, courses/curriculum, inquiries, media assets, site settings and private design source files.
- **Frontend:** Indonesian and English member-area panels for orders, payment proof upload, invoice, courses, digital purchases and voluntary reviews; new admin workspace for order/invoice creation, BCA settings, payment proof verification, shipping tracking, review moderation, course enrolment and digital entitlement setup.
- **Payment:** manual BCA only; account number intentionally blank and inactive until Bagus configures it. Admin checks the actual incoming bank transfer before marking paid. Current invoice expiry default is 24 hours and configurable in admin.
- **Shipping:** schema supports local same-day, Bagusin delivery, pickup and manually managed national courier shipments. No live J&T/JNE/aggregator rate or tracking API is connected.
- **Digital downloads:** private entitlement table and deployed Edge Function `bagusin-download-entitlement` (version 2) return five-minute signed URLs only after checking the signed-in owner, paid/completed order and download limit.
- **Security verification:** RLS enabled on all commerce tables; Security Advisor returned no findings after removing an exposed SECURITY DEFINER download RPC. Performance Advisor reports only unused-index INFO notices because tables are empty; no missing FK index or multiple permissive-policy warnings remain.
- **Data state at last check:** zero Auth users, orders, invoices, reviews, course enrolments and digital entitlements. No fake transactions/reviews were inserted.
- **Implemented:** Store persistent cart, two-step customer order submission, multi-attribute product variants, server-side variant price/stock validation, and variant snapshots in order items.
- **Not yet active:** automated WhatsApp/email notifications, scheduled reminders and expiry worker, live courier APIs, Google Merchant Center feed, public product/review widgets, course attendance and richer student progress reporting, payment gateway, and full end-to-end payment/download verification.
- **Required owner setup:** register and confirm Bagus's account, promote that verified profile to admin using the trusted SQL documented in `supabase/README.md`, then configure BCA account number in Admin.
- **Next exact actions:** finish source/CI review; fix any JS/browser issues; test owner login and admin role on Android; create a test customer/order, submit proof, verify payment, complete order, test review and secure download; only then merge and verify GitHub Pages deployment.
- **Current limitation:** customer-facing product/service CTAs are not all wired to automatic order creation yet. Initial operational flow is inquiry → admin-created order/invoice → member area.
- **Rollback:** code changes are isolated in PR #160. Database changes are additive migrations; do not drop tables or buckets for rollback.
