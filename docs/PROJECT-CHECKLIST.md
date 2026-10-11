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

**Latest known smoke-test evidence:** run #244, #38125042910, and #38125376280 for PR #108 concluded **failure**. The latest completed run found three issues: homepage service-label assertion, checkout manual WhatsApp follow-up explanation, and a generic `waitForFunction` timeout. Follow-up changes in commit `efb14f70cad104c9c98e0f736781d8b787a17b6a` adjust the visible-card assertion, align checkout email-status expectations with the actual message, and add the follow-up explanation. A further copy correction is in commit `97001e94f63b7dff8065c896a7cffdf8f5aeda9a`; its CI is pending.
- Homepage roadmap CSS path is corrected on PR #108 branch; the English article stylesheet path is also corrected there. The previous smoke-test server logs showed the corrected assets returning HTTP 200.
- Homepage service card labels and section structure were corrected on PR #108 branch. Follow-up fixes now also remove a broken Google Business Profile demo link, clarify contact brief guidance, localize the work-page H1, and make the checkout smoke test provide all fields required by the real validation rules. The homepage smoke test now checks the visible service-card grid directly. Latest commits are on `fix/homepage-and-english-article-asset-paths-20261011` / PR #108; validation remains pending.
- Other known failures remain unresolved pending their phase: contact hero/service brief copy; work-page heading expectation; checkout progression and review-summary; interaction smoke timeout on `[data-next="3"]` because the control was not visible.
- Reproduce each failure and compare test expectations with intended UX. Fix the site or update an outdated assertion only when evidence supports that choice; do not weaken tests just to get green.
- `README.md` on `main` was empty at last inspection. Root `AGENTS.md` and this file preserve working context and AI instructions.

**Immediate next actions:**
1. Inspect latest PR #108 CI after commit `97001e94f63b7dff8065c896a7cffdf8f5aeda9a`; do not merge while checks fail or are unverified.
2. Confirm visible homepage service-card labels and CSS assets pass, then review all 276 responsive viewport checks and pathfinder interaction.
3. Confirm the static audit no longer reports the nonexistent Google Business Profile collections URL.
4. Verify contact copy, work-page heading, checkout validation/review/terms path, status messaging, and that user-provided text is escaped.
5. Record exact pass/fail counts. Only move to Phase 2 after Phase 1 homepage acceptance criteria pass.

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
