# Bagusin — Roadmap Pengerjaan Website

Terakhir diperbarui: 11 Oktober 2026

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

## Tahap 4 — Blog, artikel, dan kategori

**Status: Belum dimulai.**

- Audit struktur Blog, kategori, tag, metadata, artikel terbaru, dan artikel pilihan.
- Buat peta topik dan maksud pencarian untuk mencegah artikel yang saling bersaing atau mengulang isi.
- Hubungkan artikel ke layanan, demo, dan course hanya ketika relevan.
- Artikel harus ditulis orisinal. Sumber eksternal digunakan untuk verifikasi fakta dan dicantumkan bila diperlukan; jangan menyalin artikel pihak lain.
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
