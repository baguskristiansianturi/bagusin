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
- **Mandatory article standard:** follow `content/ARTICLE-EDITORIAL-SOP.md` for every article, including the planned 50-article programme. Original writing, source verification, overlap/cannibalization checks, taxonomy consistency, SEO review, and publication gates are required. If originality or factual support is doubtful, do not publish.
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
- [x] Add the mandatory article editorial/SEO SOP at `content/ARTICLE-EDITORIAL-SOP.md`.
- [ ] Before drafting the 50-article programme, inspect the existing article inventory and build a content map with unique intent, overlap audit, outline, sources, category/tags and internal links.
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

## One-line prompt for a new ChatGPT conversation

Use this single instruction to continue work. The detailed rules live in the repository and must be read before acting.

> Aya, baca catatan terbaru di repository Bagusin dan lanjutkan dari tahap terakhir yang benar-benar terverifikasi.

This means: inspect the latest `PROJECT-STATUS.md`, `ROADMAP.md`, relevant master/checklist files (including `content/ARTICLE-EDITORIAL-SOP.md` for article work), the current branch and recent commits; verify what is complete and unfinished; follow the relevant SOP; make only scoped changes; test what can actually be tested; update the records; commit only when appropriate; and report honestly what was done, what remains, which files changed, the checks performed/not performed, the full commit SHA and deployment status. Never rely only on chat history or claim a test/deployment happened without verification.


## Work log — 13 October 2026 (structure and course audit)

- Added `SITE-STRUCTURE-AND-COURSE-PAGE-PLAN.md`: site architecture, page roles, course detail template, and article workflow.
- Added `STRUCTURE-AUDIT-NOTES.md` and `COURSE-PAGE-AUDIT-2026-10-13.md` / `COURSE-PAGE-AUDIT-DETAILS.md`: initial verified inventory and static findings. All eight Indonesian and eight English course detail files exist. Module titles are specific, but many meeting descriptions use generic templated text and need course-specific exercises/deliverables before pages are treated as fully developed.
- Added `content/ARTICLE-CONTENT-MAP-50.md`: 50 planned article slots, separating existing pages for audit from new topics. This is a content plan, not a claim that the 50 articles have been researched or written.
- Added `STRUCTURE-AUDIT-NOTES.md` and course audit docs are static file inspections only. Browser interactions, form submission, responsive UI and live GitHub Pages remain unverified.
- Next: verify source URLs and course price comparisons; refine each meeting's specific syllabus; test CTAs/contact; compare Learning ID/EN for full curriculum parity; then review and approve article intents/outlines/sources under `content/ARTICLE-EDITORIAL-SOP.md`.


## Work log — 13 October 2026 (Web Developer syllabus, ID + EN)

- Replaced generic meeting copy on `learning/web-developer/index.html` with session-specific concept focus, guided practice, tangible output, and review criteria for all 22 meetings.
- Mirrored the same learning progression in `en/learning/web-developer/index.html` with English copy.
- Verified after writing by fetching both files again: each contains 22 course modules, 22 specific focus sections, and 22 practice-output labels; the previous generic placeholder sentence no longer appears.
- Commits: ID `8d30f1314e2b6478f36868c010162aceb567a9e4`; EN `e24b130d5d988cdf95382d9ec53b6470f763e1b9`.
- Scope intentionally limited to syllabus body copy. Prices, session count, availability, page layout, metadata, links, and shared styling were not changed.
- Still not verified: browser rendering, keyboard interaction, mobile responsiveness, contact-form submission, or live GitHub Pages deployment. Next: apply the same course-specific syllabus standard to the other seven course pairs, then re-check prices/benchmark sources and registration status without changing commercial terms without approval.


## Work log — 13 October 2026 (all eight course syllabi refined, ID + EN)

- Extended the session-specific syllabus format from Web Developer to the other seven course pairs: Digital Marketer, Online Business, UI/UX Design, Cloud & DevOps, Data Analyst, AI & Automation, and IoT & Embedded.
- Each meeting now has a concept focus, guided practice, a tangible practice output, and review criteria. The English pages have English-specific copy; no Indonesian section labels leaked into the English pages in the static check.
- Re-fetched all 16 course detail files after updates. Verified module counts remain unchanged and match the current structure: Web Developer 22 per language; Digital Marketer 10; Online Business 10; UI/UX Design 16; Cloud & DevOps 10; Data Analyst 10; AI & Automation 14; IoT & Embedded 10. No previous generic placeholder phrase was found in the checked files.
- Scope: syllabus body copy only. Prices, session counts, registration statuses, links, metadata, and layouts were not intentionally changed.
- Important: static repository checks are not browser QA. Mobile layout, keyboard interaction, contact form submission, external links, and live GitHub Pages deployment remain unverified. Cloud & DevOps and IoT & Embedded remain planning-only / enrolment not open as previously recorded.
- Next: verify course price benchmark URLs and registration status, then test the actual user journey from course page to contact form; do not alter commercial terms without approval.


