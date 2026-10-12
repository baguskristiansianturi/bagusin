# SOP — Menambahkan Artikel dan Kategori Blog Bagusin

**File acuan:** `js/blog-catalog.js`, `blog/index.html`, `css/blog.css`

## Cara kerja
Kartu, pencarian, saran topik, dan filter kategori dibuat dari satu registri artikel di `js/blog-catalog.js`. Kategori baru otomatis muncul di filter dan saran pencarian ketika dipakai pada properti `category` artikel. Gunakan label yang konsisten; jangan membuat variasi nama untuk topik yang sama tanpa alasan editorial.

## Checklist artikel baru
1. Buat halaman artikel dan pastikan URL-nya benar.
2. Lengkapi judul, deskripsi orisinal, gambar beserta teks alternatif, penulis, metadata SEO/canonical, tanggal publikasi, dan tanggal pembaruan bila diperlukan.
3. Tambahkan satu objek pada array `articles` di `js/blog-catalog.js` dengan properti `title`, `url`, `category`, `date`, `description`, `image`, `alt`, dan `minutes`.
4. Isi `date` dengan tanggal publikasi sebenarnya dalam format `YYYY-MM-DD`, selaras dengan metadata halaman. Jangan mengubah tanggal publikasi hanya untuk menaikkan posisi artikel.
5. Gunakan kategori yang sudah ada bila sesuai. Jika topik benar-benar baru, tulis nama kategori yang ringkas dan konsisten; filter serta saran topik akan mengikutinya otomatis.
6. Pastikan gambar dan tautan berfungsi; uji pencarian judul/deskripsi, filter kategori, saran topik, kartu, urutan tanggal, dan tampilan mobile.
7. Periksa metadata SEO, tautan internal, dan hasil sebelum commit.

## Pemeriksaan tampilan
- Mobile: kategori tepat di bawah hero dan sebelum daftar kartu; layar sangat sempit memakai satu kolom.
- Tablet: dua kolom kartu.
- Desktop lebar: empat kolom kartu; sidebar kategori sejajar dengan daftar.
- Pastikan lebar grid tidak melampaui container/footer dan tidak ada overflow horizontal.
