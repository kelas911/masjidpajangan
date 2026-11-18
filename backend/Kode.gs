/**
 * ============================================================================
 * PORTAL MASJID AL IKHLASH (MD PAJANGAN) — BACKEND REST API JSON
 * Arsitektur: GAS-PRO-API + GAS-RAHASIA-SCRIPT-PROPERTIES + GAS-SCALE-TURBO
 * Standar: Pure REST API, No iFrame, SWR Caching, Stateless HMAC Auth, RBAC
 * ============================================================================
 */

const APP_VERSION = '2.1.0';
const SESI_JAM = 12; // Durasi masa aktif sesi admin (12 jam)

// ----------------------------------------------------------------------------
// 1. AKSES SATU PINTU SCRIPT PROPERTIES (GAS-RAHASIA-SCRIPT-PROPERTIES)
// ----------------------------------------------------------------------------
const PROPS = PropertiesService.getScriptProperties();
let _PROP_MEMO = null;

function prop_(key, def) {
  if (!_PROP_MEMO) _PROP_MEMO = PROPS.getProperties() || {};
  const v = _PROP_MEMO[key];
  return (v === undefined || v === null || v === '') ? (def === undefined ? '' : def) : v;
}

function setProp_(key, val) {
  PROPS.setProperty(key, String(val));
  if (_PROP_MEMO) _PROP_MEMO[key] = String(val);
}

function setProps_(obj) {
  PROPS.setProperties(obj);
  if (_PROP_MEMO) {
    Object.keys(obj).forEach(k => { _PROP_MEMO[k] = String(obj[k]); });
  }
}

function delProp_(key) {
  PROPS.deleteProperty(key);
  if (_PROP_MEMO) delete _PROP_MEMO[key];
}

const CONFIG = {
  get SPREADSHEET_ID() { return prop_('SPREADSHEET_ID'); },
  get ROOT_FOLDER_ID() { return prop_('ROOT_FOLDER_ID'); },
  get UPLOADS_FOLDER()  { return prop_('UPLOADS_FOLDER'); },
  get PDF_FOLDER()      { return prop_('PDF_FOLDER'); },
  SHEETS: {
    pengguna:        'Pengguna',
    profil:          'ProfilMasjid',
    kas:             'KasMasjid',
    donasi:          'Donasi',
    kegiatan:        'JadwalKegiatan',
    pengurus:        'PengurusMasjid',
    galeri:          'GaleriKegiatan',
    jadwalSholatPdf: 'JadwalSholatPDF'
  }
};

// ----------------------------------------------------------------------------
// 2. KRIPTOGRAFI, HASH ITERATIF & SESI HMAC STATELESS
// ----------------------------------------------------------------------------
function acak_(n, huruf) {
  huruf = huruf || 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let s = '';
  while (s.length < n) {
    const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, Utilities.getUuid());
    digest.forEach(b => { if (s.length < n) s += huruf[(b & 0xff) % huruf.length]; });
  }
  return s;
}

function sandiAcak_(n) {
  const s = acak_(n || 16);
  return /\d/.test(s) && /[A-Za-z]/.test(s) ? s : sandiAcak_(n);
}

function hashPass_(pass, salt) {
  let h = String(pass);
  for (let i = 0; i < 300; i++) {
    h = Utilities.base64Encode(Utilities.computeHmacSha256Signature(h + salt, salt));
  }
  return h;
}

function samaAman_(a, b) {
  a = String(a || '');
  b = String(b || '');
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

function secret_() {
  let s = prop_('SESSION_SECRET');
  if (!s) {
    s = acak_(64);
    setProp_('SESSION_SECRET', s);
  }
  return s;
}

function hmac_(s) {
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(s, secret_())).replace(/=+$/, '');
}

function signToken_(payload) {
  const body = Utilities.base64EncodeWebSafe(JSON.stringify(payload)).replace(/=+$/, '');
  return body + '.' + hmac_(body);
}

function buatSesi_(username, role, nama) {
  const now = Date.now();
  return signToken_({
    u: username,
    r: role || 'admin',
    n: nama || 'Takmir Masjid',
    i: now,
    x: now + SESI_JAM * 3600e3
  });
}

function verifyToken_(token) {
  try {
    const parts = String(token || '').split('.');
    if (parts.length !== 2 || !samaAman_(hmac_(parts[0]), parts[1])) return null;
    let b = parts[0];
    while (b.length % 4) b += '=';
    const jsonStr = Utilities.newBlob(Utilities.base64DecodeWebSafe(b)).getDataAsString();
    const p = JSON.parse(jsonStr);
    if (!p.x || p.x < Date.now()) return null;

    const rev = Number(CacheService.getScriptCache().get('rev_' + p.u) || prop_('REV_' + p.u) || 0);
    if (p.i < rev) return null; // Sesi telah dicabut

    return { username: p.u, role: p.r, nama: p.n, exp: p.x };
  } catch (err) {
    return null;
  }
}

function revokeAll_(username) {
  const t = String(Date.now());
  setProp_('REV_' + username, t);
  CacheService.getScriptCache().put('rev_' + username, t, 21600);
}

// ----------------------------------------------------------------------------
// 3. CACHEX & OPTIMASI PERFORMA SKALA TURBO (GAS-SCALE-TURBO)
// ----------------------------------------------------------------------------
const CacheX = {
  SZ: 50000,
  c: function () { return CacheService.getScriptCache(); },
  get: function (key) {
    try {
      const c = this.c();
      const head = c.get(key);
      if (head == null) return null;
      if (head.indexOf('__chunks:') !== 0) return JSON.parse(head);
      const n = +head.slice(9);
      const keys = [];
      for (let i = 0; i < n; i++) keys.push(key + '#' + i);
      const parts = c.getAll(keys);
      let s = '';
      for (let i = 0; i < n; i++) {
        if (parts[keys[i]] == null) return null;
        s += parts[keys[i]];
      }
      return JSON.parse(s);
    } catch (e) {
      return null;
    }
  },
  put: function (key, val, ttl) {
    try {
      ttl = ttl || 3600;
      const s = JSON.stringify(val);
      const c = this.c();
      if (s.length <= this.SZ) {
        c.put(key, s, ttl);
        return true;
      }
      const n = Math.ceil(s.length / this.SZ);
      if (n > 20) return false;
      const m = {};
      for (let i = 0; i < n; i++) m[key + '#' + i] = s.substr(i * this.SZ, this.SZ);
      c.putAll(m, ttl);
      c.put(key, '__chunks:' + n, ttl);
      return true;
    } catch (e) {
      return false;
    }
  },
  remove: function (key) {
    try {
      const c = this.c();
      const head = c.get(key);
      if (head && head.indexOf('__chunks:') === 0) {
        const n = +head.slice(9);
        const keys = [key];
        for (let i = 0; i < n; i++) keys.push(key + '#' + i);
        c.removeAll(keys);
      } else {
        c.remove(key);
      }
    } catch (e) {}
  }
};

