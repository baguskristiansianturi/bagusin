# Bagusin — Roadmap Pengerjaan Website

Terakhir diperbarui: 13 Oktober 2026

## Catatan perubahan — UX homepage, course, dan footer

- Dibuat branch kerja `ux/homepage-course-footer-polish` dari `main` agar perubahan dapat ditinjau tanpa langsung mengubah branch produksi.
- Hero homepage dipersingkat dan copy diperjelas agar lebih langsung menyatakan bantuan yang diberikan Bagus.
- Section layanan utama dipindahkan tepat setelah hero; course dipindahkan menjelang CTA penutup agar prioritas layanan lebih kuat.
- Ditambahkan stylesheet `css/ux-polish.css` yang dimuat melalui navigasi bersama untuk memperbaiki keterbacaan, hierarki heading, target sentuh, state fokus, kartu, modul course, dan footer.
- Cache-buster stylesheet responsif diperbarui agar browser meminta versi terbaru.
- Status: perubahan kode sudah dicatat pada branch kerja. Pemeriksaan browser lintas ukuran layar dan verifikasi GitHub Pages masih harus dilakukan sebelum merge.

## Catatan perubahan — katalog template lintas platform (14 Oktober 2026)

- Branch: `feat/blogger-template-store-journey` / PR #129.
- Memisahkan filter katalog menjadi tiga dimensi: platform (Blogger, WordPress, HTML/CSS/JS), jenis kebutuhan (landing page, profil bisnis, blog, toko/katalog, portofolio), dan industri.
- Menambahkan pilihan HTML/CSS/JS tanpa mengarang produk yang belum tersedia; platform kosong menampilkan empty state yang jelas.
- Menambahkan hitungan kategori yang mengikuti jumlah produk pada platform terpilih dan pengujian browser untuk filter platform/kebutuhan.
- Verifikasi pada commit `83c7c0e38f00758ca48d17b608b47ea1dda2dd79`: browser smoke test lulus (51 rute, 306 pemeriksaan viewport) dan audit rute/SEO lulus. Assertion katalog kini memeriksa tautan demo dan detail paket pada kartu rental yang tepat; redirect destinasi ke Blog juga diuji sesuai perilaku aktual.
- Batasan: prototipe masih `noindex,nofollow`; belum ada pembayaran, penyimpanan order, email, pengiriman otomatis, atau uji impor Blogger yang dinyatakan lulus.
- Gerbang berikutnya: selaraskan halaman detail dan navigasi homepage; audit PR homepage #130 yang masih punya empat assertion gagal pada CTA koleksi dan metadata/copy halaman lain sebelum merge.

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


## Template store buyer journey prototype — 13 October 2026

**Status: implementation committed on PR branch; not merged or deployed. Browser QA and Blogger import test remain outstanding.**

- Added a separate self-installable template catalogue at `/templates/`, distinct from the website-build/service catalogue.
- Platform choices: Blogger and WordPress. Industry categories stay visible even when empty; no level filter is shown for templates.
- Added the Bagusin Editorial Blogger prototype, visual demo, product detail, Free/Premium test license choices, and multi-step simulated checkout.
- Added two Blogger XML prototype variants and a focused flow/acceptance checklist in `docs/TEMPLATE-STORE-FLOW.md`.
- Checkout is intentionally simulated: no payment, data persistence, email, or file delivery. Test price is not a commercial offer. Prototype pages use `noindex,nofollow`.
- Research basis: public SoraTemplates product pages separate live demo, version/license choices, features, documentation, purchase, and support. Bagusin adopts the journey pattern, not their visual design or copy.
- Before marking ready: run browser smoke tests, check mobile/desktop layout and local links, validate form state/escaping, import both XML variants into a dedicated Blogger test blog, define final license/update/support policy, then remove prototype-only labeling/noindex only after approval.

## Katalog template — penyelarasan smoke test (14 Oktober 2026)

**Status: perubahan tes dicatat pada branch PR #129; hasil CI setelah commit ini masih harus diverifikasi.**

