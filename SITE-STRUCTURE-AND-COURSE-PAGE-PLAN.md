# Bagusin — Struktur Induk Situs & Blueprint Halaman Course

**Status:** Draft struktur untuk ditinjau melalui implementasi bertahap.  
**Diperiksa:** 13 Oktober 2026  
**Tujuan:** Menetapkan peran tiap bagian situs dan pola halaman sebelum menambah banyak course atau menulis batch artikel. Dokumen ini bukan klaim bahwa semua fungsi/halaman sudah selesai atau live.

## 1. Aturan arsitektur

1. Satu halaman memiliki satu tujuan utama dan satu langkah lanjutan yang relevan.
2. Pengunjung boleh belajar gratis, mengeksplorasi, membeli produk, atau meminta layanan. Jangan memaksa semua pengunjung menuju konsultasi.
3. **Layanan** menjual pelaksanaan/kustomisasi; **Koleksi** menunjukkan demo/template siap pakai; **Portofolio** menunjukkan pekerjaan nyata yang memang dapat dibuktikan; **Blog/Panduan** membantu pembaca menyelesaikan pertanyaan; **Course** menyediakan pembelajaran terstruktur dengan praktik dan umpan balik.
4. Jangan mengklaim fitur, hasil, harga, jadwal, sertifikat, kanal, atau course tersedia sebelum diverifikasi.
5. Pertahankan desain Blog, Koleksi, dan Portofolio yang sudah disukai. Perubahan lintas halaman harus punya alasan, cakupan, checkpoint dan pengujian.
6. Struktur navigasi, halaman, taxonomy, sitemap, metadata, dan bahasa Indonesia/Inggris harus konsisten.
7. Untuk artikel, ikuti `content/ARTICLE-EDITORIAL-SOP.md` sejak perencanaan. Peta konten harus selesai sebelum batch 50 artikel ditulis.

## 2. Peta situs tingkat atas

| Area | Tujuan utama | Isi / halaman induk | Langkah lanjutan yang wajar |
|---|---|---|---|
| Beranda | Membantu pengunjung menemukan jalur yang sesuai | Hero dan path-finder; hasil rekomendasi; layanan/koleksi/course yang relevan; beberapa artikel; eksplorasi ringkas; CTA penutup | Buka halaman terkait, bukan selalu konsultasi |
| Layanan / Work | Menjelaskan bantuan yang bisa dipesan | Katalog layanan dan halaman detail per layanan | Baca panduan terkait, kirim brief, atau hubungi Bagus |
| Koleksi | Menampilkan demo/template yang dapat dipilih | Katalog, kategori, detail/preview demo, harga dan batasan bila sudah dipastikan | Lihat demo atau tanyakan penyesuaian |
| Portofolio | Memperlihatkan pekerjaan nyata secara jujur | Daftar proyek yang dapat dipublikasikan dan detail kasus jika datanya tersedia | Lihat layanan terkait |
| Belajar / Learning | Membantu memilih tujuan belajar | Katalog 16 domain, 5 jalur lintas domain, topik praktis lama, tingkat kompetensi | Buka domain, jalur atau detail course |
| Detail course | Menjelaskan satu tawaran belajar secara lengkap | Tujuan, kesiapan awal, kurikulum, praktik, waktu, metode, harga dan status | Ajukan pertanyaan/permintaan pendaftaran dengan konteks terpilih |
| Blog | Menjawab pertanyaan, cerita dan eksplorasi | Indeks artikel, kategori/label, halaman artikel | Artikel terkait, panduan, layanan, koleksi atau course bila relevan |
| Panduan gratis | Membantu pembaca menyelesaikan tugas | Bisa menjadi bagian Blog atau halaman panduan khusus sesuai sistem konten yang ada | Langkah lanjutan yang relevan tanpa menahan informasi penting |
| Destinasi / eksplorasi | Memuat pengalaman/tempat dan minat personal | Indeks dan cerita sesuai inventaris nyata | Konten terkait |
| Tentang Bagus | Memberi konteks personal secukupnya | Identitas, cara kerja, minat dan batasan yang benar | Jelajahi karya atau kontak bila cocok |
| Kontak | Menangkap pertanyaan/brief dengan konteks | Formulir, pilihan maksud, ringkasan kebutuhan, cara menghubungi | Tindak lanjut manual sesuai proses yang tersedia |
| Legal & kebijakan | Menjelaskan aturan dan transparansi | Privacy, Terms, Disclaimer, Editorial Policy dan syarat layanan/course | Kembali ke halaman asal |
| Bahasa Inggris | Memberi versi Inggris yang setara | Padanan halaman penting, metadata, alternate/hreflang dan link balik | Jalur halaman Inggris yang relevan |