function bump(scope) {
  const now = String(Date.now());
  CacheService.getScriptCache().put('ver_' + (scope || 'global'), now, 21600);
}

function getCacheVersion(scope) {
  return CacheService.getScriptCache().get('ver_' + (scope || 'global')) || '0';
}

// ----------------------------------------------------------------------------
// 4. ENTRY POINTS — doGet & doPost (Pure JSON)
// ----------------------------------------------------------------------------
function doGet(e) {
  const t0 = Date.now();
  let res;
  try {
    const action = (e && e.parameter && e.parameter.action) || 'getPublicData';
    if (action === 'getPublicData') {
      res = getPublicDataBundle();
    } else if (action === 'getKas') {
      res = getKasList(e.parameter);
    } else if (action === 'getKegiatan') {
      res = getKegiatanList();
    } else if (action === 'getPengurus') {
      res = getPengurusList();
    } else if (action === 'ping') {
      res = { success: true, message: 'Portal Masjid Al Ikhlash API Ready', version: APP_VERSION };
    } else {
      res = { success: false, message: 'Action doGet tidak dikenal: ' + action };
    }
  } catch (err) {
    res = { success: false, message: err.message || String(err) };
  }

  res.ms = Date.now() - t0;
  res.v = APP_VERSION;
  return buildResponse(res);
}

function doPost(e) {
  const t0 = Date.now();
  let res;
  try {
    const rawContent = (e && e.postData && e.postData.contents) || '{}';
    const payload = JSON.parse(rawContent);
    const action = payload.action;

    // Public actions
    if (action === 'submitDonasi') {
      res = submitDonasiPublic(payload.data);
    } else if (action === 'loginAdmin') {
      res = handleLoginAdmin(payload.data);
    }
    // Protected Admin Actions (Require Valid Session Token)
    else {
      const auth = verifyToken_(payload.token);
      if (!auth) {
        return buildResponse({ success: false, code: 'UNAUTHORIZED', message: 'Sesi login tidak sah atau sudah kedaluwarsa. Silakan login kembali.' });
      }

      if (action === 'verifyDonasi') {
        res = verifyDonasiAdmin(payload.data, auth);
      } else if (action === 'saveKas') {
        res = saveKasAdmin(payload.data, auth);
      } else if (action === 'deleteKas') {
        res = deleteKasAdmin(payload.data, auth);
      } else if (action === 'saveKegiatan') {
        res = saveKegiatanAdmin(payload.data, auth);
      } else if (action === 'deleteKegiatan') {
        res = deleteKegiatanAdmin(payload.data, auth);
      } else if (action === 'savePengurus') {
        res = savePengurusAdmin(payload.data, auth);
      } else if (action === 'deletePengurus') {
        res = deletePengurusAdmin(payload.data, auth);
      } else if (action === 'saveGaleri') {
        res = saveGaleriAdmin(payload.data, auth);
      } else if (action === 'deleteGaleri') {
        res = deleteGaleriAdmin(payload.data, auth);
      } else if (action === 'saveProfil') {
        res = saveProfilAdmin(payload.data, auth);
      } else if (action === 'uploadJadwalPdf') {
        res = uploadJadwalPdfAdmin(payload.data, auth);
      } else if (action === 'gantiPassword') {
        res = gantiPasswordAdmin(payload.data, auth);
      } else if (action === 'getAdminData') {
        res = getAdminDataBundle(auth);
      } else {
        res = { success: false, message: 'Action doPost tidak dikenal: ' + action };
      }
    }
  } catch (err) {
    res = { success: false, message: err.message || String(err) };
  }

  res.ms = Date.now() - t0;
  res.v = APP_VERSION;
  return buildResponse(res);
}

function buildResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ----------------------------------------------------------------------------
// 5. DATA ACCESS HELPERS & SHEETS MANAGEMENT
// ----------------------------------------------------------------------------
function getSpreadsheet_() {
  const id = CONFIG.SPREADSHEET_ID;
  if (!id) throw new Error('SPREADSHEET_ID belum diatur. Jalankan setupAppEnvironment() terlebih dahulu.');
  return SpreadsheetApp.openById(id);
}

function getSheet_(name) {
  const ss = getSpreadsheet_();
  const sh = ss.getSheetByName(name);
  if (!sh) throw new Error('Sheet "' + name + '" tidak ditemukan pada database.');
  return sh;
}

function readAllRows_(sheetName) {
  const sh = getSheet_(sheetName);
  const v = sh.getDataRange().getValues();
  if (v.length <= 1) return [];
  const headers = v[0].map(String);
  const rows = [];
  for (let r = 1; r < v.length; r++) {
    const row = v[r];
    if (row.join('').trim() === '') continue; // Skip baris kosong
    const obj = {};
    headers.forEach((h, i) => { if (h) obj[h] = row[i]; });
    rows.push(obj);
  }
  return rows;
}