- Temuan: smoke test sebelumnya masih mencari tautan demo langsung dan detail paket di kartu katalog, sedangkan UI katalog terbaru dengan sengaja mengarahkan kedua tindakan melalui halaman preview template.
- Perbaikan: assertion kini memeriksa CTA preview dan CTA paket/harga untuk template **Bagus Sewa Mobil Bali 01** yang spesifik, bukan mengandalkan kartu pertama. Ini juga mencegah tes menjadi rapuh saat katalog menambah template baru atau mengurutkan item berdasarkan tanggal terbaru.
- Batas verifikasi: penyesuaian assertion bukan bukti bahwa semua rute preview, demo kanonis, detail harga, atau deployment GitHub Pages telah lulus. CI harus dijalankan ulang pada commit terbaru.
- Peluang peningkatan berikutnya:
  - Tambahkan assertion untuk setiap platform yang benar-benar tersedia (Blogger, WordPress, HTML/CSS/JS), dan tampilkan status ketersediaan per platform secara jujur.
  - Tambahkan pengujian keyboard/fokus dan reduced-motion pada navigasi katalog, preview, dan carousel.
  - Validasi semua URL demo/preview/detail di data katalog secara otomatis; tautan internal harus relatif terhadap prefix GitHub Pages dan tidak boleh menghasilkan item palsu.
  - Pisahkan status pemeriksaan source, browser CI, preview Cloudflare, dan situs publik menjadi gerbang verifikasi yang berbeda.
- Langkah selanjutnya: cek ulang hasil CI commit `7d11e2df5473813e5fd83e343c2351bcdfe0a1b6`; bila ada kegagalan lain, perbaiki sumber masalahnya atau buat PR tindak lanjut yang terukur sebelum merge.

## Temuan penting — katalog Blogger/WordPress belum ada di main (14 Oktober 2026)

**Status: diverifikasi pada sumber repository; deployment publik belum diuji langsung.**

- Pada branch `feat/blogger-template-store-journey`, halaman katalog lintas platform berada di `templates/index.html`, disertai halaman produk/demo dan aset katalog.
- Pengambilan file yang sama dari branch default `main` sebelumnya menghasilkan `404 Not Found`. Artinya, pada saat pemeriksaan ini, jalur `/templates/` belum dapat dianggap tersedia pada situs GitHub Pages yang dibangun dari `main`, walaupun file katalog data website di `templates/catalog.json` sudah ada.
- Ini menjelaskan perbedaan antara kode prototipe di PR dan apa yang kemungkinan terlihat oleh pengunjung situs publik. Kehadiran file di branch PR bukan deployment.
- Gerbang sebelum menyatakan katalog siap: pastikan PR #129 memuat halaman indeks, aset, halaman detail, demo, dan semua rute pendukung; jalankan CI pada head terbaru; review batasan transaksi; lalu merge hanya setelah pemeriksaan selesai. Setelah merge, buka URL GitHub Pages `/bagusin/templates/` dan uji alur katalog Blogger/WordPress sampai demo dan lisensi.
- Status produk tetap prototipe: checkout simulasi, XML Blogger belum dinyatakan lolos impor, dan belum ada klaim bahwa pembayaran atau pemrosesan pesanan aktif.


## Koreksi struktur homepage — koleksi, template, dan portofolio (14 Oktober 2026)

**Status: perubahan homepage dicatat pada branch PR #130; belum merged atau terverifikasi di GitHub Pages.**

- Jalur ringkas homepage memprioritaskan Layanan, Koleksi & demo website, Katalog Template, Blog, dan Course.
- Portofolio tetap tersedia melalui navigasi/halaman khusus, tetapi dihapus dari daftar pintasan penemuan homepage agar tidak bersaing dengan jalur pengunjung yang ingin memilih layanan, melihat demo, atau mencari template.
- Template source code boleh menjadi bagian dari karya/portofolio secara konsep, tetapi katalog produk tetap terpisah agar pengunjung dapat membedakan karya nyata, demo, dan item yang memang ditawarkan untuk dibeli.
- Jangan menyebut Koleksi sebagai katalog template; Koleksi menampilkan demo website, sedangkan /templates/ adalah jalur untuk menelusuri template per platform.
- Pemeriksaan berikutnya: audit seluruh tautan homepage/navigasi untuk label yang tumpang tindih, jalankan smoke test dan tes viewport pada head terbaru, sinkronkan branch dengan main, lalu verifikasi GitHub Pages setelah workflow/deployment benar-benar sukses.

## Keputusan UX — alur pengunjung dan langkah berikutnya (14 Oktober 2026)

**Prinsip:** satu halaman punya satu tindakan utama dan satu jalur lanjutan yang relevan. Jangan memberi terlalu banyak CTA setara, dan jangan mengarahkan semua pengunjung ke konsultasi.

