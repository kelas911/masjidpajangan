/**
 * ============================================================================
 * MODUL MIGRASI & SINKRONISASI DATABASE SPREADSHEET (GAS-MIGRASI-DATABASE)
 * Standar: Non-Destructive, Idempoten, Dry-Run Scan, Header-Name Matching
 * ============================================================================
 */

function openSourceSpreadsheet_(idOrUrl) {
  const m = String(idOrUrl).match(/\/d\/([A-Za-z0-9_-]{20,})/);
  const id = m ? m[1] : String(idOrUrl).trim();
  const currentId = prop_('SPREADSHEET_ID');
  if (id === currentId) {
    throw new Error('Spreadsheet yang dimasukkan adalah spreadsheet aplikasi baru. Masukkan ID/URL spreadsheet LAMA.');
  }
  try {
    return SpreadsheetApp.openById(id);
  } catch (e) {
    throw new Error('Spreadsheet lama tidak dapat dibuka. Pastikan ID benar dan berada di akun Google yang sama: ' + e.message);
  }
}

function readSourceSheetRows_(ss, sheetName) {
  const sh = ss.getSheetByName(sheetName);
  if (!sh) return null;
  const v = sh.getDataRange().getValues();
  if (v.length <= 1) return [];
  const h = v[0].map(String);
  return v.slice(1).filter(r => r.join('').trim() !== '').map(r => {
    const o = {};
    h.forEach((k, i) => { if (k) o[k] = r[i]; });
    return o;
  });
}

/**
 * Eksekusi upsert batch idempoten antar-spreadsheet
 * @param {Object} plan Konfigurasi target sheet, key selector, updatable fields
 * @param {boolean} dryRun Simulasi jika true
 */
function upsertBatchPlan_(plan, dryRun) {
  const targetSh = getSheet_(plan.target);
  const values = targetSh.getDataRange().getValues();
  const headers = values[0].map(String);
  const index = {};

  for (let r = 1; r < values.length; r++) {
    const o = {};
    headers.forEach((k, i) => o[k] = values[r][i]);
    const k = plan.key(o);
    if (k) index[k] = r;
  }

  const res = { inserted: 0, updated: 0, skipped: 0 };
  const newRows = [];
  const seen = {};

  plan.rows.forEach(src => {
    const k = plan.key(src);
    if (!k || seen[k]) { res.skipped++; return; }
    seen[k] = true;

    if (index[k] !== undefined) {
      const row = values[index[k]];
      let changed = false;
      (plan.updatable || []).forEach(f => {
        const i = headers.indexOf(f);
        if (i === -1 || src[f] === undefined || src[f] === '') return;
        let v = src[f];
        if (String(row[i]) !== String(v)) {
          row[i] = v;
          changed = true;
        }
      });
      changed ? res.updated++ : res.skipped++;
    } else {
      newRows.push(headers.map(f => src[f] !== undefined ? src[f] : ''));
      res.inserted++;
    }
  });

  if (!dryRun && (res.updated || newRows.length)) {
    let all = values.concat(newRows);
    if (plan.sortBy && newRows.length) {
      const si = headers.indexOf(plan.sortBy);
      all = [values[0]].concat(all.slice(1).sort((a, b) => new Date(a[si]) - new Date(b[si])));
    }
    targetSh.getRange(1, 1, all.length, headers.length).setValues(all);
    bump('global');
  }

  return res;
}

/**
 * Fungsi Utama: Migrasi Seluruh Sheet dari Spreadsheet Lama ke Spreadsheet Baru
 * @param {string} oldSpreadsheetId ID atau URL spreadsheet versi sebelumnya
 * @param {boolean} dryRun Set true untuk simulasi, false untuk menulis nyata
 */
