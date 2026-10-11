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

**Active phase:** Phase 1 validation + Phase 2 catalog UX improvements in PR #108. Phase 2 changes are being developed on the same focused branch while the remaining homepage/checkout browser test is corrected; do not call either phase accepted until current-head CI passes.

**Latest known smoke-test evidence:** static route/SEO audit passed on commit `65044601d3fc41a4d46a5927c2e8452d8bc3ccde`. Browser smoke then failed because the test tried to fill `#timeline` after the checkout flow had moved away from panel 1. The test sequence has been corrected to fill required agreement fields while panel 1 is visible; current head is `6df456f2bfd4b096025d2fb4c311e2cd8a3d7801` and CI is running. Earlier failures for homepage labels, WhatsApp follow-up copy, and email-status assertions were addressed, but must be reverified on the latest head.
- Homepage roadmap CSS path is corrected on PR #108 branch; the English article stylesheet path is also corrected there. Prior smoke-test server logs showed corrected assets returning HTTP 200.
- Phase 2 catalog work on the same PR branch: demo cards are filtered by the selected industry, sorted by latest update (newest first), industry/filter labels are more consistent in Indonesian, category/level filter state is exposed with `aria-pressed`, and empty-state copy is clearer. Added smoke assertions for the latest demo and category relevance; these assertions are not yet accepted until CI is green.
- Homepage service card labels and section structure were corrected on PR #108 branch. Follow-up fixes now also remove a broken Google Business Profile demo link, clarify contact brief guidance, localize the work-page H1, and make the checkout smoke test provide all fields required by the real validation rules. The homepage smoke test now checks the visible service-card grid directly. Latest commits are on `fix/homepage-and-english-article-asset-paths-20261011` / PR #108; validation remains pending.
- Other known failures remain unresolved pending their phase: contact hero/service brief copy; work-page heading expectation; checkout progression and review-summary; interaction smoke timeout on `[data-next="3"]` because the control was not visible.
- Reproduce each failure and compare test expectations with intended UX. Fix the site or update an outdated assertion only when evidence supports that choice; do not weaken tests just to get green.
- `README.md` on `main` was empty at last inspection. Root `AGENTS.md` and this file preserve working context and AI instructions.

**Immediate next actions:**
1. Inspect current-head CI for PR #108 at `6df456f2bfd4b096025d2fb4c311e2cd8a3d7801`; current run links are [browser smoke](https://github.com/baguskristiansianturi/bagusin/actions/runs/38126426380) and [static audit](https://github.com/baguskristiansianturi/bagusin/actions/runs/38126426378). Do not merge while checks fail or are unverified.
2. Confirm homepage service-card labels, stylesheet paths, responsive viewports, and pathfinder interactions pass.
3. Confirm static audit does not report the broken Google Business Profile collections URL.
4. Verify checkout validation/review/terms flow, email status, and safe escaping; latest failure was the test attempting to fill a field hidden on panel 2, so ensure the corrected test passes.
5. Verify catalog latest-demo ordering and industry filter relevance. Record exact pass/fail counts, then merge only when both current-head checks pass and verify the deployed GitHub Pages URLs.

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
