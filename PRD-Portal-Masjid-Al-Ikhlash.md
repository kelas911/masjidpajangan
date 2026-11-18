# PRD Final: Portal Informasi & Manajemen Masjid Al Ikhlash

## 1. Ringkasan Eksekutif
Portal Masjid Al Ikhlash adalah aplikasi web publik yang ceria, ramah ponsel, dan mudah dipakai jamaah untuk melihat informasi masjid. Aplikasi ini juga menjadi alat kerja takmir untuk mengelola data kegiatan, pengurus, kas, dan donasi. Aplikasi dibangun di atas Google Apps Script dengan Google Sheets sebagai basis data, sehingga tidak memerlukan biaya server.

## 2. Tujuan Produk & Nilai Bisnis
- Memberi jamaah akses mudah ke jadwal sholat bulanan, kegiatan, dan informasi donasi.
- Meningkatkan transparansi kas masjid melalui ringkasan dan tabel laporan kas yang bisa dilihat publik.
- Memudahkan takmir mengelola data tanpa keahlian teknis, termasuk mengunduh laporan resmi.
- Mengurangi ketergantungan pada pengumuman manual di grup percakapan.

## 3. Pengguna Target & Matriks Hak Akses (RBAC)

| Fitur | Jamaah / Pengunjung (Publik) | Admin / Takmir |
|---|---|---|
| Lihat beranda, profil, galeri, jadwal sholat PDF | Ya | Ya |
| Lihat jadwal kegiatan dan struktur pengurus | Ya | Ya |
| Lihat ringkasan dan tabel laporan kas | Ya | Ya |
| Unduh laporan kas (Excel/PDF) | Tidak | Ya |
| Kirim form konfirmasi donasi | Ya | Ya |
| Kelola profil masjid dan info rekening | Tidak | Ya |
| Kelola galeri dan jadwal sholat PDF | Tidak | Ya |
| Kelola kegiatan dan struktur pengurus | Tidak | Ya |
| Kelola kas (tambah, ubah, hapus) | Tidak | Ya |
| Verifikasi donasi | Tidak | Ya |

Login hanya diperlukan untuk Admin. Kata sandi disimpan dalam bentuk hash dengan salt, dan sandi awal wajib diganti saat login pertama. Tombol unduh tidak ditampilkan kepada pengunjung publik, dan pemeriksaan hak akses juga dilakukan di sisi server, bukan hanya di tampilan.

## 4. Arsitektur Data & Integrasi Google Workspace

- **Google Sheets (8 sheet):** `Pengguna`, `ProfilMasjid`, `KasMasjid`, `Donasi`, `JadwalKegiatan`, `PengurusMasjid`, `GaleriKegiatan`, `JadwalSholatPDF`. Skema kolom mengikuti spesifikasi v3.
- **Google Drive:** Folder induk "Masjid Al Ikhlash" dengan subfolder untuk PDF jadwal sholat, foto pengurus, dan galeri. Berkas diberi akses baca publik agar bisa ditampilkan di halaman utama.
- **Alur otomatis:** Upload jadwal bulan baru mengubah jadwal lama menjadi `Arsip`. Donasi yang `Terverifikasi` otomatis tercatat sebagai `Pemasukan` di `KasMasjid`.
- **Ekspor laporan kas:** Excel dan PDF dibuat dari data kas yang sudah difilter dan hanya dapat dipicu oleh Admin yang sudah login.

## 5. Persyaratan Fungsional

**M1 Beranda & Profil Masjid**
- Identitas masjid dengan foto gedung sebagai hero, dengan latar bernuansa Muhammadiyah (logo hijau dan putih sebagai aksen atau pola latar).
- Galeri slider yang bergeser otomatis setiap 2 detik, hanya menampilkan foto berstatus `Aktif`.
- Jadwal sholat bulan aktif ditampilkan dalam pratinjau PDF beserta tombol unduh PDF jadwal.
- Admin dapat mengubah nama, alamat, kontak, dan info rekening.

**M2 Kas Masjid**
- Kartu ringkasan: total pemasukan, total pengeluaran, dan saldo akhir, terlihat oleh publik.
- **Tabel data kas** dengan kolom tanggal, jenis, kategori, keterangan, dan nominal, terlihat oleh publik.
- **Filter pencarian:** kolom pencarian teks, filter jenis (Pemasukan/Pengeluaran), kategori, dan rentang tanggal.
- **Tombol unduh Excel dan PDF:** hanya tampil dan berfungsi untuk Admin, mengikuti hasil filter yang sedang ditampilkan.
- Admin dapat menambah, mengubah, dan menghapus transaksi.

