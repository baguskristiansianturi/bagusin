# Bagusin — Project decisions and session handoff

Last updated: 13 October 2026

This document is the persistent working memory for the website project. Update it whenever a material product, UX, architecture, or release decision changes. It is internal project documentation; do not copy implementation rationale verbatim into public marketing pages.

## Current product model

Bagusin is one ecosystem with distinct customer journeys:
- **Services:** Bagus helps plan, improve, or build a digital solution with a defined brief and agreed scope.
- **Templates and collections:** self-installable assets/demos, separated by platform and customer need.
- **Code and applications:** reusable code, tools, and digital experiments; only link to released items as available.
- **Courses:** private learning sessions, offered by request with scope and availability confirmed.
- **Blog:** original explanatory articles that support decisions and services.
- **Portfolio:** real work, concepts, and experiments must be labeled honestly; never invent client proof or testimonials.

## Homepage decisions — 13 October 2026

- Start with the homepage, then improve the catalog, then align detail pages and related navigation.
- Keep the hero and guided needs path, followed by core services.
- Put the course preview before the mixed “Baru di Bagusin” shelf so learning remains discoverable without extending the page after the shelf.
- “Baru di Bagusin” is a horizontal carousel for mixed content types, not an article-only section. It supports services, products, templates, demos, code, apps, articles, and courses.
- Each shelf entry must have a real release date, sort newest-first, expire 30 days after publication, and the shelf may show no more than six entries.
- Do not claim popularity without reliable engagement or order data.
- After the shelf, use a compact set of navigation links instead of multiple repeated editorial/explanatory grids.
- Keep only working routes. Until a dedicated applications page exists, code and app exploration points to the existing portfolio.
- A product/demo that has expired from the homepage remains accessible from its catalog if it is still available.

## Release date policy

The homepage carousel registry lives in `js/home-whats-new.js`. Before launch/merge, confirm each seeded `publishedAt` date against the actual public release/history. A PR date is not a public release date. If the date cannot be verified, do not describe the item as newly released; correct the date or omit the item until verified.

## Workflow and verification policy

- Make changes on a feature branch and open a PR; do not silently change production `main`.
- After each phase, update `ROADMAP.md` and this document with the branch/commit/PR, checks performed, failures, and next task.
- Separate source-level checks, automated browser tests, live GitHub Pages checks, and real backend/payment/email checks. Never conflate them.
- If a task is blocked, document it and continue with the next independent roadmap step; return to blocked PRs in a dedicated final audit before starting a new project.
- Do not claim deployment, working checkout, payment, email delivery, or real platform import unless directly tested.

## Current handoff

- Branch: `ux/homepage-newest-carousel`
- Focus: shorten homepage and replace the static mixed demo grid with an expiring mixed-content carousel.
- Seed dates checked against repository history: Bagus Ink was added to the homepage/catalog on 12 October 2026; the named Sewa Mobil Bali Starter demo was created on 11 October 2026. These are source-history dates; live deployment timing still needs verification.
- Next: finish CI/browser responsive tests, audit homepage links and visuals, then proceed to the catalog.
- No merge or deployment is implied by this branch.
