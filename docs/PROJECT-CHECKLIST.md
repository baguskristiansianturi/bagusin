# Bagusin Project Checklist & Session Handoff

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
**Last updated:** 2026-10-16

**Active phase:** homepage refinement plus cross-page UI consistency audit on draft PR #138. Keep `main` protected; the active branch is `ux/homepage-newest-carousel-20261015-main`.

**Latest verified main head:** `b18dbe9cc821cd599a8cc66220c33c82682ea106`.
- Existing main checks remain: responsive browser smoke #948, static site audit #996, and GitHub Pages deployment #1490 succeeded for that older main commit.
- Those results do **not** validate the current PR branch. The latest PR head must pass both workflows before review/merge.
- Demo **Bagus Rental Mobil #002** and its `templates/catalog.json` entry remain part of the integrated baseline.
- Visual QA on Bagus's phone is still pending; a successful CI run does not prove the deployed page looks correct.
- The current audit sampled the homepage, services, collections, template store/detail, blog/article, contact, about, learning, legal, and English routes. The repository currently contains about 96–97 HTML pages and 41 CSS files.
- Root cause candidates confirmed in source: legacy page templates contain different navigation labels/order; the template store/detail pages had custom headers without the shared mobile menu; the template detail used a custom footer; and the shared title/subtitle rhythm was split across many page-specific selectors and global override layers.
- Shared navigation now normalizes localized labels/order, the breadcrumb guard recognizes legacy breadcrumb markup, and template store/detail pages use the shared header/footer. New static/browser assertions cover the common page shell.
- No live email delivery, payment processing, or real checkout transaction has been verified.

**Immediate next actions:**
1. Finish static audit and responsive browser smoke on the latest PR #138 head. Fix every new failure rather than weakening assertions without evidence.
2. Continue the shared UI pass by page family: services/details; collections/catalog/template detail; blog/article; learning/course; legal/contact; Indonesian/English parity. Standardize title/subtitle and paragraph spacing without flattening each page's purpose.
3. Consolidate conflicting global CSS overrides only after identifying which selectors are still needed. Avoid adding another blanket `!important` layer.
4. Manually check the deployed GitHub Pages on a real phone: sticky navbar, mobile menu, breadcrumbs, result headings below sticky UI, footer, and 320–390px spacing. Browser tooling could not open the public Pages URLs directly.
5. Keep PR #138 draft until its latest CI is green and mobile visual QA is addressed; do not merge or claim production deployment prematurely.
6. Preserve the service-first homepage and remove consultation from the homepage only; consultation may remain on relevant contact/service flows.

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
