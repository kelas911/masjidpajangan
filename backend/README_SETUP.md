# Panduan Instalasi & Deploy Backend Google Apps Script (GAS)
## Portal Informasi & Manajemen Masjid Al Ikhlash (MD Pajangan)

Dokumen ini memandu Anda memasang backend REST API Google Apps Script dan Google Sheets secara otomatis tanpa konfigurasi rumit.

---

### Langkah 1: Buat Proyek Google Apps Script Baru
1. Buka browser dan kunjungi: [https://script.google.com/home](https://script.google.com/home).
2. Klik tombol **Proyek Baru** (New Project) di pojok kiri atas.
3. Beri nama proyek di kiri atas: `Backend Portal Masjid Al Ikhlash`.

---

### Langkah 2: Salin Berkas Backend
Proyek ini membutuhkan 3 berkas:

1. **`appsscript.json` (Manifest Proyek):**
   - Di bilah kiri, klik ikon roda gigi **Setelan Proyek** (Project Settings).
   - Centang opsi **Tampilkan file manifes "appsscript.json" di editor**.
   - Kembali ke Editor (ikon `< >`), buka file `appsscript.json`, timpa isinya dengan isi dari file `backend/appsscript.json`.

2. **`Kode.gs` (REST API JSON Engine):**
   - Buka file bawaan `Kode.gs` (atau buat jika belum ada).
   - Hapus semua isi bawaan, lalu salin seluruh isi dari file `backend/Kode.gs` lokal ke dalamnya.

3. **`Migrasi.gs` (Modul Migrasi & Sinkronisasi Database):**
   - Klik tanda **+** di samping Files > pilih **Script**.
   - Beri nama: `Migrasi.gs`.
   - Salin seluruh isi dari file `backend/Migrasi.gs` ke dalamnya.

4. Klik tombol **Simpan** (ikon disket) atau tekan `Ctrl + S`.

---

### Langkah 3: Jalankan Setup Otomatis (`setupAppEnvironment`)
Fungsi ini akan secara otomatis:
- Membuat folder Google Drive `📁 Portal Masjid Al Ikhlash Pajangan` beserta subfolder `Bukti Transfer Donasi` dan `Jadwal Sholat PDF`.
- Membuat Google Spreadsheet baru dengan 8 sheet lengkap (`Pengguna`, `ProfilMasjid`, `KasMasjid`, `Donasi`, `JadwalKegiatan`, `PengurusMasjid`, `GaleriKegiatan`, `JadwalSholatPDF`) yang sudah terformat dan terisi data awal realistis.
- Mengamankan ID spreadsheet, ID folder, dan membangkitkan `SESSION_SECRET` kriptografis di **Script Properties**.
- Membangkitkan kata sandi acak awal untuk Takmir Admin.

**Cara Menjalankan:**
1. Di bilah menu atas editor Apps Script, pada pilihan dropdown fungsi, pilih **`setupAppEnvironment`**.
2. Klik tombol **Jalankan** (Run).
3. Google akan meminta izin (Authorization required):
   - Klik **Tinjau Izin** (Review permissions).
   - Pilih akun Google Anda.
   - Klik **Lanjutan** (Advanced) di kiri bawah > klik **Buka Backend Portal Masjid Al Ikhlash (tidak aman)**.
   - Klik **Izinkan** (Allow).
4. Buka tab **Log Eksekusi** di bagian bawah.
5. **CATAT KREDENSIAL ADMIN YANG MUNCUL DI LOG:**
   ```text
   🔐 KREDENSIAL DEFAULT TAKMIR ADMIN:
      Username : admin
      Password : [KATA_SANDI_ACAK_ANDA]
   ```

---

### Langkah 4: Terapkan (Deploy) Sebagai Web App
1. Klik tombol **Terapkan** (Deploy) di kanan atas > **Penerapan Baru** (New deployment).
2. Klik ikon roda gigi di samping "Pilih jenis" > pilih **Aplikasi Web** (Web app).
3. Isi formulir penerapan:
   - **Deskripsi:** `Versi 2.1 Produksi`
   - **Jalankan sebagai (Execute as):** `Saya (email Anda)`
   - **Siapa yang memiliki akses (Who has access):** `Siapa saja (Anyone)` *(Penting agar frontend GitHub Pages dapat membaca & menulis data tanpa login akun Google)*
4. Klik **Terapkan** (Deploy).
5. Salin **URL Aplikasi Web** yang berakhiran `/exec`.
   Contoh format: `https://script.google.com/macros/s/AKfycbx.../exec`.

---

### Langkah 5: Hubungkan ke Frontend
1. Buka file `js/config.js` di folder proyek lokal Anda.
2. Masukkan URL yang disalin ke variabel `GAS_URL`:
   ```javascript
   const APP_CONFIG = {
     GAS_URL: 'https://script.google.com/macros/s/AKfycbx.../exec',
     APP_TITLE: 'Masjid Al Ikhlash',
     ...
   };
   ```
3. Simpan file `js/config.js`. Selesai! Web app frontend Anda kini terhubung 100% ke Google Sheets.