// ----------------------------------------------------------------------------
// 6. BUSINESS LOGIC: PUBLIC BUNDLE & QUERIES (SWR / FAST READ)
// ----------------------------------------------------------------------------
function getPublicDataBundle() {
  const ver = getCacheVersion('global');
  const cacheKey = 'pub_bundle_v' + ver;
  const cached = CacheX.get(cacheKey);
  if (cached) {
    cached.fromCache = true;
    return cached;
  }

  // 1. Profil Masjid (Key-Value)
  const profilRows = readAllRows_(CONFIG.SHEETS.profil);
  const profil = {};
  profilRows.forEach(r => { if (r.key) profil[r.key] = r.value; });

  // 2. Kas Masjid & Ringkasan Keuangan
  const kasRows = readAllRows_(CONFIG.SHEETS.kas);
  let totalPemasukan = 0;
  let totalPengeluaran = 0;
  const kasSorted = kasRows.map(r => {
    const nom = Number(r.nominal) || 0;
    if (String(r.jenis).toLowerCase().trim() === 'pemasukan') {
      totalPemasukan += nom;
    } else {
      totalPengeluaran += nom;
    }
    return {
      id: r.id,
      tanggal: formatDate_(r.tanggal),
      jenis: r.jenis,
      kategori: r.kategori,
      keterangan: r.keterangan,
      nominal: nom,
      metode: r.metode || 'Kas'
    };
  }).reverse(); // Terbaru di atas

  const saldo = totalPemasukan - totalPengeluaran;

  // 3. Kegiatan Aktif (Upcoming)
  const kegiatanRows = readAllRows_(CONFIG.SHEETS.kegiatan)
    .filter(k => String(k.status).toLowerCase() !== 'nonaktif')
    .map(k => ({
      id: k.id,
      judul: k.judul,
      kategori: k.kategori,
      tanggal: formatDate_(k.tanggal),
      waktu_mulai: k.waktu_mulai ? String(k.waktu_mulai).slice(0, 5) : '',
      waktu_selesai: k.waktu_selesai ? String(k.waktu_selesai).slice(0, 5) : '',
      penceramah: k.penceramah || '',
      lokasi: k.lokasi || 'Masjid Al Ikhlash',
      keterangan: k.keterangan || '',
      poster_url: k.poster_url || '',
      status: k.status || 'Aktif'
    }));

  // 4. Pengurus Masjid (Urutan)
  const pengurusRows = readAllRows_(CONFIG.SHEETS.pengurus)
    .filter(p => String(p.status).toLowerCase() !== 'nonaktif')
    .sort((a, b) => (Number(a.urutan) || 99) - (Number(b.urutan) || 99))
    .map(p => ({
      id: p.id,
      nama: p.nama,
      jabatan: p.jabatan,
      masa_bakti: p.masa_bakti,
      profil_singkat: p.profil_singkat || '',
      foto_url: p.foto_url || '',
      no_wa: p.no_wa || '',
      urutan: Number(p.urutan) || 1
    }));

  // 5. Galeri Slider Aktif
  const galeriRows = readAllRows_(CONFIG.SHEETS.galeri)
    .filter(g => String(g.status).toLowerCase() !== 'nonaktif')
    .sort((a, b) => (Number(a.urutan) || 99) - (Number(b.urutan) || 99))
    .map(g => ({
      id: g.id,
      judul: g.judul,
      keterangan: g.keterangan || '',
      foto_url: g.foto_url || '',
      urutan: Number(g.urutan) || 1
    }));

  // 6. Jadwal Sholat PDF Aktif
  const jadwalPdfRows = readAllRows_(CONFIG.SHEETS.jadwalSholatPdf)
    .filter(j => String(j.status).toLowerCase() === 'aktif');
  const jadwalPdfAktif = jadwalPdfRows.length ? jadwalPdfRows[jadwalPdfRows.length - 1] : null;

  const result = {
    success: true,
    data: {
      profil: profil,
      keuangan: {
        totalPemasukan: totalPemasukan,
        totalPengeluaran: totalPengeluaran,
        saldo: saldo,
        transaksi: kasSorted
      },
      kegiatan: kegiatanRows,
      pengurus: pengurusRows,
      galeri: galeriRows,
      jadwalPdf: jadwalPdfAktif
    }
  };

  CacheX.put(cacheKey, result, 3600);
  return result;
}

function getKasList(param) {
  const bundle = getPublicDataBundle();
  return {
    success: true,
    data: bundle.data.keuangan
  };
}

function getKegiatanList() {
  const bundle = getPublicDataBundle();
  return {
    success: true,
    data: bundle.data.kegiatan
  };
}

function getPengurusList() {
  const bundle = getPublicDataBundle();
  return {
    success: true,
    data: bundle.data.pengurus
  };
}

function formatDate_(val) {
  if (!val) return '';
  if (val instanceof Date) {
    return Utilities.formatDate(val, 'Asia/Jakarta', 'yyyy-MM-dd');
  }
  return String(val).split('T')[0];
}

// ----------------------------------------------------------------------------
// 7. BUSINESS LOGIC: DONASI PUBLIK & UPLOAD BUKTI KE GOOGLE DRIVE
// ----------------------------------------------------------------------------
function submitDonasiPublic(data) {
  if (!data) throw new Error('Data donasi tidak boleh kosong.');
  if (data.hp_check) {
    // Honeypot anti-spam terpicu
    return { success: true, message: 'Donasi berhasil diterima (HP).' };
  }

  const nominal = Number(data.nominal);
  if (!nominal || nominal < 1000) {
    throw new Error('Nominal donasi minimal Rp 1.000.');
  }

  // Upload bukti transfer jika dikirim dalam bentuk base64
  let buktiUrl = data.bukti_url || '';
  if (data.bukti_base64 && CONFIG.UPLOADS_FOLDER) {
    try {
      const folder = DriveApp.getFolderById(CONFIG.UPLOADS_FOLDER);
      const parts = data.bukti_base64.split(';base64,');
      const contentType = parts.length > 1 ? parts[0].replace('data:', '') : 'image/jpeg';
      const base64Data = parts.length > 1 ? parts[1] : parts[0];
      const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), contentType, 'bukti_' + Date.now() + '.jpg');
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      buktiUrl = file.getUrl();
    } catch (e) {
      Logger.log('Gagal upload bukti transfer: ' + e.message);
    }
  }

  const sh = getSheet_(CONFIG.SHEETS.donasi);
  const idDonasi = 'DON-' + Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyMMdd') + '-' + acak_(4, '1234567890');
  const now = new Date();
  const tanggal = data.tanggal ? formatDate_(new Date(data.tanggal)) : formatDate_(now);

  sh.appendRow([
    idDonasi,
    tanggal,
    data.program || 'Infaq Umum',
    data.nama_donatur || 'Hamba Allah',
    data.no_wa || '',
    nominal,
    data.metode_transfer || 'Transfer Bank BSI',
    buktiUrl,
    data.doa_pesan || '',
    'Menunggu',
    '',
    '',
    Utilities.formatDate(now, 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss')
  ]);

  bump('global');
  return {
    success: true,
    message: 'Alhamdulillah, konfirmasi donasi Anda telah kami terima. Takmir akan segera memverifikasinya. Jazakumullah khairan katsiran.',
    idDonasi: idDonasi
  };
}