**M3 Donasi & Infaq**
- Informasi rekening dan form konfirmasi transfer untuk jamaah.
- Admin mengubah status donasi dari `Menunggu` ke `Terverifikasi`, dengan daftar yang bisa difilter.

**M4 Jadwal Kegiatan:** daftar kegiatan mendatang dengan kartu yang rapi di ponsel. Admin dapat mengelola data.

**M5 Struktur Pengurus:** kartu pengurus berisi foto, nama, jabatan, masa bakti, dan profil singkat, diurutkan sesuai kolom `Urutan`.

**M6 Panel Admin:** pengelolaan galeri, unggah jadwal sholat PDF, serta pengaturan lain sesuai hak akses.

## 6. Batasan Teknis & Mitigasi Kuota GAS
- **Batas eksekusi 6 menit:** Pembacaan data dilakukan secara batch dan hasilnya di-cache untuk halaman publik.
- **Ukuran file:** Foto diinput sebagai tautan URL atau unggahan gambar ringan ke Drive, dengan gambar cadangan jika tautan kosong atau gagal dimuat.
- **Iframe PDF:** Tampilan jadwal sholat lewat pratinjau Google Drive bisa diblokir pada beberapa browser. Perlu diuji dan disediakan tombol unduh sebagai cadangan.
- **Form publik:** Dilindungi dari spam dengan honeypot dan batas kiriman per waktu.
- **Ekspor Excel dan PDF:** Dibuat di sisi browser dengan pustaka ringan setelah verifikasi sesi Admin, sehingga tidak membebani server GAS.

## 7. Spesifikasi Tampilan & Antarmuka (UI/UX)
- **Nuansa:** ceria dan ramah di ponsel, dengan tata letak mobile-first dan tombol berukuran besar yang nyaman disentuh.
- **Palet warna:** Hijau Muhammadiyah sebagai warna utama, putih sebagai latar kartu, dan aksen kuning hangat untuk tombol penting. Teks harus memenuhi kontras yang cukup.
- **Latar:** Logo Muhammadiyah sebagai pola samar di latar belakang atau bagian hero, tidak menutupi informasi.
- **Foto:** Gunakan foto asli gedung Masjid Al Ikhlash (contoh: ikhlas.png) sebagai hero di beranda dan profil.
- **Tipografi:** Huruf sans-serif yang mudah dibaca di layar kecil.
- **Laporan kas:** Tabel dengan filter. Tombol unduh Excel/PDF hanya muncul untuk Admin. Tidak ada grafik.
- **Navigasi:** Menu bawah di ponsel dengan ikon dan label untuk Beranda, Kas, Donasi, Kegiatan, dan Pengurus.

## 8. Rencana Deployment & Tahapan Pengujian
1. Siapkan Google Sheets dan folder Drive, lalu isi data awal `ProfilMasjid` dan akun Admin dengan sandi yang sudah diganti.
2. Deploy Web App GAS (Execute as: Me, Who has access: Anyone).
3. Uji di ponsel Android dan iPhone, termasuk tampilan PDF, slider galeri, dan filter tabel kas.
4. Uji alur donasi: kirim konfirmasi, verifikasi oleh Admin, lalu cek pencatatan otomatis di kas.
5. Uji bahwa tombol unduh Excel/PDF tidak tampil dan tidak berfungsi bagi pengunjung, lalu uji unduhan dengan dan tanpa filter aktif saat login sebagai Admin.
6. Pastikan izin penggunaan logo Muhammadiyah sudah sesuai dengan ketentuan pengurus masjid.

---
🎨 **Tahapan Khusus: Penentuan Visual UI/UX**
1. Unggah Referensi: Silakan unggah referensi tangkapan layar, warna, dan gaya antarmuka yang diinginkan.
2. Jika Belum Ada Referensi Visual:
   - Salin seluruh teks dokumen PRD Final di atas.
   - Buka Google Stitch, lalu tempelkan teks PRD ke dalamnya.
   - Unduh hasil pratinjau desain visual yang dihasilkan oleh Google Stitch.
   - Unggah gambar hasil desain tersebut ke percakapan ini untuk diimplementasikan ke dalam kode HTML/CSS.
