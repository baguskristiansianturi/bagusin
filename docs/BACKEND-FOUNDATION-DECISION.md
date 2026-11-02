# Fondasi Backend Bagusin

Tanggal: 2 November 2026  
Status: keputusan implementasi tahap awal; belum terhubung ke proyek Supabase aktif.

## Tujuan produk

Bagusin memiliki tiga kelompok konten utama yang dikelola dari satu admin dashboard:

1. **Artikel/blog** — konten yang terus bertambah; membutuhkan draft, publikasi, kategori, tag/SEO, cover, slug, dan artikel terkait.
2. **Katalog desain/template** — dapat berkembang menjadi ratusan item; setiap item memiliki kode, kategori, harga, status, preview, galeri, dan tautan demo.
3. **Course** — jumlah course relatif lebih sedikit, tetapi setiap course memiliki modul, pelajaran, materi, status publikasi, dan pendaftaran peserta.

Akun pengguna dan pendaftaran course disiapkan pada fondasi ini. Checkout/pembayaran, email transaksional, dan akses materi berbayar belum diaktifkan pada tahap pertama.

## Keputusan stack tahap awal

- Frontend tetap menggunakan HTML, CSS, dan JavaScript yang sudah ada; jangan merombak tampilan untuk mengadopsi backend.
- **Supabase PostgreSQL** menjadi database dan layanan autentikasi awal.
- **Supabase Storage** digunakan sementara untuk gambar artikel, preview template, dan media course yang sesuai batas kuota.
- Hosting frontend tetap terpisah. Alamat publik website bukan alamat API Supabase.
- Backend harus portabel: skema memakai PostgreSQL standar sebisa mungkin, file disimpan menggunakan path relatif di tabel, dan integrasi frontend memakai satu modul adapter. Ini memudahkan migrasi ke PostgreSQL/object storage lain kelak.
- Supabase project URL dan publishable/anon key adalah konfigurasi publik yang boleh berada di frontend; service_role key, database password, dan token admin tidak boleh berada di HTML/JavaScript publik atau repository.

Keputusan ini menggantikan rencana lama yang menunda backend sampai Go/Google Cloud tersedia. Go/Cloud dapat dievaluasi lagi jika kebutuhan operasional muncul; tidak perlu dibangun sekarang.

## Struktur data awal

- profiles: profil pengguna dan role member/admin.
- article_categories, articles: konten editorial.
- design_categories, design_templates, design_template_images: katalog desain yang dapat tumbuh besar.
- courses, course_modules, course_lessons, course_enrollments: struktur course yang reusable.
- File biner tidak disimpan sebagai kolom database; database hanya menyimpan storage path.

## Keamanan

- Row Level Security (RLS) aktif pada seluruh tabel.
- Pengunjung anonim hanya dapat membaca konten yang sudah dipublikasikan/tersedia.
- Hanya admin yang dapat membuat, mengubah, atau menghapus konten.
- Pengguna hanya dapat membaca profil dan enrollment miliknya sendiri.
- Role admin tidak boleh diberikan melalui form registrasi publik. Akun admin pertama harus dipromosikan secara manual melalui SQL Editor Supabase setelah akun dibuat.
- File publik hanya untuk preview/media yang memang dimaksudkan untuk publik; file privat course perlu bucket dan policy terpisah sebelum materi berbayar diluncurkan.
- Jangan pernah mengirim service role key ke browser.

## Batas tahap pertama

Belum dibuat:
- Proyek Supabase aktif atau kredensial koneksi.
- Integrasi website live.
- Admin dashboard.
- Editor artikel WYSIWYG.
- Payment gateway, invoice otomatis, dan email transaksi.
- Migrasi semua JSON/HTML konten lama ke database.

## Tahap pengerjaan

1. Siapkan proyek Supabase dari HP dan simpan URL + publishable/anon key secara aman.
2. Review lalu jalankan migration SQL pertama.
3. Buat akun owner, lalu tetapkan role admin manual.
4. Buat adapter frontend tanpa mengubah tampilan publik.
5. Hubungkan artikel terlebih dahulu; validasi list, detail, kategori, SEO fallback, draft/published.
6. Hubungkan katalog desain; validasi filter, ratusan data, pagination, dan empty state.
7. Hubungkan course; validasi course, modul, pelajaran, enrollment.
8. Bangun admin dashboard mobile-first.

## Definisi selesai fondasi

- Migration dapat dijalankan pada proyek Supabase baru tanpa error.
- RLS mencegah anon/user biasa menulis konten atau mengubah role.
- Konten draft tidak dapat dibaca publik.
- Konten published/available dapat dibaca publik.
- Tidak ada secret dalam bundle frontend.
- Frontend tetap berfungsi dengan fallback data lokal selama koneksi backend belum disetel.