## Work log — 13 October 2026 (English contact-form parity)

- Static inspection found the English contact form lacked the service-choice dropdown present on the Indonesian form, despite the shared contact-form script already supporting that control.
- Added the matching English-language service selector to `en/contact/index.html` and preserved the existing hidden service/mode fields, validation, terms checkbox, and submission script.
- Commit: `2ce76ea3ede32e6efcdee4ea6d506ed766f432f3`.
- Verified by fetching the file again: the service selector, all 10 options (including the blank/general option), hidden service field, and project form remain present. This is a static markup check only; no real submission was sent.
- A direct live-page open through the available web viewer was not accessible, so GitHub Pages deployment and visual rendering remain unverified. Next: verify the form's language-specific terms link behaviour and run a browser-based end-to-end check if an appropriate browser test capability is available.


## Work log — 13 October 2026 (contact terms-link parity audit)

- Re-fetched Indonesian and English contact pages, the shared `js/contact-form.js`, and the Indonesian/English terms pages on `main`.
- Confirmed the Indonesian contact form uses `/terms/`, whose page contains general and service-specific sections and whose shared script updates the link by selected service.
- Confirmed the English contact form links to `/en/legal/terms/`, which exists but currently contains only generic terms text. The English form does not expose the `contact-terms-link` ID, so the shared service-specific link updater does not update it. The English page therefore does not currently offer the same service-specific terms journey as the Indonesian form.
- This is a verified static markup/script finding. No form submission, browser interaction, or live deployment was tested. No production code was changed in this audit.
- Next safe step: prepare and review a genuinely equivalent English terms page (including translated service-specific sections and stable topic anchors), then wire the English contact form and shared script to the English-localized anchors. Do not merely point the English form at the Indonesian terms page or claim parity before content and behavior are checked.


## Work log — 13 October 2026 (English terms journey implemented; static verification)

- Added `en/terms/index.html` with 23 anchored sections: general terms, order/payment/scope/revision/cancellation/delivery/rights/privacy/support/law, eight service topics, private courses, and digital products. Reused the site's existing terms layout/styles and topic-filter script.
- Updated the English contact form to expose `contact-terms-link` and point to the English terms page.
- Updated `js/contact-form.js` so service-specific terms links use the current language's route and include mappings for general consultation and course inquiries.
- Updated `js/terms.js` with English topic labels/anchors while retaining the Indonesian topic map and language-aware search normalisation.
- Updated the legacy English legal terms page to point to the detailed page and added both detailed terms pages to `sitemap.xml`.
- Static checks: English terms page contains 23 sections; required stylesheet and `js/terms.js` are included; contact form has the dynamic link ID; route mapping is language-aware; sitemap contains both detailed routes. This is source-level inspection only. No browser/keyboard/screen-reader test, real form submission, or live GitHub Pages deployment check has been completed.
- Next verification gate: run a browser test for each service selection in ID and EN, confirm the link lands on the matching section, inspect mobile layout and keyboard operation, and verify the deployed Pages URL before declaring the flow complete.


### Follow-up static audit — 13 October 2026

- Re-fetched the final files from `main` after the topic-map correction.
- Verified 23 unique section IDs in the English terms page, no broken in-page navigation anchors, and that the page includes `terms.css` and `terms.js`.
- Verified English contact form has the dynamic terms-link ID, shared routing selects `/en/terms/` or `/terms/` by page language, and mappings exist for consultation → `general` and course inquiry → `courses`. Every mapped topic exists in the relevant terms page.
- Checked balanced delimiters in `js/terms.js` and confirmed both detailed terms routes are in the sitemap.
- Live page URLs could not be opened through the available web viewer, and no browser runner is available in this session. Therefore runtime behaviour, mobile appearance, actual form submission, and deployment remain unverified.


## Work log — 13 October 2026 (legacy Terms navigation cleanup)

- Fixed navigation paths in `legal/terms/index.html` so its Terms links lead to the detailed Indonesian `/terms/` page. Removed the incorrect current-page marker from the legacy-page link.
- Fixed navigation and language-switch paths in `en/legal/terms/index.html` so they lead to the detailed English `/en/terms/` page; aligned the Open Graph URL with the detailed canonical URL.
- Verified both changed files were fetched again from `main`. Static checks found zero remaining legacy Terms hrefs in these two files; detailed route links: ID 3, EN 5; stale English Open Graph URL absent.
- Commits: ID `e7de6fefbd5754346e94e06271856e0a3b4d012a`; EN `989f335c10d1ce7a9d4337df1a1879f51df09662`.
- Not verified: actual browser navigation, responsive layout, keyboard accessibility, live Pages deployment, or email submission. Do not mark this journey fully complete until those checks pass.


