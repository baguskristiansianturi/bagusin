# Keputusan Arsitektur: Frontend Statis, Backend Go, dan Domain

Tanggal: 14 Oktober 2026
Status: keputusan arah kerja; belum merupakan implementasi backend atau keputusan pembelian domain.

## Keputusan yang disepakati

- Pertahankan frontend Bagusin sebagai situs statis HTML, CSS, dan JavaScript. Prioritas sekarang adalah menyelesaikan UX, responsivitas, konten, aksesibilitas, dan verifikasi GitHub Pages.
- Jangan menambahkan CodeIgniter/PHP ke repository ini. Backend yang direncanakan ke depan adalah Go (Golang), bukan CodeIgniter.
- Google Cloud menjadi target hosting backend di masa depan, setelah akses billing/kartu pembayaran dapat diselesaikan. Jangan menganggap layanan Google Cloud sudah aktif.
- Pisahkan frontend dan backend: frontend tetap bisa dipublikasikan sebagai situs statis; API Go baru dibuat saat ada kebutuhan yang jelas dan lingkungan hosting siap.
- Jangan membuat checkout, penyimpanan pesanan, pengiriman email, autentikasi, atau pembayaran palsu hanya demi menampilkan alur seolah-olah sudah aktif.
- Pertahankan desain dan interaksi yang sudah disukai. Perubahan arsitektur tidak menjadi alasan untuk merombak tampilan Blog, Koleksi, Portofolio, homepage, tipografi, warna, atau navigasi tanpa kebutuhan yang terbukti dan review terpisah.

## Audit repository pada 14 Oktober 2026

Pemeriksaan Git tree main pada commit 493c70f430fa4ecb4cec98eb6e07b6640b699a4d menunjukkan:

- Tidak ditemukan file PHP/PHTML, composer.json, go.mod, go.sum, atau berkas bernama/berjalur CodeIgniter, Cloudflare Worker, atau API.
- Dockerfile saat ini menggunakan nginx:1.27-alpine, menyalin konfigurasi Nginx dan file repository ke direktori situs statis. Ini adalah image frontend statis berbasis Nginx, bukan aplikasi CodeIgniter.
- Ada nginx.conf, yang perlu diperiksa sebelum perubahan deployment atau Docker dilakukan.
- Karena tidak ada runtime CodeIgniter/PHP yang terdeteksi pada main, jangan menghapus HTML/CSS/JS atau direktori frontend dengan dugaan bahwa itu skrip CodeIgniter. Bila ada deployment CodeIgniter terpisah di layanan eksternal, bersihkan deployment tersebut secara terpisah setelah URL dan sumber deploy dipastikan.

Catatan: audit ini berdasarkan nama file Git tree; bukan pemindaian isi setiap file atau seluruh akun Cloudflare/Google Cloud.

## Target arsitektur bertahap

1. Sekarang — frontend: GitHub Pages tetap menjadi lingkungan publik untuk iterasi desain. Perbaiki dan uji tampilan sebelum merge; jangan bergantung pada backend yang belum ada.
2. Persiapan — kontrak API: catat kebutuhan data dan endpoint sebelum membuat API. Frontend harus menampilkan status yang jujur bila fitur membutuhkan backend.
3. Nanti — Go API: buat layanan Go terpisah ketika kebutuhan seperti order, email, atau penyimpanan benar-benar siap dirancang, diuji, dan diamankan.
4. Nanti — Google Cloud: evaluasi Cloud Run untuk layanan Go setelah billing tersedia. Hosting frontend dapat tetap terpisah; pilihan layanan statis Google Cloud baru dibandingkan bila ada alasan operasional yang nyata.
5. Rilis: rahasiakan kredensial; gunakan konfigurasi environment; validasi input; tambahkan logging dan penanganan error; jangan pernah menyimpan rahasia di repository frontend.

## Keputusan nama dan domain

- Jangan mengganti nama Bagusin menjadi Bagusdev hanya karena domain tertentu tidak tersedia. Bagusin sudah memiliki konsep, konten, struktur, dan identitas yang lebih luas dari jasa developer.
- Bagusdev terdengar lebih sempit dan berorientasi jasa/pengembangan perangkat lunak; itu berpotensi mengecilkan ruang untuk Blog, panduan, course, produk, koleksi, perjalanan, dan karya personal.
- Nama domain belum diputuskan dan ketersediaannya harus dicek langsung melalui registrar sebelum pembelian. Jangan mengklaim suatu domain tersedia hanya berdasarkan hasil pencarian web.
- .co.id tidak diprioritaskan untuk identitas independen ini: kebijakan PANDI mengarahkannya kepada entitas bisnis/badan hukum/organisasi yang memenuhi persyaratan dokumen. Periksa kebijakan dan persyaratan terkini pada registrar sebelum mendaftar.
- Urutan evaluasi: cari varian domain yang tetap memakai nama Bagusin terlebih dahulu; bandingkan .id dan ekstensi lain yang cocok bagi individu; pertimbangkan domain personal Bagus sebagai alternatif hanya jika nama Bagusin benar-benar tidak layak didapatkan. Nilai kemudahan diucapkan, dieja, diingat, kesinambungan brand, biaya perpanjangan, dan kemungkinan benturan merek.
- Sebelum mengubah canonical URL, sitemap, Open Graph, atau tautan internal, tunggu keputusan domain final. Hindari migrasi URL berulang.

## Batas perubahan yang aman

- Perubahan tahap ini hanya dokumentasi keputusan/roadmap. Tidak menghapus file runtime, tidak mengubah CSS/HTML/JS produksi, tidak mengubah URL canonical, dan tidak mengubah deployment.
- Perubahan kode berikutnya harus melalui branch terpisah, dengan pemeriksaan diff dan tes sebelum merge.
