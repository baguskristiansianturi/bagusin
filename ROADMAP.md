# Bagusin — Roadmap Pengerjaan Website

Terakhir diperbarui: 13 Oktober 2026

## Catatan perubahan — UX homepage, course, dan footer

- Dibuat branch kerja `ux/homepage-course-footer-polish` dari `main` agar perubahan dapat ditinjau tanpa langsung mengubah branch produksi.
- Hero homepage dipersingkat dan copy diperjelas agar lebih langsung menyatakan bantuan yang diberikan Bagus.
- Section layanan utama dipindahkan tepat setelah hero; course dipindahkan menjelang CTA penutup agar prioritas layanan lebih kuat.
- Ditambahkan stylesheet `css/ux-polish.css` yang dimuat melalui navigasi bersama untuk memperbaiki keterbacaan, hierarki heading, target sentuh, state fokus, kartu, modul course, dan footer.
- Cache-buster stylesheet responsif diperbarui agar browser meminta versi terbaru.
- Status: perubahan kode sudah dicatat pada branch kerja. Pemeriksaan browser lintas ukuran layar dan verifikasi GitHub Pages masih harus dilakukan sebelum merge.

## Prinsip kerja

- Bagusin diposisikan sebagai ekosistem personal yang dijalankan secara independen oleh Bagus, bukan perusahaan yang mengklaim memiliki tim besar.
- Layanan yang siap digunakan menjadi prioritas utama homepage. Course dan jalur belajar diperkenalkan sebagai pilihan tambahan, terutama bagi pengunjung yang ingin membangun kemampuan sendiri.
- Halaman layanan menjelaskan bantuan secara ringkas; penjelasan mendalam dikembangkan menjadi artikel Blog orisinal.
- Jangan menampilkan layanan, course, demo, jadwal, tim, atau hasil yang belum benar-benar tersedia seolah-olah sudah siap.
- Hindari pengulangan isi. Setiap halaman harus mempunyai tujuan yang jelas dan mengarahkan pengunjung ke langkah relevan berikutnya.
- Sebelum perubahan besar, buat titik pemulihan. Setelah perubahan, lakukan pemeriksaan struktur, tautan, responsivitas, aksesibilitas, SEO, dan fungsi.
- Bedakan pemeriksaan kode statis dari pengujian visual browser dan verifikasi deployment langsung.

## Tahap 1 — Homepage

**Status: Perbaikan responsif lintas halaman dan hub jalur belajar sudah masuk ke `main`; verifikasi visual di browser dan deployment live masih belum dapat dikonfirmasi.**

### Sasaran
Homepage menjelaskan bantuan Bagus dengan cepat, mengutamakan layanan, menyediakan jalur ke demo dan artikel, memperlihatkan cerita personal, menjelaskan pendekatan Bagusin, dan memperkenalkan course menjelang akhir halaman.

### Susunan konten
1. Hero dan pemilih jalur kebutuhan bisnis.
2. Layanan utama yang dapat digunakan.
3. Demo dan koleksi yang baru tersedia.
4. Kebutuhan populer dan contoh solusi.
5. Artikel/cerita terbaru.
6. Panduan pilihan untuk pertanyaan dasar.
7. Cerita lain: perjalanan, proyek, eksperimen, dan video.
8. Prinsip kerja: mengapa bekerja dengan Bagus dan membaca Blog Bagusin.
9. Video/YouTube.
10. CTA course dan jalur pembelajaran menjelang footer.