### Susunan beranda yang direkomendasikan untuk validasi

1. Hero singkat dengan path-finder yang tetap interaktif.
2. Rekomendasi berdasarkan jawaban pengunjung; tidak langsung memaksa konsultasi.
3. Course/jalur belajar dengan status ketersediaan jujur.
4. Desain terbaru dan Koleksi; demo yang tersedia lebih dulu, tautan “lihat semua” di akhir daftar.
5. Sedikit artikel/panduan unggulan tanpa menduplikasi bagian lain.
6. Penemuan tambahan: destinasi, portofolio/proyek nyata, dan YouTube hanya jika statusnya dijelaskan dengan jujur.
7. CTA penutup yang memberi pilihan sesuai niat pengunjung.
8. Footer ringkas dengan tautan yang benar-benar ada.

Urutan ini adalah rancangan untuk direview, bukan pernyataan bahwa sudah diterapkan. Sebelum perubahan kode, periksa status beranda saat ini dan jaga agar tidak merusak pola path-finder.

## 3. Taksonomi dan pola konten

- **Kategori**: kelompok subjek yang stabil dan mudah dimengerti.
- **Tag/label**: hubungan topik yang berguna lintas artikel; bukan daftar semua kata kunci.
- **Jalur belajar**: urutan kompetensi lintas beberapa domain.
- **Domain course**: rumpun kemampuan utama.
- **Tingkat**: Foundation → Intermediate → Advanced → Professional.
- **Course**: penawaran yang memiliki hasil belajar, urutan modul, latihan, evaluasi, prasyarat dan status.
- **Koleksi/demo**: produk/konsep yang siap ditinjau, bukan bukti pekerjaan klien.
- **Portofolio**: karya nyata dengan hak dan informasi publikasi yang sesuai.

Jangan membuat kategori/tag baru atau mengganti slug sebelum inventaris dan dampak URL ditinjau. Gunakan taxonomy yang sudah dipakai situs sebagai sumber kebenaran.

## 4. Arsitektur Learning/Course

### Halaman induk dan anak

1. `/learning/` — katalog utama berbahasa Indonesia.
2. `/en/learning/` — padanan bahasa Inggris.
3. Katalog menampilkan semua **16 domain**, semua **4 tingkat kompetensi**, **5 jalur lintas domain**, serta pemetaan **37 kelompok topik praktis lama**. Item yang belum siap tetap dapat dipetakan, tetapi harus diberi status yang benar.
4. Halaman jalur menjelaskan urutan lintas domain, prasyarat, tujuan akhir, dan domain yang dilewati.
5. Halaman domain/course menjelaskan kompetensi dan pilihan pembelajaran yang benar-benar dikembangkan. Delapan halaman detail yang ada saat ini adalah draft awal, bukan representasi lengkap seluruh kurikulum.
6. Padanan ID/EN harus selaras dalam cakupan, jumlah domain, tingkat, status, tautan alternate, dan makna; terjemahan tidak boleh mengubah klaim atau status.

### Domain induk (16)

1. Digital Foundations
2. UI/UX & Web Design
3. Frontend Development
4. Programming & Algorithms
5. Backend Development
6. Database & Data Engineering
7. CMS & Web Platforms
8. Cloud Computing
9. DevOps & Security
10. AI & Machine Learning
11. Automation & Integration
12. Mobile Development
13. Embedded Systems & IoT
14. Computer & Networking
15. Data Analysis & Business Tools
16. Graphic Design & Media

