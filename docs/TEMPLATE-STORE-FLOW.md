# Template Store Journey — Bagusin

Status: prototipe UI/UX untuk evaluasi; bukan toko aktif dan tidak memproses transaksi.

## Referensi alur publik yang ditinjau

SoraTemplates memisahkan beberapa langkah yang berguna untuk dipelajari:
1. Katalog/arsip produk membantu menemukan template berdasarkan gaya atau kebutuhan.
2. Halaman produk menampilkan gambar, tautan demo langsung, pilihan versi gratis/premium/extended, manfaat tiap versi, deskripsi, fitur, serta tautan dokumentasi/video.
3. Pilihan pembelian mengarah ke penyedia transaksi eksternal; halaman produk juga memberi akses ke layanan setup/kustomisasi dan dukungan.
4. Dokumentasi serta halaman support menjelaskan pemasangan, pemecahan masalah, batas dukungan, dan layanan tambahan.

Sumber yang ditinjau:
- https://www.soratemplates.com/2026/04/dizee-blogger-templates.html
- https://www.soratemplates.com/2017/07/sora-cart-blogger-templates.html
- https://www.soratemplates.com/p/support.html

Bagusin mengambil pola perjalanan tersebut, bukan desain, teks, atau identitas SoraTemplates. Katalog memisahkan tiga dimensi agar tidak tercampur: (1) platform/format distribusi — Blogger, WordPress, dan kode HTML/CSS/JS; (2) kebutuhan/desain — landing page, profil bisnis/perusahaan, blog/editorial, toko/katalog, dan portofolio; (3) industri — blog personal, bisnis jasa, travel/rental, penginapan, kuliner, fashion, teknologi, pendidikan, kreatif, dan toko online. Dimensi ini saling melengkapi, bukan saling menggantikan. Kategori yang belum memiliki produk harus tetap menampilkan empty state yang jujur.

## Jalur prototipe

`/templates/` → pilih platform → pilih industri / cari → `/templates/blogger-editorial/` → lihat demo → pilih Free/Premium → `/templates/checkout/?license=...` → isi data → validasi → periksa ringkasan → selesaikan simulasi.

## Produk contoh

- Nama: Bagusin Editorial
- Platform: Blogger
- Industri: Blog personal / editorial
- File: `templates/files/bagusin-editorial-free-v0.1.xml` dan `templates/files/bagusin-editorial-premium-v0.1.xml`
- Demo visual: `templates/demos/editorial-blogger/`
- Semua halaman prototipe menggunakan `noindex,nofollow`; jangan masukkan ke sitemap sebelum produk, lisensi, harga, dan kompatibilitas siap dipublikasikan.

## Batasan dan aturan produk

- Harga Rp49.000 hanya nilai uji UI, bukan harga jual Bagusin.
- Form checkout hanya simulasi browser. Tidak ada payment gateway, penyimpanan data, email, atau pengiriman file setelah submit.
- XML adalah prototipe sumber. Jangan menyatakan valid di Blogger sampai file benar-benar diimpor dan diuji di akun/blog uji.
- Kredit versi gratis harus dijelaskan dalam lisensi. Jangan membuat mekanisme tersembunyi yang mengalihkan atau merusak website ketika kredit dihapus.
- Untuk versi premium, hak menghapus kredit, masa dukungan, cakupan update, dan lisensi penggunaan harus disepakati serta dicantumkan secara eksplisit sebelum produk dijual.
- Dokumentasi tiap rilis perlu memuat screenshot, versi, tanggal, changelog, persyaratan, petunjuk instalasi, dan tautan unduh yang sesuai lisensi.

## Acceptance checklist

- [ ] Pilihan Blogger/WordPress dapat diubah dan status aktif dibaca oleh assistive technology.
- [ ] Industri kosong menampilkan empty state, bukan produk palsu.
- [ ] Pencarian menyaring produk yang ada.
- [ ] Detail menyediakan demo yang bisa dibuka, paket, batasan, dan pilihan lisensi.
- [ ] Parameter lisensi dibawa ke checkout dengan benar.
- [ ] Form memvalidasi nama, email, URL opsional, dan persetujuan.
- [ ] Ringkasan menampilkan data yang dimasukkan dengan aman.
- [ ] Submit hanya menampilkan hasil simulasi; tidak mengklaim pembayaran/email berhasil.
- [ ] Desktop dan mobile diuji di browser.
- [ ] XML berhasil diimpor ke Blogger test blog sebelum dinyatakan siap dijual.
- [ ] Produk/lisensi/harga yang disetujui ditinjau sebelum menghapus noindex atau memasukkan ke sitemap.


## Perubahan katalog — 14 Oktober 2026

- Menambahkan pilihan platform ketiga: **HTML, CSS & JS**. Karena belum ada template kode yang dirilis pada katalog ini, pilihan tersebut menampilkan empty state, bukan produk palsu.
- Menambahkan filter **Jenis kebutuhan** yang terpisah dari platform dan industri: landing page, profil bisnis/perusahaan, blog/editorial, toko online/katalog, dan portofolio.
- Kartu Bagusin Editorial diberi klasifikasi kebutuhan `blog`; filter landing page tidak boleh menampilkan item blog hanya karena keduanya bisa berupa satu halaman.
- Jumlah produk di samping industri dihitung dari kartu katalog pada platform yang dipilih; angka tidak boleh menjadi klaim ketersediaan yang direka.
- Tetap `noindex,nofollow` dan prototipe. Harga, lisensi, checkout, impor Blogger, dan pengiriman belum boleh disebut transaksi aktif.