### Implementasi yang sudah dicatat
- Layanan dipindahkan tepat setelah hero pada homepage Indonesia.
- Copy hero disesuaikan agar lebih personal dan tidak memberi kesan sebagai perusahaan dengan tim besar.
- Ditambahkan section cerita, prinsip kerja, dan CTA pembelajaran.
- Ditambahkan stylesheet responsif untuk kartu editorial, prinsip kerja, dan CTA pembelajaran.
- Homepage Inggris diselaraskan dengan struktur service-first.
- Link kartu layanan diperiksa agar mengarah ke halaman katalog/detail yang tersedia.
- CTA course diarahkan ke formulir kontak dengan mode pertanyaan course/jalur belajar; formulir menampilkan ringkasan tujuan belajar, kemampuan awal, metode, dan kebutuhan peserta.
- Metadata judul dan deskripsi homepage diperbarui.
- Lapisan perbaikan responsif lintas halaman ditambahkan ke `css/final-responsive.css`, yang dimuat setelah CSS halaman; mencakup grid, kartu, hero, konten artikel, formulir, dan footer pada desktop/tablet/ponsel.
- Cache-buster stylesheet final diperbarui agar browser meminta versi terbaru.
- Halaman jalur belajar ID/EN dibuat dan ditautkan dari CTA homepage, navigasi global, footer, serta sitemap. Halaman menjelaskan jalur mandiri dan meminta konfirmasi format/ketersediaan sebelum pendaftaran; tidak mengklaim course berbayar yang belum tersedia.
- Katalog layanan, artikel, halaman legal, pencarian, koleksi, dan halaman course/learning terkait diperiksa secara statis untuk memastikan template memakai navigasi dan stylesheet responsif global. Ini bukan pengganti uji visual browser.


### Pemeriksaan kode yang sudah dilakukan
- Jumlah tag `<section>` dan `</section>` seimbang pada homepage Indonesia dan Inggris.
- Tidak ditemukan ID HTML duplikat pada dua homepage.
- Tautan internal homepage yang diperiksa cocok dengan jalur pada sitemap.
- CSS baru terhubung pada kedua versi bahasa.
- Mode pertanyaan course tersedia pada JavaScript formulir dan versi formulir Indonesia/Inggris.

### Yang masih harus diperiksa sebelum Tahap 1 ditandai selesai
- Buka homepage pada browser desktop dan ponsel; periksa layout, pemotongan konten, jarak, overflow horizontal, dan hierarki visual.
- Uji interaksi pemilih jalur, navigasi desktop/mobile, pencarian, pengalih bahasa, dan semua CTA.
- Uji pengisian formulir pertanyaan course serta formulir layanan tanpa mengirim data uji yang tidak diinginkan.
- Pastikan deployment live benar-benar menampilkan commit terbaru. Pemeriksaan melalui alat browser pada 11 Oktober 2026 tidak berhasil mengakses URL publik, jadi status live belum dapat dikonfirmasi dari pemeriksaan tersebut.
- Setelah visual dan fungsi lolos, tinjau ulang urutan section dan panjang homepage di ponsel.

## Tahap 2 — Katalog dan detail layanan

**Status: Belum dimulai.**

- Audit semua layanan dan status ketersediaannya.
- Samakan istilah, kategori, deskripsi ringkas, dan CTA.
- Pastikan setiap layanan memiliki halaman detail yang menjelaskan cakupan, batasan, proses, hasil yang diharapkan, dan cara memulai.
- Bedakan permintaan konsultasi, brief proyek, kesepakatan ruang lingkup, dan checkout setelah kesepakatan personal.
- Pastikan tidak ada link kategori atau layanan yang menuju halaman kosong atau salah.

## Tahap 3 — Demo, koleksi, dan portofolio

**Status: Belum dimulai.**

- Satukan katalog demo lintas kategori supaya demo yang tersedia tetap terlihat saat pengunjung memilih kategori.
- Urutkan item terbaru terlebih dahulu; siapkan struktur untuk populer jika data yang sah tersedia.
- Tampilkan status demo, cakupan kustomisasi, tautan demo, dan tindakan berikutnya.
- Bedakan demo, konsep, eksperimen, dan proyek klien; jangan mengarang bukti atau testimoni.

## Standar editorial wajib — artikel Bagusin (13 Oktober 2026)

**Status: SOP terdokumentasi; inventaris dan peta 50 artikel belum dibuat/diverifikasi.**

Dokumen wajib: [`content/ARTICLE-EDITORIAL-SOP.md`](content/ARTICLE-EDITORIAL-SOP.md).