// ----------------------------------------------------------------------------
// 8. AUTENTIKASI TAKMIR / ADMIN & PENCEGAHAN BRUTE-FORCE
// ----------------------------------------------------------------------------
function handleLoginAdmin(data) {
  if (!data || !data.username || !data.password) {
    throw new Error('Username dan kata sandi wajib diisi.');
  }

  const usernameInput = String(data.username).trim().toLowerCase();
  const passInput = String(data.password);

  // Cek penguncian lockout darurat
  const lockKey = 'KUNCI_' + usernameInput;
  const lockUntil = Number(prop_(lockKey) || 0);
  if (lockUntil && Date.now() < lockUntil) {
    const sisaMenit = Math.ceil((lockUntil - Date.now()) / 60000);
    return { success: false, message: 'Akun terkunci sementara karena beberapa kali percobaan gagal. Coba lagi dalam ' + sisaMenit + ' menit.' };
  }

  // 1. Cek dari sheet Pengguna
  const users = readAllRows_(CONFIG.SHEETS.pengguna);
  let matchedUser = users.find(u => String(u.username).trim().toLowerCase() === usernameInput && String(u.status).toLowerCase() === 'aktif');

  // 2. Fallback darurat (Emergency Script Properties)
  let isDarurat = false;
  if (!matchedUser && usernameInput === prop_('EMERGENCY_USER', 'darurat')) {
    const salt = prop_('EMERGENCY_SALT');
    const hash = prop_('EMERGENCY_PASS_HASH');
    if (salt && hash && samaAman_(hashPass_(passInput, salt), hash)) {
      matchedUser = { username: 'darurat', role: 'admin', nama: 'Admin Darurat', wajib_ganti_pass: '0' };
      isDarurat = true;
    }
  }

  let passValid = false;
  if (matchedUser && !isDarurat) {
    const salt = matchedUser.salt;
    const expectedHash = matchedUser.password_hash;
    passValid = samaAman_(hashPass_(passInput, salt), expectedHash);
  } else if (isDarurat) {
    passValid = true;
  }

  if (!matchedUser || !passValid) {
    // Catat percobaan gagal
    const failKey = 'FAIL_' + usernameInput;
    const fails = Number(prop_(failKey) || 0) + 1;
    setProp_(failKey, fails);
    if (fails >= 5) {
      setProp_(lockKey, Date.now() + 15 * 60000); // Kunci 15 menit
      delProp_(failKey);
      return { success: false, message: 'Terlalu banyak percobaan sandi salah. Akun dikunci selama 15 menit demi keamanan.' };
    }
    return { success: false, message: 'Username atau kata sandi tidak sesuai. (' + fails + '/5)' };
  }

  // Login Berhasil — Reset counter kegagalan
  delProp_('FAIL_' + usernameInput);
  delProp_(lockKey);

  const token = buatSesi_(matchedUser.username, matchedUser.role, matchedUser.nama);
  return {
    success: true,
    message: 'Login berhasil. Selamat bertugas Takmir Masjid!',
    token: token,
    user: {
      username: matchedUser.username,
      nama: matchedUser.nama,
      role: matchedUser.role,
      wajibGantiPass: String(matchedUser.wajib_ganti_pass) === '1'
    }
  };
}

function gantiPasswordAdmin(data, auth) {
  if (!data || !data.passwordBaru || data.passwordBaru.length < 8) {
    throw new Error('Kata sandi baru minimal 8 karakter.');
  }

  const sh = getSheet_(CONFIG.SHEETS.pengguna);
  const rows = sh.getDataRange().getValues();
  const headers = rows[0].map(String);
  const uIdx = headers.indexOf('username');
  const hIdx = headers.indexOf('password_hash');
  const sIdx = headers.indexOf('salt');
  const wIdx = headers.indexOf('wajib_ganti_pass');

  let found = false;
  for (let r = 1; r < rows.length; r++) {
    if (String(rows[r][uIdx]).toLowerCase().trim() === auth.username.toLowerCase().trim()) {
      const newSalt = Utilities.getUuid();
      const newHash = hashPass_(data.passwordBaru, newSalt);
      sh.getRange(r + 1, hIdx + 1).setValue(newHash);
      sh.getRange(r + 1, sIdx + 1).setValue(newSalt);
      if (wIdx > -1) sh.getRange(r + 1, wIdx + 1).setValue('0');
      found = true;
      break;
    }
  }

  if (!found) throw new Error('Pengguna tidak ditemukan di database.');
  return { success: true, message: 'Kata sandi berhasil diperbarui.' };
}

