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

**Latest known smoke-test evidence:** run #244 for PR #108 concluded **failure** (6 assertions failed). A new commit was pushed to the same PR branch after that run; the new CI result must be checked before claiming improvement.
- Homepage roadmap CSS path is corrected on PR #108 branch; the English article stylesheet path is also corrected there. The previous smoke-test server logs showed the corrected assets returning HTTP 200.
- Homepage service card labels now explicitly include `Penulisan Konten & SEO` and `Aplikasi Web & Sistem` (commit `096da1f21a71eebc8e17dfd0afa4a633af43dfb7`). A further structural fix in commit `de8e322dd0152e1b6855f77e6af640e22b576728` moves the services section out of the recommendation panel and places it after the hero. Both commits are on `fix/homepage-and-english-article-asset-paths-20261011` / PR #108. These changes are not accepted until the latest browser smoke run completes and the homepage journey is checked.
- Other known failures remain unresolved pending their phase: contact hero/service brief copy; work-page heading expectation; checkout progression and review-summary; interaction smoke timeout on `[data-next="3"]` because the control was not visible.
- Reproduce each failure and compare test expectations with intended UX. Fix the site or update an outdated assertion only when evidence supports that choice; do not weaken tests just to get green.
- `README.md` on `main` was empty at last inspection. Root `AGENTS.md` and this file preserve working context and AI instructions.

**Immediate next actions:**
1. Check PR #108 and the new workflow run triggered by commit `096da1f21a71eebc8e17dfd0afa4a633af43dfb7`; do not merge while checks fail or are unverified.
2. Confirm the homepage service-label assertions and CSS asset requests pass on the updated branch, including the latest structural move of the services section.
3. If homepage assertions pass, inspect the responsive checks and test the recommendation flow on mobile; fix any functional issues before moving phases.
4. Then handle the contact and work-page copy assertions, followed by checkout flow bugs in a separate focused change.
5. Update this file with exact CI results and remaining issues. Only move to Phase 2 after homepage acceptance criteria pass.

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
