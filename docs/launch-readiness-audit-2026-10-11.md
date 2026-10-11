# BagusIn — Launch Readiness Audit
**Audit date:** 2026-10-11  
**Baseline:** `main` at `4adc1eb5bdb23f50b074c1579a5939cbdaa64f27`  
**Scope:** repository structure, navigation/search, responsive CSS, portfolio inquiry flow, SEO metadata, and deployment safety.  
**Important:** this is a source-code audit. Browser/device QA and real email delivery have not been claimed or completed by this document.

## Safety rules
- Do not change `main` directly during major improvements.
- Keep GitHub Pages available as the known public baseline while Cloudflare is tested separately.
- Make one focused change per checkpoint; inspect the diff and verify before proceeding.
- Do not merge backend/API work or switch the contact form until a real end-to-end test succeeds.
- Never claim an email was delivered merely because an HTTP request was accepted by a third-party service.

## Findings

### 1. Navigation and search
- `js/navigation.js` provides shared mobile navigation, dropdowns, language selection, and a fallback search panel for older pages.
- The homepage and portfolio markup use root-relative project paths such as `/bagusin/blog/` and `/bagusin/contact/`.
- **Risk to validate:** GitHub Pages project hosting uses the `/bagusin/` base path, while a Worker custom hostname normally serves from `/`. Reusing the same static build without a base-path strategy may break internal links/assets on the Worker deployment.
- Search markup submits to a static `/search/?q=...` page. Actual result quality, empty queries, and language-specific routing still require browser QA.

### 2. Responsive layout
- `css/responsive.css` has a mobile safety layer and `css/final-responsive.css` adds broad overrides for article content, cards, forms, and spacing.
- Global `overflow-x: clip` rules can hide horizontal overflow rather than fixing the specific child that exceeds the viewport.
- **Required QA:** 320, 375, 390, 768, 1024, and 1440 CSS-pixel widths; inspect hero, article body, tables, images, cards, nav drawer, footer, and contact form. Do not mark this complete until browser screenshots or equivalent browser inspection exist.

### 3. Portfolio and template inquiry
- `portfolio/index.html` places the Sewa Mobil Bali collection before other portfolio categories.
- Starter scope is described as a one-page responsive site with free installation after the customer's domain and hosting are available; those third-party costs and advanced features are excluded.
- The demo is correctly described as an interactive example that is not connected to real booking or payment.
- The “Pilih template” link passes service/mode/template context through query parameters. Verify that this context appears correctly in the contact form in both languages and on both deployments.

### 4. Contact form / email
- `js/contact-form.js` posts the form payload to FormSubmit's AJAX endpoint, displays a fallback email link on failure, and states that first-use verification may be required.
- This is **not yet evidence of delivery to the inbox**. The UI must distinguish “service accepted the request” from confirmed delivery; a real test submission and inbox check are required.
- The source currently includes a client-side honeypot and browser validation. These are useful but are not server-side abuse protection.
- A separate Cloudflare Worker + D1 backend is documented in draft PR #85 and intentionally has not been merged. Keep it separate until database binding, schema application, email delivery, validation, rate limiting, and end-to-end tests are complete.

### 5. SEO and localization
- Homepage metadata includes canonical, Open Graph, hreflang, and structured data.
- `sitemap.xml` lists many Indonesian and English URLs, but it should be reconciled against actual files and deployed routes. The English version of the remote-work article currently uses an Indonesian slug; that may be intentional, but canonical/hreflang pairs must agree with the actual URL structure.
- Some older article recommendation dates/content are static. Verify they are truthful and not presented as current/latest when they are not.
- Verify internal links, canonical URL, hreflang pairs, robots directives, sitemap coverage, and page titles across both language trees before launch.

## Ordered work plan and exit gates

### Stage 1 — Audit baseline (this document)
- [x] Record current baseline commit and preserve changes on an isolated branch.
- [x] Identify major risks from source review.
- [ ] Browser QA on the live GitHub Pages deployment.
- [ ] Verify current Cloudflare route and root-relative paths.
- **Exit gate:** deployment/base-path behavior is known and there is a page-by-page QA list.

### Stage 2 — Responsive UI foundation
- Fix specific overflow causes; do not rely on global clipping as the sole solution.
- Normalize header/footer/container/hero behavior without redesigning the approved visual identity.
- **Exit gate:** target viewport matrix passes for representative pages and no unintended horizontal scrolling remains.

### Stage 3 — User journeys
- Test content discovery, search, portfolio demo, template-to-contact prefill, and language switching.
- **Exit gate:** every primary CTA lands on the intended page and preserves needed context.

### Stage 4 — Contact reliability
- Decide whether to keep FormSubmit or complete the separate Cloudflare Worker/D1 path.
- Test success, rejection, offline/network failure, duplicate submission, invalid input, spam handling, and real inbox receipt.
- **Exit gate:** no false success message; manual fallback works.

### Stage 5 — SEO/content integrity
- Reconcile sitemap with deployed routes, canonical and hreflang pairs, metadata, structured data, and internal links.
- **Exit gate:** no broken priority URLs or mismatched language alternates found in automated/manual checks.

### Stage 6 — Deployment and release
- Build and test staging first, compare deployment with intended commit, then perform a final regression pass.
- Keep GitHub Pages as rollback target until Cloudflare is confirmed stable.
- **Exit gate:** deployed commit, build result, internal navigation, contact submission, and key mobile screens are verified.

## Current status
**Not launch-certified.** The codebase has substantial foundations, but browser/device QA, Cloudflare base-path compatibility, and confirmed contact-email delivery remain open verification items.
