# Portal Masjid Al Ikhlash (MD Pajangan)
### Aplikasi Web Full-Stack PWA + REST API Google Apps Script & Google Sheets

Aplikasi web portal informasi, transparansi keuangan kas terbuka, donasi online, jadwal kajian, dan manajemen takmir untuk **Masjid Al Ikhlash (Pimpinan Ranting Muhammadiyah Pajangan, Yogyakarta)**.

---

## 🌟 Fitur Utama

1. **Beranda & Profil Masjid (M1):**
   - Hero foto arsitektur gedung masjid berpadu watermark lambang Muhammadiyah.
   - Widget hitung mundur waktu sholat real-time (Subuh, Terbit, Dzuhur, Ashar, Maghrib, Isya) wilayah DIY.
   - Tombol unduh Jadwal Imsakiyah & Sholat (PDF).
   - Slider galeri agenda dan dokumentasi kegiatan dengan rotasi otomatis setiap 2 detik.
   - Mutiara hikmah / hadits harian dengan tombol salin / bagikan instan.
   - Ringkasan cepat transparansi saldo kas masjid.

2. **Laporan Kas Transparan (M2):**
   - Kartu metrik bento: Saldo Kas Utama, Total Pemasukan (+), Total Pengeluaran (-).
   - Filter mutasi interaktif: pencarian teks, dropdown jenis mutasi, dan dropdown kategori transaksi.
   - Ekspor laporan ke Excel (CSV/XLS) dan cetak laporan PDF langsung di browser (khusus login Takmir).
   - Tambah, ubah, dan hapus mutasi kas secara langsung oleh Takmir.

3. **Infaq & Donasi Online (M3):**
   - Pemilihan program kebaikan (Operasional Masjid, Pembangunan Kubah, Santunan Yatim & Dhuafa, Wakaf Karpet).
   - Kartu rekening Bank Syariah Indonesia (BSI) dengan tombol salin 1-klik.
   - QRIS Standar Nasional bebas biaya admin.
   - Formulir konfirmasi transfer donatur dengan opsi anonim "Hamba Allah", chip nominal cepat, unggah bukti transfer gambar (auto-upload ke Google Drive), dan proteksi spam honeypot.
   - Verifikasi donasi oleh Takmir: donasi yang disetujui otomatis tercatat sebagai Pemasukan di buku kas!

4. **Jadwal Kegiatan & Kajian (M4):**
   - Filter kategori kegiatan (Semua, Kajian Rutin, Sholat Jumat, Sosial & Santunan, Remaja Masjid & TPA).
   - Pencarian judul kajian atau nama penceramah.
   - Tampilan ritme kalender rapi dan ramah ponsel.

5. **Profil Masjid & Struktur Pengurus (M5):**
   - Profil resmi, visi & misi keumatan, dan tautan langsung ke WhatsApp, Google Maps, dan Email.
   - Kisi 2 kolom kartu pengurus takmir dengan foto, jabatan, dan modal detail profil/kontak.

6. **Portal Takmir & Keamanan (M6):**
   - Autentikasi sesi HMAC-SHA256 stateless 12 jam.
   - Sandi dengan salt acak dan hash 300 putaran iteratif.
   - Proteksi brute-force (kunci otomatis 15 menit setelah 5x gagal).
   - Nol rahasia literal: seluruh credential disimpan di Google Apps Script Properties.

7. **Performa Tinggi & PWA:**
   - Single Page Application (SPA) murni dengan pergantian tab 0 ms (tanpa jeda/reload).
   - Caching Stale-While-Revalidate (SWR) dan deduplikasi request in-flight.
   - Service Worker (`sw.js`) dan `manifest.json` untuk pemasangan Add to Home Screen di ponsel (Android & iPhone).

---

## 📁 Struktur Berkas

```text
MD Pajangan/
├── index.html                   # Antarmuka SPA PWA utama
├── manifest.json                # Konfigurasi PWA Web App Manifest
├── sw.js                        # Pekerja latar belakang Service Worker
├── css/
│   └── style.css                # Gaya antarmuka Serambi Al Ikhlash
├── js/
│   ├── config.js                # Konfigurasi GAS_URL
│   └── app.js                   # Mesin logika klien, SWR, dan kontrol UI
├── assets/
│   ├── hero-masjid.png          # Foto hero arsitektur masjid
│   ├── logo.png                 # Logo Muhammadiyah / ikon masjid
│   ├── icon-192.png             # Ikon PWA 192x192
│   └── icon-512.png             # Ikon PWA 512x512
└── backend/
    ├── Kode.gs                  # REST API JSON Google Apps Script
    ├── Migrasi.gs               # Utilitas migrasi & sinkronisasi database
    ├── appsscript.json          # Manifes runtime GAS V8
    └── README_SETUP.md          # Panduan instalasi backend langkah-demi-langkah
```

---

## 🚀 Panduan Deploy Cepat ke GitHub Pages

1. Pastikan Git sudah terpasang di komputer Anda (`git --version`).
2. Masukkan URL hasil deploy backend Google Apps Script ke file `js/config.js`.
3. Buka terminal di folder proyek ini dan jalankan:
   ```bash
   git init
   git add .
   git commit -m "Deploy Portal Masjid Al Ikhlash"
   git branch -M main
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git push -u origin main
   ```
4. Di GitHub: Buka **Settings** repositori > **Pages** > pada Source pilih **Deploy from a branch** > branch `main` folder `/ (root)` > klik **Save**.
5. Situs Anda akan langsung online dan siap diakses jamaah!