// ----------------------------------------------------------------------------
// 9. PROTECTED TAKMIR ACTIONS: VERIFIKASI DONASI (AUTO-POST KE KAS MASJID)
// ----------------------------------------------------------------------------
function verifyDonasiAdmin(data, auth) {
  if (!data || !data.idDonasi || !data.status) {
    throw new Error('ID Donasi dan status baru wajib dikirim.');
  }

  const shDonasi = getSheet_(CONFIG.SHEETS.donasi);
  const vDonasi = shDonasi.getDataRange().getValues();
  const hDonasi = vDonasi[0].map(String);
  const idIdx = hDonasi.indexOf('id');
  const stIdx = hDonasi.indexOf('status');
  const catIdx = hDonasi.indexOf('catatan_takmir');
  const verIdx = hDonasi.indexOf('verified_at');

  let targetRow = -1;
  let donasiObj = null;

  for (let r = 1; r < vDonasi.length; r++) {
    if (String(vDonasi[r][idIdx]) === String(data.idDonasi)) {
      targetRow = r + 1;
      donasiObj = {};
      hDonasi.forEach((h, i) => { donasiObj[h] = vDonasi[r][i]; });
      break;
    }
  }

  if (targetRow === -1) throw new Error('Data donasi tidak ditemukan.');

  const statusBaru = data.status === 'Terverifikasi' ? 'Terverifikasi' : 'Ditolak';
  shDonasi.getRange(targetRow, stIdx + 1).setValue(statusBaru);
  if (catIdx > -1) shDonasi.getRange(targetRow, catIdx + 1).setValue(data.catatan || '');
  if (verIdx > -1) shDonasi.getRange(targetRow, verIdx + 1).setValue(Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss'));

  // ALUR OTOMATIS: Jika Terverifikasi, catat otomatis ke KasMasjid sebagai Pemasukan!
  let autoKasId = '';
  if (statusBaru === 'Terverifikasi') {
    const shKas = getSheet_(CONFIG.SHEETS.kas);
    autoKasId = 'KAS-IN-' + Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyMMdd') + '-' + acak_(4, '1234567890');
    shKas.appendRow([
      autoKasId,
      donasiObj.tanggal || formatDate_(new Date()),
      'Pemasukan',
      donasiObj.program || 'Infaq Donasi',
      'Infaq dari ' + (donasiObj.nama_donatur || 'Hamba Allah') + ' (' + data.idDonasi + ')',
      Number(donasiObj.nominal) || 0,
      donasiObj.metode_transfer || 'Transfer Bank',
      auth.nama || 'Takmir',
      Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss')
    ]);
  }

  bump('global');
  return {
    success: true,
    message: 'Status donasi berhasil diubah menjadi ' + statusBaru + (autoKasId ? ' dan otomatis dicatat ke Kas Masjid (' + autoKasId + ').' : '.')
  };
}

// ----------------------------------------------------------------------------
// 10. PROTECTED TAKMIR ACTIONS: KELOLA KAS, KEGIATAN, PENGURUS, PROFIL
// ----------------------------------------------------------------------------
function saveKasAdmin(data, auth) {
  if (!data || !data.jenis || !data.nominal) {
    throw new Error('Jenis transaksi dan nominal wajib diisi.');
  }

  const sh = getSheet_(CONFIG.SHEETS.kas);
  const rows = sh.getDataRange().getValues();
  const headers = rows[0].map(String);
  const idIdx = headers.indexOf('id');

  const now = new Date();
  const id = data.id || ('KAS-' + (data.jenis === 'Pemasukan' ? 'IN-' : 'OUT-') + Utilities.formatDate(now, 'Asia/Jakarta', 'yyMMdd') + '-' + acak_(4, '1234567890'));
  const tanggal = data.tanggal ? formatDate_(new Date(data.tanggal)) : formatDate_(now);

  let existingRow = -1;
  if (data.id) {
    for (let r = 1; r < rows.length; r++) {
      if (String(rows[r][idIdx]) === String(data.id)) {
        existingRow = r + 1;
        break;
      }
    }
  }

  const rowValues = [
    id,
    tanggal,
    data.jenis === 'Pemasukan' ? 'Pemasukan' : 'Pengeluaran',
    data.kategori || 'Lain-lain',
    data.keterangan || '',
    Number(data.nominal) || 0,
    data.metode || 'Kas Fisik',
    auth.nama || 'Takmir',
    Utilities.formatDate(now, 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss')
  ];

  if (existingRow > -1) {
    sh.getRange(existingRow, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sh.appendRow(rowValues);
  }

  bump('global');
  return { success: true, message: 'Transaksi kas berhasil disimpan.', id: id };
}

function deleteKasAdmin(data, auth) {
  if (!data || !data.id) throw new Error('ID transaksi kas wajib dikirim.');
  const sh = getSheet_(CONFIG.SHEETS.kas);
  const rows = sh.getDataRange().getValues();
  const idIdx = rows[0].map(String).indexOf('id');

  for (let r = 1; r < rows.length; r++) {
    if (String(rows[r][idIdx]) === String(data.id)) {
      sh.deleteRow(r + 1);
      bump('global');
      return { success: true, message: 'Transaksi kas ' + data.id + ' berhasil dihapus.' };
    }
  }
  throw new Error('Transaksi kas tidak ditemukan.');
}

function saveKegiatanAdmin(data, auth) {
  if (!data || !data.judul || !data.tanggal) {
    throw new Error('Judul dan tanggal kegiatan wajib diisi.');
  }

  const sh = getSheet_(CONFIG.SHEETS.kegiatan);
  const rows = sh.getDataRange().getValues();
  const headers = rows[0].map(String);
  const idIdx = headers.indexOf('id');

  const now = new Date();
  const id = data.id || ('ACT-' + Utilities.formatDate(now, 'Asia/Jakarta', 'yyMMdd') + '-' + acak_(4, '1234567890'));
  const tanggal = formatDate_(new Date(data.tanggal));

  let existingRow = -1;
  if (data.id) {
    for (let r = 1; r < rows.length; r++) {
      if (String(rows[r][idIdx]) === String(data.id)) {
        existingRow = r + 1;
        break;
      }
    }
  }

  const rowValues = [
    id,
    data.judul,
    data.kategori || 'Kajian Rutin',
    tanggal,
    data.waktu_mulai || '19:30',
    data.waktu_selesai || '21:00',
    data.penceramah || '',
    data.lokasi || 'Masjid Al Ikhlash',
    data.keterangan || '',
    data.poster_url || '',
    data.status || 'Aktif',
    Utilities.formatDate(now, 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss')
  ];

  if (existingRow > -1) {
    sh.getRange(existingRow, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sh.appendRow(rowValues);
  }

  bump('global');
  return { success: true, message: 'Jadwal kegiatan berhasil disimpan.', id: id };
}

function deleteKegiatanAdmin(data, auth) {
  if (!data || !data.id) throw new Error('ID kegiatan wajib dikirim.');
  const sh = getSheet_(CONFIG.SHEETS.kegiatan);
  const rows = sh.getDataRange().getValues();
  const idIdx = rows[0].map(String).indexOf('id');

  for (let r = 1; r < rows.length; r++) {
    if (String(rows[r][idIdx]) === String(data.id)) {
      sh.deleteRow(r + 1);
      bump('global');
      return { success: true, message: 'Kegiatan berhasil dihapus.' };
    }
  }
  throw new Error('Kegiatan tidak ditemukan.');
}

function savePengurusAdmin(data, auth) {
  if (!data || !data.nama || !data.jabatan) {
    throw new Error('Nama dan jabatan pengurus wajib diisi.');
  }

  const sh = getSheet_(CONFIG.SHEETS.pengurus);
  const rows = sh.getDataRange().getValues();
  const headers = rows[0].map(String);
  const idIdx = headers.indexOf('id');

  const now = new Date();
  const id = data.id || ('TAK-' + acak_(6, '1234567890'));

  let existingRow = -1;
  if (data.id) {
    for (let r = 1; r < rows.length; r++) {
      if (String(rows[r][idIdx]) === String(data.id)) {
        existingRow = r + 1;
        break;
      }
    }
  }

  const rowValues = [
    id,
    data.nama,
    data.jabatan,
    data.masa_bakti || '2024 - 2028',
    data.profil_singkat || '',
    data.foto_url || '',
    data.no_wa || '',
    Number(data.urutan) || 10,
    data.status || 'Aktif',
    Utilities.formatDate(now, 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss')
  ];

  if (existingRow > -1) {
    sh.getRange(existingRow, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sh.appendRow(rowValues);
  }

  bump('global');
  return { success: true, message: 'Data pengurus berhasil disimpan.', id: id };
}

function deletePengurusAdmin(data, auth) {
  if (!data || !data.id) throw new Error('ID pengurus wajib dikirim.');
  const sh = getSheet_(CONFIG.SHEETS.pengurus);
  const rows = sh.getDataRange().getValues();
  const idIdx = rows[0].map(String).indexOf('id');

  for (let r = 1; r < rows.length; r++) {
    if (String(rows[r][idIdx]) === String(data.id)) {
      sh.deleteRow(r + 1);
      bump('global');
      return { success: true, message: 'Data pengurus berhasil dihapus.' };
    }
  }
  throw new Error('Pengurus tidak ditemukan.');
}

function saveGaleriAdmin(data, auth) {
  if (!data || !data.judul || !data.foto_url) {
    throw new Error('Judul dan URL foto galeri wajib diisi.');
  }

  const sh = getSheet_(CONFIG.SHEETS.galeri);
  const rows = sh.getDataRange().getValues();
  const headers = rows[0].map(String);
  const idIdx = headers.indexOf('id');

  const now = new Date();
  const id = data.id || ('GAL-' + acak_(6, '1234567890'));

  let existingRow = -1;
  if (data.id) {
    for (let r = 1; r < rows.length; r++) {
      if (String(rows[r][idIdx]) === String(data.id)) {
        existingRow = r + 1;
        break;
      }
    }
  }

  const rowValues = [
    id,
    data.judul,
    data.keterangan || '',
    data.foto_url,
    Number(data.urutan) || 1,
    data.status || 'Aktif',
    Utilities.formatDate(now, 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss')
  ];

  if (existingRow > -1) {
    sh.getRange(existingRow, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sh.appendRow(rowValues);
  }

  bump('global');
  return { success: true, message: 'Galeri berhasil disimpan.', id: id };
}

function deleteGaleriAdmin(data, auth) {
  if (!data || !data.id) throw new Error('ID galeri wajib dikirim.');
  const sh = getSheet_(CONFIG.SHEETS.galeri);
  const rows = sh.getDataRange().getValues();
  const idIdx = rows[0].map(String).indexOf('id');

  for (let r = 1; r < rows.length; r++) {
    if (String(rows[r][idIdx]) === String(data.id)) {
      sh.deleteRow(r + 1);
      bump('global');
      return { success: true, message: 'Foto galeri berhasil dihapus.' };
    }
  }
  throw new Error('Foto galeri tidak ditemukan.');
}

function saveProfilAdmin(data, auth) {
  if (!data || typeof data !== 'object') throw new Error('Data profil tidak valid.');
  const sh = getSheet_(CONFIG.SHEETS.profil);
  const rows = sh.getDataRange().getValues();
  const keyIdx = rows[0].map(String).indexOf('key');
  const valIdx = rows[0].map(String).indexOf('value');

  const keyToRow = {};
  for (let r = 1; r < rows.length; r++) {
    const k = String(rows[r][keyIdx]).trim();
    if (k) keyToRow[k] = r + 1;
  }

  Object.keys(data).forEach(k => {
    if (keyToRow[k]) {
      sh.getRange(keyToRow[k], valIdx + 1).setValue(String(data[k]));
    } else {
      sh.appendRow([k, String(data[k]), 'Pengaturan Profil Takmir']);
    }
  });

  bump('global');
  return { success: true, message: 'Profil masjid & rekening berhasil diperbarui.' };
}

function uploadJadwalPdfAdmin(data, auth) {
  if (!data || !data.bulan_tahun) {
    throw new Error('Bulan & tahun jadwal wajib diisi.');
  }

  let fileUrl = data.file_url || '';
  let downloadUrl = data.download_url || fileUrl;
  let fileId = '';

  // Handle PDF base64 upload if provided
  if (data.pdf_base64 && CONFIG.PDF_FOLDER) {
    try {
      const folder = DriveApp.getFolderById(CONFIG.PDF_FOLDER);
      const parts = data.pdf_base64.split(';base64,');
      const base64Data = parts.length > 1 ? parts[1] : parts[0];
      const blob = Utilities.newBlob(
        Utilities.base64Decode(base64Data),
        'application/pdf',
        'Jadwal_Sholat_' + data.bulan_tahun.replace(/\s+/g, '_') + '.pdf'
      );
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fileId = file.getId();
      fileUrl = file.getUrl();
      downloadUrl = 'https://drive.google.com/uc?export=download&id=' + fileId;
    } catch (e) {
      Logger.log('Gagal upload PDF ke Drive: ' + e.message);
    }
  }

  const sh = getSheet_(CONFIG.SHEETS.jadwalSholatPdf);
  const rows = sh.getDataRange().getValues();
  const headers = rows[0].map(String);
  const stIdx = headers.indexOf('status');

  // ALUR OTOMATIS: Ubah jadwal lama yang berstatus 'Aktif' menjadi 'Arsip'
  for (let r = 1; r < rows.length; r++) {
    if (String(rows[r][stIdx]).toLowerCase() === 'aktif') {
      sh.getRange(r + 1, stIdx + 1).setValue('Arsip');
    }
  }

  const newId = 'PDF-' + Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyMM') + '-' + acak_(4, '1234567890');
  sh.appendRow([
    newId,
    data.bulan_tahun,
    fileId,
    fileUrl,
    downloadUrl,
    'Aktif',
    Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss')
  ]);

  bump('global');
  return { success: true, message: 'Jadwal sholat PDF baru berhasil dipublikasikan dan jadwal lama telah diarsipkan.' };
}

function getAdminDataBundle(auth) {
  const donasiRows = readAllRows_(CONFIG.SHEETS.donasi).reverse();
  const publicBundle = getPublicDataBundle();

  return {
    success: true,
    data: {
      public: publicBundle.data,
      donasiList: donasiRows,
      adminUser: {
        username: auth.username,
        nama: auth.nama,
        role: auth.role
      }
    }
  };
}

// ----------------------------------------------------------------------------
// 11. AUTO-SETUP ENVIRONMENT IDEMPOTEN (Jalankan Sekali di Script Editor)
// ----------------------------------------------------------------------------
function setupAppEnvironment() {
  const APP_NAME = 'Portal Masjid Al Ikhlash Pajangan';
  Logger.log('🚀 Memulai inisialisasi lingkungan untuk: ' + APP_NAME);

  // 1. Bangun / Ambil Folder Google Drive
  let rootFolder;
  const rootId = prop_('ROOT_FOLDER_ID');
  if (rootId) {
    try { rootFolder = DriveApp.getFolderById(rootId); } catch (e) {}
  }
  if (!rootFolder) {
    rootFolder = DriveApp.createFolder('📁 ' + APP_NAME);
    rootFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  }

  let uploadsFolder;
  const upId = prop_('UPLOADS_FOLDER');
  if (upId) {
    try { uploadsFolder = DriveApp.getFolderById(upId); } catch (e) {}
  }
  if (!uploadsFolder) {
    uploadsFolder = rootFolder.createFolder('📂 Bukti Transfer Donasi');
    uploadsFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  }

  let pdfFolder;
  const pdfId = prop_('PDF_FOLDER');
  if (pdfId) {
    try { pdfFolder = DriveApp.getFolderById(pdfId); } catch (e) {}
  }
  if (!pdfFolder) {
    pdfFolder = rootFolder.createFolder('📂 Jadwal Sholat & Dokumen PDF');
    pdfFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  }

  // 2. Bangun / Buka Google Spreadsheet Database
  let ss;
  const ssId = prop_('SPREADSHEET_ID');
  if (ssId) {
    try { ss = SpreadsheetApp.openById(ssId); } catch (e) {}
  }
  if (!ss) {
    ss = SpreadsheetApp.create('🗃️ Database — ' + APP_NAME);
    DriveApp.getFileById(ss.getId()).moveTo(rootFolder);
  }

  // Helper pembuat sheet dengan header & format
  function ensureSheet(name, headers, initialRows) {
    let sh = ss.getSheetByName(name);
    if (!sh) {
      sh = ss.insertSheet(name);
      sh.appendRow(headers);
      sh.getRange(1, 1, 1, headers.length)
        .setBackground('#0B5D36')
        .setFontColor('#FFFFFF')
        .setFontWeight('bold');
      sh.setFrozenRows(1);

      if (initialRows && initialRows.length) {
        sh.getRange(2, 1, initialRows.length, headers.length).setValues(initialRows);
      }
    }
    return sh;
  }

  // Hapus 'Sheet1' bawaan jika ada
  const defaultSheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('Sheet 1');

  // Sheet 1: Pengguna
  const initialAdminPass = sandiAcak_(12);
  const initialSalt = Utilities.getUuid();
  const initialPassHash = hashPass_(initialAdminPass, initialSalt);
  ensureSheet(
    CONFIG.SHEETS.pengguna,
    ['id', 'username', 'email', 'nama', 'role', 'password_hash', 'salt', 'status', 'wajib_ganti_pass', 'created_at'],
    [
      ['USR-001', 'admin', 'takmir@masjid-al-ikhlash.id', 'Takmir Masjid', 'admin', initialPassHash, initialSalt, 'Aktif', '1', new Date().toISOString()]
    ]
  );

  // Sheet 2: ProfilMasjid
  ensureSheet(
    CONFIG.SHEETS.profil,
    ['key', 'value', 'keterangan'],
    [
      ['NAMA_MASJID', 'Masjid Al Ikhlash', 'Nama resmi masjid'],
      ['AFILIASI', 'Pimpinan Ranting Muhammadiyah (PRM) Pajangan', 'Persyarikatan / Wilayah'],
      ['ALAMAT', 'Jl. Pajangan-Bantul No. 12, Kompleks Perguruan Muhammadiyah, Yogyakarta', 'Alamat lengkap masjid'],
      ['KONTAK_WA', '6281234567890', 'Nomor resmi WhatsApp Takmir'],
      ['EMAIL', 'info@masjid-al-ikhlash.id', 'Email resmi masjid'],
      ['MAPS_URL', 'https://maps.google.com', 'Tautan Google Maps lokasi masjid'],
      ['BANK_NAME', 'Bank Syariah Indonesia (BSI)', 'Nama Bank Penampung Donasi'],
      ['BANK_ACCOUNT', '7142-9908-11', 'Nomor Rekening Donasi'],
      ['BANK_HOLDER', 'Masjid Al Ikhlash PDM', 'Nama Pemilik Rekening'],
      ['QRIS_INFO', 'QRIS Standar Nasional — Tanpa Biaya Admin', 'Keterangan QRIS'],
      ['PERIODE_TAKMIR', '2024 - 2028', 'Masa bakti pengurus berjalan'],
      ['TAHUN_BERDIRI', '1996', 'Tahun berdirinya masjid'],
      ['VISI_MISI', 'Mewujudkan pusat peribadatan dan peradaban yang berakhlak mulia, mencerahkan umat, serta mandiri secara sosial-keumatan.', 'Visi & Misi Masjid']
    ]
  );

  // Sheet 3: KasMasjid (Data Riil Sesuai Stitch)
  ensureSheet(
    CONFIG.SHEETS.kas,
    ['id', 'tanggal', 'jenis', 'kategori', 'keterangan', 'nominal', 'metode', 'petugas', 'created_at'],
    [
      ['KAS-IN-001', '2026-11-03', 'Pemasukan', 'Infaq Jumat', 'Infaq Kotak Sholat Jumat (tromol 4 shaf utama jamaah)', 8450000, 'Kas Fisik', 'Takmir', new Date().toISOString()],
      ['KAS-OUT-001', '2026-11-02', 'Pengeluaran', 'Operasional', 'Pembayaran token listrik PLN aula & AC utama', 2150000, 'Autodebet', 'Takmir', new Date().toISOString()],
      ['KAS-IN-002', '2026-11-01', 'Pemasukan', 'Pembangunan', 'Donasi Transfer Pembangunan Kubah via QRIS BSI', 5000000, 'Transfer Bank', 'Takmir', new Date().toISOString()],
      ['KAS-OUT-002', '2026-10-28', 'Pengeluaran', 'Kebersihan', 'Bisyarah honor marbot & kebersihan bulan Oktober', 3500000, 'Tunai Resmi', 'Takmir', new Date().toISOString()],
      ['KAS-IN-003', '2026-10-25', 'Pemasukan', 'Santunan', 'Infaq konsumsi jamaah pengajian rutin Ahad Pagi', 1820000, 'Kotak Keliling', 'Takmir', new Date().toISOString()]
    ]
  );

  // Sheet 4: Donasi
  ensureSheet(
    CONFIG.SHEETS.donasi,
    ['id', 'tanggal', 'program', 'nama_donatur', 'no_wa', 'nominal', 'metode_transfer', 'bukti_url', 'doa_pesan', 'status', 'catatan_takmir', 'verified_at', 'created_at'],
    [
      ['DON-261101-1001', '2026-11-01', 'Pembangunan & Renovasi Kubah', 'Hamba Allah', '08123456789', 5000000, 'Transfer Bank BSI', '', 'Semoga barokah dan bermanfaat bagi umat', 'Terverifikasi', 'Dicatat otomatis ke kas', new Date().toISOString(), new Date().toISOString()],
      ['DON-261104-1002', '2026-11-04', 'Infaq Operasional Masjid', 'Ahmad Dahlan', '08129876543', 250000, 'QRIS BSI', '', 'Untuk kemakmuran masjid', 'Menunggu', '', '', new Date().toISOString()]
    ]
  );

  // Sheet 5: JadwalKegiatan
  ensureSheet(
    CONFIG.SHEETS.kegiatan,
    ['id', 'judul', 'kategori', 'tanggal', 'waktu_mulai', 'waktu_selesai', 'penceramah', 'lokasi', 'keterangan', 'poster_url', 'status', 'created_at'],
    [
      ['ACT-001', 'Kajian Tematik: Menata Hati Menjemput Ridho Ilahi', 'Kajian Rutin', '2026-11-22', '05:00', '06:30', 'Ust. Dr. H. Nashirudin, M.Ag.', 'Ruang Utama Masjid', 'Disediakan sarapan pagi bersama seluruh jamaah.', '', 'Aktif', new Date().toISOString()],
      ['ACT-002', 'Pelatihan Pengurusan Jenazah Sesuai Sunnah', 'Kajian Rutin', '2026-11-28', '08:30', '11:30', 'Tim Majelis Tabligh PRM', 'Aula Serbaguna Masjid', 'Praktik langsung tata cara memandikan hingga mengkafani.', '', 'Aktif', new Date().toISOString()],
      ['ACT-003', 'Sholat Jumat Berjamaah & Khutbah', 'Sholat Jumat', '2026-11-20', '11:30', '12:30', 'Ust. Fauzi Anwar, Lc.', 'Ruang Utama Masjid', 'Imam & Khatib Sholat Jumat.', '', 'Aktif', new Date().toISOString()],
      ['ACT-004', 'Pembagian Santunan Beras Jumat Berkah', 'Sosial & Santunan', '2026-11-27', '13:00', '15:00', 'Bidang Sosial & Lazismu', 'Serambi Masjid', 'Penyaluran 100 paket sembako untuk warga dhuafa sekitar masjid.', '', 'Aktif', new Date().toISOString()]
    ]
  );

  // Sheet 6: PengurusMasjid
  ensureSheet(
    CONFIG.SHEETS.pengurus,
    ['id', 'nama', 'jabatan', 'masa_bakti', 'profil_singkat', 'foto_url', 'no_wa', 'urutan', 'status', 'created_at'],
    [
      ['TAK-001', 'Ir. H. Syamsul Huda, M.T.', 'Ketua Takmir', '2024 - 2028', 'Mengkoordinasikan seluruh program kemakmuran dan pembangunan masjid.', '', '6281234567891', 1, 'Aktif', new Date().toISOString()],
      ['TAK-002', 'Drs. H. Anwar Fauzi', 'Wakil Ketua Takmir', '2024 - 2028', 'Membidangi hubungan persyarikatan Muhammadiyah dan pembinaan jamaah.', '', '6281234567892', 2, 'Aktif', new Date().toISOString()],
      ['TAK-003', 'H. Muhammad Arifin, S.Ag.', 'Sekretaris Takmir', '2024 - 2028', 'Administrasi surat menyurat, notulensi rapat, dan dokumentasi aset.', '', '6281234567893', 3, 'Aktif', new Date().toISOString()],
      ['TAK-004', 'Hj. Siti Aminah, S.E.', 'Bendahara Kas', '2024 - 2028', 'Pencatatan buku kas, pembukuan infaq Jumat, dan pelaporan keuangan terbuka.', '', '6281234567894', 4, 'Aktif', new Date().toISOString()]
    ]
  );

  // Sheet 7: GaleriKegiatan
  ensureSheet(
    CONFIG.SHEETS.galeri,
    ['id', 'judul', 'keterangan', 'foto_url', 'urutan', 'status', 'created_at'],
    [
      ['GAL-001', 'Kajian Akbar Ramadhan & Buka Bersama 1447H', 'Ahad, 15 Ramadhan • Bersama Ust. Dr. H. Nashir, M.Ag.', '', 1, 'Aktif', new Date().toISOString()],
      ['GAL-002', 'Pelatihan Pengurusan Jenazah Sesuai Sunnah', 'Sabtu, 28 Nov 2026 • Bersama Majelis Tabligh', '', 2, 'Aktif', new Date().toISOString()],
      ['GAL-003', 'Gerakan Subuh Berjamaah & Sarapan Umat', 'Ahad Pagi Pekan ke-1 • Terbuka Seluruh Warga', '', 3, 'Aktif', new Date().toISOString()]
    ]
  );

  // Sheet 8: JadwalSholatPDF
  ensureSheet(
    CONFIG.SHEETS.jadwalSholatPdf,
    ['id', 'bulan_tahun', 'file_id', 'file_url', 'download_url', 'status', 'created_at'],
    [
      ['PDF-001', 'November 2026', '', '', '', 'Aktif', new Date().toISOString()]
    ]
  );

  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch (e) {}
  }

  // Simpan properti lingkungan secara idempoten
  setProps_({
    SPREADSHEET_ID: ss.getId(),
    ROOT_FOLDER_ID: rootFolder.getId(),
    UPLOADS_FOLDER: uploadsFolder.getId(),
    PDF_FOLDER:     pdfFolder.getId()
  });

  secret_(); // Generate SESSION_SECRET

  // Cetak kredensial awal admin
  Logger.log('================================================================');
  Logger.log('✅ SUKSES SETUP PORTAL MASJID AL IKHLASH');
  Logger.log('Spreadsheet URL : ' + ss.getUrl());
  Logger.log('Root Folder URL : ' + rootFolder.getUrl());
  Logger.log('----------------------------------------------------------------');
  Logger.log('🔐 KREDENSIAL DEFAULT TAKMIR ADMIN (Catat sekarang):');
  Logger.log('   Username : admin');
  Logger.log('   Password : ' + initialAdminPass);
  Logger.log('*(Sandi wajib diganti saat pertama kali login)*');
  Logger.log('================================================================');
}
