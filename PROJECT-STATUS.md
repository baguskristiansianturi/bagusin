# Bagusin — Project Status & Chat Handoff

Last updated: 13 October 2026
Repository: https://github.com/baguskristiansianturi/bagusin
Primary branch: main
GitHub Pages: https://baguskristiansianturi.github.io/bagusin/

## Purpose

This document is the quick handoff for continuing Bagusin in a new ChatGPT conversation. Read this file together with `ROADMAP.md` before making changes. For curriculum work, also read `learning/MASTER-CURRICULUM.md`. Do not assume that a plan discussed in chat has been implemented in the repository.

## Project identity — non-negotiable

- Bagusin is Bagus Kristian Sianturi's independent work. Do not present it as a large company, agency, or team that does not exist.
- Keep the voice personal, honest, calm, useful, and professional. Professional quality should come from the work, clarity, and care—not corporate-sounding claims.
- Bagusin is broader than website services: it includes free articles and guides, courses/learning paths, digital products and website demos, services, portfolio, destinations/travel, and other useful interests.
- Visitors have different intentions. Some want to learn from zero and build something themselves; some want to evaluate and hire a service; some want ready-made products; some want structured learning; others arrive for articles or destinations.
- Free articles should provide genuine, complete help for the task they promise, including basic tasks such as email, Blogger/Blogspot, domain connection, WordPress setup, and publishing. Do not artificially withhold essential steps to force a sale.
- A paid course must offer a real additional value over scattered free tutorials: a structured sequence, practice, feedback/evaluation, projects, and clearly stated outcomes and boundaries.
- A service sells implementation, customization, specialist time, or responsibility for execution. A product offers a ready-to-use starting point. Explain the differences without pressure.
- Affiliate links may be used where useful and disclosed clearly. Recommendations must remain honest and should not imply every visitor must buy through Bagusin.
- Do not rush into display ads that damage the reading experience. Prioritize helpful content, products, courses when ready, and relevant services.
- Write original content. Do not copy/paste other publishers' writing. Verify factual claims and cite/link sources when appropriate.
- Avoid overengineering and perfectionism. Prioritize by user benefit, business impact, risk, and effort. Do not polish minor details at the cost of launching useful work.

## Design decisions to preserve

- The user already likes the visual direction of the Blog/article pages, Collections pages, and Portfolio pages. Treat these as visual references; do not redesign them casually while working on the homepage.
- Keep the existing interactive question/path-finder pattern and its recommendation flow unless a specific, reviewed change is approved. Preserve working interactions and improve the content/coverage carefully.
- Keep the clean, premium, elegant, modern, mobile-first look. Use readable type, generous spacing, clear visual hierarchy, visibly colored links (not default underlines), and relevant professional icons.
- Avoid cramped layouts, tiny text, horizontal overflow, unnecessary animation, repeated CTAs, and excessive content on the homepage.
- “Koleksi” means ready-to-use demos/templates/products. “Portofolio” means actual work or projects that can truthfully be shown. Never blur these roles or invent client proof/testimonials.
- Homepage should make it easy to find a relevant next step; it should not become a long About page or an article archive.
- Courses can be listed before every course is ready, but clearly mark availability. Do not represent a planned course, service, channel, form, payment flow, or feature as live unless verified.
- Consultation fee currently specified by Bagus: Rp1.000.000 per 60 minutes. Do not silently change this to Rp990.000 or another price.

## Current phase: homepage and footer analysis

### Inspected in this session

- Inspected the current `index.html` section structure and a sample of related CSS/JS paths in the repository.
- Homepage currently includes: hero/path-finder; a service/discovery section; demo/new-design cards; featured stories; basic guides; popular solutions; destinations/projects/video; principles; course preview; final CTA and footer.
- Initial finding: the page contains overlapping purposes between service discovery, popular solutions, featured stories and basic guides. Consider combining/reducing repeated sections rather than adding more content.
- Initial direction: preserve the path-finder and familiar card style; introduce Bagusin's wider learning/exploration purpose without hiding products and services; keep course and demo availability honest; make footer navigation personal and useful rather than corporate.
- No website code has been changed as part of this analysis.
- No live browser visual/interaction test was completed in this session. GitHub Pages deployment status is therefore not newly verified here.

### Proposed homepage structure — awaiting review before implementation

1. Hero and interactive path-finder.
2. Relevant next steps from the path-finder, without forcing visitors to contact or buy.
3. Courses/learning paths, with accurate readiness labels.
4. Latest designs and collections; actual available demos first, “View all” at the end of the list.
5. One concise featured articles/guides section; avoid duplicating the same article purpose in separate sections.
6. A compact discovery section for destinations, portfolio/projects, and video/YouTube.
7. A concise final CTA that does not assume every visitor needs a business service.
8. Simplified footer with clear groups and legal links.