function migrasiDatabaseLengkap(oldSpreadsheetId, dryRun) {
  dryRun = (dryRun === undefined) ? true : !!dryRun;
  Logger.log('====================================================');
  Logger.log('🔄 MEMULAI MIGRASI DATABASE (Mode: ' + (dryRun ? 'SIMULASI / DRY-RUN' : 'EKSEKUSI NYATA') + ')');
  Logger.log('====================================================');

  const oldSs = openSourceSpreadsheet_(oldSpreadsheetId);
  const hasil = {};

  // 1. Migrasi KasMasjid
  const oldKas = readSourceSheetRows_(oldSs, 'KasMasjid') || readSourceSheetRows_(oldSs, 'Kas') || [];
  hasil.KasMasjid = upsertBatchPlan_({
    target: CONFIG.SHEETS.kas,
    rows: oldKas,
    key: r => r.id || (r.tanggal + '_' + r.nominal + '_' + r.keterangan),
    updatable: ['kategori', 'keterangan', 'metode', 'petugas'],
    sortBy: 'tanggal'
  }, dryRun);
  Logger.log('📊 KasMasjid: ' + JSON.stringify(hasil.KasMasjid));

  // 2. Migrasi Donasi
  const oldDonasi = readSourceSheetRows_(oldSs, 'Donasi') || [];
  hasil.Donasi = upsertBatchPlan_({
    target: CONFIG.SHEETS.donasi,
    rows: oldDonasi,
    key: r => r.id || (r.tanggal + '_' + r.nama_donatur + '_' + r.nominal),
    updatable: ['status', 'catatan_takmir', 'verified_at', 'bukti_url'],
    sortBy: 'tanggal'
  }, dryRun);
  Logger.log('🎁 Donasi: ' + JSON.stringify(hasil.Donasi));

  // 3. Migrasi JadwalKegiatan
  const oldKegiatan = readSourceSheetRows_(oldSs, 'JadwalKegiatan') || readSourceSheetRows_(oldSs, 'Kegiatan') || [];
  hasil.JadwalKegiatan = upsertBatchPlan_({
    target: CONFIG.SHEETS.kegiatan,
    rows: oldKegiatan,
    key: r => r.id || (r.judul + '_' + r.tanggal),
    updatable: ['kategori', 'waktu_mulai', 'waktu_selesai', 'penceramah', 'lokasi', 'keterangan', 'poster_url', 'status'],
    sortBy: 'tanggal'
  }, dryRun);
  Logger.log('📅 JadwalKegiatan: ' + JSON.stringify(hasil.JadwalKegiatan));

  // 4. Migrasi PengurusMasjid
  const oldPengurus = readSourceSheetRows_(oldSs, 'PengurusMasjid') || readSourceSheetRows_(oldSs, 'Pengurus') || [];
  hasil.PengurusMasjid = upsertBatchPlan_({
    target: CONFIG.SHEETS.pengurus,
    rows: oldPengurus,
    key: r => r.id || (r.nama + '_' + r.jabatan),
    updatable: ['jabatan', 'masa_bakti', 'profil_singkat', 'foto_url', 'no_wa', 'urutan', 'status']
  }, dryRun);
  Logger.log('👥 PengurusMasjid: ' + JSON.stringify(hasil.PengurusMasjid));

  // 5. Migrasi GaleriKegiatan
  const oldGaleri = readSourceSheetRows_(oldSs, 'GaleriKegiatan') || readSourceSheetRows_(oldSs, 'Galeri') || [];
  hasil.GaleriKegiatan = upsertBatchPlan_({
    target: CONFIG.SHEETS.galeri,
    rows: oldGaleri,
    key: r => r.id || r.judul,
    updatable: ['keterangan', 'foto_url', 'urutan', 'status']
  }, dryRun);
  Logger.log('🖼️ GaleriKegiatan: ' + JSON.stringify(hasil.GaleriKegiatan));

  Logger.log('====================================================');
  Logger.log('✅ SELESAI: ' + JSON.stringify(hasil, null, 2));
  return hasil;
}
