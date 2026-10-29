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
**Last updated:** 2026-10-29

**Active phase:** modular architecture foundation on branch `refactor/modular-architecture`. Architecture rules, repository map, modularization phases, VS Code settings/tasks, and article/category template guidance have been added. This is documentation/editor setup only so far; the shared navbar/footer are still duplicated in page HTML and are NOT yet globally centralized. Do not claim the modularization is complete until the shared-shell pilot and its regression tests pass.

**Latest verified main head:** `b18dbe9cc821cd599a8cc66220c33c82682ea106`.
- Responsive browser smoke test run #948: success.
- Static site audit run #996: success.
- GitHub Pages deployment run #1490: success.
- PR #136 pre-merge browser smoke #947 and static audit #995 also passed.
- Demo **Bagus Rental Mobil #002** and its `templates/catalog.json` entry remain present after integration.
- Browser tooling could not open the public GitHub Pages URLs. The deployment workflow passed, but visual QA on Bagus's phone is still pending.
- PR #135 and PR #125 are closed as superseded by PR #136. PR #127 and #128 are drafts because their older test/filter expectations need correction. PR #130 and #126 remain draft and must be re-ported from current main.
- Future backend remains Go; Google Cloud is not active. No live email delivery, payment processing, or real checkout transaction has been verified.

**Immediate next actions (modularization):**
1. Capture current static audit and responsive smoke-test baselines on `refactor/modular-architecture`.
2. Build a single-source navbar/mobile navigation and footer; pilot on the three category pages, then verify search/mobile-menu initialization and visual parity before broader migration.
3. Migrate article source/content only after defining one source of truth and a tested render/build path. Preserve every existing public URL.
4. Keep homepage layout protected and leave Complete Business page creation out of scope.

**Earlier project follow-ups:**
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