### Jalur lintas domain (5)

- Web & Software Engineering
- Cloud & Infrastructure
- AI Engineering
- IoT & Connected Systems
- Data & Automation

### Struktur wajib untuk setiap halaman detail course

1. **Nama dan ringkasan**: hasil belajar utama dalam bahasa sederhana; bukan janji kerja atau penghasilan.
2. **Status**: Available / In development / Planned, diterjemahkan konsisten. Jangan menerima pendaftaran sebagai course tersedia sebelum detailnya diverifikasi.
3. **Cocok untuk siapa**: kebutuhan dan pengalaman awal.
4. **Prasyarat dan kesiapan**: kemampuan yang perlu dikuasai, bukan batas umur; arahkan pemula ke fondasi bila perlu.
5. **Hasil praktis**: hal yang dapat dilakukan setelah belajar dan artefak proyek yang akan dibuat, bila sesuai.
6. **Silabus per pertemuan**: urutan pertemuan, topik, praktik, tugas dan hasil sesi. Jangan mengarang jumlah sesi atau jam sebelum ditetapkan.
7. **Metode latihan**: Understand → See an example → Practise → Modify → Solve a challenge → Receive feedback → Build a project → Review.
8. **Evaluasi**: latihan selesai, pemahaman, perbaikan dan proyek; jangan menjadikan sertifikat sebagai janji utama.
9. **Metode belajar**: online dari mana saja atau tatap muka dengan instruktur datang ke lokasi peserta di Bali, sesuai area layanan dan kesepakatan. Jangan menyebut adanya ruang kelas Bagusin.
10. **Peralatan dan biaya tambahan**: laptop/desktop jika dibutuhkan; domain, hosting, perangkat, software, cloud, iklan atau kit hardware yang tidak termasuk harus disebut jelas.
11. **Durasi, jadwal, kapasitas**: hanya ditampilkan setelah dipastikan.
12. **Harga**: cantumkan harga final dan basis pembanding yang transparan. Kebijakan yang sudah ditetapkan: benchmark paket relevan + Rp1.750.000 untuk model privat satu peserta; jika pembanding tidak sepadan, tandai sebagai estimasi perencanaan dan jangan buka pendaftaran sampai ditinjau.
13. **FAQ dan batasan**: jawaban atas hambatan umum, prasyarat, apa yang tidak termasuk dan apa yang belum dijanjikan.
14. **CTA kontekstual**: pertanyaan course/permintaan pendaftaran membawa nama course/jalur dan kebutuhan yang dipilih ke brief kontak.
15. **Navigasi lanjutan**: prasyarat, tingkat berikutnya, domain terkait, panduan gratis dan artikel pendamping yang relevan.
16. **SEO/teknis**: satu H1, title/meta description unik, canonical, alternate bahasa, breadcrumb bila cocok dengan sistem, tautan valid, keyboard accessibility, responsif, schema hanya jika sesuai isi nyata.

### Kebijakan penyampaian dan harga yang tidak boleh berubah diam-diam

- Satu peserta per instruktur.
- Online dapat dilakukan dari mana saja.
- Offline berarti instruktur mendatangi lokasi peserta di Bali sesuai area dan jadwal yang disepakati; Bagusin tidak memiliki ruang kelas sendiri.
- Kesiapan dinilai dari kompetensi, bukan usia.
- Untuk latihan website, programming, data, cloud atau desain, perangkat laptop/desktop yang sesuai diperlukan; ponsel saja tidak cukup.
- Rumus harga privat: pembanding paket relevan + Rp1.750.000. Jangan mengklaim penyedia pembanding menawarkan kurikulum identik. Bila tidak ada pembanding yang dapat dipertanggungjawabkan, tandai sebagai estimasi dan tahan pendaftaran sampai ditinjau.
- Jangan menciptakan jadwal, sertifikat, akreditasi, testimoni, pengajar, atau jaminan karier.

## 5. Arsitektur Blog dan 50 artikel

