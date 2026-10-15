# Bagusin — Instructions for AI coding assistants

This repository is **Bagusin** (personal website, blog, service discovery, demos/collections, and portfolio). Do not confuse it with Bali Bagus Dev Studio or another project.

## Mandatory workflow
1. Before changing code, read `docs/PROJECT-CHECKLIST.md`; inspect current branch, recent commits, relevant files, open PRs, and test status.
2. Work on a focused branch. Never perform major refactors directly on `main`.
3. Preserve the existing clean, premium, modern-classic visual direction unless a documented issue justifies change. Avoid unnecessary redesigns and duplicated sections.
4. Fix one phase at a time. Make small, reviewable commits with descriptive messages.
5. Verify asset paths and links. GitHub Pages uses the `/bagusin/` base path; nested pages require correct relative paths.
6. Run available tests and inspect results. Editing code is not proof of a fix. Distinguish verified facts from assumptions and unresolved failures.
7. Update `docs/PROJECT-CHECKLIST.md` whenever phase, test results, decisions, or next actions change. Keep its current-state and handoff sections actionable.
8. Open a pull request containing summary, files changed, test evidence, known limitations, and acceptance criteria. Do not merge failing/unverified changes or claim deployment until status and live behavior are verified.
9. Protect known-good work. Do not delete, overwrite, or roll back without confirming the target commit and scope. Prefer small reversible changes.
10. Content must be original. External sources can support verified facts and be cited, never copied into articles. Do not fabricate testimonials, credentials, metrics, or delivery guarantees.

## Quality gates
- **UI/UX:** clear hierarchy, obvious interactive controls, consistent header/footer/breadcrumb/content widths, readable type, no overlap, clipping, or horizontal overflow. Test 320/375/390/768/1024/1440 px.
- **Functionality:** test navigation, global search, forms, category/filter links, CTA destinations, checkout steps/validation, language switching, and error/fallback states relevant to changed pages.
- **SEO:** accurate unique title/description, meaningful H1 and heading order, canonical/hreflang when applicable, language metadata, internal links, indexability, semantic HTML, alt text, valid structured data, no broken assets.
- **Performance/accessibility:** avoid unnecessary dependencies/heavy assets; use responsive images and lazy loading where appropriate; support keyboard/focus, labels, contrast, reduced motion.
- **Release:** review diff, CI, merge only after appropriate gates pass, then verify deployed URLs. Never call unverified work complete.

When unsure, inspect and report rather than inventing facts or silently making broad changes.
