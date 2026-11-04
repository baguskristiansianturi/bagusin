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
6. Dari Admin → Store, pilih foto pada kolom **Tambah foto produk**. Foto akan diunggah ke `bagusin-public` dan path-nya disimpan pada database. Hapus foto eksternal lama bila ingin menggantinya dengan aset Storage.

## Kondisi aset uji sekarang

Sepuluh produk uji telah memiliki referensi foto produk dan deskripsi spesifikasinya. Sebagian foto galeri dan foto variasi juga sudah disiapkan sebagai referensi URL. Referensi tersebut masih mengarah ke situs produsen atau sumber katalog eksternal; file biner belum disalin ke bucket Bagusin. Untuk menjadikan aset permanen, unggah file foto melalui Admin → Store. Setelah unggah, path Storage Bagusin akan menggantikan URL eksternal.

## Variasi produk dan foto variasi

- Data variasi berada di `public.store_product_variants`; setiap kombinasi menyimpan `sku`, `variant_options`, `price_override`, `stock_quantity`, `status`, dan `image_path`.
- Foto variasi disimpan pada bucket `bagusin-public` dengan pola `products/<slug>/variants/<sku>-<timestamp>.<ext>`.
- Di Admin → Store, isi JSON variasi. Pilih file pada **Foto variasi** dengan nama file yang sama persis dengan SKU, tanpa ekstensi (contoh `G102-LS-WHT.webp` untuk SKU `G102-LS-WHT`).
- Foto variasi yang dipilih akan mengganti foto utama ketika opsi variasi dipilih, dan path-nya ikut dibawa ke keranjang.
- Produk uji yang sudah memiliki variasi: ASUS Vivobook 15 (Cool Silver / Quiet Blue), Logitech G102 (Black / White), dan Kingston FURY Beast (1×16 GB / 2×8 GB).

## Deskripsi dan spesifikasi

- `short_description`: ringkasan di kartu katalog.
- `description`: uraian panjang di halaman detail.
- `specifications`: JSON array kelompok spesifikasi, setiap kelompok berisi `group` dan objek `items`.
- Jangan mengisi jumlah terjual atau rating secara manual. `sold_count` bertambah ketika pesanan produk berubah menjadi `completed`; ulasan ditampilkan dari `product_reviews` dengan status `published`.

## Pengiriman dan pembayaran

Checkout saat ini mendukung pengiriman kurir manual (ongkos dikonfirmasi Bagusin) dan ambil sendiri. Belum ada integrasi ongkir otomatis atau payment gateway. Total akhir dan instruksi pembayaran dikonfirmasi setelah pengajuan ditinjau.