## Latest verified work — contact-form language parity (13 October 2026)

- Fixed three Indonesian-only context labels that could appear on the English contact form: selected design, the in-person consultation note appended to a template brief, and homepage recommendation context.
- Preserved the specified consultation price: Rp1.000.000 per 60 minutes (English display: Rp1,000,000 per 60 minutes).
- Verified the updated `js/contact-form.js` was re-fetched from `main`; both ID/EN forms load it and require the terms checkbox. All 10 service-to-terms mappings point to existing anchors in both detailed terms pages, and the terms-page section IDs are unique.
- Code commit: `ef23ae36a39fab1917e32c15ed728a60f52f08ba`. Roadmap record commit: `2379f9d03e253a52a7284714a94c9c7f8279afcf`.
- Verification boundary: static source checks only. No browser execution, screen-reader/keyboard test, mobile visual inspection, real email delivery, or live GitHub Pages confirmation has been completed. The next gate remains direct browser verification; do not label the contact/terms journey fully tested until that passes.


## Latest verified work — contact recipient correction (13 October 2026)

- Corrected the FormSubmit AJAX destination and manual mailto fallback in `js/contact-form.js` from `baguskristian@gmail.com` to the specified contact inbox `sbaguskristian@gmail.com`.
- Re-fetched the script from `main` and verified both destinations. This is static source verification only; it does not prove inbox ownership/activation, actual email receipt, or GitHub Pages deployment.
- Code commit: `6aaa4858365173d7d3a08082770224cd9087fa49`. Roadmap record commit: `dd0010e2c8674512b9facb0c34aa3a571f28e6e4`.
- Do not mark the form fully verified until the published page is checked and a safe test submission is confirmed in the intended inbox.


## Work log — responsive smoke test recipient correction (13 October 2026)

- Inspected the latest GitHub Actions run for commit `53376fcc53fa8b519f746c5f76937a78970c6794`. The browser smoke workflow failed because `scripts/responsive-smoke.mjs` still intercepted the old FormSubmit endpoint `baguskristian@gmail.com`, while `js/contact-form.js` had already been corrected to `sbaguskristian@gmail.com`.
- Updated all five stale endpoint references in the smoke test to the specified inbox URL.
- Commit: `5eda2c4c3897da44d4f63bb75d757fa4453b5655`. Re-fetched the file from `main`: zero old endpoint references and five references to the corrected endpoint.
- At the time of this note, the browser smoke test and GitHub Pages deployment workflows for the new commit were queued, not yet completed. Do not treat the fix as test-passed or live-deployed until their results are checked.
- Still unverified: actual FormSubmit activation/delivery and inbox receipt. The smoke test intercepts the network request and cannot prove real email delivery.


## Work log — katalog lintas platform dan evaluasi perjalanan pengunjung (14 Oktober 2026)

- PR #129 katalog template lintas platform berhasil digabung ke `main` pada merge commit `482990211e6975a64b977e92723fb2367f066b4e`. Sebelum merge, browser smoke test dan audit statis pada head terbaru berstatus sukses.
- Sumber `main` kini berisi `templates/index.html`; katalog masih prototipe `noindex,nofollow`. Checkout masih simulasi dan file XML Blogger belum dinyatakan lolos impor.
- Audit homepage `index.html` pada `main` setelah merge menunjukkan belum ada tautan eksplisit ke `/bagusin/templates/`. Artinya, keberadaan halaman di repository belum cukup untuk membuktikan pengunjung dapat menemukannya dari homepage.
- Verifikasi situs GitHub Pages secara langsung belum berhasil pada sesi ini karena akses jaringan/DNS dari lingkungan pemeriksaan gagal. Status publik/deployment karena itu tetap **belum terverifikasi**; jangan mengklaim katalog sudah tampil live sebelum URL diuji.
- Keputusan UX: satu halaman = satu CTA primer dan satu jalur lanjutan kontekstual. Pengunjung yang belum siap membeli diarahkan ke panduan/blog yang relevan, demo, dokumentasi, atau halaman layanan terkait. Konsultasi menjadi bantuan sekunder/terakhir, bukan CTA default.
- Aturan koneksi konten: halaman layanan/produk menghubungkan ke panduan yang menjawab pertanyaan pengunjung; artikel menghubungkan kembali ke solusi yang dibahas; sesudah demo/artikel, sarankan langkah berikutnya yang relevan dan jangan selalu mengembalikan pengunjung ke homepage.
- PR #130 homepage masih terbuka dan status mergeability terakhir `false`. Langkah berikutnya: audit penyebab status tersebut, periksa ulang browser assertions, lalu perbarui homepage dengan jalur katalog yang jelas tanpa menambah pilihan setara secara berlebihan.
- Periksa deployment dan uji alur di desktop/mobile setelah perubahan homepage digabung. Jangan menyatakan produk atau checkout siap dijual sebelum lisensi, harga, pembayaran, pengiriman, dan uji impor Blogger selesai.


