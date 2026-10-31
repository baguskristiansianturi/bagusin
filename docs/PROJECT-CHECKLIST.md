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