Sebelum menulis batch, inventarisasi artikel yang ada dan rencana sebelumnya. Content map minimal memuat:
- ID dan slug; judul kerja; bahasa.
- Pembaca, maksud pencarian dan pertanyaan utama.
- Batas cakupan dan pembeda dari artikel lain.
- Outline; kategori dan tag yang sudah ada.
- Klaim yang butuh riset serta sumber primer/otoritatif yang diharapkan.
- Tautan internal masuk/keluar dan artikel pendamping.
- Hubungan yang relevan dengan layanan, koleksi, course atau panduan.
- Status editorial dan teknis.

Lakukan audit tumpang tindih sebelum outline disetujui. Gabungkan atau batalkan topik yang tidak punya tujuan berbeda. Artikel gratis harus menyelesaikan tugas yang dijanjikan secara memadai; jangan sengaja menyembunyikan langkah penting demi penjualan. Terapkan semua pemeriksaan dalam `content/ARTICLE-EDITORIAL-SOP.md`.

## 6. Inventaris yang berhasil diverifikasi saat audit ini

Berikut adalah fakta struktur yang dapat diverifikasi dari berkas yang dibuka; daftar ini **bukan** audit penuh semua berkas:

- `index.html` ada di root dan memuat homepage Indonesia.
- `learning/index.html` ada sebagai katalog course Indonesia.
- `en/learning/index.html` ada sebagai katalog course Inggris.
- Delapan slug detail course yang tercantum di sitemap: `web-developer`, `digital-marketer`, `online-business`, `ui-ux-design`, `cloud-devops`, `data-analyst`, `ai-automation`, `iot-embedded`, masing-masing tercantum untuk ID dan EN.
- `blog/index.html` ada; sitemap memuat artikel fondasi website/bisnis dan artikel personal/perjalanan. Daftar sitemap tidak cukup untuk menyimpulkan inventaris konten lengkap atau kualitas setiap artikel.
- Sitemap juga mencantumkan `work/`, `collections/`, `portfolio/`, `about/`, `contact/` beserta beberapa halaman detail layanan.
- `learning/MASTER-CURRICULUM.md` adalah sumber kebenaran cakupan kurikulum; dokumen ini tidak menggantikannya.
- `content/ARTICLE-EDITORIAL-SOP.md` adalah standar editorial wajib.

## 7. Gap yang masih perlu diaudit sebelum coding

- [ ] Inventaris penuh file/URL dan navigasi utama ID/EN.
- [ ] Audit isi serta fungsi katalog Learning dan delapan halaman detail yang sudah ada, termasuk status harga, sesi, perangkat, metode dan CTA.
- [ ] Pastikan seluruh 16 domain, 4 tingkat, 5 jalur, dan 37 keluarga topik benar-benar dapat ditemukan dari katalog; jangan menyimpulkan hanya dari dokumen kurikulum.
- [ ] Audit semua artikel yang sudah ada, kategori/tag, metadata, tanggal, link terkait, serta risiko tumpang tindih.
- [ ] Buat content map 50 artikel yang disetujui sebelum penulisan.
- [ ] Audit footer/header dan target tautan sebelum perubahan.
- [ ] Jalankan pemeriksaan tautan, HTML, metadata, aksesibilitas dasar dan perilaku CTA.
- [ ] Uji browser pada ponsel/desktop dan verifikasi deployment langsung; status live belum dikonfirmasi oleh audit ini.

## 8. Urutan eksekusi

1. Lengkapi inventaris struktur situs dan navigasi dari berkas yang benar-benar ada.
2. Audit dan selaraskan katalog serta halaman detail course dengan master curriculum.
3. Tetapkan struktur Blog/taxonomy dan selesaikan content map 50 artikel.
4. Review struktur dan prioritas bisnis sebelum perubahan besar pada homepage.
5. Implementasikan per kelompok kecil dengan checkpoint, pengujian dan catatan perubahan.
6. Baru tulis artikel dalam batch kecil setelah topik, outline, sumber dan hubungan internal disetujui.
7. Laporkan commit, file berubah, pemeriksaan yang benar-benar dijalankan, item yang belum diuji dan status deployment secara terpisah.