Sebelum penulisan artikel dimulai:
- Baca SOP editorial dan audit seluruh artikel, slug, kategori, tag, dan rencana konten yang sudah ada di repository.
- Buat atau perbarui satu content map untuk rencana 50 artikel. Catat maksud pencarian, pertanyaan utama, batas pembahasan, judul/slug, kategori/tag, sumber yang dibutuhkan, artikel terkait, tautan internal, status, dan alasan artikel berbeda dari konten lain.
- Periksa tumpang tindih dan risiko keyword cannibalization sebelum menyetujui kerangka. Gabungkan atau batalkan topik yang tidak memiliki tujuan berbeda.
- Lakukan riset sumber primer/otoritatif untuk klaim eksternal yang perlu diverifikasi. Tautkan sumber yang benar-benar mendukung klaim; jangan membuat sitasi atau tautan sekadar untuk backlink.
- Tulis dari nol dengan struktur, penjelasan, contoh dan sudut pandang yang dibuat mandiri. Dilarang menyalin, menerjemahkan dekat, atau memparafrasekan tulisan sumber paragraf demi paragraf.
- Terapkan pemeriksaan editorial, orisinalitas, fakta, SEO, kategori/tag, tautan, dan teknis sebelum publikasi. Jika keaslian atau kebenaran belum bisa dipastikan, tahan artikel.
- Jangan mengklaim alat pendeteksi plagiarisme, pencarian web, atau AI detector dapat menjamin orisinalitas 100%. Itu hanya sinyal tambahan; standar operasional Bagusin adalah penulisan mandiri, verifikasi sumber, pemeriksaan kemiripan, dan keputusan untuk tidak menerbitkan bila ragu.

Tahap ini baru menetapkan aturan. Belum ada 50 artikel yang ditulis, diaudit, atau diterbitkan sebagai bagian dari perubahan dokumentasi ini.

## Tahap 4 — Blog, artikel, dan kategori

**Status: Belum dimulai.**

- Audit struktur Blog, kategori, tag, metadata, artikel terbaru, dan artikel pilihan.
- Buat peta topik dan maksud pencarian untuk mencegah artikel yang saling bersaing atau mengulang isi.
- Hubungkan artikel ke layanan, demo, dan course hanya ketika relevan.
- Semua artikel wajib mengikuti `content/ARTICLE-EDITORIAL-SOP.md`, termasuk audit tumpang tindih sebelum outline, peta konten, penulisan mandiri, verifikasi fakta dan sumber, SEO, kategori/tag, internal links, serta gerbang publikasi. Jangan menyalin, menerjemahkan dekat, atau memparafrasekan artikel sumber. Jika ragu, tahan publikasi.
- Pastikan tampilan artikel dan rekomendasi tetap responsif pada ponsel.

## Tahap 5 — Course dan jalur pembelajaran

**Status: Perencanaan; jangan tampilkan course yang belum siap sebagai penawaran aktif.**

- Petakan kebutuhan pelaku usaha/UMKM, pekerja, freelancer, pelajar/mahasiswa, dan pembelajar mandiri.
- Susun jalur belajar dari tujuan dan kemampuan awal, bukan hanya berdasarkan nama teknologi.
- Untuk setiap course, definisikan level, prasyarat, modul, hasil belajar, proyek/evaluasi, metode online/offline/hybrid, durasi, biaya, perangkat, biaya tambahan, pengajar, dan status kesiapan.
- Jelaskan bahwa course pada tahap awal diajar oleh Bagus; struktur harus dapat menampung pengajar tepercaya di masa depan.
- Jangan menjanjikan pekerjaan, keahlian profesional, atau sertifikasi resmi hanya karena menyelesaikan course.

## Tahap 6 — Kontak, brief, pemesanan, dan pendaftaran

**Status: Belum dimulai sebagai audit menyeluruh; dukungan minimum CTA pertanyaan course telah ditambahkan.**

- Pastikan form layanan, konsultasi, pertanyaan course, dan pendaftaran memiliki tujuan yang jelas.
- Kumpulkan data secukupnya dan hindari meminta informasi sensitif yang tidak diperlukan.
- Tampilkan ringkasan brief dan persetujuan yang relevan.
- Pertahankan alur kerja: diskusi dan kesepakatan personal dahulu; checkout dilakukan setelah ruang lingkup dan harga disepakati.
- Uji validasi, pesan sukses/gagal, pengiriman, aksesibilitas, dan pengalaman ponsel.