## Evaluasi lanjutan — status homepage PR #130 setelah katalog digabung (14 Oktober 2026)

- Pemeriksaan ulang branch PR #130 pada head `567ac2af47f401dc96bc8c9c61afb6556de6af6a` menunjukkan kedua workflow terkait pull request telah selesai dengan hasil sukses: `Responsive browser smoke test` dan `Static site audit`. Catatan kegagalan lima assertion dalam deskripsi PR tampaknya belum diperbarui; status hasil CI terbaru harus menjadi acuan, sambil tetap memeriksa cakupan tes.
- PR #130 belum bisa digabung: GitHub melaporkan `mergeable=false`, dan perbandingan branch menunjukkan branch homepage tertinggal 3 commit dari `main` serta memiliki 19 commit unik. Perubahan katalog dan catatan roadmap di `main` terjadi setelah branch homepage dibuat.
- Jangan menganggap workflow sukses pada branch yang tertinggal sebagai bukti bahwa versi gabungan sudah lolos. Langkah aman berikutnya adalah menyelaraskan branch homepage dengan `main`, meninjau ulang konflik/hasil gabungan, lalu menjalankan tes sekali lagi sebelum merge.
- Jalur yang dipertahankan untuk menghindari pilihan berlebihan: homepage → koleksi/layanan website → detail solusi. Dari halaman koleksi, tautan kontekstual terpisah membawa orang yang ingin memasang template sendiri ke katalog template. Blog/panduan dipakai sebagai jalur lanjutan bagi yang masih mempertimbangkan; konsultasi bukan CTA utama.


## Work log — pemisahan pintasan homepage dan katalog template (14 Oktober 2026)

- Atas evaluasi UX terbaru, jalur ringkas homepage di branch PR #130 tidak lagi menampilkan Portofolio sebagai pintasan. Label “Koleksi & template” diubah menjadi “Koleksi & demo website” agar fungsinya tidak tumpang tindih dengan katalog template.
- Tautan katalog “Template Blogger & WordPress” tetap disediakan secara eksplisit menuju `/bagusin/templates/`. Portofolio masih tersedia melalui navigasi/halaman tersendiri; source code sebagai karya tidak otomatis berarti produk yang dapat dibeli.
- Commit branch PR #130: `79fc841d7ffd24fa7d94cdf87fe2447d00de48bb` (homepage), `f1d0081744222f96f5e353e2ecee885f992bd679` (catatan keputusan). Roadmap utama diperbarui di commit terpisah.
- Pemeriksaan sumber setelah perubahan: pintasan Portofolio tidak ditemukan pada jalur ringkas homepage; label Koleksi & demo website dan tautan katalog template ditemukan. Ini hanya pemeriksaan source, bukan browser QA.
- Belum selesai: PR #130 belum merged, branch divergen dari `main`, dan tidak ada workflow/status check terdeteksi pada head terbaru. GitHub Pages live serta tampilan visual mobile/desktop belum terverifikasi. Jangan menyatakan perubahan sudah tampil di situs publik.


## Update handoff — keputusan stack dan domain (14 Oktober 2026)

- Stack: frontend tetap statis (HTML/CSS/JS); backend masa depan menggunakan Go, bukan CodeIgniter.
- Hosting: GitHub Pages tetap dipakai untuk frontend selama persiapan. Google Cloud/Cloud Run baru dievaluasi setelah billing dapat diaktifkan; jangan mengklaim API/backend sudah live.
- Audit file: pada Git tree main commit 493c70f430fa4ecb4cec98eb6e07b6640b699a4d, tidak ditemukan file PHP/CodeIgniter, Go module, atau worker/API. Dockerfile memakai Nginx untuk frontend statis. Jangan menghapus aset frontend sebagai pembersihan CodeIgniter. Periksa deployment eksternal secara terpisah.
- Desain: pertahankan desain saat ini. Perubahan arsitektur tidak boleh menjadi alasan untuk redesign atau perubahan visual tanpa review terpisah.
- Domain/brand: pertahankan nama Bagusin sementara; jangan ganti Bagusdev sebelum evaluasi brand dan domain selesai. Jangan memilih .co.id tanpa memastikan persyaratan kelayakan dan dokumen.
- Perubahan sesi ini: dokumentasi keputusan dan roadmap; belum ada perubahan kode produksi atau deployment.
- Tugas berikutnya: review dan sinkronisasi PR homepage #130 dengan main tanpa kehilangan desain; periksa konfigurasi nginx.conf; verifikasi status CI dan tampilan GitHub Pages. Setelah itu inventarisasi URL/deployment CodeIgniter eksternal yang memang perlu dimatikan.