### Peta perjalanan yang disarankan
1. **Pintu masuk** — homepage membantu pengunjung mengenali kebutuhan: mulai dari nol, memperbaiki website/bisnis digital, mencari template, atau belajar. Pilihan ini adalah pintu masuk; bukan daftar semua layanan sekaligus.
2. **Halaman solusi** — halaman layanan, koleksi, kursus, atau produk menjelaskan hasil yang akan didapat, siapa yang cocok, contoh/demo, harga atau cara mendapat estimasi, batasan, dan langkah berikutnya.
3. **Siap memesan** — arahkan ke pemesanan/checkout hanya jika produk dan alur transaksi memang sudah siap. Checkout simulasi tidak boleh ditampilkan seolah transaksi nyata.
4. **Belum siap** — jangan otomatis kembali ke homepage. Berikan satu panduan/blog yang menjawab keberatan atau pertanyaan paling dekat dengan halaman itu, lalu tautkan kembali ke layanan/produk terkait.
5. **Butuh bantuan memilih** — tawarkan kontak atau konsultasi sebagai jalur sekunder, khususnya untuk kebutuhan yang belum jelas atau proyek custom. Konsultasi bukan CTA default pada setiap halaman dan berada setelah pengunjung memperoleh informasi dasar.

### Aturan CTA dan tautan kontekstual
- Setiap halaman memilih satu CTA primer; CTA sekunder dibatasi pada tindakan pendukung yang benar-benar berbeda.
- Artikel blog harus punya hubungan dua arah: dari layanan/produk ke panduan relevan, dan dari panduan ke layanan/produk yang dibahas. Hindari CTA generik yang tidak cocok dengan isi artikel.
- Detail template mengarah ke demo, lisensi/batasan, dan cara pemasangan; jika belum siap membeli, arahkan ke dokumentasi/panduan pemasangan atau bantuan memilih.
- Halaman layanan yang memerlukan diskusi menjelaskan lingkup dan proses terlebih dahulu; konsultasi baru ditawarkan jika memang membantu keputusan.
- Setelah aksi selesai (misalnya membaca artikel, melihat demo, atau mengirim permintaan), tampilkan langkah berikutnya yang sesuai konteks, bukan memaksa pengguna kembali ke homepage.
- Jangan membuat tautan ke produk, artikel, pembayaran, dukungan, atau fitur yang belum tersedia. Kategori kosong harus tetap jujur dan tidak memunculkan produk palsu.
- Ukur kualitas alur berdasarkan apakah pengunjung bisa menjawab “ini cocok untuk saya?”, “apa yang saya dapat?”, “berapa/ bagaimana biayanya?”, dan “apa langkah berikutnya?” tanpa perlu bertanya dulu.

### Status implementasi dan gerbang verifikasi
- PR #129 katalog lintas platform digabung ke `main` melalui merge commit `482990211e6975a64b977e92723fb2367f066b4e`; browser smoke dan audit statis pada head sebelum merge lulus.
- File `templates/index.html` kini terverifikasi ada pada `main`; halaman katalog tetap prototipe `noindex,nofollow`, checkout simulasi, dan impor XML Blogger belum tervalidasi.
- Pemeriksaan sumber `index.html` pada `main` menunjukkan belum ada tautan eksplisit `/bagusin/templates/` di homepage. Katalog harus dihubungkan melalui navigasi yang jelas, tetapi jangan menambah CTA berlebihan.
- PR #130 homepage masih terbuka dan `mergeable=false`. Pemeriksaan terbaru pada head `567ac2af47f401dc96bc8c9c61afb6556de6af6a` menunjukkan kedua workflow PR (browser smoke dan audit statis) sukses, meski deskripsi PR masih mencatat kegagalan tes lama. Branch homepage tertinggal 3 commit dari `main` dan memiliki 19 commit unik; sinkronkan perubahan katalog/catatan terbaru, lalu jalankan tes ulang pada hasil gabungan sebelum merge.
- GitHub Pages publik belum dapat diverifikasi langsung pada pemeriksaan ini. Jangan menandai fitur live hanya karena file sudah ada di `main`; setelah workflow/deployment selesai, buka katalog dan uji alur pada browser desktop dan mobile.
- Berikutnya: audit PR #130 dan konsolidasikan satu jalur homepage → katalog/layanan → detail → demo atau panduan → pemesanan/kontak. Pastikan setiap halaman punya fallback non-pembelian yang kontekstual.