This is an analysis proposal, not an implemented or approved final layout. Before coding, confirm whether the first hero question should remain focused on business needs or be broadened to welcome visitors who mainly want to learn/explore. Preserve the existing interaction model either way.

### Footer direction

Suggested navigation groups:
- **Jelajahi:** Blog, Destinasi, YouTube (only if appropriately labelled), Tentang Bagus.
- **Belajar:** Panduan gratis, Courses, Jalur belajar.
- **Produk & Karya:** Koleksi desain, Portofolio, Layanan.
- **Mulai di sini:** Bantu pilih, Kontak Bagus, and links to relevant help/terms.
- Bottom legal row: Privacy, Terms, Disclaimer, Editorial Policy, copyright.

This is a content proposal, not yet implemented. Verify every link and the actual availability/status of social channels before showing them.

## Immediate next steps

- [ ] Review/confirm the homepage section order and hero path-finder audience.
- [ ] Inspect the current footer implementation and global navigation dependencies before changing it.
- [ ] Create a pre-change checkpoint (branch or commit) before code edits.
- [ ] Make the smallest scoped homepage change first; do not refactor unrelated article, collection, portfolio, or global components.
- [ ] Review and update footer in a separately identifiable step if practical.
- [ ] Run static checks for section/tag balance, duplicate IDs, internal links, image alt text, heading hierarchy, CSS/JS paths, metadata, and console/runtime issues where tools permit.
- [ ] Test path-finder options and recommendations, navigation, language switcher, search, CTAs and forms without sending unintended real submissions.
- [ ] Check narrow mobile, common mobile, tablet and desktop layouts for clipped content and unintended horizontal overflow.
- [ ] Verify the deployed GitHub Pages version matches the intended commit. If not possible, explicitly state that deployment is unverified.
- [ ] Update this file and `ROADMAP.md` with completed items, pending items, tests and any known issues.
- [ ] Make the final implementation commit only after the relevant checks; provide the full commit SHA and direct repository links.

## Required change-safety protocol

1. Read this file, `ROADMAP.md`, relevant existing master/checklist documents, and the exact files that will be changed.
2. Restate the task scope internally; list files allowed to change and files/components that must remain untouched.
3. Inspect the current state before editing. Do not overwrite a file based on a stale copy.
4. Create a rollback point before major changes.
5. Make the smallest change that solves the requested problem. No unrelated redesigns, file deletions, broad formatting, or speculative features.
6. Test the changed behavior and nearby dependent behavior. Separate static checks, automated/function checks, live browser checks, and deployment checks in the report.
7. Update the status and checklist truthfully. Never mark a test passed if it was not run.
8. Review the diff and confirm no unrelated files or user-approved designs were unintentionally changed.
9. Commit implementation and its corresponding documentation update when appropriate. Report the actual commit SHA, message, date, files changed, checks run, checks not run, deployment status and rollback reference.
10. Do not say “done”, “fixed”, “tested”, “deployed” or “committed” unless the relevant action/result has been verified.

## Rules for status labels

- **Belum dimulai:** not yet inspected or worked on.
- **Dalam pengerjaan:** being changed or checks are incomplete.
- **Siap ditinjau:** implementation exists but review/checks remain.
- **Selesai:** relevant implementation and checks passed; live/deployment checks must be explicitly noted when applicable.

## Reusable prompt for a new ChatGPT conversation

You are continuing the existing Bagusin repository, not starting a new project. First inspect the latest `PROJECT-STATUS.md`, `ROADMAP.md`, relevant master/checklist files, current default branch and latest commits. Then inspect the exact current files relevant to the next unfinished checklist item. Do not rely only on chat history or prior assistant claims; verify the repository state.

Preserve Bagusin as Bagus's independent personal project, not a large agency. Follow the identity, content, design, and change-safety rules in `PROJECT-STATUS.md`. The user already likes the Blog/article, Collections, and Portfolio visual direction. Do not redesign those pages unless specifically requested. Continue from the latest verified unfinished task, and do not repeat completed work.

Before editing, report the verified current state, scope, affected files, and rollback point. Make only the smallest scoped changes, test relevant functionality and responsive layouts, review the diff, update `PROJECT-STATUS.md` and `ROADMAP.md`, then commit only after verification. Be explicit about what was and was not tested and whether GitHub Pages deployment was verified. At the end provide a phone-friendly handoff: task completed, pending checklist, changed files, test results, known issues, commit title, full SHA, date, and rollback reference. Never invent test results, commit hashes, or deployment status.
