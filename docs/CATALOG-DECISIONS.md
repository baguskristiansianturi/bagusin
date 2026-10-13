# Bagusin — Catatan keputusan katalog template

Terakhir diperbarui: 14 Oktober 2026

## Model katalog yang disepakati

Template adalah produk digital yang bisa dipilih dan dipasang pelanggan sendiri, berbeda dari layanan pembuatan/instalasi website yang dikerjakan Bagus.

Gunakan tiga dimensi independen:
1. **Platform / format:** Blogger, WordPress, dan kode HTML/CSS/JS. Platform lain dapat ditambahkan jika benar-benar didukung.
2. **Jenis kebutuhan:** landing page, profil bisnis/perusahaan, blog/editorial, toko/katalog, portofolio, dan jenis berikutnya bila ada kebutuhan nyata.
3. **Industri:** blog personal, bisnis jasa, travel/rental, hotel/penginapan, kuliner, fashion/kecantikan, teknologi, pendidikan, kreatif, toko online, dan lainnya.

Jangan memakai level Starter/Business/Commerce sebagai pengganti platform atau jenis kebutuhan pada produk template yang diunduh. Level bisa tetap relevan pada layanan website custom yang dibangun atau dipasang untuk pelanggan.

## Aturan kejujuran katalog

- Hanya produk yang benar-benar ada dan berstatus tersedia yang boleh ditampilkan sebagai tersedia.
- Kategori kosong tetap boleh terlihat, tetapi harus menunjukkan empty state yang jelas.
- Hitungan produk harus dihitung dari data katalog aktif, bukan angka yang ditulis manual.
- Demo konseptual harus diberi label sebagai demo; jangan mengarang klien, testimoni, kontak, atau hasil.
- Detail produk harus menjelaskan platform, cara pemasangan, isi, batasan, lisensi, pembaruan, dan dukungan.
- Harga Rp49.000 di prototipe Bagusin Editorial hanyalah nilai uji, bukan harga jual.
- Checkout saat ini hanya simulasi; jangan mengklaim pembayaran, email, penyimpanan pesanan, atau pengiriman file otomatis.
- File XML belum dinyatakan kompatibel sampai diuji dengan impor ke blog Blogger uji.
- Halaman toko tetap `noindex,nofollow` sampai produk, lisensi, harga, dan alur transaksi disetujui.

## Alur yang diharapkan

Katalog → filter platform/jenis kebutuhan/industri → kartu visual → detail produk → demo → periksa lisensi dan apa yang termasuk → checkout atau permintaan bantuan pemasangan.

Layanan yang dikerjakan Bagus tetap punya jalur tersendiri dari katalog website di `/collections/`. Jangan membuat pelanggan mengira membeli file template sama dengan membeli website yang sudah dipasang dan siap digunakan.

## Handoff

- Homepage: PR #130, branch `ux/homepage-newest-carousel`. Audit statis lulus; browser smoke masih memiliki assertion yang gagal terkait copy homepage, CTA katalog, dan lokalisasi halaman destinasi. Belum merge/deploy.
- Katalog: PR #129, branch `feat/blogger-template-store-journey`. Filter platform, kebutuhan, dan industri telah ditambahkan; pemeriksaan browser CI terbaru sedang diverifikasi.
- Berikutnya: selesaikan browser smoke katalog, periksa tampilan mobile/desktop, lanjutkan penyelarasan halaman detail dan navigasi. Setelah fase roadmap selesai, lakukan audit gabungan atas PR tertunda sebelum memulai proyek baru.
