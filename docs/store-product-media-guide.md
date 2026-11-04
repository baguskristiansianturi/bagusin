# Media produk Bagusin Store

## Lokasi data

- Data utama produk: tabel Supabase `public.store_products`.
- Foto utama: kolom `image_path`.
- Foto galeri (maksimal 15 per produk): tabel `public.store_product_images`, diurutkan dengan `sort_order`; tandai foto utama dengan `is_primary=true`.
- Bucket media publik yang digunakan storefront: `bagusin-public`.

## Mengisi atau mengganti foto

1. Unggah foto produk ke bucket Storage `bagusin-public`, misalnya folder `store/products/<slug>/`.
2. Simpan path objek (bukan URL sementara) ke `store_products.image_path`.
3. Tambahkan foto lain ke `store_product_images.image_path` dengan `product_id`, `alt_text`, dan `sort_order`.
4. Foto utama harus memiliki `is_primary=true`. Gunakan foto produk asli: sudut depan/samping/belakang, detail port/fitur, dan isi paket.
5. Maksimal 15 foto ditampilkan di halaman detail.

## Kondisi aset uji sekarang

Sepuluh produk uji telah memiliki foto produk dan deskripsi spesifikasinya. URL gambar yang sekarang tersimpan masih mengarah ke situs produsen atau sumber katalog eksternal; file belum disalin ke bucket Bagusin. Lingkungan kerja ini tidak dapat mengakses jaringan untuk mengunduh file secara lokal. Setelah file diunggah ke bucket, ganti `image_path` dengan path Storage Bagusin agar foto tidak bergantung pada host luar.

## Deskripsi dan spesifikasi

- `short_description`: ringkasan di kartu katalog.
- `description`: uraian panjang di halaman detail.
- `specifications`: JSON array kelompok spesifikasi, setiap kelompok berisi `group` dan objek `items`.
- Jangan mengisi jumlah terjual atau rating secara manual. `sold_count` bertambah ketika pesanan produk berubah menjadi `completed`; ulasan ditampilkan dari `product_reviews` dengan status `published`.

## Pengiriman dan pembayaran

Checkout saat ini mendukung pengiriman kurir manual (ongkos dikonfirmasi Bagusin) dan ambil sendiri. Belum ada integrasi ongkir otomatis atau payment gateway. Total akhir dan instruksi pembayaran dikonfirmasi setelah pengajuan ditinjau.
