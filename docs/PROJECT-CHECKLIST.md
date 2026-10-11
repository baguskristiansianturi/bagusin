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
**Last updated:** 2026-10-11

**Active phase:** Phase 0 / Phase 1 — baseline and homepage-first repair. Do not jump to later phases until homepage issues and relevant tests are resolved.

**Latest known smoke-test evidence:** run #244 for PR #108 concluded **failure** at last check. Never describe it as passing.
- Homepage stylesheet returned 404 at `/bagusin/css/css/homepage-roadmap.css`.
- English article stylesheet returned 404 at `/bagusin/en/css/article-consistency.css`.
- Other failures requiring reproduction: homepage service-label assertions; contact copy assertions; work-page heading assertion; checkout progression/review assertions; interaction test timed out clicking `[data-next="3"]`.
- PR #108 contains two targeted CSS path fixes. Verify its latest state, diff, and CI before depending on it or repeating changes. Do not duplicate blindly.
- `README.md` on `main` was empty at last inspection. This file and root `AGENTS.md` preserve working context and AI instructions.

**Immediate next actions:**
1. Check current PR #108 state, changed files, CI, and latest `main` SHA. Do not merge while checks fail or are unverified.
2. Verify both CSS fixes on the actual branch; rerun smoke tests. Investigate stale assertions without weakening tests merely to get green.
3. Reproduce and fix the homepage issue first; verify the actual user journey and mobile layout, not only text assertions.
4. Update this file with exact branch/PR/commit links, pass/fail counts, known issues, and next action.
5. Only move to Phase 2 after homepage acceptance criteria pass.

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