## Tahap 7 — Spesifikasi backend dan administrasi

**Status: Belum dimulai.**

- Tentukan kebutuhan data untuk artikel, kategori, layanan, demo, course, pengguna, brief, pendaftaran, status, dan notifikasi.
- Pilih mana yang tetap statis dan mana yang benar-benar memerlukan database atau backend.
- Rancang pengelolaan konten, publikasi, ketersediaan, pendaftaran, dan tindak lanjut.
- Tentukan keamanan, privasi, backup, akses admin, dan penanganan kegagalan sebelum implementasi.

## Tahap 8 — Audit akhir

**Status: Belum dimulai.**

- Audit semua tautan internal, navigasi, bahasa, form, metadata, sitemap, dan struktur heading.
- Uji layout pada ukuran ponsel kecil, ponsel umum, tablet, dan desktop.
- Periksa akses keyboard, focus state, kontras, alt text, reduced motion, serta elemen yang terpotong/overflow.
- Periksa kecepatan dan gambar, lalu pastikan deployment live sesuai commit yang dimaksud.
- Tutup setiap temuan dengan perubahan dan pemeriksaan ulang.

## Aturan status

- **Belum dimulai:** belum diaudit.
- **Dalam pengerjaan:** perubahan sedang dilakukan atau pemeriksaan belum lengkap.
- **Siap ditinjau:** implementasi ada, menunggu pemeriksaan yang relevan.
- **Selesai:** implementasi, pemeriksaan fungsi/struktur, dan verifikasi visual/deployment yang relevan sudah lolos.

## Course roadmap implementation — 2026-10-11

- Replaced the temporary learning hub with a real course catalogue at `/learning/` and `/en/learning/`.
- Added eight course tracks in Indonesian and English: Web Developer, Digital Marketer, Online Business/Bisnis Online, UI/UX Design, Cloud & DevOps, Data Analyst, AI & Automation, and IoT & Embedded Systems.
- Each course detail page includes the target audience, learning outcomes, module-by-module curriculum, a suggested practical project, and a course-specific enquiry CTA.
- Course enquiries pass the selected course slug into the contact form and prefill the brief so the enquiry is tied to the intended course.
- Added responsive styles for the catalogue, course detail layouts, and expandable curriculum modules; added all 16 language-specific detail URLs to the sitemap.
- No unsupported promises about price, schedule, or current cohort availability are published. These must be confirmed before enrolment.
- Still required before calling this done: verify GitHub Pages deployment and visually test desktop/mobile on the live site; course delivery formats and final pricing/schedules remain operational decisions.

## Tahap kurikulum Bagusin — pemulihan master curriculum (11 Oktober 2026)

**Status kode: diperbarui di `main`. Status visual browser dan deployment GitHub Pages: belum terverifikasi.**

- Katalog Indonesia dan Inggris kini menampilkan 16 domain kompetensi, masing-masing dengan empat jenjang: dasar/foundation, menengah/intermediate, lanjutan/advanced, dan profesional/professional.
- Lima jalur lintas domain ditampilkan: Web & Software Engineering; Cloud & Infrastructure; AI Engineering; IoT & Connected Systems; Data & Automation.
- Materi praktis dari referensi Computer Course Center dipetakan kembali, termasuk administrasi/Office, desain, animasi/video, 3D/AutoCAD, website/programming/CMS, marketing, Excel/Sheets, data analysis, Apps Script, Macro/VBA, akuntansi spreadsheet, serta teknisi komputer/jaringan.
- Master kurikulum disimpan di `learning/MASTER-CURRICULUM.md` sebagai sumber acuan untuk menghindari penyusutan kembali menjadi delapan course.
- Delapan halaman detail yang sudah ada diposisikan sebagai draft awal, bukan keseluruhan kurikulum atau klaim bahwa semua kelas sudah tersedia.
- CTA jalur belajar membawa pilihan jalur ke ringkasan pertanyaan kontak.
- Memperbaiki path CSS/JavaScript relatif pada 18 halaman katalog/detail agar sesuai kedalaman direktori GitHub Pages.
- Memperbaiki hreflang dan schema WebPage pada 16 halaman detail agar URL dan bahasa menunjuk halaman yang sesuai.
- Pemeriksaan statis: kedua katalog berisi 16 domain dan 64 kartu level; delapan halaman detail bahasa Indonesia masing-masing memiliki tujuh modul, canonical dan hreflang spesifik; pemeriksaan path aset untuk 18 halaman lulus.
- Belum dianggap selesai sampai tampilan desktop/mobile dan deployment publik diperiksa di browser nyata.

