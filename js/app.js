/**
 * ============================================================================
 * PORTAL MASJID AL IKHLASH (MD PAJANGAN) — CLIENT LOGIC ENGINE
 * Arsitektur: GAS-PRO-API + GAS-SCALE-TURBO + SWR Instant UX + PWA
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. DATA AWAL CADANGAN (FALLBACK INSTAN SEBELUM KONEKSI LIVE GAS)
// ----------------------------------------------------------------------------
const SEED_DATA = {
  profil: {
    NAMA_MASJID: 'Masjid Al Ikhlash',
    AFILIASI: 'Pimpinan Ranting Muhammadiyah (PRM) Pajangan',
    ALAMAT: 'Jl. Pajangan-Bantul No. 12, Kompleks Perguruan Muhammadiyah, Yogyakarta',
    KONTAK_WA: '6281234567890',
    EMAIL: 'info@masjid-al-ikhlash.id',
    MAPS_URL: 'https://maps.google.com',
    BANK_NAME: 'Bank Syariah Indonesia (BSI)',
    BANK_ACCOUNT: '7142-9908-11',
    BANK_HOLDER: 'Masjid Al Ikhlash PDM',
    QRIS_INFO: 'QRIS Standar Nasional — Tanpa Biaya Admin',
    PERIODE_TAKMIR: '2024 - 2028',
    TAHUN_BERDIRI: '1996',
    VISI_MISI: 'Mewujudkan pusat peribadatan dan peradaban yang berakhlak mulia, mencerahkan umat, serta mandiri secara sosial-keumatan.'
  },
  keuangan: {
    totalPemasukan: 42850000,
    totalPengeluaran: 18230000,
    saldo: 24620000,
    transaksi: [
      {
        id: 'KAS-IN-001',
        tanggal: '2026-11-03',
        jenis: 'Pemasukan',
        kategori: 'Infaq Jumat',
        keterangan: 'Infaq Kotak Sholat Jumat (tromol 4 shaf utama jamaah)',
        nominal: 8450000,
        metode: 'Kas Fisik'
      },
      {
        id: 'KAS-OUT-001',
        tanggal: '2026-11-02',
        jenis: 'Pengeluaran',
        kategori: 'Operasional',
        keterangan: 'Pembayaran token listrik PLN aula & AC utama',
        nominal: 2150000,
        metode: 'Autodebet'
      },
      {
        id: 'KAS-IN-002',
        tanggal: '2026-11-01',
        jenis: 'Pemasukan',
        kategori: 'Pembangunan',
        keterangan: 'Donasi Transfer Pembangunan Kubah via QRIS BSI',
        nominal: 5000000,
        metode: 'Transfer Bank'
      },
      {
        id: 'KAS-OUT-002',
        tanggal: '2026-10-28',
        jenis: 'Pengeluaran',
        kategori: 'Kebersihan',
        keterangan: 'Bisyarah honor marbot & kebersihan bulan Oktober',
        nominal: 3500000,
        metode: 'Tunai Resmi'
      },
      {
        id: 'KAS-IN-003',
        tanggal: '2026-10-25',
        jenis: 'Pemasukan',
        kategori: 'Santunan',
        keterangan: 'Infaq konsumsi jamaah pengajian rutin Ahad Pagi',
        nominal: 1820000,
        metode: 'Kotak Keliling'
      }
    ]
  },
  kegiatan: [
    {
      id: 'ACT-001',
      judul: 'Kajian Tematik: Menata Hati Menjemput Ridho Ilahi',
      kategori: 'Kajian Rutin',
      tanggal: '2026-11-22',
      waktu_mulai: '05:00',
      waktu_selesai: '06:30',
      penceramah: 'Ust. Dr. H. Nashirudin, M.Ag.',
      lokasi: 'Ruang Utama Masjid',
      keterangan: 'Disediakan sarapan pagi bersama seluruh jamaah.',
      status: 'Aktif'
    },
    {
      id: 'ACT-002',
      judul: 'Pelatihan Pengurusan Jenazah Sesuai Sunnah',
      kategori: 'Kajian Rutin',
      tanggal: '2026-11-28',
      waktu_mulai: '08:30',
      waktu_selesai: '11:30',
      penceramah: 'Tim Majelis Tabligh PRM',
      lokasi: 'Aula Serbaguna Masjid',
      keterangan: 'Praktik langsung tata cara memandikan hingga mengkafani.',
      status: 'Aktif'
    },
    {
      id: 'ACT-003',
      judul: 'Sholat Jumat Berjamaah & Khutbah',
      kategori: 'Sholat Jumat',
      tanggal: '2026-11-20',
      waktu_mulai: '11:30',
      waktu_selesai: '12:30',
      penceramah: 'Ust. Fauzi Anwar, Lc.',
      lokasi: 'Ruang Utama Masjid',
      keterangan: 'Imam & Khatib Sholat Jumat.',
      status: 'Aktif'
    },
    {
      id: 'ACT-004',
      judul: 'Pembagian Santunan Beras Jumat Berkah',
      kategori: 'Sosial & Santunan',
      tanggal: '2026-11-27',
      waktu_mulai: '13:00',
      waktu_selesai: '15:00',
      penceramah: 'Bidang Sosial & Lazismu',
      lokasi: 'Serambi Masjid',
      keterangan: 'Penyaluran 100 paket sembako untuk warga dhuafa sekitar masjid.',
      status: 'Aktif'
    }
  ],
  pengurus: [
    {
      id: 'TAK-001',
      nama: 'Ir. H. Syamsul Huda, M.T.',
      jabatan: 'Ketua Takmir',
      masa_bakti: '2024 - 2028',
      profil_singkat: 'Mengkoordinasikan seluruh program kemakmuran, dakwah, dan pembangunan fisik masjid.',
      foto_url: '',
      no_wa: '6281234567891',
      urutan: 1
    },
    {
      id: 'TAK-002',
      nama: 'Drs. H. Anwar Fauzi',
      jabatan: 'Wakil Ketua Takmir',
      masa_bakti: '2024 - 2028',
      profil_singkat: 'Membidangi pembinaan jamaah, hubungan persyarikatan Muhammadiyah, dan syiar keumatan.',
      foto_url: '',
      no_wa: '6281234567892',
      urutan: 2
    },
    {
      id: 'TAK-003',
      nama: 'H. Muhammad Arifin, S.Ag.',
      jabatan: 'Sekretaris Takmir',
      masa_bakti: '2024 - 2028',
      profil_singkat: 'Administrasi surat menyurat, dokumentasi inventaris, dan publikasi portal informasi masjid.',
      foto_url: '',
      no_wa: '6281234567893',
      urutan: 3
    },
    {
      id: 'TAK-004',
      nama: 'Hj. Siti Aminah, S.E.',
      jabatan: 'Bendahara Kas',
      masa_bakti: '2024 - 2028',
      profil_singkat: 'Pencatatan pembukuan kas, pengelolaan infaq tromol Jumat, dan pelaporan keuangan berkala.',
      foto_url: '',
      no_wa: '6281234567894',
      urutan: 4
    }
  ],
  galeri: [
    {
      id: 'GAL-001',
      judul: 'Kajian Akbar Ramadhan & Buka Bersama 1447H',
      keterangan: 'Ahad, 15 Ramadhan • Bersama Ust. Dr. H. Nashir, M.Ag.',
      foto_url: './assets/hero-masjid.png'
    },
    {
      id: 'GAL-002',
      judul: 'Pelatihan Pengurusan Jenazah Sesuai Sunnah',
      keterangan: 'Sabtu, 28 Nov 2026 • Bersama Majelis Tabligh',
      foto_url: './assets/hero-masjid.png'
    },
    {
      id: 'GAL-003',
      judul: 'Gerakan Subuh Berjamaah & Sarapan Umat',
      keterangan: 'Ahad Pagi Pekan ke-1 • Terbuka Seluruh Warga',
      foto_url: './assets/hero-masjid.png'
    }
  ],
  jadwalPdf: {
    bulan_tahun: 'November 2026',
    download_url: ''
  }
};

// ----------------------------------------------------------------------------
// 2. STATE MANAGER & SWR CACHING
// ----------------------------------------------------------------------------
let APP_STATE = {
  currentTab: 'beranda',
  data: JSON.parse(JSON.stringify(SEED_DATA)),
  adminToken: localStorage.getItem('al_ikhlash_token') || null,
  adminUser: JSON.parse(localStorage.getItem('al_ikhlash_user') || 'null'),
  donasiList: [],
  kegiatanFilter: 'all',
  kasFilter: {
    query: '',
    type: 'all',
    category: 'all'
  }
};

const _inflight = {};

// SWR API Client (GAS-SCALE-TURBO)
async function apiCall(action, payload = null, method = 'GET') {
  const gasUrl = APP_CONFIG.GAS_URL;
  if (!gasUrl) {
    console.warn('GAS_URL belum dikonfigurasi. Menggunakan data lokal (Offline/Demo Mode).');
    return { success: true, data: APP_STATE.data, demo: true };
  }

  // Deduplikasi in-flight request GET
  const reqKey = method + '|' + action + '|' + JSON.stringify(payload || {});
  if (method === 'GET' && _inflight[reqKey]) {
    return _inflight[reqKey];
  }

  const promise = (async () => {
    try {
      let res;
      if (method === 'GET') {
        const url = `${gasUrl}?action=${encodeURIComponent(action)}`;
        res = await fetch(url);
      } else {
        // ATURAN CORS: Header WAJIB 'Content-Type': 'text/plain;charset=utf-8'
        res = await fetch(gasUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: action,
            token: APP_STATE.adminToken,
            data: payload
          })
        });
      }
      const json = await res.json();
      if (method === 'POST' && json && json.code === 'UNAUTHORIZED' && APP_STATE.adminToken) {
        sesiBerakhir_();
      } else if (method === 'POST' && json && json.code === 'WAJIB_GANTI_PASS') {
        bukaModalWajibGanti();
      }
      return json;
    } catch (err) {
      console.error('API Call Error:', err);
      return { success: false, message: 'Gagal terhubung ke server: ' + err.message };
    }
  })();

  if (method === 'GET') {
    _inflight[reqKey] = promise;
    promise.finally(() => delete _inflight[reqKey]);
  }

  return promise;
}

// ----------------------------------------------------------------------------
// 3. INISIALISASI APLIKASI & SWR REVALIDATE
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // 1. Muat dari LocalStorage jika ada (0ms instant render)
  const cachedBundle = localStorage.getItem('ikhlash_bundle_cache');
  if (cachedBundle) {
    try {
      const parsed = JSON.parse(cachedBundle);
      APP_STATE.data = parsed;
    } catch (e) {}
  }

  // 2. Render UI Awal Instan
  renderAllViews();
  initPrayerTimes();
  initGallerySlider();
  updateAuthUI();
  // Sesi lama yang masih memakai sandi awal: paksa ganti sandi
  if (APP_STATE.adminToken && APP_STATE.adminUser && APP_STATE.adminUser.wajibGantiPass) bukaModalWajibGanti();

  // 3. SWR: Revalidate dari Live API di latar belakang
  revalidatePublicData();

  // 4. Deteksi Koneksi Internet
  window.addEventListener('online', () => {
    document.getElementById('offlineBanner')?.classList.add('hidden');
    showToast('Koneksi internet terhubung kembali.', 'wifi');
    revalidatePublicData();
  });
  window.addEventListener('offline', () => {
    document.getElementById('offlineBanner')?.classList.remove('hidden');
  });

  // 5. Setup Filter Kas
  setupKasFilters();
  setupKegiatanSearch();
});

async function revalidatePublicData() {
  if (!APP_CONFIG.GAS_URL) return;
  const res = await apiCall('getPublicData');
  if (res && res.success && res.data) {
    APP_STATE.data = res.data;
    localStorage.setItem('ikhlash_bundle_cache', JSON.stringify(res.data));
    renderAllViews();
  }
}

// ----------------------------------------------------------------------------
// 4. SISTEM NAVIGASI TAB (SPA INSTAN 0 MS)
// ----------------------------------------------------------------------------
function navigateTab(targetTab) {
  if (APP_STATE.currentTab === targetTab) return;
  APP_STATE.currentTab = targetTab;

  // 1. Switch View Classes
  document.querySelectorAll('.spa-view').forEach(view => {
    view.classList.remove('active');
  });
  const targetView = document.getElementById('view-' + targetTab);
  if (targetView) targetView.classList.add('active');

  // 2. Update Bottom Nav Active Indicator
  document.querySelectorAll('.nav-tab').forEach(tab => {
    if (tab.getAttribute('data-target') === targetTab) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // 3. Update Header Subtitle
  const subEl = document.getElementById('headerSubtitle');
  if (subEl) {
    const titles = {
      beranda: 'Beranda',
      kas: 'Laporan Kas',
      donasi: 'Infaq Online',
      kegiatan: 'Jadwal Kajian',
      pengurus: 'Profil & Takmir'
    };
    subEl.textContent = titles[targetTab] || 'Portal';
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ----------------------------------------------------------------------------
// 5. RENDER UI BUNDLE (BERANDA, KAS, DONASI, KEGIATAN, PENGURUS)
// ----------------------------------------------------------------------------
function renderAllViews() {
  renderProfilUI();
  renderKasUI();
  renderKegiatanUI();
  renderPengurusUI();
  renderGaleriUI();
}

function renderProfilUI() {
  const p = APP_STATE.data.profil || {};
  
  const heroName = document.getElementById('heroMosqueName');
  if (heroName) heroName.textContent = p.NAMA_MASJID || 'Masjid Al Ikhlash';

  const heroAff = document.getElementById('heroMosqueAffiliation');
  if (heroAff) heroAff.innerHTML = `<span class="material-symbols-outlined text-[14px]">location_on</span> ${esc(p.AFILIASI || 'PRM Pajangan')}`;

  const profilTitle = document.getElementById('profilMosqueTitle');
  if (profilTitle) profilTitle.textContent = p.NAMA_MASJID || 'Masjid Al Ikhlash';

  const profilAddr = document.getElementById('profilMosqueAddress');
  if (profilAddr) profilAddr.textContent = p.ALAMAT || '';

  const profilVisi = document.getElementById('profilMosqueVisi');
  if (profilVisi) profilVisi.textContent = p.VISI_MISI || '';

  const bankAcc = document.getElementById('bankAccNumber');
  if (bankAcc) bankAcc.textContent = p.BANK_ACCOUNT || '7142-9908-11';

  const bankHolder = document.getElementById('bankAccHolder');
  if (bankHolder) bankHolder.textContent = 'a.n. ' + (p.BANK_HOLDER || 'Masjid Al Ikhlash PDM');

  const linkWA = document.getElementById('linkWA');
  if (linkWA && p.KONTAK_WA) linkWA.href = `https://wa.me/${p.KONTAK_WA.replace(/\D/g, '')}`;

  const linkMaps = document.getElementById('linkMaps');
  if (linkMaps && p.MAPS_URL) linkMaps.href = safeUrl(p.MAPS_URL, '#');

  const linkEmail = document.getElementById('linkEmail');
  if (linkEmail && p.EMAIL) linkEmail.href = `mailto:${encodeURIComponent(p.EMAIL)}`.replace('%40','@');
}

// Anti-XSS: semua teks dari database/form publik WAJIB lewat esc() sebelum masuk innerHTML
function esc(v) {
  return String(v === undefined || v === null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Hanya izinkan http(s), data:image, dan path relatif untuk src/href dari data eksternal
function safeUrl(u, fallback) {
  const s = String(u || '').trim();
  if (/^(https?:\/\/|\.\/|\/(?!\/)|data:image\/(png|jpe?g|gif|webp);base64,)/i.test(s)) return s;
  return fallback || '';
}

function formatRupiah(num) {
  return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
}

function renderKasUI() {
  const k = APP_STATE.data.keuangan || { totalPemasukan: 0, totalPengeluaran: 0, saldo: 0, transaksi: [] };
  
  // Ringkasan Beranda
  const ringkasSaldo = document.getElementById('ringkasKasSaldo');
  if (ringkasSaldo) ringkasSaldo.textContent = formatRupiah(k.saldo);

  const ringkasPem = document.getElementById('ringkasKasPemasukan');
  if (ringkasPem) ringkasPem.textContent = '+' + formatRupiah(k.totalPemasukan);

  const ringkasPeng = document.getElementById('ringkasKasPengeluaran');
  if (ringkasPeng) ringkasPeng.textContent = '-' + formatRupiah(k.totalPengeluaran);

  // View Kas Utama
  const kasSaldo = document.getElementById('kasTotalSaldo');
  if (kasSaldo) kasSaldo.textContent = formatRupiah(k.saldo);

  const kasPem = document.getElementById('kasTotalPemasukan');
  if (kasPem) kasPem.textContent = formatRupiah(k.totalPemasukan);

  const kasPeng = document.getElementById('kasTotalPengeluaran');
  if (kasPeng) kasPeng.textContent = formatRupiah(k.totalPengeluaran);

  applyKasFilter();
}

function setupKasFilters() {
  const searchInput = document.getElementById('kasSearchInput');
  const typeFilter = document.getElementById('kasTypeFilter');
  const catFilter = document.getElementById('kasCategoryFilter');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      APP_STATE.kasFilter.query = e.target.value.toLowerCase().trim();
      applyKasFilter();
    });
  }

  if (typeFilter) {
    typeFilter.addEventListener('change', (e) => {
      APP_STATE.kasFilter.type = e.target.value;
      applyKasFilter();
    });
  }

  if (catFilter) {
    catFilter.addEventListener('change', (e) => {
      APP_STATE.kasFilter.category = e.target.value;
      applyKasFilter();
    });
  }
}

// Satu sumber kebenaran filter kas: dipakai tampilan tabel DAN ekspor Excel/PDF
function getFilteredKas() {
  const allTx = (APP_STATE.data.keuangan && APP_STATE.data.keuangan.transaksi) || [];
  const q = APP_STATE.kasFilter.query;
  const t = APP_STATE.kasFilter.type;
  const c = APP_STATE.kasFilter.category;
  return allTx.filter(tx => {
    const matchQuery = !q || (tx.keterangan || '').toLowerCase().includes(q) || (tx.kategori || '').toLowerCase().includes(q);
    const matchType = t === 'all' || (tx.jenis || '').toLowerCase() === t.toLowerCase();
    const matchCat = c === 'all' || (tx.kategori || '').toLowerCase() === c.toLowerCase();
    return matchQuery && matchType && matchCat;
  });
}

// Cegah formula injection saat CSV dibuka di Excel (=, +, -, @, tab, CR di awal sel)
function csvCell(v) {
  let t = String(v === undefined || v === null ? '' : v);
  if (/^[=+\-@\t\r]/.test(t)) t = "'" + t;
  return '"' + t.replace(/"/g, '""') + '"';
}

function applyKasFilter() {
  const listContainer = document.getElementById('kasTransactionsList');
  const emptyState = document.getElementById('kasEmptyState');
  const countLabel = document.getElementById('kasResultCount');
  if (!listContainer) return;

  const filtered = getFilteredKas();

  if (countLabel) countLabel.textContent = `Menampilkan ${filtered.length} mutasi`;

  if (filtered.length === 0) {
    listContainer.innerHTML = '';
    emptyState?.classList.remove('hidden');
    return;
  }

  emptyState?.classList.add('hidden');
  listContainer.innerHTML = filtered.map(tx => {
    const isIncome = String(tx.jenis).toLowerCase() === 'pemasukan';
    const icon = isIncome ? 'add_circle' : 'remove_circle';
    const badgeColor = isIncome ? 'bg-surface-container-low text-income-green' : 'bg-error-container/40 text-expense-red';
    const sign = isIncome ? '+' : '-';
    const textNominalColor = isIncome ? 'text-income-green' : 'text-expense-red';

    return `
      <div class="bg-surface-card p-3.5 rounded-2xl shadow-sm transition-all flex items-start justify-between gap-3">
        <div class="flex items-start gap-3 min-w-0">
          <div class="w-10 h-10 rounded-xl ${badgeColor} flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="material-symbols-outlined text-[20px]">${icon}</span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5 mb-0.5">
              <span class="bg-surface-container-highest text-primary text-[10px] font-bold px-2 py-0.5 rounded-md">
                ${esc(tx.kategori || 'Kas')}
              </span>
              <span class="text-text-muted text-[11px]">${esc(tx.tanggal || '')}</span>
            </div>
            <h4 class="text-xs font-bold text-text-primary truncate">${esc(tx.keterangan || 'Transaksi Kas')}</h4>
            <p class="text-[11px] text-text-muted mt-0.5">Metode: ${esc(tx.metode || 'Kas')}</p>
          </div>
        </div>
        <div class="text-right flex-shrink-0">
          <span class="text-xs font-extrabold ${textNominalColor} block">${sign}${formatRupiah(tx.nominal)}</span>
          ${APP_STATE.adminToken ? `
            <button onclick="hapusKasAdmin('${esc(tx.id)}')" class="text-[11px] text-error font-semibold hover:underline mt-1">Hapus</button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function resetKasFilter() {
  APP_STATE.kasFilter = { query: '', type: 'all', category: 'all' };
  const searchInput = document.getElementById('kasSearchInput');
  const typeFilter = document.getElementById('kasTypeFilter');
  const catFilter = document.getElementById('kasCategoryFilter');
  if (searchInput) searchInput.value = '';
  if (typeFilter) typeFilter.value = 'all';
  if (catFilter) catFilter.value = 'all';
  applyKasFilter();
}

// ----------------------------------------------------------------------------
// 6. EXPORT KAS BROWSER-SIDE (EXCEL & PDF) — KHUSUS ADMIN (PRD V3)
// ----------------------------------------------------------------------------
function exportKasExcel() {
  if (!APP_STATE.adminToken) {
    showToast('Akses ditolak: Fitur unduh hanya untuk Takmir.', 'lock');
    return;
  }

  const txs = getFilteredKas(); // ikut hasil filter yang sedang tampil (sesuai PRD)
  if (txs.length === 0) {
    showToast('Tidak ada data transaksi untuk diekspor.', 'info');
    return;
  }

  // Generate CSV format with UTF-8 BOM
  let csv = '\uFEFF';
  csv += 'ID Transaksi,Tanggal,Jenis,Kategori,Keterangan,Nominal (Rp),Metode\n';
  txs.forEach(t => {
    csv += [t.id, t.tanggal, t.jenis, t.kategori, t.keterangan, t.nominal, t.metode || 'Kas'].map(csvCell).join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Laporan_Kas_Masjid_Al_Ikhlash_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Laporan Kas berhasil diunduh (Excel/CSV).', 'download_done');
}

function exportKasPDF() {
  if (!APP_STATE.adminToken) {
    showToast('Akses ditolak: Fitur unduh hanya untuk Takmir.', 'lock');
    return;
  }
  showToast('Membuka dialog cetak laporan PDF...', 'print');
  setTimeout(() => {
    window.print();
  }, 400);
}

// ----------------------------------------------------------------------------
// 7. KEGIATAN & PENGURUS RENDER
// ----------------------------------------------------------------------------
function setupKegiatanSearch() {
  const searchInput = document.getElementById('kegiatanSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderKegiatanUI(e.target.value.toLowerCase().trim());
    });
  }
}

function filterKegiatanCategory(cat, btn) {
  APP_STATE.kegiatanFilter = cat;
  document.querySelectorAll('.kegiatan-chip').forEach(c => {
    c.classList.remove('active', 'bg-primary', 'text-on-primary');
    c.classList.add('bg-surface-card', 'text-text-muted');
  });
  btn.classList.add('active', 'bg-primary', 'text-on-primary');
  btn.classList.remove('bg-surface-card', 'text-text-muted');
  renderKegiatanUI();
}

function renderKegiatanUI(searchQuery = '') {
  const container = document.getElementById('kegiatanListContainer');
  if (!container) return;

  const allKeg = APP_STATE.data.kegiatan || [];
  const cat = APP_STATE.kegiatanFilter;

  const filtered = allKeg.filter(k => {
    const matchCat = cat === 'all' || k.kategori === cat;
    const matchSearch = !searchQuery || 
      (k.judul || '').toLowerCase().includes(searchQuery) ||
      (k.penceramah || '').toLowerCase().includes(searchQuery) ||
      (k.keterangan || '').toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="bg-surface-card rounded-2xl p-6 text-center text-xs text-text-muted">
        Tidak ada agenda kegiatan yang cocok.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(k => {
    const d = new Date(k.tanggal || new Date());
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['JAN','FEB','MAR','APR','MEI','JUN','JUL','AGU','SEP','OKT','NOV','DES'];
    const month = months[d.getMonth()] || 'NOV';
    const year = d.getFullYear() || 2026;

    return `
      <article class="w-full bg-surface-card rounded-2xl p-4 shadow-sm flex flex-col gap-3 transition-transform active:scale-[0.99]">
        <div class="flex items-start gap-3.5">
          <div class="w-13 h-16 rounded-xl bg-primary flex flex-col items-center justify-center text-on-primary shadow-sm flex-shrink-0 px-2">
            <span class="text-base font-extrabold leading-none tracking-tight">${day}</span>
            <span class="text-[10px] font-bold tracking-wider mt-0.5">${month}</span>
            <span class="text-[9px] text-on-primary/75">${year}</span>
          </div>
          <div class="flex flex-col min-w-0 flex-1">
            <div class="flex items-center gap-1.5 mb-1 flex-wrap">
              <span class="px-2 py-0.5 rounded-full bg-surface-container text-primary text-[10px] font-bold">
                ${esc(k.kategori || 'Kegiatan')}
              </span>
            </div>
            <h3 class="text-xs font-bold text-text-primary leading-snug line-clamp-2">
              ${esc(k.judul)}
            </h3>
          </div>
        </div>
        <div class="bg-surface rounded-xl p-2.5 flex flex-col gap-1 text-[11px] text-text-muted">
          ${k.penceramah ? `<div class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[14px] text-primary">person</span><span class="font-medium text-text-primary">${esc(k.penceramah)}</span></div>` : ''}
          <div class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[14px] text-secondary">schedule</span><span>${esc(k.waktu_mulai || '19:30')} - ${esc(k.waktu_selesai || 'Selesai')} WIB</span></div>
          <div class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[14px] text-text-muted">location_on</span><span>${esc(k.lokasi || 'Ruang Utama Masjid')}</span></div>
          ${k.keterangan ? `<p class="mt-1 pt-1 border-t border-border-divider/50 text-text-muted leading-relaxed">${esc(k.keterangan)}</p>` : ''}
        </div>
        ${APP_STATE.adminToken ? `
        <div class="grid grid-cols-2 gap-2">
          <button onclick="editKegiatan('${esc(k.id)}')" class="h-8 rounded-lg bg-surface-container text-primary text-[11px] font-bold" type="button">Ubah</button>
          <button onclick="hapusKegiatan('${esc(k.id)}')" class="h-8 rounded-lg bg-error-container/40 text-error text-[11px] font-bold" type="button">Hapus</button>
        </div>` : ''}
      </article>
    `;
  }).join('');
}

function renderPengurusUI() {
  const container = document.getElementById('pengurusGridContainer');
  if (!container) return;

  const pengurusList = APP_STATE.data.pengurus || [];
  container.innerHTML = pengurusList.map(p => {
    return `
      <div class="bg-surface-card rounded-2xl p-3 shadow-sm flex flex-col items-center text-center cursor-pointer transition-all hover:shadow-md active:scale-95 group" onclick="bukaModalPengurusDetail('${esc(p.id)}')">
        <div class="relative w-16 h-16 mb-2">
          <div class="w-16 h-16 rounded-full p-1 bg-surface-container-high">
            <img class="w-full h-full object-cover rounded-full bg-surface-dim" src="${esc(safeUrl(p.foto_url, './assets/logo.png'))}" alt="${esc(p.nama)}"/>
          </div>
          <span class="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px] shadow-sm">
            <span class="material-symbols-outlined text-[12px]">shield_person</span>
          </span>
        </div>
        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-light text-secondary mb-1 line-clamp-1">${esc(p.jabatan || 'Pengurus')}</span>
        <h3 class="text-xs font-bold text-text-primary leading-tight line-clamp-2 min-h-[32px] flex items-center justify-center">${esc(p.nama)}</h3>
        <span class="text-[10px] text-text-muted mt-1">${esc(p.masa_bakti || '2024 - 2028')}</span>
      </div>
    `;
  }).join('');
}

let _pengurusAktifId = null;

function bukaModalPengurusDetail(id) {
  const p = (APP_STATE.data.pengurus || []).find(item => item.id === id);
  if (!p) return;

  document.getElementById('detailPengurusFoto').src = safeUrl(p.foto_url, './assets/logo.png');
  document.getElementById('detailPengurusJabatan').textContent = p.jabatan || 'Pengurus';
  document.getElementById('detailPengurusNama').textContent = p.nama || '';
  document.getElementById('detailPengurusMasa').textContent = 'Masa Bakti ' + (p.masa_bakti || '2024 - 2028');
  document.getElementById('detailPengurusBio').textContent = p.profil_singkat || 'Amanah kepengurusan takmir Masjid Al Ikhlash Pajangan.';

  _pengurusAktifId = p.id;
  document.getElementById('detailPengurusAdmin')?.classList.toggle('hidden', !APP_STATE.adminToken);

  const waBtn = document.getElementById('detailPengurusWA');
  if (waBtn) {
    if (p.no_wa) {
      waBtn.href = `https://wa.me/${p.no_wa.replace(/\D/g, '')}`;
      waBtn.style.display = 'flex';
    } else {
      waBtn.style.display = 'none';
    }
  }

  const modal = document.getElementById('modalPengurusDetail');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function tutupModalPengurusDetail() {
  const modal = document.getElementById('modalPengurusDetail');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// ----------------------------------------------------------------------------
// 8. GALERI SLIDER DENGAN AUTO-SLIDE 2 DETIK (PRD SECTION 5 M1)
// ----------------------------------------------------------------------------
let _slideIndex = 0;
let _slideTimer = null;

function renderGaleriUI() {
  const galeriList = APP_STATE.data.galeri || [];
  if (galeriList.length === 0) return;
  setSlide(0);
}

function setSlide(idx) {
  const galeriList = APP_STATE.data.galeri || [];
  if (galeriList.length === 0) return;
  _slideIndex = (idx + galeriList.length) % galeriList.length;

  const item = galeriList[_slideIndex];
  const imgEl = document.getElementById('gallery-image');
  const capEl = document.getElementById('gallery-caption');
  const subEl = document.getElementById('gallery-sub');

  if (imgEl) imgEl.src = safeUrl(item.foto_url, './assets/hero-masjid.png');
  if (capEl) capEl.textContent = item.judul || 'Dokumentasi Kegiatan';
  if (subEl) subEl.textContent = item.keterangan || 'Masjid Al Ikhlash Pajangan';

  // Update dots
  const dotsContainer = document.getElementById('gallery-dots');
  if (dotsContainer) {
    dotsContainer.innerHTML = galeriList.map((_, i) => `
      <button onclick="setSlide(${i})" class="${i === _slideIndex ? 'w-2.5 h-2.5 bg-secondary-container' : 'w-2 h-2 bg-surface-card/60'} rounded-full transition-all" aria-label="Slide ${i + 1}"></button>
    `).join('');
  }
}

function initGallerySlider() {
  if (_slideTimer) clearInterval(_slideTimer);
  _slideTimer = setInterval(() => {
    setSlide(_slideIndex + 1);
  }, 2000); // Tepat 2 detik sesuai PRD M1
}

// ----------------------------------------------------------------------------
// 9. ENGINE JADWAL SHOLAT & COUNTDOWN REAL-TIME (YOGYAKARTA / PAJANGAN)
// ----------------------------------------------------------------------------
function initPrayerTimes() {
  // Judul bulan mengikuti tanggal perangkat, bukan teks tetap di HTML
  const titleEl = document.getElementById('prayerMonthTitle');
  if (titleEl) {
    const bln = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    const now = new Date();
    titleEl.textContent = 'Jadwal Sholat — ' + bln[now.getMonth()] + ' ' + now.getFullYear();
  }
  updatePrayerTimes();
  setInterval(updatePrayerTimes, 30000); // Update setiap 30 detik
}

function updatePrayerTimes() {
  const now = new Date();
  
  // Waktu sholat standar untuk koordinat Bantul/Yogyakarta (-7.86, 110.28)
  const times = {
    subuh:   '04:12',
    terbit:  '05:30',
    dzuhur:  '11:45',
    ashar:   '15:14',
    maghrib: '17:52',
    isya:    '19:04'
  };

  Object.keys(times).forEach(k => {
    const el = document.getElementById('time-' + k);
    if (el) el.textContent = times[k];
  });

  // Hitung sholat berikutnya
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const scheduleMinutes = [
    { name: 'Subuh', time: times.subuh, m: 4 * 60 + 12, id: 'subuh' },
    { name: 'Dzuhur', time: times.dzuhur, m: 11 * 60 + 45, id: 'dzuhur' },
    { name: 'Ashar', time: times.ashar, m: 15 * 60 + 14, id: 'ashar' },
    { name: 'Maghrib', time: times.maghrib, m: 17 * 60 + 52, id: 'maghrib' },
    { name: 'Isya', time: times.isya, m: 19 * 60 + 4, id: 'isya' }
  ];

  let nextPrayer = scheduleMinutes.find(s => s.m > nowMinutes);
  let diffMinutes = 0;

  if (nextPrayer) {
    diffMinutes = nextPrayer.m - nowMinutes;
  } else {
    // Lewat Isya, menuju Subuh besok
    nextPrayer = scheduleMinutes[0];
    diffMinutes = (24 * 60 - nowMinutes) + nextPrayer.m;
  }

  // Update Countdown Banner
  const banner = document.getElementById('prayerCountdownText');
  if (banner) {
    const jam = Math.floor(diffMinutes / 60);
    const mnt = diffMinutes % 60;
    const durasiStr = jam > 0 ? `${jam} jam ${mnt} menit` : `${mnt} menit`;
    banner.textContent = `${durasiStr} menuju ${nextPrayer.name} (${nextPrayer.time} WIB)`;
  }

  // Highlight active prayer card
  scheduleMinutes.forEach(s => {
    const card = document.getElementById('prayer-' + s.id);
    if (card) {
      if (s.id === nextPrayer.id) {
        card.className = 'bg-primary text-on-primary rounded-xl p-2.5 flex flex-col items-center text-center shadow-md scale-102 transition-all';
        const spanTime = card.querySelector('span:last-child');
        if (spanTime) spanTime.className = 'text-sm font-bold text-on-primary mt-0.5';
      } else {
        card.className = 'bg-surface-container-low rounded-xl p-2.5 flex flex-col items-center text-center transition-all';
        const spanTime = card.querySelector('span:last-child');
        if (spanTime) spanTime.className = 'text-sm font-bold text-text-primary mt-0.5';
      }
    }
  });
}

function unduhJadwalSholatPDF() {
  const pdfData = APP_STATE.data.jadwalPdf;
  const url = pdfData ? safeUrl(pdfData.download_url || pdfData.file_url, '') : '';
  if (url) {
    window.open(url, '_blank', 'noopener');
    showToast('Membuka dokumen Jadwal Sholat...', 'picture_as_pdf');
  } else {
    showToast('Dokumen jadwal sholat belum tersedia. Silakan hubungi Takmir.', 'info');
  }
}

// ----------------------------------------------------------------------------
// 10. DONASI ONLINE & SUBMISSION HANDLER
// ----------------------------------------------------------------------------
let _selectedProgram = 'Pembangunan & Renovasi Kubah';
let _isHambaAllah = false;

function selectDonationProgram(progName, cardEl) {
  _selectedProgram = progName;
  document.getElementById('selectedProgramLabel').textContent = progName;
  document.getElementById('formProgramInput').value = progName;

  document.querySelectorAll('#donationProgramGrid .program-card').forEach(c => {
    c.classList.remove('selected', 'bg-surface-container-high', 'shadow-md');
    c.classList.add('bg-surface-card', 'shadow-sm');
    const pill = c.querySelector('.check-pill');
    if (pill) pill.classList.add('hidden');
    const title = c.querySelector('span:first-child');
    if (title) title.classList.remove('text-primary');
  });

  if (cardEl) {
    cardEl.classList.add('selected', 'bg-surface-container-high', 'shadow-md');
    cardEl.classList.remove('bg-surface-card', 'shadow-sm');
    const pill = cardEl.querySelector('.check-pill');
    if (pill) pill.classList.remove('hidden');
    const title = cardEl.querySelector('span:first-child');
    if (title) title.classList.add('text-primary');
  }
}

function toggleHambaAllah() {
  _isHambaAllah = !_isHambaAllah;
  const nameInput = document.getElementById('formDonorName');
  if (!nameInput) return;

  if (_isHambaAllah) {
    nameInput.value = 'Hamba Allah';
    nameInput.readOnly = true;
    nameInput.classList.add('bg-surface-container-high');
  } else {
    nameInput.value = '';
    nameInput.readOnly = false;
    nameInput.classList.remove('bg-surface-container-high');
    nameInput.focus();
  }
}

function setNominalDonasi(amount) {
  const input = document.getElementById('formNominalInput');
  if (input) input.value = amount;
}

function salinNomorRekening() {
  const acc = document.getElementById('bankAccNumber')?.textContent || '7142-9908-11';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(acc.replace(/\D/g, ''));
  }
  showToast('Nomor Rekening BSI berhasil disalin!', 'content_copy');
}

function salinMutiaraHadits() {
  const text = document.getElementById('hadithQuoteText')?.textContent || '';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text.trim() + ' — HR. Muslim (Portal Masjid Al Ikhlash)');
  }
  showToast('Mutiara hadits berhasil disalin ke clipboard!', 'share');
}

async function submitFormDonasi(e) {
  e.preventDefault();

  const honeypot = document.getElementById('hpCheck')?.value;
  if (honeypot) return; // Silent discard spam

  const btnSubmit = document.getElementById('btnSubmitDonasi');
  const nama = document.getElementById('formDonorName').value.trim();
  const phone = document.getElementById('formDonorPhone').value.trim();
  const nominal = Number(document.getElementById('formNominalInput').value);
  const note = document.getElementById('formDonorNote').value.trim();
  const fileInput = document.getElementById('formBuktiFile');

  if (!nominal || nominal < 1000) {
    showToast('Nominal minimal donasi Rp 1.000.', 'warning');
    return;
  }

  btnSubmit.disabled = true;
  btnSubmit.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> <span>Mengirim Konfirmasi...</span>`;

  let buktiBase64 = '';
  if (fileInput && fileInput.files && fileInput.files[0]) {
    try {
      buktiBase64 = await readFileAsBase64(fileInput.files[0]);
    } catch (err) {}
  }

  const payload = {
    program: _selectedProgram,
    nama_donatur: nama || 'Hamba Allah',
    no_wa: phone,
    nominal: nominal,
    doa_pesan: note,
    bukti_base64: buktiBase64
  };

  const res = await apiCall('submitDonasi', payload, 'POST');

  btnSubmit.disabled = false;
  btnSubmit.innerHTML = `<span class="material-symbols-outlined text-[18px]">send</span> <span>Kirim Konfirmasi Donasi</span>`;

  if (res && res.success) {
    if (res.message && res.message.indexOf('Catatan:') > -1) {
      showToast(res.message.slice(res.message.indexOf('Catatan:')).replace(' Jazakumullah khairan katsiran.', ''), 'warning', 9000);
    } else {
      showToast('Alhamdulillah, konfirmasi donasi berhasil dikirim!', 'check_circle');
    }
    document.getElementById('donationForm').reset();
    _isHambaAllah = false;
    document.getElementById('formDonorName').readOnly = false;
  } else {
    showToast('Gagal: ' + (res.message || 'Terjadi kesalahan.'), 'error');
  }
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// ----------------------------------------------------------------------------
// 11. AUTENTIKASI TAKMIR & DASHBOARD ADMIN (HMAC SESSION TOKEN)
// ----------------------------------------------------------------------------
function updateAuthUI() {
  const isAuth = !!APP_STATE.adminToken;
  const takmirLabel = document.getElementById('takmirBtnLabel');
  if (takmirLabel) takmirLabel.textContent = isAuth ? 'Takmir (Aktif)' : 'Takmir';

  const adminKasBar = document.getElementById('adminKasActionBar');
  if (adminKasBar) adminKasBar.classList.toggle('hidden', !isAuth);

  const adminKegBar = document.getElementById('adminKegiatanActionBar');
  if (adminKegBar) adminKegBar.classList.toggle('hidden', !isAuth);

  const adminPengBar = document.getElementById('adminPengurusActionBar');
  if (adminPengBar) adminPengBar.classList.toggle('hidden', !isAuth);

  // Tombol Ubah/Hapus pada kartu kegiatan hanya muncul saat Takmir login
  if (APP_STATE.data) renderKegiatanUI();
}

function openTakmirModal() {
  const modal = document.getElementById('modalTakmir');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');

  if (APP_STATE.adminToken) {
    document.getElementById('takmirLoginContainer')?.classList.add('hidden');
    document.getElementById('takmirDashboardContainer')?.classList.remove('hidden');
    muatAdminData();
  } else {
    document.getElementById('takmirLoginContainer')?.classList.remove('hidden');
    document.getElementById('takmirDashboardContainer')?.classList.add('hidden');
  }
}

function closeTakmirModal() {
  const modal = document.getElementById('modalTakmir');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const user = document.getElementById('loginUsername').value.trim();
  const pass = document.getElementById('loginPassword').value;
  const btn = document.getElementById('btnLoginSubmit');
  const errEl = document.getElementById('loginErrorMsg');

  errEl.classList.add('hidden');
  btn.disabled = true;
  btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> <span>Memverifikasi Sandi...</span>`;

  const res = await apiCall('loginAdmin', { username: user, password: pass }, 'POST');

  btn.disabled = false;
  btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">login</span> <span>Masuk ke Panel Takmir</span>`;

  if (res && res.success && res.token) {
    APP_STATE.adminToken = res.token;
    APP_STATE.adminUser = res.user;
    localStorage.setItem('al_ikhlash_token', res.token);
    localStorage.setItem('al_ikhlash_user', JSON.stringify(res.user));
    
    updateAuthUI();
    document.getElementById('loggedAdminName').textContent = res.user.nama || 'Takmir Masjid';
    document.getElementById('takmirLoginContainer').classList.add('hidden');
    document.getElementById('takmirDashboardContainer').classList.remove('hidden');
    showToast('Login berhasil. Selamat bertugas Takmir!', 'verified');
    if (res.user && res.user.wajibGantiPass) {
      bukaModalWajibGanti();
    } else {
      muatAdminData();
    }
  } else {
    errEl.textContent = res.message || 'Login gagal. Periksa username dan password.';
    errEl.classList.remove('hidden');
  }
}

function logoutAdmin() {
  APP_STATE.adminToken = null;
  APP_STATE.adminUser = null;
  localStorage.removeItem('al_ikhlash_token');
  localStorage.removeItem('al_ikhlash_user');
  updateAuthUI();
  closeTakmirModal();
  tutupEl_('modalWajibGanti');
  showToast('Anda telah keluar dari akun Takmir.', 'logout');
  applyKasFilter();
}

async function muatAdminData() {
  if (!APP_STATE.adminToken) return;
  const res = await apiCall('getAdminData', null, 'POST');
  if (res && res.success && res.data) {
    APP_STATE.donasiList = res.data.donasiList || [];
    renderAdminDonasiList();
    const saldoEl = document.getElementById('adminMiniSaldo');
    if (saldoEl) saldoEl.textContent = formatRupiah(APP_STATE.data.keuangan?.saldo);
  }
}

function showAdminTab(tabName) {
  document.querySelectorAll('.admin-tab').forEach(b => {
    const aktif = b.dataset.tab === tabName;
    b.classList.toggle('active', aktif);
    b.classList.toggle('bg-primary', aktif);
    b.classList.toggle('text-on-primary', aktif);
    b.classList.toggle('bg-surface-container', !aktif);
    b.classList.toggle('text-text-primary', !aktif);
  });
  document.getElementById('adminPanelDonasi')?.classList.toggle('hidden', tabName !== 'donasi');
  document.getElementById('adminPanelKas')?.classList.toggle('hidden', tabName !== 'kas');
  document.getElementById('adminPanelKonten')?.classList.toggle('hidden', tabName !== 'konten');
  if (tabName === 'konten') { renderAdminGaleriList(); isiFormProfil(); isiInfoJadwal(); }
}

function renderAdminDonasiList() {
  const container = document.getElementById('adminDonasiList');
  if (!container) return;

  const list = APP_STATE.donasiList || [];
  if (list.length === 0) {
    container.innerHTML = `<p class="text-xs text-text-muted text-center py-4">Belum ada donasi yang masuk.</p>`;
    return;
  }

  container.innerHTML = list.map(d => {
    const isPending = d.status === 'Menunggu';
    return `
      <div class="p-3 bg-surface rounded-xl flex flex-col gap-2 border border-border-divider/60 text-xs">
        <div class="flex items-center justify-between">
          <span class="font-bold text-text-primary">${esc(d.nama_donatur || 'Hamba Allah')}</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${isPending ? 'bg-gold-light text-secondary' : 'bg-surface-container-low text-income-green'}">
            ${esc(d.status || 'Menunggu')}
          </span>
        </div>
        <div class="flex justify-between text-text-muted text-[11px]">
          <span>${esc(d.program || 'Infaq')} • ${esc(d.tanggal || '')}</span>
          <span class="font-bold text-primary">${formatRupiah(d.nominal)}</span>
        </div>
        ${d.doa_pesan ? `<p class="italic text-[11px] text-text-muted bg-surface-card p-2 rounded-lg">“${esc(d.doa_pesan)}”</p>` : ''}
        ${isPending ? `
          <div class="flex gap-2 pt-1">
            <button onclick="verifikasiDonasi('${esc(d.id)}', 'Terverifikasi')" class="flex-1 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-[11px] active:scale-95">
              Setujui & Catat ke Kas
            </button>
            <button onclick="verifikasiDonasi('${esc(d.id)}', 'Ditolak')" class="px-3 py-1.5 rounded-lg bg-surface-card text-error font-bold text-[11px] active:scale-95">
              Tolak
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

async function verifikasiDonasi(idDonasi, status) {
  if (!confirm(`Ubah status donasi ${idDonasi} menjadi ${status}?`)) return;
  const res = await apiCall('verifyDonasi', { idDonasi, status }, 'POST');
  if (res && res.success) {
    showToast(res.message, 'verified');
    muatAdminData();
    revalidatePublicData();
  } else {
    showToast('Gagal: ' + (res.message || 'Terjadi kesalahan.'), 'error');
  }
}

// ----------------------------------------------------------------------------
// 12. CRUD KAS ADMIN MODAL
// ----------------------------------------------------------------------------
function bukaModalTambahKas() {
  const modal = document.getElementById('modalKasForm');
  if (!modal) return;
  document.getElementById('inputKasTanggal').value = new Date().toISOString().slice(0, 10);
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function tutupModalTambahKas() {
  const modal = document.getElementById('modalKasForm');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

async function handleTambahKasSubmit(e) {
  e.preventDefault();
  const payload = {
    tanggal: document.getElementById('inputKasTanggal').value,
    jenis: document.getElementById('inputKasJenis').value,
    kategori: document.getElementById('inputKasKategori').value.trim(),
    nominal: Number(document.getElementById('inputKasNominal').value),
    keterangan: document.getElementById('inputKasKet').value.trim(),
    metode: document.getElementById('inputKasMetode').value
  };

  const res = await apiCall('saveKas', payload, 'POST');
  if (res && res.success) {
    showToast('Transaksi kas berhasil dicatat.', 'check_circle');
    tutupModalTambahKas();
    revalidatePublicData();
  } else {
    showToast('Gagal: ' + (res.message || 'Error simpan kas'), 'error');
  }
}

async function hapusKasAdmin(idKas) {
  if (!confirm(`Yakin ingin menghapus transaksi kas ${idKas}?`)) return;
  const res = await apiCall('deleteKas', { id: idKas }, 'POST');
  if (res && res.success) {
    showToast('Transaksi kas berhasil dihapus.', 'delete');
    revalidatePublicData();
  } else {
    showToast('Gagal: ' + (res.message || 'Error hapus kas'), 'error');
  }
}

// ----------------------------------------------------------------------------
// 12b. ADMIN: KEGIATAN, PENGURUS, GALERI, PROFIL, GANTI SANDI
// ----------------------------------------------------------------------------
function bukaEl_(id) { const m = document.getElementById(id); if (m) { m.classList.remove('hidden'); m.classList.add('flex'); } }
function tutupEl_(id) { const m = document.getElementById(id); if (m) { m.classList.add('hidden'); m.classList.remove('flex'); } }

function sesiBerakhir_() {
  APP_STATE.adminToken = null;
  APP_STATE.adminUser = null;
  localStorage.removeItem('al_ikhlash_token');
  localStorage.removeItem('al_ikhlash_user');
  tutupEl_('modalWajibGanti');
  updateAuthUI();
  showToast('Sesi berakhir. Silakan login kembali.', 'lock');
  openTakmirModal();
}

async function simpanAdmin_(action, payload, btnId, pesanOk) {
  const btn = document.getElementById(btnId);
  if (btn) btn.disabled = true;
  const res = await apiCall(action, payload, 'POST');
  if (btn) btn.disabled = false;
  if (res && res.success) {
    showToast(pesanOk, 'check_circle');
    await revalidatePublicData();
    return true;
  }
  if (!res || (res.code !== 'UNAUTHORIZED' && res.code !== 'WAJIB_GANTI_PASS')) {
    showToast('Gagal: ' + ((res && res.message) || 'Terjadi kesalahan.'), 'error');
  }
  return false;
}

// ---- Kegiatan ----
function bukaModalTambahKegiatan() {
  document.getElementById('formKegiatan').reset();
  document.getElementById('kegId').value = '';
  document.getElementById('kegPoster').value = '';
  document.getElementById('kegTanggal').value = new Date().toISOString().slice(0, 10);
  document.getElementById('kegMulai').value = '19:30';
  document.getElementById('kegSelesai').value = '21:00';
  document.getElementById('kegFormTitle').textContent = 'Tambah Jadwal Kegiatan';
  bukaEl_('modalKegiatanForm');
}

function editKegiatan(id) {
  const k = (APP_STATE.data.kegiatan || []).find(x => String(x.id) === String(id));
  if (!k) return;
  document.getElementById('kegId').value = k.id;
  document.getElementById('kegPoster').value = k.poster_url || '';
  document.getElementById('kegJudul').value = k.judul || '';
  document.getElementById('kegKategori').value = k.kategori || '';
  document.getElementById('kegTanggal').value = String(k.tanggal || '').slice(0, 10);
  document.getElementById('kegMulai').value = k.waktu_mulai || '';
  document.getElementById('kegSelesai').value = k.waktu_selesai || '';
  document.getElementById('kegPenceramah').value = k.penceramah || '';
  document.getElementById('kegLokasi').value = k.lokasi || '';
  document.getElementById('kegKet').value = k.keterangan || '';
  document.getElementById('kegFormTitle').textContent = 'Ubah Jadwal Kegiatan';
  bukaEl_('modalKegiatanForm');
}

function tutupModalKegiatan() { tutupEl_('modalKegiatanForm'); }

async function handleKegiatanSubmit(e) {
  e.preventDefault();
  const payload = {
    id: document.getElementById('kegId').value || undefined,
    judul: document.getElementById('kegJudul').value.trim(),
    kategori: document.getElementById('kegKategori').value.trim(),
    tanggal: document.getElementById('kegTanggal').value,
    waktu_mulai: document.getElementById('kegMulai').value,
    waktu_selesai: document.getElementById('kegSelesai').value,
    penceramah: document.getElementById('kegPenceramah').value.trim(),
    lokasi: document.getElementById('kegLokasi').value.trim(),
    keterangan: document.getElementById('kegKet').value.trim(),
    poster_url: document.getElementById('kegPoster').value
  };
  if (await simpanAdmin_('saveKegiatan', payload, 'btnSimpanKegiatan', 'Jadwal kegiatan berhasil disimpan.')) tutupModalKegiatan();
}

async function hapusKegiatan(id) {
  const k = (APP_STATE.data.kegiatan || []).find(x => String(x.id) === String(id));
  if (!confirm(`Hapus kegiatan "${k ? k.judul : id}"?`)) return;
  const res = await apiCall('deleteKegiatan', { id: id }, 'POST');
  if (res && res.success) { showToast('Kegiatan dihapus.', 'delete'); revalidatePublicData(); }
  else if (!res || !res.code) showToast('Gagal: ' + ((res && res.message) || 'Error hapus'), 'error');
}

// ---- Pengurus ----
function bukaModalTambahPengurus() {
  document.getElementById('formPengurus').reset();
  document.getElementById('pengId').value = '';
  document.getElementById('pengUrutan').value = 10;
  document.getElementById('pengFormTitle').textContent = 'Tambah Data Pengurus';
  bukaEl_('modalPengurusForm');
}

function editPengurusAktif() {
  const p = (APP_STATE.data.pengurus || []).find(x => String(x.id) === String(_pengurusAktifId));
  if (!p) return;
  document.getElementById('pengId').value = p.id;
  document.getElementById('pengNama').value = p.nama || '';
  document.getElementById('pengJabatan').value = p.jabatan || '';
  document.getElementById('pengUrutan').value = p.urutan || 10;
  document.getElementById('pengMasa').value = p.masa_bakti || '';
  document.getElementById('pengWA').value = p.no_wa || '';
  document.getElementById('pengFoto').value = p.foto_url || '';
  document.getElementById('pengBio').value = p.profil_singkat || '';
  document.getElementById('pengFormTitle').textContent = 'Ubah Data Pengurus';
  tutupModalPengurusDetail();
  bukaEl_('modalPengurusForm');
}

function tutupModalPengurusForm() { tutupEl_('modalPengurusForm'); }

async function handlePengurusSubmit(e) {
  e.preventDefault();
  const payload = {
    id: document.getElementById('pengId').value || undefined,
    nama: document.getElementById('pengNama').value.trim(),
    jabatan: document.getElementById('pengJabatan').value.trim(),
    urutan: Number(document.getElementById('pengUrutan').value) || 10,
    masa_bakti: document.getElementById('pengMasa').value.trim(),
    no_wa: document.getElementById('pengWA').value.trim(),
    foto_url: document.getElementById('pengFoto').value.trim(),
    profil_singkat: document.getElementById('pengBio').value.trim()
  };
  if (await simpanAdmin_('savePengurus', payload, 'btnSimpanPengurus', 'Data pengurus berhasil disimpan.')) tutupModalPengurusForm();
}

async function hapusPengurusAktif() {
  const p = (APP_STATE.data.pengurus || []).find(x => String(x.id) === String(_pengurusAktifId));
  if (!p || !confirm(`Hapus data pengurus "${p.nama}"?`)) return;
  const res = await apiCall('deletePengurus', { id: p.id }, 'POST');
  if (res && res.success) {
    showToast('Data pengurus dihapus.', 'delete');
    tutupModalPengurusDetail();
    revalidatePublicData();
  } else if (!res || !res.code) showToast('Gagal: ' + ((res && res.message) || 'Error hapus'), 'error');
}

// ---- Galeri ----
function renderAdminGaleriList() {
  const box = document.getElementById('adminGaleriList');
  if (!box) return;
  const list = APP_STATE.data.galeri || [];
  if (list.length === 0) {
    box.innerHTML = '<p class="text-[11px] text-text-muted p-2">Belum ada foto galeri.</p>';
    return;
  }
  box.innerHTML = list.map(g => `
    <div class="flex items-center gap-2 p-2 bg-surface rounded-xl">
      <img src="${esc(safeUrl(g.foto_url, './assets/logo.png'))}" alt="" class="w-10 h-10 rounded-lg object-cover bg-surface-dim flex-shrink-0"/>
      <span class="text-xs font-semibold text-text-primary flex-1 truncate">${esc(g.judul)}</span>
      <button onclick="hapusGaleri('${esc(g.id)}')" class="text-[11px] text-error font-bold px-2" type="button">Hapus</button>
    </div>`).join('');
}

async function handleGaleriSubmit(e) {
  e.preventDefault();
  const payload = {
    judul: document.getElementById('galJudul').value.trim(),
    foto_url: document.getElementById('galUrl').value.trim(),
    keterangan: document.getElementById('galKet').value.trim(),
    urutan: (APP_STATE.data.galeri || []).length + 1
  };
  if (await simpanAdmin_('saveGaleri', payload, null, 'Foto galeri ditambahkan.')) {
    document.getElementById('formGaleri').reset();
    renderAdminGaleriList();
  }
}

async function hapusGaleri(id) {
  if (!confirm('Hapus foto ini dari galeri?')) return;
  const res = await apiCall('deleteGaleri', { id: id }, 'POST');
  if (res && res.success) {
    showToast('Foto galeri dihapus.', 'delete');
    await revalidatePublicData();
    renderAdminGaleriList();
  } else if (!res || !res.code) showToast('Gagal: ' + ((res && res.message) || 'Error hapus'), 'error');
}

// ---- Profil ----
function isiFormProfil() {
  const p = APP_STATE.data.profil || {};
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
  set('profNama', p.NAMA_MASJID); set('profAfiliasi', p.AFILIASI); set('profAlamat', p.ALAMAT);
  set('profVisi', p.VISI_MISI); set('profBank', p.BANK_ACCOUNT); set('profBankNama', p.BANK_HOLDER);
  set('profWA', p.KONTAK_WA); set('profEmail', p.EMAIL); set('profMaps', p.MAPS_URL);
}

async function handleProfilSubmit(e) {
  e.preventDefault();
  const v = id => document.getElementById(id).value.trim();
  const payload = {
    NAMA_MASJID: v('profNama'), AFILIASI: v('profAfiliasi'), ALAMAT: v('profAlamat'),
    VISI_MISI: v('profVisi'), BANK_ACCOUNT: v('profBank'), BANK_HOLDER: v('profBankNama'),
    KONTAK_WA: v('profWA'), EMAIL: v('profEmail'), MAPS_URL: v('profMaps')
  };
  await simpanAdmin_('saveProfil', payload, null, 'Profil masjid berhasil diperbarui.');
}

// ---- Jadwal Sholat PDF ----
function isiInfoJadwal() {
  const j = APP_STATE.data.jadwalPdf;
  const el = document.getElementById('jadwalAktifInfo');
  if (!el) return;
  const ada = j && (j.download_url || j.file_url);
  el.textContent = 'Jadwal aktif: ' + (j && j.bulan_tahun ? j.bulan_tahun : '-') + (ada ? '' : ' (file belum diunggah)');
}

async function handleJadwalPdfSubmit(e) {
  e.preventDefault();
  const bulan = document.getElementById('jadwalBulan').value.trim();
  const file = document.getElementById('jadwalFile').files[0];
  if (!file) { showToast('Pilih file PDF terlebih dahulu.', 'warning'); return; }
  if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
    showToast('File harus berformat PDF.', 'warning');
    return;
  }
  if (file.size > 4 * 1024 * 1024) {
    showToast('Ukuran PDF maksimal 4 MB.', 'warning');
    return;
  }
  const btn = document.getElementById('btnJadwalPdf');
  btn.disabled = true;
  btn.textContent = 'Mengunggah...';
  let b64 = '';
  try { b64 = await readFileAsBase64(file); }
  catch (err) { btn.disabled = false; btn.textContent = 'Unggah & Publikasikan'; showToast('Gagal membaca file.', 'error'); return; }

  const ok = await simpanAdmin_('uploadJadwalPdf', { bulan_tahun: bulan, pdf_base64: b64 }, null, 'Jadwal sholat berhasil dipublikasikan.');
  btn.disabled = false;
  btn.textContent = 'Unggah & Publikasikan';
  if (ok) {
    document.getElementById('formJadwalPdf').reset();
    isiInfoJadwal();
  }
}

// ---- Ganti sandi ----
function toggleGantiPassForm() {
  document.getElementById('formGantiPass')?.classList.toggle('hidden');
}

async function ubahSandi_(lama, baru, konfirm) {
  if (baru.length < 8) return 'Kata sandi baru minimal 8 karakter.';
  if (baru !== konfirm) return 'Konfirmasi kata sandi tidak sama.';
  if (baru === lama) return 'Kata sandi baru harus berbeda dari yang lama.';
  const res = await apiCall('gantiPassword', { passwordLama: lama, passwordBaru: baru }, 'POST');
  if (res && res.success) {
    if (APP_STATE.adminUser) {
      APP_STATE.adminUser.wajibGantiPass = false;
      localStorage.setItem('al_ikhlash_user', JSON.stringify(APP_STATE.adminUser));
    }
    return '';
  }
  return (res && res.message) || 'Gagal mengganti kata sandi.';
}

async function handleGantiPassSubmit(e) {
  e.preventDefault();
  const err = await ubahSandi_(
    document.getElementById('inputPassLama').value,
    document.getElementById('inputPassBaru').value,
    document.getElementById('inputPassKonfirm').value
  );
  if (err) { showToast(err, 'error'); return; }
  document.getElementById('formGantiPass').reset();
  document.getElementById('formGantiPass').classList.add('hidden');
  showToast('Kata sandi berhasil diperbarui.', 'verified_user');
}

function bukaModalWajibGanti() {
  document.getElementById('wgError')?.classList.add('hidden');
  bukaEl_('modalWajibGanti');
}

async function handleWajibGantiSubmit(e) {
  e.preventDefault();
  const errEl = document.getElementById('wgError');
  const btn = document.getElementById('btnWajibGanti');
  errEl.classList.add('hidden');
  btn.disabled = true;
  const err = await ubahSandi_(
    document.getElementById('wgLama').value,
    document.getElementById('wgBaru').value,
    document.getElementById('wgKonfirm').value
  );
  btn.disabled = false;
  if (err) { errEl.textContent = err; errEl.classList.remove('hidden'); return; }
  document.getElementById('formWajibGanti').reset();
  tutupEl_('modalWajibGanti');
  showToast('Kata sandi berhasil diganti. Selamat bertugas!', 'verified_user');
  muatAdminData();
}

// ----------------------------------------------------------------------------
// 13. TOAST MICRO-INTERACTION & SERVICE WORKER PWA
// ----------------------------------------------------------------------------
let _toastTimer = null;
function showToast(msg, icon = 'check_circle', ms = 3200) {
  const toast = document.getElementById('toast-feedback');
  const msgEl = document.getElementById('toast-message');
  const iconEl = document.getElementById('toast-icon');
  if (!toast || !msgEl) return;

  msgEl.textContent = msg;
  if (iconEl) iconEl.textContent = icon;

  toast.classList.remove('opacity-0', 'pointer-events-none');
  toast.classList.add('opacity-100');

  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0', 'pointer-events-none');
  }, ms);
}

// Daftarkan Service Worker PWA (GAS-PWA-GITHUB)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('PWA Service Worker registered:', reg.scope))
      .catch(err => console.warn('PWA SW registration error:', err));
  });
}

// Tangani Tombol Install Add to Home Screen (PWA)
let deferredInstallPrompt;
const btnInstall = document.getElementById('btnInstall');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  if (btnInstall) btnInstall.classList.remove('hidden');
});

if (btnInstall) {
  btnInstall.addEventListener('click', async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        btnInstall.classList.add('hidden');
        showToast('Terima kasih telah memasang aplikasi!', 'favorite');
      }
      deferredInstallPrompt = null;
    }
  });
}