## Further curriculum refinement — 11 October 2026

- Replaced the short legacy-topic list with a searchable catalogue of **37 reference topic families**, grouped into the seven categories used by the reference programme, in Indonesian and English.
- Rewrote descriptions rather than copying source marketing text. Historical prices, session counts, certificates and availability are not carried forward as Bagusin promises.
- Added a search field that filters the catalogue and opens matching topic groups; every topic passes its selected identifier into the course inquiry form.
- Added explicit next-step actions to all 16 master domains in both languages, with links to existing relevant detail pages where available.
- Fixed course-path inquiry handling: the selected learning path is now passed using `learning_path`; individual domain and legacy topic selections use `learning_domain` and `learning_item`. This avoids colliding with the homepage's existing recommendation parameter `path` and preserves the default contact briefing questions.
- Added a consistent four-step practice/evaluation section to all 16 detailed course pages, responsive on mobile and desktop.
- Static validation performed after these changes: 16 master domains and 16 domain actions per language; 37 legacy topic items; all eight detail pages per language contain the practice/evaluation section; all contact inquiry selections map to named labels.
- Still required before calling the stage fully complete: validate JavaScript execution in a browser, keyboard/screen-reader interaction, mobile visual layout, and public GitHub Pages deployment.


## Contact terms-link parity audit — 13 October 2026

**Status: Finding verified statically; implementation not changed.**

- Indonesian contact form has a service-specific terms link that the shared script updates from the selected service.
- English contact form points to the existing generic English legal terms page, but does not participate in the service-specific link updater. The English terms page does not yet mirror the detailed Indonesian terms sections/anchors.
- Next: create/review the equivalent English terms content and anchors, wire language-aware link updates, then test selected service → correct terms section in both languages. Browser and live deployment checks remain pending.


## English terms journey — 13 October 2026

**Implementation committed; static checks only.**

- Added the English terms page with 23 matching section anchors, including general terms, service-specific conditions, private courses, and digital products.
- Wired the English contact form and shared script to language-specific terms routes and service anchors. The shared terms script now displays English topic labels and uses English search normalisation on English pages while preserving Indonesian behaviour.
- Added the detailed ID/EN terms pages to the sitemap and redirected the legacy English legal page's content toward the detailed terms page.
- Not yet verified: browser interactions, accessibility/keyboard behaviour, mobile rendering, real submission, or public deployment. Do not mark the flow fully complete until these checks pass.


### Final source-level audit — 13 October 2026

- Verified 23 unique English terms section IDs and all navigation anchors; checked stylesheet/script references.
- Verified service mapping targets, language-specific terms routes, consultation/course mappings, balanced delimiters in `js/terms.js`, and both detailed terms URLs in the sitemap.
- Browser and public deployment verification remains pending; the live URLs were inaccessible through the available web viewer. Do not label the flow fully tested until a real browser check passes.


## Legacy terms navigation cleanup — 13 October 2026

- Updated the legacy Indonesian legal terms page navigation/footer links to point to the detailed `/terms/` page rather than linking back to the legacy route. Removed the stale current-page marker from the legacy navigation link.
- Updated the legacy English legal terms page navigation, footer, and language-switch links to point to `/en/terms/`; aligned its Open Graph URL with the detailed canonical terms URL.
- Re-fetched both changed files from `main` after commits. Static verification: no remaining navigation hrefs to the legacy terms routes in either changed page; Indonesian page has three links to detailed terms and English page has five. The English Open Graph URL no longer points to the legacy route.
- Commits: ID [`e7de6fefbd5754346e94e06271856e0a3b4d012a`](https://github.com/baguskristiansianturi/bagusin/commit/e7de6fefbd5754346e94e06271856e0a3b4d012a); EN [`989f335c10d1ce7a9d4337df1a1879f51df09662`](https://github.com/baguskristiansianturi/bagusin/commit/989f335c10d1ce7a9d4337df1a1879f51df09662).
- Limits: this was a source-level navigation audit only. No browser interaction, live GitHub Pages check, keyboard/mobile visual test, or real form submission was performed. The detailed Terms pages and contact form journey must still pass runtime checks before the feature is considered complete.


## Contact-form language parity audit — 13 October 2026

**Status: targeted source fixes committed; browser and deployment verification remain pending.**

- A follow-up source review found three Indonesian-only context strings that could appear on the English contact form: the selected-design label, the appended in-person consultation note in a template brief, and the homepage recommendation context label.
- Localised those strings according to the page language in `js/contact-form.js`; kept the consultation amount at Rp1.000.000 per 60 minutes in Indonesian and Rp1,000,000 per 60 minutes in English.
- Re-fetched the updated script from `main` and confirmed the three bilingual branches are present and the old hard-coded context labels are absent.
- Static checks: both contact forms load the shared script and require the terms checkbox; all 10 service-to-terms mappings target an existing anchor in both detailed terms pages; section IDs are unique on both pages.
- Commit: [`ef23ae36a39fab1917e32c15ed728a60f52f08ba`](https://github.com/baguskristiansianturi/bagusin/commit/ef23ae36a39fab1917e32c15ed728a60f52f08ba).
- Limits: these are source-level checks, not execution tests. Do not mark the contact/terms journey complete until browser checks cover language switching, service selection, keyboard focus, mobile layout, actual email delivery, and the published GitHub Pages version.


## Contact recipient correction — 13 October 2026

**Status: code and commit verified; delivery remains untested.**

- During the next contact-flow audit, found the shared contact script pointed both the FormSubmit AJAX request and the manual mailto fallback at `baguskristian@gmail.com`, while the project's specified contact inbox is `sbaguskristian@gmail.com`.
- Corrected both destinations in `js/contact-form.js` to `sbaguskristian@gmail.com`; did not change payload fields or the submission-success wording.
- Re-fetched the updated script from `main` and verified the AJAX endpoint and mailto fallback both use the specified inbox. This is source verification only; it does not prove FormSubmit activation, email receipt, or public deployment.
- Commit: [`6aaa4858365173d7d3a08082770224cd9087fa49`](https://github.com/baguskristiansianturi/bagusin/commit/6aaa4858365173d7d3a08082770224cd9087fa49).
- Next gate: verify published code, then perform an explicitly safe test submission and confirm receipt at the intended inbox before closing this flow.


## Contact recipient smoke-test regression — 13 October 2026

- The browser smoke test failed on commit `53376fcc53fa8b519f746c5f76937a78970c6794` because its network interception still targeted the old contact recipient, while the production script used the corrected address.
- Updated the five test interception references in `scripts/responsive-smoke.mjs` to match the endpoint in `js/contact-form.js`.
- Fix commit: `5eda2c4c3897da44d4f63bb75d757fa4453b5655`. Source re-fetch confirmed zero stale endpoint references in the test and five references to the intended endpoint.
- Browser smoke and Pages deployment runs for this commit were queued at the time of writing; result and live deployment must be checked before marking this step complete. Network interception is a simulated test and does not prove real inbox delivery.


## QA follow-up — PR #128 collection browser smoke (14 October 2026)

- Inspected the failed browser smoke run for PR #128 (head `a648a9a47d63da35a199f69fab7c8fc650c568d6`): the collection assertions still expected the legacy detail URL, while the current catalog links to the responsive preview and package section; the Destinations checks expected a full localized page although the legacy route intentionally redirects to Blog.
- Updated `scripts/responsive-smoke.mjs` to assert the actual catalog → preview → demo/package flow, including price, canonical demo action, the `#spec-title` anchor, website-project/consultation intent, and mobile preview mode. Updated the Destinations assertion to verify the intended redirect.
- Test commit: `8c30e571435917cce3f0fdf6facf3c21e365452c`.
- This is a test-alignment correction, not evidence that the browser suite passes. CI must run against this commit before PR #128 can be considered verified. Visual sticky/sidebar QA and live GitHub Pages remain unverified.
