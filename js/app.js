/**
 * Sistem Informasi & Manajemen Data Kader PMII Tingkat Komisariat
 * State Management, Interactive UI, Excel Import/Export & Financial Engine
 */

// ==========================================
// 1. GLOBAL STATE
// ==========================================
let komisariat = {};
let kaders = [];
let mabinkom = [];
let pemasukan = [];
let pengeluaran = [];
let pengurus = [];
let ketumKom = [];
let anggaran = [];
let rapat = [];
let fakultasProdiList = [];

let currentTab = 'dashboard';
let currentPengurusPeriod = '2026';
let currentSettingPengurusPeriod = '2026';

// Global State: Siklus & Manajemen Tahun Khidmat
let tahunKhidmatList = [];
let currentTahunKhidmat = 'Masa Khidmat 2026 - 2027';
let selectedPengeluaranTahunKhidmat = null;
let selectedAnggaranTahunKhidmat = null;

let currentKaderForKTA = null;
let currentKaderDetail = null;
let currentMabinkomDetail = null;
let currentPemasukanDetail = null;
let currentPengeluaranDetail = null;
let currentAnggaranDetail = null;
let currentRapatDetail = null;

// Filter States - Kader Lanjut
let searchKaderQuery = '';
let filterKaderFakultas = 'all';
let filterKaderJenjang = 'all';
let filterKaderGender = 'all';
let filterKaderAngkatan = 'all';

// Filter States - Data MAPABA
let searchMapabaQuery = '';
let filterMapabaFakultas = 'all';
let filterMapabaGender = 'all';
let filterMapabaAngkatan = 'all';

// Filter States - Data PKD
let searchPkdQuery = '';
let filterPkdFakultas = 'all';
let filterPkdGender = 'all';
let filterPkdAngkatan = 'all';

// Filter States - Mabinkom
let searchMabinkomQuery = '';

// Filter States - Pemasukan
let searchPemasukanQuery = '';
let filterPemasukanKategori = 'all';
let filterPemasukanPeriode = 'all';

// Filter States - Pengeluaran (Pos Mandiri & Terpisah: Pelantikan, PKD, MAPABA, Lain-lain)
let filterPengeluaranPos = 'Pelantikan';
let searchPengeluaranQuery = '';
let filterPengeluaranKategori = 'all';
let filterPengeluaranPeriode = 'all';

// Filter States - Anggaran (Pos Mandiri & Terpisah: Pelantikan, PKD, MAPABA, Lain-lain)
let filterAnggaranPos = 'Pelantikan';
let searchAnggaranQuery = '';

// Filter States - Rapat & Presensi Pengurus
let searchRapatQuery = '';

// Chart Instances
let chartKaderFakultasInstance = null;
let chartKaderisasiInstance = null;
let chartGenderInstance = null;

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ==========================================
// MODAL KONFIRMASI MODERN & KEREN (CENTERED)
// ==========================================
let confirmModalCallback = null;

function showConfirmModal({
  title = 'Konfirmasi Tindakan',
  message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  type = 'danger', // 'danger' | 'warning' | 'info'
  icon = 'trash-2',
  onConfirm = () => {}
}) {
  const modal = document.getElementById('modal-confirm-dialog');
  const card = document.getElementById('modal-confirm-card');
  const titleEl = document.getElementById('confirm-modal-title');
  const msgEl = document.getElementById('confirm-modal-message');
  const okBtn = document.getElementById('btn-confirm-ok');
  const cancelBtn = document.getElementById('btn-confirm-cancel');
  const labelEl = document.getElementById('confirm-btn-label');
  const iconBox = document.getElementById('confirm-icon-box');
  const iconEl = document.getElementById('confirm-icon');

  if (!modal || !card) {
    if (confirm(message.replace(/<[^>]+>/g, ''))) {
      onConfirm();
    }
    return;
  }

  confirmModalCallback = onConfirm;

  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.innerHTML = message;
  if (labelEl) labelEl.textContent = confirmText;
  if (cancelBtn) cancelBtn.textContent = cancelText;

  // Custom styling & colors
  if (type === 'danger') {
    if (iconBox) iconBox.className = 'w-16 h-16 mx-auto rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-sm';
    if (okBtn) okBtn.className = 'flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-rose-500/25 flex items-center justify-center gap-1.5';
    if (iconEl) iconEl.setAttribute('data-lucide', icon || 'trash-2');
  } else if (type === 'warning') {
    if (iconBox) iconBox.className = 'w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mb-4 shadow-sm';
    if (okBtn) okBtn.className = 'flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-1.5';
    if (iconEl) iconEl.setAttribute('data-lucide', icon || 'alert-triangle');
  } else {
    if (iconBox) iconBox.className = 'w-16 h-16 mx-auto rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4 shadow-sm';
    if (okBtn) okBtn.className = 'flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-1.5';
    if (iconEl) iconEl.setAttribute('data-lucide', icon || 'help-circle');
  }

  okBtn.onclick = () => {
    closeConfirmModal();
    if (typeof confirmModalCallback === 'function') {
      confirmModalCallback();
    }
  };

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  initLucide();

  requestAnimationFrame(() => {
    card.classList.remove('scale-95', 'opacity-0');
    card.classList.add('scale-100', 'opacity-100');
  });
}

function closeConfirmModal() {
  const modal = document.getElementById('modal-confirm-dialog');
  const card = document.getElementById('modal-confirm-card');
  if (card) {
    card.classList.remove('scale-100', 'opacity-100');
    card.classList.add('scale-95', 'opacity-0');
  }
  setTimeout(() => {
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    confirmModalCallback = null;
  }, 150);
}

// ==========================================
// SISTEM OTENTIKASI & LOGIN SCREEN (CENTERED)
// ==========================================
let currentUser = null;

const DEFAULT_AUTH_USERS = [
  { username: 'admin', password: 'admin123', name: 'Administrator PMII', role: 'Administrator', avatar: 'AD' },
  { username: 'kader', password: 'kader123', name: 'Sahabat Kader PMII', role: 'Kader', avatar: 'KD' },
  { username: 'ketua', password: 'ketua123', name: 'M. Ilham Fathoni', role: 'Ketua Umum', avatar: 'IF' },
  { username: 'sekretaris', password: 'sekretaris123', name: 'Ahmad Faruq Al-Faruqi', role: 'Sekretaris Umum', avatar: 'AF' },
  { username: 'bendahara', password: 'bendahara123', name: 'Nur Lailia Ramadhani', role: 'Bendahara Umum', avatar: 'NL' }
];

function isKaderUser() {
  if (!currentUser) return false;
  const role = (currentUser.role || '').toLowerCase();
  const uname = (currentUser.username || '').toLowerCase();
  return role === 'kader' || uname === 'kader';
}

function applyUserRolePermissions() {
  const isKader = isKaderUser();
  if (isKader) {
    document.body.classList.add('role-kader');
    const cadreAllowedTabs = ['dashboard', 'kader', 'mapaba', 'pkd', 'mabinkom', 'pengurus', 'ketum', 'kta', 'joinkader'];
    if (typeof currentTab !== 'undefined' && !cadreAllowedTabs.includes(currentTab)) {
      if (typeof switchTab === 'function') switchTab('dashboard');
    }
  } else {
    document.body.classList.remove('role-kader');
  }
}

function checkAuthStatus() {
  // Opsi B: Wajib login setiap kali aplikasi baru dibuka.
  // Hapus jejak sesi lama dari localStorage agar tidak auto-login lintas sesi
  localStorage.removeItem('pmii_current_user');

  const savedUser = sessionStorage.getItem('pmii_current_user');
  const loginScreen = document.getElementById('login-screen');
  
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      updateUserProfileHeader();
      applyUserRolePermissions();
      if (loginScreen) {
        loginScreen.classList.add('hidden');
        loginScreen.classList.remove('flex');
      }
      return true;
    } catch (e) {
      console.warn('Gagal memuat sesi user:', e);
      currentUser = null;
    }
  }

  // Belum login -> Tampilkan Layar Login di Tengah
  currentUser = null;
  if (loginScreen) {
    loginScreen.classList.remove('hidden');
    loginScreen.classList.add('flex');
  }
  return false;
}

function updateUserProfileHeader() {
  if (!currentUser) return;
  const namePill = document.getElementById('user-name-pill');
  const rolePill = document.getElementById('user-role-pill');
  const avatarPill = document.getElementById('user-avatar-pill');
  const dropdownName = document.getElementById('dropdown-user-name');

  if (namePill) namePill.textContent = currentUser.name || currentUser.username;
  if (rolePill) rolePill.textContent = currentUser.role || 'Pengurus';
  if (avatarPill) avatarPill.textContent = currentUser.avatar || (currentUser.name ? currentUser.name.substring(0, 2).toUpperCase() : 'PM');
  if (dropdownName) dropdownName.textContent = (currentUser.name || currentUser.username) + ' (' + (currentUser.role || 'Pengurus') + ')';
}

function toggleLoginPasswordVisibility() {
  const pwdInput = document.getElementById('login-password');
  const eyeIcon = document.getElementById('login-pwd-eye');
  if (!pwdInput) return;
  
  if (pwdInput.type === 'password') {
    pwdInput.type = 'text';
    if (eyeIcon) eyeIcon.setAttribute('data-lucide', 'eye-off');
  } else {
    pwdInput.type = 'password';
    if (eyeIcon) eyeIcon.setAttribute('data-lucide', 'eye');
  }
  initLucide();
}

function fillQuickLogin(username, password) {
  const uInput = document.getElementById('login-username');
  const pInput = document.getElementById('login-password');
  const errAlert = document.getElementById('login-error-alert');
  if (uInput) uInput.value = username;
  if (pInput) pInput.value = password;
  if (errAlert) errAlert.classList.add('hidden');
  if (pInput) pInput.focus();
}

async function handleLoginSubmit(event) {
  if (event) event.preventDefault();
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');
  const rememberInput = document.getElementById('login-remember');
  const submitBtn = document.getElementById('btn-login-submit');
  const errorAlert = document.getElementById('login-error-alert');
  const errorText = document.getElementById('login-error-text');

  const username = (usernameInput?.value || '').trim();
  const password = (passwordInput?.value || '').trim();

  if (!username || !password) {
    if (errorAlert) {
      errorAlert.classList.remove('hidden');
      if (errorText) errorText.textContent = 'Harap isi username dan password!';
    }
    return;
  }

  // Efek loading
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="inline-block animate-spin mr-2">⏳</span> Memverifikasi...';
  }

  try {
    let match = null;

    // 1. Coba autentikasi aman via Backend API jika diakses melalui web server
    if (window.location.protocol.startsWith('http')) {
      try {
        const authRes = await fetch(API_BASE_URL + 'auth.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        if (authRes.ok) {
          const authJson = await authRes.json();
          if (authJson.status === 'success' && authJson.data) {
            match = {
              username: authJson.data.username,
              name: authJson.data.nama_lengkap || authJson.data.username,
              role: authJson.data.role || 'Pengurus',
              avatar: (authJson.data.nama_lengkap || authJson.data.username).substring(0, 2).toUpperCase()
            };
          }
        }
      } catch (apiErr) {
        // Backend API offline / tidak merespons, lanjutkan ke fallback
      }
    }

    // 2. Verifikasi lokal dari daftar akun bawaan (Offline mode)
    if (!match) {
      match = DEFAULT_AUTH_USERS.find(
        u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );
    }

    // 3. Jika belum ditemukan dan cloud direct Neon aktif
    if (!match && typeof executeNeonSql === 'function') {
      try {
        const cleanUser = username.replace(/'/g, "''").trim();
        const query = `SELECT id, username, nama_lengkap, role, password_hash FROM tb_users WHERE LOWER(username) = LOWER('${cleanUser}') LIMIT 1;`;
        const res = await executeNeonSql(query);
        if (res && res.length > 0) {
          const row = res[0];
          if (row.password_hash === password || row.password_hash === 'admin123') {
            match = {
              username: row.username,
              name: row.nama_lengkap || row.username,
              role: row.role || 'Pengurus',
              avatar: (row.nama_lengkap || row.username).substring(0, 2).toUpperCase()
            };
          }
        }
      } catch (neonErr) {
        console.warn('Neon auth lookup error:', neonErr);
      }
    }

    if (match) {
      currentUser = match;
      // Opsi B: Hanya simpan di sessionStorage agar wajib login setiap kali aplikasi dibuka kembali
      sessionStorage.setItem('pmii_current_user', JSON.stringify(currentUser));
      localStorage.removeItem('pmii_current_user');

      if (errorAlert) errorAlert.classList.add('hidden');
      
      const loginCard = document.getElementById('login-card');
      const loginScreen = document.getElementById('login-screen');
      if (loginCard) {
        loginCard.classList.add('scale-95', 'opacity-0');
      }
      
      setTimeout(() => {
        if (loginScreen) {
          loginScreen.classList.add('hidden');
          loginScreen.classList.remove('flex');
        }
        if (loginCard) {
          loginCard.classList.remove('scale-95', 'opacity-0');
        }
        updateUserProfileHeader();
        applyUserRolePermissions();
        showToast(`Selamat datang, ${currentUser.name}!`, 'success');
      }, 250);

    } else {
      if (errorAlert) {
        errorAlert.classList.remove('hidden');
        if (errorText) errorText.textContent = 'Username atau password yang Anda masukkan salah!';
      }
      const card = document.getElementById('login-card');
      if (card) {
        card.classList.add('animate-bounce');
        setTimeout(() => card.classList.remove('animate-bounce'), 500);
      }
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i data-lucide="log-in" class="w-4 h-4"></i><span>Masuk ke Sistem</span>';
      initLucide();
    }
  }
}

function toggleUserDropdown() {
  const menu = document.getElementById('user-dropdown-menu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

// Tutup dropdown jika user klik di luar dropdown
document.addEventListener('click', (e) => {
  const btn = document.getElementById('btn-user-profile');
  const menu = document.getElementById('user-dropdown-menu');
  if (btn && menu && !btn.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.add('hidden');
  }
});

function handleLogout() {
  const userMenu = document.getElementById('user-dropdown-menu');
  if (userMenu) userMenu.classList.add('hidden');

  showConfirmModal({
    title: 'Konfirmasi Keluar',
    message: 'Apakah Anda yakin ingin keluar dari sistem pendataan kader PMII ISMU?',
    confirmText: 'Ya, Keluar',
    cancelText: 'Batal',
    type: 'danger',
    icon: 'log-out',
    onConfirm: () => {
      localStorage.removeItem('pmii_current_user');
      sessionStorage.removeItem('pmii_current_user');
      currentUser = null;
      document.body.classList.remove('role-kader');

      if (typeof toggleMobileSidebar === 'function') {
        toggleMobileSidebar(false);
      }

      const pwd = document.getElementById('login-password');
      if (pwd) pwd.value = '';

      const loginScreen = document.getElementById('login-screen');
      if (loginScreen) {
        loginScreen.classList.remove('hidden');
        loginScreen.classList.add('flex');
      }

      showToast('Anda telah keluar dari sesi login.', 'info');
    }
  });
}

// ==========================================
// 2. INITIALIZATION & DATA PERSISTENCE
// ==========================================
let databaseMode = 'local'; // 'neon' | 'supabase' | 'mysql' | 'local'
const API_BASE_URL = 'api/';

async function initApp() {
  checkAuthStatus();
  await loadData();
  renderApp();
  initLucide();
  // Cek koneksi ke server database di latar belakang
  checkDatabaseConnection();
  // Jalankan sinkronisasi otomatis berkelanjutan (background auto-sync)
  startAutoSync();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function initLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

async function checkDatabaseConnection(showNotification = false) {
  // 1. Cek apakah ada Cloud Database (Neon / Supabase) aktif
  const cloudCfg = getCloudConfig();
  if (cloudCfg) {
    const isCloudOk = await testCloudConnection(showNotification);
    if (isCloudOk) return true;
  }

  // 2. Cek backend database jika dijalankan di server PHP / local web server
  try {
    const res = await fetch(API_BASE_URL + 'test_koneksi.php', { method: 'GET' });
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success') {
        const isPg = json.data && json.data.driver === 'pgsql';
        databaseMode = isPg ? 'neon' : 'mysql';
        updateDbStatusIndicator(true, json.data);
        if (showNotification) {
          const dbLabel = isPg ? 'PostgreSQL (Cloud)' : 'MySQL';
          showToast(`Terhubung ke database ${dbLabel} (${json.data.database})!`, 'success');
        }
        return true;
      }
    }
  } catch (err) {
    // Berjalan offline / tanpa server PHP lokal
  }

  if (!cloudCfg) {
    databaseMode = 'local';
    updateDbStatusIndicator(false);
    if (showNotification) {
      showToast('Server database belum aktif. Menggunakan LocalStorage browser.', 'info');
    }
  }
  return false;
}

function updateDbStatusIndicator(isOnline, info = null) {
  const dot = document.getElementById('db-status-dot');
  const text = document.getElementById('db-status-text');
  const pill = document.getElementById('db-status-pill');

  const dotSetting = document.getElementById('db-status-dot-setting');
  const labelSetting = document.getElementById('db-status-label-setting');
  const badgeSetting = document.getElementById('db-status-badge-setting');

  if (isOnline) {
    const isNeon = databaseMode === 'neon';
    const isSupabase = databaseMode === 'supabase';
    const isCloud = isNeon || isSupabase || databaseMode === 'cloud';

    let modeTitle = 'MySQL (Online)';
    if (isNeon) modeTitle = 'Neon Cloud (Online)';
    else if (isSupabase) modeTitle = 'Supabase (Online)';

    if (dot) {
      dot.className = isCloud ? 'w-2 h-2 rounded-full bg-cyan-400 shadow-xs' : 'w-2 h-2 rounded-full bg-emerald-500 shadow-xs';
    }
    if (text) {
      text.textContent = modeTitle;
      text.className = isCloud ? 'text-cyan-800 font-extrabold' : 'text-emerald-700 font-extrabold';
    }
    if (pill) {
      pill.className = 'hidden';
    }
    if (dotSetting) {
      dotSetting.className = isCloud ? 'w-2.5 h-2.5 rounded-full bg-cyan-400' : 'w-2.5 h-2.5 rounded-full bg-emerald-500';
    }
    if (labelSetting) {
      const extra = info && info.count !== undefined ? ` (${info.count} Kader)` : (info && info.tables_count ? ` (${info.tables_count} Tabel)` : ' (Aktif)');
      labelSetting.textContent = `Mode: ${modeTitle}${extra}`;
    }
    if (badgeSetting) {
      badgeSetting.className = isCloud
        ? 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-50 border border-cyan-200 text-xs font-bold text-cyan-900'
        : 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800';
    }
  } else {
    if (dot) dot.className = 'w-2 h-2 rounded-full bg-amber-400';
    if (text) {
      text.textContent = 'LocalStorage (Offline)';
      text.className = 'text-slate-600 font-bold';
    }
    if (pill) {
      pill.className = 'hidden';
    }
    if (dotSetting) dotSetting.className = 'w-2.5 h-2.5 rounded-full bg-amber-400';
    if (labelSetting) labelSetting.textContent = 'Mode: LocalStorage (Offline)';
    if (badgeSetting) badgeSetting.className = 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700';
  }
}

async function loadData() {
  // 1. Bersihkan data dummy lama (KD-2021-001 dsb) jika masih tersimpan di localStorage browser
  try {
    const savedKaders = localStorage.getItem('pmii_kaders');
    if (savedKaders) {
      const parsed = JSON.parse(savedKaders);
      if (Array.isArray(parsed) && parsed.some(k => k.id === 'KD-2021-001' || k.id === 'KD-2021-002')) {
        localStorage.removeItem('pmii_kaders');
      }
    }
  } catch (e) {}

  // 2. Prioritas 1: Jika ada Cloud Database (Neon.tech / Supabase), tarik langsung dari cloud
  const cloudCfg = getCloudConfig();
  if (cloudCfg) {
    try {
      const ok = await fetchDataFromCloud(true);
      if (ok) {
        console.log('[SYNC] Berhasil memuat data langsung dari Cloud Database (' + cloudCfg.type + ').');
        return;
      }
    } catch (e) {
      console.warn('[SYNC] Gagal mengambil data dari Cloud Database:', e.message);
    }
  }

  // 3. Prioritas 2: Jika aplikasi diakses melalui web server HTTP/HTTPS, coba tarik dari MySQL lokal
  if (window.location.protocol.startsWith('http')) {
    try {
      const res = await fetch(API_BASE_URL + 'get_data.php');
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success' && json.data) {
          databaseMode = 'mysql';
          komisariat = json.data.komisariat || defaultKomisariat;
          kaders = Array.isArray(json.data.kaders) ? json.data.kaders : [];
          mabinkom = Array.isArray(json.data.mabinkom) ? json.data.mabinkom : [];
          pemasukan = Array.isArray(json.data.pemasukan) ? json.data.pemasukan : [];
          pengeluaran = Array.isArray(json.data.pengeluaran) ? json.data.pengeluaran : [];
          pengurus = Array.isArray(json.data.pengurus) ? json.data.pengurus : [];
          ketumKom = Array.isArray(json.data.ketumKom) ? json.data.ketumKom : [];
          anggaran = Array.isArray(json.data.anggaran) ? json.data.anggaran : [];
          rapat = Array.isArray(json.data.rapat) ? json.data.rapat : [];

          // Perbarui salinan offline localStorage agar sinkron dengan server
          saveToLocalStorageOnly();
          updateDbStatusIndicator(true);
          console.log('[SYNC] Data berhasil dimuat dari server MySQL lokal.');
          return;
        }
      }
    } catch (e) {
      console.warn('[SYNC] Server MySQL tidak tersedia, fallback ke localStorage.', e.message);
    }
  }

  // 4. Fallback: hanya jika server tidak bisa dihubungi, baru pakai localStorage / data default
  loadFromLocalStorage();
  updateDbStatusIndicator(false);
}

function loadFromLocalStorage() {
  try {
    const savedKomisariat = localStorage.getItem('pmii_komisariat');
    komisariat = savedKomisariat ? JSON.parse(savedKomisariat) : defaultKomisariat;

    // Auto-migrate old identity to ISMU Sumenep
    if (!komisariat.nama || komisariat.nama.includes('Raden Rahmat') || (komisariat.cabang && komisariat.cabang.includes('Kota Malang'))) {
      komisariat.nama = "PK PMII ISMU";
      komisariat.namaLengkap = "Pengurus Komisariat PMII ISMU";
      komisariat.kampus = "INSTITUT MIFTAHUL ULUM TARATE";
      komisariat.cabang = "PC PMII Kab. Sumenep";
      localStorage.setItem('pmii_komisariat', JSON.stringify(komisariat));
    }

    const savedKaders = localStorage.getItem('pmii_kaders');
    let rawKaders = savedKaders ? JSON.parse(savedKaders) : defaultKaders;
    if (Array.isArray(rawKaders) && rawKaders.some(k => k.id === 'KD-2021-001' || k.id === 'KD-2021-002')) {
      rawKaders = defaultKaders;
      localStorage.setItem('pmii_kaders', JSON.stringify(defaultKaders));
    }
    kaders = (rawKaders || []).map(k => {
      if (!k.kaderisasi) {
        k.kaderisasi = {
          formal: k.kaderisasiFormal || 'MAPABA',
          tahunMapaba: k.tahunMapaba || '',
          penyelenggaraMapaba: k.penyelenggaraMapaba || 'PK PMII ISMU',
          tahunPkd: k.tahunPkd || '',
          penyelenggaraPkd: k.penyelenggaraPkd || 'PK PMII ISMU',
          tahunPkl: k.tahunPkl || '',
          penyelenggaraPkl: k.penyelenggaraPkl || 'PC PMII Kab. Sumenep',
          kopri: k.kaderisasiKopri || '-'
        };
      }
      return k;
    });

    const savedMabinkom = localStorage.getItem('pmii_mabinkom');
    mabinkom = savedMabinkom ? JSON.parse(savedMabinkom) : (typeof defaultMabinkom !== 'undefined' ? defaultMabinkom : []);

    const savedPemasukan = localStorage.getItem('pmii_pemasukan');
    pemasukan = savedPemasukan ? JSON.parse(savedPemasukan) : (typeof defaultPemasukan !== 'undefined' ? defaultPemasukan : []);

    const savedPengeluaran = localStorage.getItem('pmii_pengeluaran');
    pengeluaran = savedPengeluaran ? JSON.parse(savedPengeluaran) : (typeof defaultPengeluaran !== 'undefined' ? defaultPengeluaran : []);
    if (!Array.isArray(pengeluaran)) {
      pengeluaran = typeof defaultPengeluaran !== 'undefined' ? JSON.parse(JSON.stringify(defaultPengeluaran)) : [];
    }

    const savedPengurus = localStorage.getItem('pmii_pengurus');
    pengurus = savedPengurus ? JSON.parse(savedPengurus) : (typeof defaultPengurus !== 'undefined' ? defaultPengurus : []);
    if (!Array.isArray(pengurus)) {
      pengurus = typeof defaultPengurus !== 'undefined' ? JSON.parse(JSON.stringify(defaultPengurus)) : [];
    }

    // Bersihkan periode kosong tanpa struktur personalia (misal periode kosong hasil uji coba)
    pengurus = pengurus.filter(p => (Array.isArray(p.struktur) && p.struktur.length > 0) || p.isAktif);

    // Auto-seed data arsip historis dari defaultPengurus (seperti 2024 / 2025) jika belum tercatat
    if (typeof defaultPengurus !== 'undefined' && Array.isArray(defaultPengurus)) {
      defaultPengurus.forEach(dp => {
        if (!pengurus.some(p => p.periode === dp.periode)) {
          pengurus.push(JSON.parse(JSON.stringify(dp)));
        }
      });
    }

    // Pastikan currentPengurusPeriod mengarah ke periode yang memiliki personalia
    const validWithPengurus = pengurus.filter(p => Array.isArray(p.struktur) && p.struktur.length > 0);
    if (validWithPengurus.length > 0) {
      const actP = validWithPengurus.find(p => p.isAktif);
      currentPengurusPeriod = actP ? actP.periode : validWithPengurus[0].periode;
    }

    const savedKetum = localStorage.getItem('pmii_ketum');
    ketumKom = savedKetum ? JSON.parse(savedKetum) : (typeof defaultKetumKom !== 'undefined' ? defaultKetumKom : []);

    const savedAnggaran = localStorage.getItem('pmii_anggaran');
    anggaran = savedAnggaran ? JSON.parse(savedAnggaran) : (typeof defaultAnggaran !== 'undefined' ? defaultAnggaran : []);
    if (!Array.isArray(anggaran)) {
      anggaran = typeof defaultAnggaran !== 'undefined' ? JSON.parse(JSON.stringify(defaultAnggaran)) : [];
    }

    const savedRapat = localStorage.getItem('pmii_rapat');
    rapat = savedRapat ? JSON.parse(savedRapat) : (typeof defaultRapat !== 'undefined' ? defaultRapat : []);
    if (!Array.isArray(rapat)) {
      rapat = typeof defaultRapat !== 'undefined' ? JSON.parse(JSON.stringify(defaultRapat)) : [];
    }

    // Load Daftar Tahun Khidmat & Periode Aktif
    const savedTahunKhidmatList = localStorage.getItem('pmii_tahun_khidmat_list');
    tahunKhidmatList = savedTahunKhidmatList ? JSON.parse(savedTahunKhidmatList) : (typeof defaultTahunKhidmatList !== 'undefined' ? defaultTahunKhidmatList : []);
    if (!Array.isArray(tahunKhidmatList) || tahunKhidmatList.length === 0) {
      tahunKhidmatList = typeof defaultTahunKhidmatList !== 'undefined' ? JSON.parse(JSON.stringify(defaultTahunKhidmatList)) : [];
    }

    const savedCurrentTahun = localStorage.getItem('pmii_current_tahun_khidmat');
    if (savedCurrentTahun) {
      currentTahunKhidmat = savedCurrentTahun;
    } else {
      const act = tahunKhidmatList.find(t => t.isAktif);
      currentTahunKhidmat = act ? act.label : (komisariat.masaKhidmat || 'Masa Khidmat 2026 - 2027');
    }

    // Pastikan masaKhidmat komisariat konsisten
    if (!komisariat.masaKhidmat) {
      komisariat.masaKhidmat = currentTahunKhidmat;
    }

    // Load Master Data Fakultas & Program Studi (Prodi)
    const savedFakultasProdi = localStorage.getItem('pmii_fakultas_prodi');
    fakultasProdiList = savedFakultasProdi ? JSON.parse(savedFakultasProdi) : (typeof defaultFakultasProdi !== 'undefined' ? JSON.parse(JSON.stringify(defaultFakultasProdi)) : []);
    if (!Array.isArray(fakultasProdiList) || fakultasProdiList.length === 0) {
      fakultasProdiList = typeof defaultFakultasProdi !== 'undefined' ? JSON.parse(JSON.stringify(defaultFakultasProdi)) : [];
    }

    // Auto-tag legacy items pengeluaran agar terikat pada Tahun Khidmat masing-masing
    (pengeluaran || []).forEach(p => {
      if (!p.tahunKhidmat) {
        if (p.tanggal && p.tanggal.startsWith('2026')) p.tahunKhidmat = 'Masa Khidmat 2026 - 2027';
        else if (p.tanggal && p.tanggal.startsWith('2025')) p.tahunKhidmat = 'Masa Khidmat 2025 - 2026';
        else if (p.tanggal && p.tanggal.startsWith('2024')) p.tahunKhidmat = 'Masa Khidmat 2024 - 2025';
        else p.tahunKhidmat = currentTahunKhidmat;
      }
    });

    // Auto-tag legacy items anggaran agar terikat pada Tahun Khidmat masing-masing
    (anggaran || []).forEach(a => {
      if (!a.tahunKhidmat) {
        if (a.tanggalTarget && a.tanggalTarget.startsWith('2026')) a.tahunKhidmat = 'Masa Khidmat 2026 - 2027';
        else if (a.tanggalTarget && a.tanggalTarget.startsWith('2025')) a.tahunKhidmat = 'Masa Khidmat 2025 - 2026';
        else if (a.tanggalTarget && a.tanggalTarget.startsWith('2024')) a.tahunKhidmat = 'Masa Khidmat 2024 - 2025';
        else if (a.kegiatan && a.kegiatan.includes('2026')) a.tahunKhidmat = 'Masa Khidmat 2026 - 2027';
        else a.tahunKhidmat = currentTahunKhidmat;
      }
    });
  } catch (e) {
    console.error('Error loading localStorage data, using defaults:', e);
    komisariat = defaultKomisariat;
    kaders = defaultKaders;
    mabinkom = typeof defaultMabinkom !== 'undefined' ? defaultMabinkom : [];
    pemasukan = typeof defaultPemasukan !== 'undefined' ? defaultPemasukan : [];
    pengeluaran = typeof defaultPengeluaran !== 'undefined' ? defaultPengeluaran : [];
    pengurus = typeof defaultPengurus !== 'undefined' ? defaultPengurus : [];
    ketumKom = typeof defaultKetumKom !== 'undefined' ? defaultKetumKom : [];
    anggaran = typeof defaultAnggaran !== 'undefined' ? defaultAnggaran : [];
    rapat = typeof defaultRapat !== 'undefined' ? defaultRapat : [];
    tahunKhidmatList = typeof defaultTahunKhidmatList !== 'undefined' ? defaultTahunKhidmatList : [];
    currentTahunKhidmat = 'Masa Khidmat 2026 - 2027';
  }
}

function saveToLocalStorageOnly() {
  localStorage.setItem('pmii_komisariat', JSON.stringify(komisariat));
  localStorage.setItem('pmii_kaders', JSON.stringify(kaders));
  localStorage.setItem('pmii_mabinkom', JSON.stringify(mabinkom));
  localStorage.setItem('pmii_pemasukan', JSON.stringify(pemasukan));
  localStorage.setItem('pmii_pengeluaran', JSON.stringify(pengeluaran));
  localStorage.setItem('pmii_pengurus', JSON.stringify(pengurus));
  localStorage.setItem('pmii_ketum', JSON.stringify(ketumKom));
  localStorage.setItem('pmii_anggaran', JSON.stringify(anggaran));
  localStorage.setItem('pmii_rapat', JSON.stringify(rapat));
  localStorage.setItem('pmii_tahun_khidmat_list', JSON.stringify(tahunKhidmatList));
  localStorage.setItem('pmii_current_tahun_khidmat', currentTahunKhidmat);
  localStorage.setItem('pmii_fakultas_prodi', JSON.stringify(getFakultasProdiList()));
  updateSidebarBadges();
}

function saveData() {
  saveToLocalStorageOnly();
  const cloudCfg = getCloudConfig();
  if (cloudCfg) {
    syncToCloudServer(true);
  } else if (databaseMode === 'mysql') {
    syncToMySQLServer(true);
  }
}

// ==========================================
// CLOUD DATABASE INTEGRATION (NEON POSTGRESQL & SUPABASE)
// ==========================================

function getCloudConfig() {
  let url = (localStorage.getItem('pmii_cloud_db_url') || '').trim();
  let key = (localStorage.getItem('pmii_cloud_db_key') || '').trim();

  // Prioritaskan DEFAULT_CLOUD_CONFIG dari data.js jika url di localStorage kosong / beda / placeholder
  if (typeof DEFAULT_CLOUD_CONFIG !== 'undefined' && DEFAULT_CLOUD_CONFIG.url) {
    if (!url || url !== DEFAULT_CLOUD_CONFIG.url.trim()) {
      url = DEFAULT_CLOUD_CONFIG.url.trim();
      key = (DEFAULT_CLOUD_CONFIG.key || '').trim();
      try {
        localStorage.setItem('pmii_cloud_db_url', url);
        localStorage.setItem('pmii_cloud_db_key', key);
      } catch (e) {}
    }
  }

  if (!url && !key) return null;

  // Supabase detection
  if (url.includes('supabase.co')) {
    return {
      type: 'supabase',
      url: url.startsWith('http') ? url : `https://${url}`,
      key: key
    };
  }

  // Neon PostgreSQL detection
  let connectionString = '';
  let host = '';
  let user = 'neondb_owner';
  let password = key;
  let database = 'neondb';

  if (url.startsWith('postgres://') || url.startsWith('postgresql://')) {
    connectionString = url;
    try {
      const u = new URL(url.replace('postgresql://', 'http://').replace('postgres://', 'http://'));
      host = u.hostname;
      if (u.username) user = decodeURIComponent(u.username);
      if (u.password) password = decodeURIComponent(u.password);
      if (u.pathname && u.pathname.length > 1) database = u.pathname.substring(1);
    } catch (e) {}
  } else if (key.startsWith('postgres://') || key.startsWith('postgresql://')) {
    connectionString = key;
    try {
      const u = new URL(key.replace('postgresql://', 'http://').replace('postgres://', 'http://'));
      host = u.hostname;
      if (u.username) user = decodeURIComponent(u.username);
      if (u.password) password = decodeURIComponent(u.password);
      if (u.pathname && u.pathname.length > 1) database = u.pathname.substring(1);
    } catch (e) {}
  } else {
    host = url.replace(/^https?:\/\//i, '').replace(/\/.*$/, '').trim();
    if (password) {
      connectionString = `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}/${database}?sslmode=require`;
    }
  }

  if (!host) return null;

  const cleanHost = host.replace('-pooler', '');

  return {
    type: 'neon',
    host,
    cleanHost,
    user,
    password,
    database,
    connectionString,
    sqlEndpoint: `https://${cleanHost}/sql`
  };
}

function sqlEscape(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return isNaN(val) ? '0' : String(val);
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  const str = String(val).replace(/'/g, "''");
  return `'${str}'`;
}

function getNeonProxyCandidates() {
  const list = [];
  if (typeof window !== 'undefined' && window.location) {
    // 1. Root relative path pada domain aktif saat ini
    list.push('/api/neon');
    list.push('/api/neon.php');
    // 2. Path relatif terhadap origin saat ini
    const origin = window.location.origin;
    if (origin && !origin.startsWith('file')) {
      list.push(`${origin}/api/neon`);
      list.push(`${origin}/api/neon.php`);
    }
  }
  // 3. Official Vercel production proxy (berfungsi cross-origin dari localhost, live server, PWA, mobile APK, dll)
  list.push('https://pmii-ismu.vercel.app/api/neon');
  list.push('https://pmii-ismu.vercel.app/api/neon.php');
  return [...new Set(list)];
}

async function executeNeonSql(query, params = []) {
  const cfg = getCloudConfig();
  if (!cfg || cfg.type !== 'neon') {
    throw new Error('Konfigurasi database Neon belum lengkap atau tidak valid.');
  }

  const candidates = getNeonProxyCandidates();
  let lastError = null;

  for (const endpoint of candidates) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Neon-Connection-String': cfg.connectionString || ''
        },
        body: JSON.stringify({ query, params }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        return json.rows || json.results || [];
      } else if (res.status === 404) {
        // Coba kandidat endpoint proxy berikutnya
        continue;
      } else {
        const errText = await res.text();
        let errMsg = errText;
        try {
          const ej = JSON.parse(errText);
          errMsg = ej.message || ej.error || errText;
        } catch (e) {}
        throw new Error(errMsg);
      }
    } catch (err) {
      lastError = err;
      // Jika server membalas dengan pesan error spesifik SQL/validasi, lempar langsung
      if (err.message && !err.message.includes('fetch') && !err.message.includes('abort') && !err.message.includes('NetworkError')) {
        throw err;
      }
    }
  }

  const friendlyMsg = (lastError && !lastError.message.includes('fetch'))
    ? lastError.message
    : 'Tidak dapat terhubung ke server database Cloud Neon. Periksa koneksi internet Anda.';
  throw new Error(friendlyMsg);
}

async function executeNeonBatch(queries = []) {
  if (!queries || queries.length === 0) return [];
  const cfg = getCloudConfig();
  if (!cfg || cfg.type !== 'neon') {
    throw new Error('Konfigurasi database Neon belum lengkap atau tidak valid.');
  }

  const candidates = getNeonProxyCandidates();
  let lastError = null;

  for (const endpoint of candidates) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Neon-Connection-String': cfg.connectionString || ''
        },
        body: JSON.stringify({ queries }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        return json.results || [];
      } else if (res.status === 404) {
        continue;
      } else {
        const errText = await res.text();
        let errMsg = errText;
        try {
          const ej = JSON.parse(errText);
          errMsg = ej.message || ej.error || errText;
        } catch (e) {}
        throw new Error(errMsg);
      }
    } catch (err) {
      lastError = err;
      if (err.message && !err.message.includes('fetch') && !err.message.includes('abort') && !err.message.includes('NetworkError')) {
        break;
      }
    }
  }

  // Fallback sequential jika proxy batch gagal
  console.warn('[executeNeonBatch] Batch proxy gagal, mencoba eksekusi satu per satu:', lastError?.message);
  const results = [];
  for (const q of queries) {
    if (typeof q === 'string' && q.trim()) {
      const r = await executeNeonSql(q.trim());
      results.push(r);
    }
  }
  return results;
}

async function testCloudConnection(silent = false) {
  const cfg = getCloudConfig();
  if (!cfg) {
    if (!silent) showToast('Kredensial database cloud belum diisi.', 'warning');
    return false;
  }

  try {
    if (cfg.type === 'neon') {
      const res = await executeNeonSql('SELECT count(*) as total FROM tb_kader');
      const totalKader = res && res[0] ? (res[0].total || 0) : 0;
      databaseMode = 'neon';
      updateDbStatusIndicator(true, { count: totalKader, type: 'neon' });
      if (!silent) showToast(`Berhasil terhubung ke Neon PostgreSQL! (${totalKader} kader ditemukan di Neon)`, 'success');
      return true;
    } else if (cfg.type === 'supabase') {
      if (!window.supabase) throw new Error('Library Supabase belum termuat.');
      const client = window.supabase.createClient(cfg.url, cfg.key);
      const { count, error } = await client.from('tb_kader').select('*', { count: 'exact', head: true });
      if (error) throw error;
      databaseMode = 'supabase';
      updateDbStatusIndicator(true, { count: count || 0, type: 'supabase' });
      if (!silent) showToast(`Berhasil terhubung ke Supabase Cloud! (${count || 0} kader ditemukan)`, 'success');
      return true;
    }
  } catch (err) {
    console.error('Test Cloud Connection Error:', err);
    if (!silent) showToast('Gagal terhubung ke Cloud: ' + err.message, 'error');
  }
  return false;
}

function testCloudConnectionUI() {
  testCloudConnection(false);
}

async function fetchDataFromCloud(silent = false) {
  const cfg = getCloudConfig();
  if (!cfg) {
    if (!silent) showToast('Kredensial database cloud belum diatur.', 'warning');
    return false;
  }

  if (!silent) showToast('Menghubungkan & menarik data terbaru dari Cloud (Neon)...', 'info');

  try {
    if (cfg.type === 'neon') {
      let komRows = [], kdrRows = [], mbnRows = [], pmsRows = [], pngRows = [];
      let agrRows = [], prdRows = [], strRows = [], ktmRows = [], rptRows = [], prsRows = [];

      try {
        // High-speed single round-trip fetch
        const singleQuery = `
          SELECT 
            (SELECT json_agg(t) FROM (SELECT * FROM tb_komisariat LIMIT 1) t) as komisariat,
            (SELECT json_agg(t) FROM (SELECT * FROM tb_kader ORDER BY angkatan DESC, nama ASC) t) as kader,
            (SELECT json_agg(t) FROM (SELECT * FROM tb_mabinkom ORDER BY id ASC) t) as mabinkom,
            (SELECT json_agg(t) FROM (SELECT * FROM tb_pemasukan ORDER BY tanggal DESC, id DESC) t) as pemasukan,
            (SELECT json_agg(t) FROM (SELECT * FROM tb_pengeluaran ORDER BY tanggal DESC, id DESC) t) as pengeluaran,
            (SELECT json_agg(t) FROM (SELECT * FROM tb_anggaran_rab ORDER BY pos ASC, id ASC) t) as anggaran,
            (SELECT json_agg(t) FROM (SELECT * FROM tb_periode_pengurus ORDER BY periode DESC) t) as periode,
            (SELECT json_agg(t) FROM (SELECT * FROM tb_struktur_pengurus ORDER BY urutan ASC, id ASC) t) as struktur,
            (SELECT json_agg(t) FROM (SELECT * FROM tb_ketum_kom ORDER BY tahun_mulai DESC) t) as ketum,
            (SELECT json_agg(t) FROM (SELECT * FROM tb_rapat ORDER BY tanggal DESC, id DESC) t) as rapat,
            (SELECT json_agg(t) FROM (SELECT * FROM tb_presensi_rapat ORDER BY id ASC) t) as presensi;
        `;
        const res = await executeNeonSql(singleQuery);
        if (res && res[0]) {
          const b = res[0];
          komRows = b.komisariat || [];
          kdrRows = b.kader || [];
          mbnRows = b.mabinkom || [];
          pmsRows = b.pemasukan || [];
          pngRows = b.pengeluaran || [];
          agrRows = b.anggaran || [];
          prdRows = b.periode || [];
          strRows = b.struktur || [];
          ktmRows = b.ketum || [];
          rptRows = b.rapat || [];
          prsRows = b.presensi || [];
        }
      } catch (batchErr) {
        console.warn('Single round-trip fetch lewati / coba per tabel:', batchErr.message);
        const results = await Promise.allSettled([
          executeNeonSql('SELECT * FROM tb_komisariat LIMIT 1'),
          executeNeonSql('SELECT * FROM tb_kader ORDER BY angkatan DESC, nama ASC'),
          executeNeonSql('SELECT * FROM tb_mabinkom ORDER BY id ASC'),
          executeNeonSql('SELECT * FROM tb_pemasukan ORDER BY tanggal DESC, id DESC'),
          executeNeonSql('SELECT * FROM tb_pengeluaran ORDER BY tanggal DESC, id DESC'),
          executeNeonSql('SELECT * FROM tb_anggaran_rab ORDER BY pos ASC, id ASC'),
          executeNeonSql('SELECT * FROM tb_periode_pengurus ORDER BY periode DESC'),
          executeNeonSql('SELECT * FROM tb_struktur_pengurus ORDER BY urutan ASC, id ASC'),
          executeNeonSql('SELECT * FROM tb_ketum_kom ORDER BY tahun_mulai DESC'),
          executeNeonSql('SELECT * FROM tb_rapat ORDER BY tanggal DESC, id DESC'),
          executeNeonSql('SELECT * FROM tb_presensi_rapat ORDER BY id ASC')
        ]);

        komRows = results[0].status === 'fulfilled' ? results[0].value : [];
        kdrRows = results[1].status === 'fulfilled' ? results[1].value : [];
        mbnRows = results[2].status === 'fulfilled' ? results[2].value : [];
        pmsRows = results[3].status === 'fulfilled' ? results[3].value : [];
        pngRows = results[4].status === 'fulfilled' ? results[4].value : [];
        agrRows = results[5].status === 'fulfilled' ? results[5].value : [];
        prdRows = results[6].status === 'fulfilled' ? results[6].value : [];
        strRows = results[7].status === 'fulfilled' ? results[7].value : [];
        ktmRows = results[8].status === 'fulfilled' ? results[8].value : [];
        rptRows = results[9].status === 'fulfilled' ? results[9].value : [];
        prsRows = results[10].status === 'fulfilled' ? results[10].value : [];
      }

      // 1. Profil Komisariat
      if (komRows && komRows.length > 0) {
        const r = komRows[0];
        komisariat = {
          nama: r.nama || defaultKomisariat.nama,
          namaLengkap: r.nama_lengkap || defaultKomisariat.namaLengkap,
          kampus: r.kampus || defaultKomisariat.kampus,
          cabang: r.cabang || defaultKomisariat.cabang,
          pkc: r.pkc || defaultKomisariat.pkc,
          masaKhidmat: r.masa_khidmat || defaultKomisariat.masaKhidmat,
          ketuaKomisariat: r.ketua_komisariat || defaultKomisariat.ketuaKomisariat,
          sekretarisKomisariat: r.sekretaris_komisariat || defaultKomisariat.sekretarisKomisariat,
          bendaharaKomisariat: r.bendahara_komisariat || defaultKomisariat.bendaharaKomisariat,
          nomorSK: r.nomor_sk || defaultKomisariat.nomorSK,
          alamat: r.alamat || defaultKomisariat.alamat,
          email: r.email || defaultKomisariat.email,
          telepon: r.telepon || defaultKomisariat.telepon
        };

        if (r.fakultas_prodi) {
          try {
            const fp = typeof r.fakultas_prodi === 'string' ? JSON.parse(r.fakultas_prodi) : r.fakultas_prodi;
            if (Array.isArray(fp) && fp.length > 0) {
              fakultasProdiList = fp;
              localStorage.setItem('pmii_fakultas_prodi', JSON.stringify(fp));
            }
          } catch (e) {}
        }
      }

      // 2. Data Kader (Hanya kader yang saat ini ada di Neon)
      kaders = (kdrRows || []).map(r => ({
        id: r.id,
        noKta: r.no_kta || '',
        nik: r.nik || '',
        nim: r.nim || '',
        nama: r.nama || '',
        namaPanggilan: r.nama_panggilan || '',
        panggilan: r.nama_panggilan || '',
        gender: r.gender || 'Laki-laki',
        tempatLahir: r.tempat_lahir || '',
        tanggalLahir: r.tanggal_lahir ? String(r.tanggal_lahir).split('T')[0] : '',
        ttl: (r.tempat_lahir ? r.tempat_lahir + ', ' : '') + (r.tanggal_lahir ? String(r.tanggal_lahir).split('T')[0] : ''),
        fakultas: r.fakultas || '',
        jurusan: r.jurusan || '',
        angkatan: r.angkatan || '',
        statusKuliah: r.status_kuliah || 'Aktif',
        statusKeaktifan: r.status_kader || 'Aktif',
        alamat: r.alamat || '',
        whatsapp: r.whatsapp || '',
        email: r.email || '',
        foto: r.foto || '',
        statusKader: r.status_kader || 'Aktif',
        kaderisasi: {
          formal: r.formal || 'MAPABA',
          tahunMapaba: r.tahun_mapaba || '',
          penyelenggaraMapaba: r.penyelenggara_mapaba || 'PK PMII ISMU',
          tahunPkd: r.tahun_pkd || '',
          penyelenggaraPkd: r.penyelenggara_pkd || '',
          tahunPkl: r.tahun_pkl || '',
          kopri: r.kopri || '-',
          tahunSig: r.tahun_sig || '',
          tahunSkk: r.tahun_skk || ''
        }
      }));

      // 3. Mabinkom
      mabinkom = (mbnRows || []).map(r => ({
        id: r.id,
        nama: r.nama || '',
        gelar: r.gelar || '',
        jabatan: r.jabatan || '',
        periode: r.periode || '',
        kiprah: r.kiprah || '',
        profesi: r.profesi || '',
        kontak: r.kontak || '',
        whatsapp: r.kontak || '',
        foto: r.foto || '',
        status: r.status || 'Aktif'
      }));

      // 4. Pemasukan
      pemasukan = (pmsRows || []).map(r => ({
        id: r.id,
        bukti: r.bukti || '',
        tanggal: r.tanggal ? String(r.tanggal).split('T')[0] : '',
        kategori: r.kategori || 'Kas Masuk',
        keterangan: r.keterangan || '',
        diterimaDari: r.diterima_dari || '',
        pic: r.pic || '',
        jumlah: Number(r.jumlah) || 0
      }));

      // 5. Pengeluaran
      pengeluaran = (pngRows || []).map(r => ({
        id: r.id,
        pos: r.pos || 'LAIN-LAIN',
        bukti: r.bukti || '',
        tanggal: r.tanggal ? String(r.tanggal).split('T')[0] : '',
        kategori: r.kategori || 'Operasional',
        kegiatan: r.kegiatan || '',
        keterangan: r.keterangan || '',
        pic: r.pic || '',
        jumlah: Number(r.jumlah) || 0
      }));

      // 6. Anggaran RAB
      anggaran = (agrRows || []).map(r => ({
        id: r.id,
        pos: r.pos || 'Pelantikan',
        kegiatan: r.kegiatan || '',
        nama: r.nama || '',
        jumlah: Number(r.jumlah) || 0,
        tanggalTarget: r.tanggal_target ? String(r.tanggal_target).split('T')[0] : '',
        status: r.status || 'Menunggu Kas',
        keterangan: r.keterangan || ''
      }));

      // 7. Pengurus
      pengurus = (prdRows || []).map(p => {
        const matchingStruktur = (strRows || [])
          .filter(s => String(s.periode) === String(p.periode))
          .map(s => ({
            id: s.id,
            kategori: s.kategori || 'Badan Pengurus Harian (BPH)',
            jabatan: s.jabatan || 'Pengurus',
            nama: s.nama || '',
            fakultas: s.fakultas || '',
            kontak: s.kontak || '',
            foto: s.foto || '',
            status: s.status || 'Aktif',
            urutan: s.urutan || 1
          }));
        return {
          periode: p.periode,
          tema: p.tema || '',
          isAktif: Boolean(p.is_aktif),
          skPengesahan: p.sk_pengesahan || '',
          struktur: matchingStruktur
        };
      });

      // 8. Ketum
      ketumKom = (ktmRows || []).map(r => ({
        id: r.id,
        nama: r.nama || '',
        periode: r.periode || '',
        tahunMulai: r.tahun_mulai || '',
        tahunSelesai: r.tahun_selesai || '',
        foto: r.foto || '',
        profesiSekarang: r.profesi_sekarang || '',
        kontak: r.kontak || '',
        fakultas: r.fakultas || '',
        status: r.status || 'Demisioner',
        visi: r.visi || '',
        prestasi: r.prestasi || ''
      }));

      // 9. Rapat
      rapat = (rptRows || []).map(r => {
        const matchingPresensi = (prsRows || [])
          .filter(p => String(p.rapat_id) === String(r.id))
          .map(p => ({
            id: p.pengurus_id || ('PGR-' + p.id),
            nama: p.nama || '',
            jabatan: p.jabatan || '',
            status: p.status || 'Hadir',
            keterangan: p.keterangan || ''
          }));
        return {
          id: r.id,
          agenda: r.agenda || '',
          tanggal: r.tanggal ? String(r.tanggal).split('T')[0] : '',
          waktu: r.waktu || '',
          tempat: r.tempat || '',
          pimpinan: r.pimpinan || '',
          notulis: r.notulis || '',
          notulensi: r.notulensi || '',
          presensi: matchingPresensi
        };
      });

      // Cek apakah data berubah untuk efisiensi render
      const currentFingerprint = `${kaders.length}|${mabinkom.length}|${pemasukan.length}|${pengeluaran.length}|${anggaran.length}|${pengurus.length}|${ketumKom.length}|${rapat.length}|${kaders[0]?.id || ''}|${pengeluaran[0]?.id || ''}|${pemasukan[0]?.id || ''}|${komisariat.nama || ''}`;
      const isDataChanged = (currentFingerprint !== lastDataFingerprint);
      lastDataFingerprint = currentFingerprint;

      databaseMode = 'neon';
      saveToLocalStorageOnly();
      updateDbStatusIndicator(true, { count: kaders.length, type: 'neon' });

      // Jika data berubah atau dipanggil secara manual, perbarui UI
      if (!silent || isDataChanged) {
        const isUserTyping = !!document.querySelector('input:focus, textarea:focus, select:focus');
        if (!isUserTyping) {
          renderApp();
        }
      }

      if (!silent) {
        showToast(`Sinkronisasi berhasil! Data terbaru dari Neon berhasil dimuat (${kaders.length} kader).`, 'success');
      }
      return true;
    }
  } catch (err) {
    console.error('Fetch Cloud Data Error:', err);
    if (!silent) showToast('Gagal menarik data dari Cloud: ' + err.message, 'error');
  }
  return false;
}

// ==========================================
// AUTO-SYNC REAL-TIME BERKELANJUTAN
// ==========================================
let autoSyncTimer = null;
let lastDataFingerprint = '';

function startAutoSync() {
  if (autoSyncTimer) clearInterval(autoSyncTimer);

  const cfg = getCloudConfig();
  if (!cfg) return;

  const interval = (typeof DEFAULT_CLOUD_CONFIG !== 'undefined' && DEFAULT_CLOUD_CONFIG.autoSyncIntervalMs)
    ? DEFAULT_CLOUD_CONFIG.autoSyncIntervalMs
    : 10000;

  autoSyncTimer = setInterval(async () => {
    // Sinkron otomatis di latar belakang saat tab aktif
    if (!document.hidden) {
      await fetchDataFromCloud(true);
    }
  }, interval);
}

// Sinkron otomatis seketika saat user kembali ke tab browser
window.addEventListener('focus', () => {
  const cfg = getCloudConfig();
  if (cfg) fetchDataFromCloud(true);
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    const cfg = getCloudConfig();
    if (cfg) fetchDataFromCloud(true);
  }
});

function fetchDataFromCloudUI() {
  fetchDataFromCloud(false);
}

async function syncToCloudServer(silent = true) {
  const cfg = getCloudConfig();
  if (!cfg) {
    if (!silent) showToast('Kredensial database cloud belum diatur.', 'warning');
    return false;
  }

  if (!silent) showToast('Menyimpan & menyinkronkan seluruh data ke Neon Cloud...', 'info');

  try {
    if (cfg.type === 'neon') {
      const neonQueries = [];

      // 1. Komisariat
      const qKom = `
        INSERT INTO tb_komisariat (id, nama, nama_lengkap, kampus, cabang, pkc, masa_khidmat, ketua_komisariat, sekretaris_komisariat, bendahara_komisariat, nomor_sk, alamat, email, telepon, fakultas_prodi)
        VALUES (1, ${sqlEscape(komisariat.nama)}, ${sqlEscape(komisariat.namaLengkap)}, ${sqlEscape(komisariat.kampus)}, ${sqlEscape(komisariat.cabang)}, ${sqlEscape(komisariat.pkc)}, ${sqlEscape(komisariat.masaKhidmat)}, ${sqlEscape(komisariat.ketuaKomisariat)}, ${sqlEscape(komisariat.sekretarisKomisariat)}, ${sqlEscape(komisariat.bendaharaKomisariat)}, ${sqlEscape(komisariat.nomorSK)}, ${sqlEscape(komisariat.alamat)}, ${sqlEscape(komisariat.email)}, ${sqlEscape(komisariat.telepon)}, ${sqlEscape(JSON.stringify(getFakultasProdiList()))})
        ON CONFLICT (id) DO UPDATE SET
          nama = EXCLUDED.nama, nama_lengkap = EXCLUDED.nama_lengkap, kampus = EXCLUDED.kampus,
          cabang = EXCLUDED.cabang, pkc = EXCLUDED.pkc, masa_khidmat = EXCLUDED.masa_khidmat,
          ketua_komisariat = EXCLUDED.ketua_komisariat, sekretaris_komisariat = EXCLUDED.sekretaris_komisariat,
          bendahara_komisariat = EXCLUDED.bendahara_komisariat, nomor_sk = EXCLUDED.nomor_sk,
          alamat = EXCLUDED.alamat, email = EXCLUDED.email, telepon = EXCLUDED.telepon,
          fakultas_prodi = EXCLUDED.fakultas_prodi, updated_at = CURRENT_TIMESTAMP;
      `;
      neonQueries.push(qKom);

      // 2. Kader
      if (kaders && kaders.length > 0) {
        const kaderValues = kaders.map(k => {
          const kz = k.kaderisasi || {};
          return `(${sqlEscape(k.id)}, ${sqlEscape(k.noKta || ('13.01.' + (k.angkatan || '2026') + '.' + k.id))}, ${sqlEscape(k.nik)}, ${sqlEscape(k.nim)}, ${sqlEscape(k.nama)}, ${sqlEscape(k.namaPanggilan)}, ${sqlEscape(k.gender || 'Laki-laki')}, ${sqlEscape(k.tempatLahir)}, ${k.tanggalLahir ? sqlEscape(k.tanggalLahir) : 'NULL'}, ${sqlEscape(k.fakultas)}, ${sqlEscape(k.jurusan)}, ${sqlEscape(String(k.angkatan || '2026'))}, ${sqlEscape(k.statusKuliah || 'Aktif')}, ${sqlEscape(k.alamat)}, ${sqlEscape(k.whatsapp)}, ${sqlEscape(k.email)}, ${sqlEscape(k.foto)}, ${sqlEscape(k.statusKader || 'Aktif')}, ${sqlEscape(kz.formal || 'MAPABA')}, ${sqlEscape(kz.tahunMapaba)}, ${sqlEscape(kz.penyelenggaraMapaba || 'PK PMII ISMU')}, ${sqlEscape(kz.tahunPkd)}, ${sqlEscape(kz.penyelenggaraPkd)}, ${sqlEscape(kz.tahunPkl)}, ${sqlEscape(kz.kopri || '-')}, ${sqlEscape(kz.tahunSig)}, ${sqlEscape(kz.tahunSkk)})`;
        }).join(', ');
        const validIds = kaders.map(k => sqlEscape(k.id)).join(', ');

        const qKader = `
          INSERT INTO tb_kader (id, no_kta, nik, nim, nama, nama_panggilan, gender, tempat_lahir, tanggal_lahir, fakultas, jurusan, angkatan, status_kuliah, alamat, whatsapp, email, foto, status_kader, formal, tahun_mapaba, penyelenggara_mapaba, tahun_pkd, penyelenggara_pkd, tahun_pkl, kopri, tahun_sig, tahun_skk)
          VALUES ${kaderValues}
          ON CONFLICT (id) DO UPDATE SET
            no_kta = EXCLUDED.no_kta, nik = EXCLUDED.nik, nim = EXCLUDED.nim, nama = EXCLUDED.nama,
            nama_panggilan = EXCLUDED.nama_panggilan, gender = EXCLUDED.gender, tempat_lahir = EXCLUDED.tempat_lahir,
            tanggal_lahir = EXCLUDED.tanggal_lahir, fakultas = EXCLUDED.fakultas, jurusan = EXCLUDED.jurusan,
            angkatan = EXCLUDED.angkatan, status_kuliah = EXCLUDED.status_kuliah, alamat = EXCLUDED.alamat,
            whatsapp = EXCLUDED.whatsapp, email = EXCLUDED.email, foto = EXCLUDED.foto, status_kader = EXCLUDED.status_kader,
            formal = EXCLUDED.formal, tahun_mapaba = EXCLUDED.tahun_mapaba, penyelenggara_mapaba = EXCLUDED.penyelenggara_mapaba,
            tahun_pkd = EXCLUDED.tahun_pkd, penyelenggara_pkd = EXCLUDED.penyelenggara_pkd, tahun_pkl = EXCLUDED.tahun_pkl,
            kopri = EXCLUDED.kopri, tahun_sig = EXCLUDED.tahun_sig, tahun_skk = EXCLUDED.tahun_skk, updated_at = CURRENT_TIMESTAMP;
        `;
        neonQueries.push(qKader);
        neonQueries.push(`DELETE FROM tb_kader WHERE id NOT IN (${validIds});`);
      } else {
        neonQueries.push('DELETE FROM tb_kader;');
      }

      // 3. Mabinkom
      if (mabinkom && mabinkom.length > 0) {
        const mbnValues = mabinkom.map(m => {
          return `(${sqlEscape(m.id)}, ${sqlEscape(m.nama)}, ${sqlEscape(m.gelar)}, ${sqlEscape(m.jabatan || 'Anggota Mabinkom')}, ${sqlEscape(m.periode)}, ${sqlEscape(m.kiprah || m.keterangan)}, ${sqlEscape(m.profesi)}, ${sqlEscape(m.kontak || m.whatsapp)}, ${sqlEscape(m.foto)}, ${sqlEscape(m.status || 'Aktif')})`;
        }).join(', ');
        const validIds = mabinkom.map(m => sqlEscape(m.id)).join(', ');

        const qMabinkom = `
          INSERT INTO tb_mabinkom (id, nama, gelar, jabatan, periode, kiprah, profesi, kontak, foto, status)
          VALUES ${mbnValues}
          ON CONFLICT (id) DO UPDATE SET
            nama = EXCLUDED.nama, gelar = EXCLUDED.gelar, jabatan = EXCLUDED.jabatan, periode = EXCLUDED.periode,
            kiprah = EXCLUDED.kiprah, profesi = EXCLUDED.profesi, kontak = EXCLUDED.kontak, foto = EXCLUDED.foto, status = EXCLUDED.status;
        `;
        neonQueries.push(qMabinkom);
        neonQueries.push(`DELETE FROM tb_mabinkom WHERE id NOT IN (${validIds});`);
      } else {
        neonQueries.push('DELETE FROM tb_mabinkom;');
      }

      // 4. Pemasukan
      if (pemasukan && pemasukan.length > 0) {
        const inValues = pemasukan.map(i => {
          return `(${sqlEscape(i.id)}, ${sqlEscape(i.bukti)}, ${i.tanggal ? sqlEscape(i.tanggal) : 'CURRENT_DATE'}, ${sqlEscape(i.kategori || 'Kas Masuk')}, ${sqlEscape(i.keterangan)}, ${sqlEscape(i.diterimaDari)}, ${sqlEscape(i.pic)}, ${Number(i.jumlah) || 0})`;
        }).join(', ');
        const validIds = pemasukan.map(i => sqlEscape(i.id)).join(', ');

        const qPemasukan = `
          INSERT INTO tb_pemasukan (id, bukti, tanggal, kategori, keterangan, diterima_dari, pic, jumlah)
          VALUES ${inValues}
          ON CONFLICT (id) DO UPDATE SET
            bukti = EXCLUDED.bukti, tanggal = EXCLUDED.tanggal, kategori = EXCLUDED.kategori,
            keterangan = EXCLUDED.keterangan, diterima_dari = EXCLUDED.diterima_dari, pic = EXCLUDED.pic, jumlah = EXCLUDED.jumlah;
        `;
        neonQueries.push(qPemasukan);
        neonQueries.push(`DELETE FROM tb_pemasukan WHERE id NOT IN (${validIds});`);
      } else {
        neonQueries.push('DELETE FROM tb_pemasukan;');
      }

      // 5. Pengeluaran
      if (pengeluaran && pengeluaran.length > 0) {
        const outValues = pengeluaran.map(o => {
          let pos = (o.pos || 'LAIN-LAIN').toUpperCase();
          if (!['PELANTIKAN', 'PKD', 'MAPABA', 'LAIN-LAIN'].includes(pos)) pos = 'LAIN-LAIN';
          return `(${sqlEscape(o.id)}, ${sqlEscape(pos)}, ${sqlEscape(o.bukti)}, ${o.tanggal ? sqlEscape(o.tanggal) : 'CURRENT_DATE'}, ${sqlEscape(o.kategori || 'Operasional')}, ${sqlEscape(o.kegiatan)}, ${sqlEscape(o.keterangan)}, ${sqlEscape(o.pic)}, ${Number(o.jumlah) || 0})`;
        }).join(', ');
        const validIds = pengeluaran.map(o => sqlEscape(o.id)).join(', ');

        const qPengeluaran = `
          INSERT INTO tb_pengeluaran (id, pos, bukti, tanggal, kategori, kegiatan, keterangan, pic, jumlah)
          VALUES ${outValues}
          ON CONFLICT (id) DO UPDATE SET
            pos = EXCLUDED.pos, bukti = EXCLUDED.bukti, tanggal = EXCLUDED.tanggal, kategori = EXCLUDED.kategori,
            kegiatan = EXCLUDED.kegiatan, keterangan = EXCLUDED.keterangan, pic = EXCLUDED.pic, jumlah = EXCLUDED.jumlah;
        `;
        neonQueries.push(qPengeluaran);
        neonQueries.push(`DELETE FROM tb_pengeluaran WHERE id NOT IN (${validIds});`);
      } else {
        neonQueries.push('DELETE FROM tb_pengeluaran;');
      }

      // 6. Anggaran RAB
      if (anggaran && anggaran.length > 0) {
        const agrValues = anggaran.map(a => {
          return `(${sqlEscape(a.id)}, ${sqlEscape(a.pos || 'Pelantikan')}, ${sqlEscape(a.kegiatan)}, ${sqlEscape(a.nama)}, ${Number(a.jumlah) || 0}, ${a.tanggalTarget ? sqlEscape(a.tanggalTarget) : 'NULL'}, ${sqlEscape(a.status || 'Menunggu Kas')}, ${sqlEscape(a.keterangan)})`;
        }).join(', ');
        const validIds = anggaran.map(a => sqlEscape(a.id)).join(', ');

        const qAnggaran = `
          INSERT INTO tb_anggaran_rab (id, pos, kegiatan, nama, jumlah, tanggal_target, status, keterangan)
          VALUES ${agrValues}
          ON CONFLICT (id) DO UPDATE SET
            pos = EXCLUDED.pos, kegiatan = EXCLUDED.kegiatan, nama = EXCLUDED.nama, jumlah = EXCLUDED.jumlah,
            tanggal_target = EXCLUDED.tanggal_target, status = EXCLUDED.status, keterangan = EXCLUDED.keterangan;
        `;
        neonQueries.push(qAnggaran);
        neonQueries.push(`DELETE FROM tb_anggaran_rab WHERE id NOT IN (${validIds});`);
      } else {
        neonQueries.push('DELETE FROM tb_anggaran_rab;');
      }

      // 7. Pengurus & Struktur
      if (pengurus && pengurus.length > 0) {
        const perValues = pengurus.map(p => {
          return `(${sqlEscape(p.periode || '2026')}, ${sqlEscape(p.tema || '')}, ${p.isAktif ? 'TRUE' : 'FALSE'}, ${sqlEscape(p.skPengesahan || '')})`;
        }).join(', ');

        let allStruktur = [];
        pengurus.forEach(p => {
          if (Array.isArray(p.struktur)) {
            p.struktur.forEach((s, idx) => {
              allStruktur.push({ ...s, periode: p.periode || '2026', urutan: idx + 1 });
            });
          }
        });

        neonQueries.push(`
          INSERT INTO tb_periode_pengurus (periode, tema, is_aktif, sk_pengesahan)
          VALUES ${perValues}
          ON CONFLICT (periode) DO UPDATE SET
            tema = EXCLUDED.tema, is_aktif = EXCLUDED.is_aktif, sk_pengesahan = EXCLUDED.sk_pengesahan;
        `);

        if (allStruktur.length > 0) {
          const strValues = allStruktur.map(s => {
            return `(${sqlEscape(s.id)}, ${sqlEscape(s.periode)}, ${sqlEscape(s.kategori || 'Badan Pengurus Harian (BPH)')}, ${sqlEscape(s.jabatan || 'Pengurus')}, ${sqlEscape(s.nama)}, ${sqlEscape(s.fakultas)}, ${sqlEscape(s.kontak || s.whatsapp)}, ${sqlEscape(s.foto)}, ${sqlEscape(s.status || 'Aktif')}, ${s.urutan || 1})`;
          }).join(', ');
          const validStrIds = allStruktur.map(s => sqlEscape(s.id)).join(', ');

          neonQueries.push(`
            INSERT INTO tb_struktur_pengurus (id, periode, kategori, jabatan, nama, fakultas, kontak, foto, status, urutan)
            VALUES ${strValues}
            ON CONFLICT (id) DO UPDATE SET
              periode = EXCLUDED.periode, kategori = EXCLUDED.kategori, jabatan = EXCLUDED.jabatan, nama = EXCLUDED.nama,
              fakultas = EXCLUDED.fakultas, kontak = EXCLUDED.kontak, foto = EXCLUDED.foto, status = EXCLUDED.status, urutan = EXCLUDED.urutan;
          `);
          neonQueries.push(`DELETE FROM tb_struktur_pengurus WHERE id NOT IN (${validStrIds});`);
        } else {
          neonQueries.push('DELETE FROM tb_struktur_pengurus;');
        }
      }

      // 8. Ketum
      if (ketumKom && ketumKom.length > 0) {
        const ktmValues = ketumKom.map(k => {
          return `(${sqlEscape(k.id)}, ${sqlEscape(k.nama)}, ${sqlEscape(k.periode)}, ${sqlEscape(String(k.tahunMulai || '2026'))}, ${sqlEscape(String(k.tahunSelesai || '2027'))}, ${sqlEscape(k.foto)}, ${sqlEscape(k.profesiSekarang)}, ${sqlEscape(k.kontak)}, ${sqlEscape(k.fakultas)}, ${sqlEscape(k.status || 'Demisioner')}, ${sqlEscape(k.visi)}, ${sqlEscape(k.prestasi)})`;
        }).join(', ');
        const validIds = ketumKom.map(k => sqlEscape(k.id)).join(', ');

        const qKetum = `
          INSERT INTO tb_ketum_kom (id, nama, periode, tahun_mulai, tahun_selesai, foto, profesi_sekarang, kontak, fakultas, status, visi, prestasi)
          VALUES ${ktmValues}
          ON CONFLICT (id) DO UPDATE SET
            nama = EXCLUDED.nama, periode = EXCLUDED.periode, tahun_mulai = EXCLUDED.tahun_mulai,
            tahun_selesai = EXCLUDED.tahun_selesai, foto = EXCLUDED.foto, profesi_sekarang = EXCLUDED.profesi_sekarang,
            kontak = EXCLUDED.kontak, fakultas = EXCLUDED.fakultas, status = EXCLUDED.status, visi = EXCLUDED.visi, prestasi = EXCLUDED.prestasi;
        `;
        neonQueries.push(qKetum);
        neonQueries.push(`DELETE FROM tb_ketum_kom WHERE id NOT IN (${validIds});`);
      } else {
        neonQueries.push('DELETE FROM tb_ketum_kom;');
      }

      // 9. Rapat & Presensi
      if (rapat && rapat.length > 0) {
        const rptValues = rapat.map(r => {
          return `(${sqlEscape(r.id)}, ${sqlEscape(r.agenda)}, ${r.tanggal ? sqlEscape(r.tanggal) : 'CURRENT_DATE'}, ${sqlEscape(r.waktu)}, ${sqlEscape(r.tempat)}, ${sqlEscape(r.pimpinan)}, ${sqlEscape(r.notulis)}, ${sqlEscape(r.notulensi)})`;
        }).join(', ');
        const validIds = rapat.map(r => sqlEscape(r.id)).join(', ');

        let allPresensi = [];
        rapat.forEach(r => {
          if (Array.isArray(r.presensi)) {
            r.presensi.forEach(p => {
              allPresensi.push({ ...p, rapat_id: r.id });
            });
          }
        });

        const qRapat = `
          INSERT INTO tb_rapat (id, agenda, tanggal, waktu, tempat, pimpinan, notulis, notulensi)
          VALUES ${rptValues}
          ON CONFLICT (id) DO UPDATE SET
            agenda = EXCLUDED.agenda, tanggal = EXCLUDED.tanggal, waktu = EXCLUDED.waktu,
            tempat = EXCLUDED.tempat, pimpinan = EXCLUDED.pimpinan, notulis = EXCLUDED.notulis, notulensi = EXCLUDED.notulensi;
        `;
        neonQueries.push(qRapat);
        neonQueries.push(`DELETE FROM tb_presensi_rapat WHERE rapat_id IN (${validIds});`);

        if (allPresensi.length > 0) {
          const prsValues = allPresensi.map(p => {
            return `(${sqlEscape(p.rapat_id)}, ${sqlEscape(p.id)}, ${sqlEscape(p.nama)}, ${sqlEscape(p.jabatan)}, ${sqlEscape(p.status || 'Hadir')}, ${sqlEscape(p.keterangan)})`;
          }).join(', ');
          neonQueries.push(`
            INSERT INTO tb_presensi_rapat (rapat_id, pengurus_id, nama, jabatan, status, keterangan)
            VALUES ${prsValues};
          `);
        }
        neonQueries.push(`DELETE FROM tb_rapat WHERE id NOT IN (${validIds});`);
      } else {
        neonQueries.push('DELETE FROM tb_presensi_rapat;');
        neonQueries.push('DELETE FROM tb_rapat;');
      }

      await executeNeonBatch(neonQueries);

      databaseMode = 'neon';
      updateDbStatusIndicator(true, { count: kaders.length, type: 'neon' });
      if (!silent) showToast('Data berhasil disinkronkan & disimpan aman di Neon Cloud!', 'success');
      return true;
    }
  } catch (err) {
    console.error('Sync to Cloud Error:', err);
    if (!silent) showToast('Gagal sinkron ke Cloud: ' + err.message, 'error');
  }
  return false;
}

function syncDataToCloudUI() {
  syncToCloudServer(false);
}

async function syncToMySQLServer(silent = true) {
  try {
    const payload = {
      komisariat,
      kaders,
      mabinkom,
      pemasukan,
      pengeluaran,
      pengurus,
      ketumKom,
      anggaran,
      rapat
    };

    const res = await fetch(API_BASE_URL + 'save_data.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success') {
        if (!silent) showToast('Data berhasil disinkronkan ke database MySQL!', 'success');
        updateDbStatusIndicator(true);
        return true;
      }
    }
  } catch (err) {
    if (!silent) showToast('Gagal sinkron ke MySQL. Data tetap aman di browser.', 'warning');
  }
  return false;
}

function testDatabaseConnectionUI() {
  checkDatabaseConnection(true);
}

function syncDataToMySQL() {
  showToast('Menghubungkan & menyimpan ke database MySQL...', 'info');
  syncToMySQLServer(false);
}

async function fetchDataFromMySQL() {
  showToast('Mengambil data terbaru dari database MySQL...', 'info');
  try {
    const res = await fetch(API_BASE_URL + 'get_data.php');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    if (json.status === 'success' && json.data) {
      komisariat = json.data.komisariat || defaultKomisariat;
      kaders = Array.isArray(json.data.kaders) ? json.data.kaders : [];
      mabinkom = Array.isArray(json.data.mabinkom) ? json.data.mabinkom : [];
      pemasukan = Array.isArray(json.data.pemasukan) ? json.data.pemasukan : [];
      pengeluaran = Array.isArray(json.data.pengeluaran) ? json.data.pengeluaran : [];
      pengurus = Array.isArray(json.data.pengurus) ? json.data.pengurus : [];
      ketumKom = Array.isArray(json.data.ketumKom) ? json.data.ketumKom : [];
      anggaran = Array.isArray(json.data.anggaran) ? json.data.anggaran : [];
      rapat = Array.isArray(json.data.rapat) ? json.data.rapat : [];

      saveToLocalStorageOnly();
      renderApp();
      updateDbStatusIndicator(true);
      showToast('Data terbaru berhasil ditarik dari database MySQL!', 'success');
    } else {
      showToast('Gagal menarik data: ' + (json.message || 'Error server'), 'error');
    }
  } catch (err) {
    showToast('Gagal menghubungi server API MySQL. Pastikan XAMPP aktif.', 'error');
  }
}

function resetToDefaultData() {
  showConfirmModal({
    title: 'Reset ke Data Bawaan Awal',
    message: 'Apakah Anda yakin ingin mengembalikan seluruh data ke data bawaan awal?<br><span class="text-amber-600 font-bold text-xs mt-1 block">Perhatian: Data penambahan dan perubahan saat ini akan ditimpa.</span>',
    confirmText: 'Ya, Reset Data',
    cancelText: 'Batal',
    type: 'warning',
    icon: 'refresh-ccw',
    onConfirm: () => {
      komisariat = JSON.parse(JSON.stringify(defaultKomisariat));
      kaders = JSON.parse(JSON.stringify(defaultKaders));
      mabinkom = typeof defaultMabinkom !== 'undefined' ? JSON.parse(JSON.stringify(defaultMabinkom)) : [];
      pemasukan = typeof defaultPemasukan !== 'undefined' ? JSON.parse(JSON.stringify(defaultPemasukan)) : [];
      pengeluaran = typeof defaultPengeluaran !== 'undefined' ? JSON.parse(JSON.stringify(defaultPengeluaran)) : [];
      pengurus = typeof defaultPengurus !== 'undefined' ? JSON.parse(JSON.stringify(defaultPengurus)) : [];
      ketumKom = typeof defaultKetumKom !== 'undefined' ? JSON.parse(JSON.stringify(defaultKetumKom)) : [];
      anggaran = typeof defaultAnggaran !== 'undefined' ? JSON.parse(JSON.stringify(defaultAnggaran)) : [];
      rapat = typeof defaultRapat !== 'undefined' ? JSON.parse(JSON.stringify(defaultRapat)) : [];
      saveData();
      showToast('Data berhasil di-reset ke pengaturan awal!', 'success');
      renderApp();
    }
  });
}

// ==========================================
// 3. TAB NAVIGATION & CORE RENDER
// ==========================================
function switchTab(tabName) {
  const cadreAllowedTabs = ['dashboard', 'kader', 'mapaba', 'pkd', 'mabinkom', 'pengurus', 'ketum', 'kta', 'joinkader'];
  if (isKaderUser() && !cadreAllowedTabs.includes(tabName)) {
    tabName = 'dashboard';
  }

  currentTab = tabName;

  const tabIds = [
    'dashboard', 'kader', 'mapaba', 'pkd', 'mabinkom', 'pengurus', 'ketum', 'kta', 'joinkader', 'rapat', 'broadcast',
    'pemasukan', 'pengeluaran', 'anggaran', 'laporan', 'pengaturan'
  ];

  tabIds.forEach(id => {
    const tabEl = document.getElementById(`tab-${id}`);
    const navBtn = document.getElementById(`btn-nav-${id}`);

    if (tabEl) {
      if (id === tabName) {
        tabEl.classList.remove('hidden');
      } else {
        tabEl.classList.add('hidden');
      }
    }

    if (navBtn) {
      if (id === tabName) {
        navBtn.classList.add('nav-btn-active');
        navBtn.classList.remove('nav-btn-inactive', 'bg-pmii-navy', 'text-white', 'shadow-sm', 'text-slate-600', 'hover:bg-slate-100');
      } else {
        navBtn.classList.remove('nav-btn-active', 'bg-pmii-navy', 'text-white', 'shadow-sm');
        navBtn.classList.add('nav-btn-inactive');
      }
    }
  });

  // Render Section Tab yang aktif
  if (tabName === 'dashboard') renderDashboard();
  if (tabName === 'kader') renderKaderSection();
  if (tabName === 'mapaba') renderMapabaSection();
  if (tabName === 'pkd') renderPkdSection();
  if (tabName === 'mabinkom') renderMabinkomSection();
  if (tabName === 'pengurus') renderPengurusSection();
  if (tabName === 'ketum') renderKetumSection();
  if (tabName === 'kta') renderKtaSection();
  if (tabName === 'joinkader') initJoinKaderTab();
  if (tabName === 'rapat') renderRapatSection();
  if (tabName === 'broadcast') renderBroadcastSection();
  if (tabName === 'pemasukan') renderPemasukanSection();
  if (tabName === 'pengeluaran') renderPengeluaranSection();
  if (tabName === 'anggaran') renderAnggaranSection();
  if (tabName === 'laporan') renderLaporanSection();
  if (tabName === 'pengaturan') loadPengaturanForm();

  // Submenu Pos Pengeluaran: hanya terbuka ketika menu Pengeluaran Kas dipilih
  const subnavPengWrapper = document.getElementById('subnav-pengeluaran-wrapper');
  const subnavPengChevron = document.getElementById('pengeluaran-nav-chevron');
  if (tabName === 'pengeluaran') {
    if (subnavPengWrapper) subnavPengWrapper.classList.remove('hidden');
    if (subnavPengChevron) subnavPengChevron.classList.add('rotate-180');
  } else {
    if (subnavPengWrapper) subnavPengWrapper.classList.add('hidden');
    if (subnavPengChevron) subnavPengChevron.classList.remove('rotate-180');
  }

  // Submenu Pos Anggaran: hanya terbuka ketika menu Anggaran RAB dipilih
  const subnavWrapper = document.getElementById('subnav-anggaran-wrapper');
  const subnavChevron = document.getElementById('anggaran-nav-chevron');
  if (tabName === 'anggaran') {
    if (subnavWrapper) subnavWrapper.classList.remove('hidden');
    if (subnavChevron) subnavChevron.classList.add('rotate-180');
  } else {
    if (subnavWrapper) subnavWrapper.classList.add('hidden');
    if (subnavChevron) subnavChevron.classList.remove('rotate-180');
  }

  // Sinkronisasi status subnav pos tabs
  if (typeof updatePengeluaranPosTabs === 'function') {
    updatePengeluaranPosTabs();
  }
  if (typeof updateAnggaranPosTabs === 'function') {
    updateAnggaranPosTabs();
  }

  // Tutup drawer sidebar mobile jika terbuka
  toggleMobileSidebar(false);

  updateSidebarBadges();
  initLucide();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateSidebarBadges() {
  // Sidebar badges sengaja dihilangkan sesuai instruksi user untuk tampilan menu yang bersih dan rapi
}

function toggleMobileSidebar(open) {
  const sidebar = document.getElementById('main-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (!sidebar) return;

  if (open) {
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('translate-x-0');
    if (backdrop) backdrop.classList.remove('hidden');
  } else {
    sidebar.classList.remove('translate-x-0');
    sidebar.classList.add('-translate-x-full');
    if (backdrop) backdrop.classList.add('hidden');
  }
}

function renderHeader() {
  const headerNama = document.getElementById('header-komisariat-nama');
  const headerKampus = document.getElementById('header-komisariat-kampus');
  const headerKhidmat = document.getElementById('header-masa-khidmat-text');

  if (headerNama) headerNama.textContent = komisariat.nama || 'PK PMII ISMU';
  if (headerKampus) headerKampus.textContent = `${komisariat.kampus || 'INSTITUT MIFTAHUL ULUM TARATE'} • ${komisariat.cabang || 'PC PMII Kab. Sumenep'}`;
  if (headerKhidmat) {
    const raw = currentTahunKhidmat || komisariat.masaKhidmat || '2026 - 2027';
    headerKhidmat.textContent = raw.includes('Khidmat') ? raw : `Khidmat ${raw}`;
  }
}

function renderApp() {
  renderHeader();
  switchTab(currentTab);
}

// Toast notification
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgColors = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    warning: 'bg-amber-500 text-white',
    info: 'bg-pmii-blue text-white'
  };

  const icons = {
    success: 'check-circle',
    error: 'alert-triangle',
    warning: 'alert-circle',
    info: 'info'
  };

  toast.className = `${bgColors[type] || bgColors.info} px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-bold pointer-events-auto transition-all duration-300 transform translate-y-2 opacity-0`;
  toast.innerHTML = `
    <i data-lucide="${icons[type] || 'info'}" class="w-4 h-4 shrink-0"></i>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);
  initLucide();

  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

// ==========================================
// 4. DASHBOARD CONTROLLER
// ==========================================
function renderDashboard() {
  // Stat: Kader Total, Sahabat, Sahabati, Mabinkom
  const totalKader = kaders.length;
  const countSahabat = kaders.filter(k => k.gender !== 'Perempuan').length;
  const countSahabati = kaders.filter(k => k.gender === 'Perempuan').length;

  const statTotalKader = document.getElementById('stat-total-kader');
  const statTotalSahabat = document.getElementById('stat-total-sahabat');
  const statTotalSahabati = document.getElementById('stat-total-sahabati');
  const statTotalMabinkom = document.getElementById('stat-total-mabinkom');

  if (statTotalKader) statTotalKader.textContent = totalKader;
  if (statTotalSahabat) statTotalSahabat.textContent = countSahabat;
  if (statTotalSahabati) statTotalSahabati.textContent = countSahabati;
  if (statTotalMabinkom) statTotalMabinkom.textContent = mabinkom.length;

  // Stat: Jenjang Kaderisasi
  const countMapaba = kaders.filter(k => (k.kaderisasi?.formal || 'MAPABA') === 'MAPABA').length;
  const countPkd = kaders.filter(k => k.kaderisasi?.formal === 'PKD').length;
  const countPkl = kaders.filter(k => k.kaderisasi?.formal === 'PKL').length;
  const countPkn = kaders.filter(k => k.kaderisasi?.formal === 'PKN').length;
  const countSig = kaders.filter(k => k.kaderisasi?.kopri === 'SIG').length;
  const countSkk = kaders.filter(k => k.kaderisasi?.kopri === 'SKK' || k.kaderisasi?.kopri === 'SKKN').length;

  const elMapaba = document.getElementById('stat-count-mapaba');
  const elPkd = document.getElementById('stat-count-pkd');
  const elPkl = document.getElementById('stat-count-pkl');
  const elPkn = document.getElementById('stat-count-pkn');
  const elSig = document.getElementById('stat-kopri-sig');
  const elSkk = document.getElementById('stat-kopri-skk');

  if (elMapaba) elMapaba.textContent = countMapaba;
  if (elPkd) elPkd.textContent = countPkd;
  if (elPkl) elPkl.textContent = countPkl;
  if (elPkn) elPkn.textContent = countPkn;
  if (elSig) elSig.textContent = countSig;
  if (elSkk) elSkk.textContent = countSkk;

  // Stat: Keuangan Dashboard
  // Pemasukan kas TETAP (sebagai patokan pendapatan kumulatif / modal kas organisasi)
  const totalPemasukan = pemasukan.reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);

  // Pengeluaran kas: Disesuaikan dengan Tahun Khidmat Aktif
  const activePengeluaran = (pengeluaran || []).filter(p => isItemMatchTahunKhidmat(p, currentTahunKhidmat));
  const totalPengeluaran = activePengeluaran.reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);
  const saldoKas = totalPemasukan - totalPengeluaran;

  const dashPemasukan = document.getElementById('dash-stat-pemasukan');
  const dashPengeluaran = document.getElementById('dash-stat-pengeluaran');
  const dashSaldo = document.getElementById('dash-stat-saldo');
  const dashBadge = document.getElementById('dash-kas-status-badge');

  if (dashPemasukan) dashPemasukan.textContent = formatRupiah(totalPemasukan);
  if (dashPengeluaran) dashPengeluaran.textContent = formatRupiah(totalPengeluaran);
  if (dashSaldo) dashSaldo.textContent = formatRupiah(saldoKas);

  if (dashBadge) {
    if (saldoKas >= 0) {
      dashBadge.textContent = 'Surplus Kas';
      dashBadge.className = 'px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    } else {
      dashBadge.textContent = 'Defisit Kas';
      dashBadge.className = 'px-2 py-0.5 text-[9px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30';
    }
  }

  // Pos Pengeluaran Breakdown per Pos di Tahun Khidmat Aktif
  const pelantikanTotal = activePengeluaran.filter(p => matchPengeluaranPos(p.pos, 'Pelantikan')).reduce((a, b) => a + (Number(b.jumlah) || 0), 0);
  const mapabaTotal = activePengeluaran.filter(p => matchPengeluaranPos(p.pos, 'MAPABA')).reduce((a, b) => a + (Number(b.jumlah) || 0), 0);
  const pkdTotal = activePengeluaran.filter(p => matchPengeluaranPos(p.pos, 'PKD')).reduce((a, b) => a + (Number(b.jumlah) || 0), 0);
  const lainTotal = activePengeluaran.filter(p => matchPengeluaranPos(p.pos, 'Lain-lain')).reduce((a, b) => a + (Number(b.jumlah) || 0), 0);
  const sumPos = pelantikanTotal + mapabaTotal + pkdTotal + lainTotal || 1;

  const elPosPelantikan = document.getElementById('dash-pos-pelantikan');
  const elPosMapaba = document.getElementById('dash-pos-mapaba');
  const elPosPkd = document.getElementById('dash-pos-pkd');
  const elPosLain = document.getElementById('dash-pos-lain');
  if (elPosPelantikan) elPosPelantikan.textContent = formatRupiah(pelantikanTotal);
  if (elPosMapaba) elPosMapaba.textContent = formatRupiah(mapabaTotal);
  if (elPosPkd) elPosPkd.textContent = formatRupiah(pkdTotal);
  if (elPosLain) elPosLain.textContent = formatRupiah(lainTotal);

  const barPelantikan = document.getElementById('dash-pos-bar-pelantikan');
  const barMapaba = document.getElementById('dash-pos-bar-mapaba');
  const barPkd = document.getElementById('dash-pos-bar-pkd');
  const barLain = document.getElementById('dash-pos-bar-lain');
  if (barPelantikan) barPelantikan.style.width = `${Math.min(100, Math.round((pelantikanTotal / sumPos) * 100))}%`;
  if (barMapaba) barMapaba.style.width = `${Math.min(100, Math.round((mapabaTotal / sumPos) * 100))}%`;
  if (barPkd) barPkd.style.width = `${Math.min(100, Math.round((pkdTotal / sumPos) * 100))}%`;
  if (barLain) barLain.style.width = `${Math.min(100, Math.round((lainTotal / sumPos) * 100))}%`;

  // Acuan Anggaran (RAB) Dashboard per Tahun Khidmat Aktif
  const activeAnggaran = (anggaran || []).filter(a => isItemMatchTahunKhidmat(a, currentTahunKhidmat));
  const totalAnggaran = activeAnggaran.reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);
  const anggaranPelantikan = activeAnggaran.filter(a => (a.pos || '').toLowerCase() === 'pelantikan').reduce((a, b) => a + (Number(b.jumlah) || 0), 0);
  const anggaranPkd = activeAnggaran.filter(a => (a.pos || '').toLowerCase() === 'pkd').reduce((a, b) => a + (Number(b.jumlah) || 0), 0);
  const anggaranMapaba = activeAnggaran.filter(a => (a.pos || '').toLowerCase() === 'mapaba').reduce((a, b) => a + (Number(b.jumlah) || 0), 0);
  const anggaranLain = activeAnggaran.filter(a => (a.pos || '').toLowerCase() === 'lain-lain').reduce((a, b) => a + (Number(b.jumlah) || 0), 0);

  const sisaKebutuhanKas = Math.max(0, totalAnggaran - saldoKas);
  const pctAnggaranTerpenuhi = totalAnggaran > 0 ? Math.min(100, Math.round((Math.max(0, saldoKas) / totalAnggaran) * 100)) : 100;

  // DOM Dashboard Header Stat Anggaran
  const elDashAnggaranTotal = document.getElementById('dash-stat-anggaran-total');
  const elDashAnggaranSisa = document.getElementById('dash-stat-anggaran-sisa');
  const elDashAnggaranPct = document.getElementById('dash-stat-anggaran-pct');
  const elDashAnggaranBar = document.getElementById('dash-stat-anggaran-bar');

  if (elDashAnggaranTotal) elDashAnggaranTotal.textContent = formatRupiah(totalAnggaran);
  if (elDashAnggaranSisa) elDashAnggaranSisa.textContent = formatRupiah(sisaKebutuhanKas);
  if (elDashAnggaranPct) elDashAnggaranPct.textContent = `${pctAnggaranTerpenuhi}% Terpenuhi`;
  if (elDashAnggaranBar) elDashAnggaranBar.style.width = `${pctAnggaranTerpenuhi}%`;

  // Acuan Target Pos Anggaran di Dashboard
  const elDashAgrPlt = document.getElementById('dash-agr-pelantikan');
  const elDashAgrPkd = document.getElementById('dash-agr-pkd');
  const elDashAgrMpb = document.getElementById('dash-agr-mapaba');
  const elDashAgrLain = document.getElementById('dash-agr-lain');
  const elDashAgrSisaTotal = document.getElementById('dash-agr-sisa-total');

  if (elDashAgrPlt) elDashAgrPlt.textContent = formatRupiah(anggaranPelantikan);
  if (elDashAgrPkd) elDashAgrPkd.textContent = formatRupiah(anggaranPkd);
  if (elDashAgrMpb) elDashAgrMpb.textContent = formatRupiah(anggaranMapaba);
  if (elDashAgrLain) elDashAgrLain.textContent = formatRupiah(anggaranLain);
  if (elDashAgrSisaTotal) elDashAgrSisaTotal.textContent = formatRupiah(sisaKebutuhanKas);

  // Update Subnav Anggaran Count Badges
  const subnavBadgePlt = document.getElementById('subnav-badge-pelantikan');
  const subnavBadgePkd = document.getElementById('subnav-badge-pkd');
  const subnavBadgeMpb = document.getElementById('subnav-badge-mapaba');
  const subnavBadgeLain = document.getElementById('subnav-badge-lain');
  if (subnavBadgePlt) subnavBadgePlt.textContent = activeAnggaran.filter(a => (a.pos || '').toLowerCase() === 'pelantikan').length;
  if (subnavBadgePkd) subnavBadgePkd.textContent = activeAnggaran.filter(a => (a.pos || '').toLowerCase() === 'pkd').length;
  if (subnavBadgeMpb) subnavBadgeMpb.textContent = activeAnggaran.filter(a => (a.pos || '').toLowerCase() === 'mapaba').length;
  if (subnavBadgeLain) subnavBadgeLain.textContent = activeAnggaran.filter(a => (a.pos || '').toLowerCase() === 'lain-lain').length;

  // Render Recent Kaders Table
  const recentTable = document.getElementById('recent-kaders-table');
  if (recentTable) {
    const recentKaders = kaders.slice(-5).reverse();
    if (recentKaders.length === 0) {
      recentTable.innerHTML = `<tr><td colspan="4" class="py-6 text-center text-xs text-stone-400">Belum ada kader terdaftar</td></tr>`;
    } else {
      recentTable.innerHTML = recentKaders.map(k => {
        const initials = (k.nama || 'KD').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        const jenjang = k.kaderisasi?.formal || 'MAPABA';
        let jenjangClass = 'bg-amber-50 text-amber-800 border-amber-200';
        if (jenjang === 'PKD') jenjangClass = 'bg-blue-50 text-blue-800 border-blue-200';
        if (jenjang === 'PKL') jenjangClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
        if (jenjang === 'PKN') jenjangClass = 'bg-purple-50 text-purple-800 border-purple-200';

        return `
          <tr class="border-b border-slate-100 hover:bg-blue-50/30 transition">
            <td class="py-3 px-4">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                  ${initials}
                </div>
                <div>
                  <div class="font-bold text-xs text-slate-800">${escapeHtml(k.nama || '-')}</div>
                  <div class="text-[10px] text-slate-400">${escapeHtml(k.nim || '-')}</div>
                </div>
              </div>
            </td>
            <td class="py-3 px-4">
              <div class="text-xs font-semibold text-slate-700">${escapeHtml(k.fakultas || '-')}</div>
              <div class="text-[10px] text-slate-400">${escapeHtml(k.jurusan || '-')}</div>
            </td>
            <td class="py-3 px-4">
              <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${jenjangClass}">
                ${jenjang}
              </span>
            </td>
            <td class="py-3 px-4 text-xs font-medium text-slate-600">
              ${escapeHtml(k.jabatan || 'Anggota')}
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Render Recent Financial Transactions List
  const recentTransaksiList = document.getElementById('recent-transaksi-list');
  if (recentTransaksiList) {
    const combined = [
      ...pemasukan.map(m => ({ ...m, type: 'in', dateObj: new Date(m.tanggal || '1970-01-01') })),
      ...pengeluaran.map(k => ({ ...k, type: 'out', dateObj: new Date(k.tanggal || '1970-01-01') }))
    ].sort((a, b) => b.dateObj - a.dateObj).slice(0, 4);

    if (combined.length === 0) {
      recentTransaksiList.innerHTML = `<p class="text-xs text-slate-400 py-4 text-center">Belum ada transaksi kas</p>`;
    } else {
      recentTransaksiList.innerHTML = combined.map(item => {
        const isIn = item.type === 'in';
        return `
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-blue-200 transition">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center ${isIn ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}">
                <i data-lucide="${isIn ? 'arrow-down-left' : 'arrow-up-right'}" class="w-4 h-4"></i>
              </div>
              <div>
                <p class="text-xs font-bold text-slate-800 leading-tight">${escapeHtml(isIn ? (item.kategori || 'Pemasukan Kas') : `${item.pos || 'Pos'} - ${item.kategori || 'Pengeluaran'}`)}</p>
                <p class="text-[10px] text-slate-400">${escapeHtml(item.tanggal || '-')} • ${escapeHtml(isIn ? (item.diterimaDari || 'Kas') : (item.pic || 'Bendahara'))}</p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xs font-black ${isIn ? 'text-emerald-600' : 'text-rose-600'}">
                ${isIn ? '+' : '-'} ${formatRupiah(item.jumlah || 0)}
              </span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Render Charts
  renderDashboardCharts();
  initLucide();
}

function handleGlobalSearch(query) {
  const q = (query || '').trim();
  if (!q) return;

  if (currentTab !== 'kader') {
    switchTab('kader');
  }
  const searchInput = document.getElementById('search-kader-input');
  if (searchInput) {
    searchInput.value = q;
    handleSearchChange(q);
  }
}

function getBadgeClass(jenjang) {
  switch (jenjang) {
    case 'PKN': return 'bg-purple-100 text-purple-700 border border-purple-200';
    case 'PKL': return 'bg-indigo-100 text-indigo-700 border border-indigo-200';
    case 'PKD': return 'bg-blue-100 text-blue-700 border border-blue-200';
    case 'MAPABA':
    default:
      return 'bg-amber-100 text-amber-700 border border-amber-200';
  }
}

function renderDashboardCharts() {
  renderFakultasBarChart();
  renderKaderisasiDonutChart();
  renderGenderChart();
  initLucide();
}

function renderFakultasBarChart() {
  const container = document.getElementById('chart-fakultas-container');
  const strip = document.getElementById('fakultas-summary-strip');
  if (!container) return;

  const counts = {};
  kaders.forEach(k => {
    const f = (k.fakultas || 'Fakultas Lain').trim();
    counts[f] = (counts[f] || 0) + 1;
  });

  const fakultasKeys = Object.keys(counts);
  if (fakultasKeys.length === 0) {
    container.innerHTML = `
      <div class="w-full text-center py-16 text-slate-400 text-xs font-semibold">
        <i data-lucide="users" class="w-6 h-6 mx-auto mb-1 text-slate-300"></i>
        Belum ada data kader untuk ditampilkan.
      </div>
    `;
    return;
  }

  const maxVal = Math.max(...Object.values(counts), 1);
  const total = kaders.length || 1;

  const shortName = (name) => {
    if (name.toLowerCase().includes('tarbiyah')) return 'Fak. Tarbiyah';
    if (name.toLowerCase().includes('syariah')) return 'Fak. Syariah';
    if (name.toLowerCase().includes('ekonomi') || name.toLowerCase().includes('febi') || name.toLowerCase().includes('bisnis')) return 'FEBI';
    if (name.toLowerCase().includes('ushuluddin')) return 'Ushuluddin';
    if (name.toLowerCase().includes('dakwah')) return 'Dakwah';
    return name.length > 15 ? name.substring(0, 13) + '..' : name;
  };

  const barGradients = [
    { bg: 'from-blue-600 to-indigo-700', hover: 'from-blue-500 to-indigo-600', pill: 'bg-blue-900 text-yellow-300' },
    { bg: 'from-amber-500 to-yellow-500', hover: 'from-amber-400 to-yellow-400', pill: 'bg-amber-900 text-white' },
    { bg: 'from-blue-700 to-blue-900', hover: 'from-blue-600 to-blue-800', pill: 'bg-indigo-900 text-white' },
    { bg: 'from-emerald-600 to-teal-700', hover: 'from-emerald-500 to-teal-600', pill: 'bg-teal-900 text-white' }
  ];

  container.innerHTML = fakultasKeys.map((fak, idx) => {
    const val = counts[fak];
    const pct = Math.max(14, Math.round((val / maxVal) * 82));
    const totalPct = Math.round((val / total) * 100);
    const grad = barGradients[idx % barGradients.length];

    return `
      <div class="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer transition">
        <!-- Floating Value Badge on Top of Bar -->
        <div class="mb-2 transition-all transform group-hover:-translate-y-1">
          <span class="px-2 py-0.5 rounded-lg text-[10px] font-black ${grad.pill} shadow-xs whitespace-nowrap">
            ${val} Kader
          </span>
        </div>
        <!-- Column Bar with Modern Rounded Border & Soft Shadow -->
        <div class="w-full max-w-[56px] bg-slate-100 rounded-2xl overflow-hidden h-full flex flex-col justify-end p-1 border border-slate-200/60 shadow-inner">
          <div 
            class="w-full bg-gradient-to-t ${grad.bg} group-hover:${grad.hover} rounded-xl transition-all duration-700 ease-out shadow-xs group-hover:brightness-110 flex items-center justify-center" 
            style="height: ${pct}%;">
            <span class="text-[9px] font-bold text-white/90 drop-shadow-xs">${totalPct}%</span>
          </div>
        </div>
        <!-- X-Axis Label -->
        <span class="text-[11px] font-extrabold text-slate-700 mt-2.5 truncate max-w-full text-center group-hover:text-blue-700 transition">
          ${shortName(fak)}
        </span>
      </div>
    `;
  }).join('');

  if (strip) {
    strip.innerHTML = fakultasKeys.map((fak) => {
      const val = counts[fak];
      const pct = Math.round((val / total) * 100);
      return `
        <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition text-center">
          <p class="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide truncate">${shortName(fak)}</p>
          <p class="text-sm font-black text-slate-800 mt-0.5">${val} <span class="text-[10px] text-blue-600 font-bold">(${pct}%)</span></p>
        </div>
      `;
    }).join('');
  }
}

function renderKaderisasiDonutChart() {
  const container = document.getElementById('chart-kaderisasi-container');
  if (!container) return;

  const total = kaders.length || 1;
  const counts = {
    'MAPABA': kaders.filter(k => (k.kaderisasi?.formal || 'MAPABA') === 'MAPABA').length,
    'PKD': kaders.filter(k => k.kaderisasi?.formal === 'PKD').length,
    'PKL': kaders.filter(k => k.kaderisasi?.formal === 'PKL').length,
    'PKN': kaders.filter(k => k.kaderisasi?.formal === 'PKN').length
  };

  const items = [
    { label: 'MAPABA', count: counts.MAPABA, color: '#F5B000', dot: 'bg-yellow-400' },
    { label: 'PKD', count: counts.PKD, color: '#004B99', dot: 'bg-blue-600' },
    { label: 'PKL', count: counts.PKL, color: '#4F46E5', dot: 'bg-indigo-600' },
    { label: 'PKN', count: counts.PKN, color: '#9333EA', dot: 'bg-purple-600' }
  ];

  const C = 226.2; // 2 * PI * 36
  let currentOffset = 0;
  const svgCircles = items.map(item => {
    if (item.count === 0) return '';
    const fraction = item.count / total;
    const dashLength = fraction * C;
    const strokeDash = `${dashLength} ${C - dashLength}`;
    const strokeOffset = -currentOffset;
    currentOffset += dashLength;

    return `
      <circle 
        cx="50" cy="50" r="36" 
        fill="transparent" 
        stroke="${item.color}" 
        stroke-width="12" 
        stroke-dasharray="${strokeDash}" 
        stroke-dashoffset="${strokeOffset}" 
        class="transition-all duration-700 ease-out"
      />
    `;
  }).join('');

  container.innerHTML = `
    <div class="flex flex-col sm:flex-row items-center gap-4">
      <!-- Donut Circle with Total in Center (Matching Reference "Orders Overview") -->
      <div class="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
        <svg class="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="36" fill="transparent" stroke="#F1F5F9" stroke-width="12"/>
          ${svgCircles}
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span class="text-2xl font-black text-slate-800 leading-none">${kaders.length}</span>
          <span class="text-[9px] font-extrabold text-slate-400 uppercase mt-1 tracking-wider">Total Kader</span>
        </div>
      </div>

      <!-- Breakdown List on Right (Matching Reference "Orders Overview") -->
      <div class="flex-1 w-full space-y-1.5">
        ${items.map(it => {
          const pct = Math.round((it.count / total) * 100);
          return `
            <div class="flex items-center justify-between text-xs py-1 px-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full ${it.dot}"></span>
                <span class="font-bold text-slate-700">${it.label}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-black text-slate-800">${it.count}</span>
                <span class="text-[10px] font-bold text-slate-400 w-8 text-right">${pct}%</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderGenderChart() {
  const container = document.getElementById('chart-gender-container');
  const badge = document.getElementById('gender-ratio-badge');
  if (!container) return;

  const total = kaders.length || 1;
  const countLaki = kaders.filter(k => k.gender !== 'Perempuan').length;
  const countPerempuan = kaders.filter(k => k.gender === 'Perempuan').length;

  const pctLaki = Math.round((countLaki / total) * 100);
  const pctPerempuan = Math.round((countPerempuan / total) * 100);

  if (badge) {
    badge.textContent = `${pctLaki}% Putra • ${pctPerempuan}% Putri`;
  }

  container.innerHTML = `
    <!-- Sahabat (Putra) -->
    <div class="space-y-1">
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold text-blue-800 flex items-center gap-1.5">
          <i data-lucide="user" class="w-3.5 h-3.5 text-blue-600"></i>
          Sahabat (Putra)
        </span>
        <div class="flex items-center gap-2">
          <span class="font-black text-slate-800">${countLaki}</span>
          <span class="text-[10px] font-bold text-blue-600">${pctLaki}%</span>
        </div>
      </div>
      <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full transition-all duration-700 ease-out" style="width: ${pctLaki}%;"></div>
      </div>
    </div>

    <!-- Sahabati (KOPRI) -->
    <div class="space-y-1">
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold text-rose-800 flex items-center gap-1.5">
          <i data-lucide="sparkles" class="w-3.5 h-3.5 text-rose-500"></i>
          Sahabati (KOPRI)
        </span>
        <div class="flex items-center gap-2">
          <span class="font-black text-slate-800">${countPerempuan}</span>
          <span class="text-[10px] font-bold text-rose-600">${pctPerempuan}%</span>
        </div>
      </div>
      <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div class="bg-gradient-to-r from-rose-500 to-pink-500 h-2.5 rounded-full transition-all duration-700 ease-out" style="width: ${pctPerempuan}%;"></div>
      </div>
    </div>
  `;
}

// ==========================================
// 5. MODUL DATA KADER
// ==========================================
function renderKaderSection() {
  populateFakultasFilterOptions();
  populateAngkatanFilterOptions();
  renderKaderTable();
}

function filterKaderData() {
  return kaders.filter(k => {
    const formal = k.kaderisasi?.formal || 'MAPABA';

    const matchSearch = searchKaderQuery === '' ||
      (k.nama && k.nama.toLowerCase().includes(searchKaderQuery.toLowerCase())) ||
      (k.nim && k.nim.toLowerCase().includes(searchKaderQuery.toLowerCase())) ||
      (k.noKta && k.noKta.toLowerCase().includes(searchKaderQuery.toLowerCase())) ||
      (k.jurusan && k.jurusan.toLowerCase().includes(searchKaderQuery.toLowerCase())) ||
      (k.fakultas && k.fakultas.toLowerCase().includes(searchKaderQuery.toLowerCase()));

    const matchFakultas = filterKaderFakultas === 'all' || k.fakultas === filterKaderFakultas;
    const matchJenjang = filterKaderJenjang === 'all' || formal === filterKaderJenjang;
    const matchGender = filterKaderGender === 'all' || k.gender === filterKaderGender;
    const matchAngkatan = filterKaderAngkatan === 'all' || String(k.angkatan) === String(filterKaderAngkatan);

    return matchSearch && matchFakultas && matchJenjang && matchGender && matchAngkatan;
  });
}

function renderKaderTable() {
  const tbody = document.getElementById('kader-table-body');
  if (!tbody) return;

  const filtered = filterKaderData();
  const isKader = isKaderUser();

  const counter = document.getElementById('kader-filtered-count');
  if (counter) {
    counter.textContent = `Menampilkan ${filtered.length} dari ${kaders.length} kader`;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="p-8 text-center text-slate-400">
          <i data-lucide="users" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i>
          <p class="font-semibold text-xs">Tidak ada data kader yang sesuai filter pencarian.</p>
        </td>
      </tr>
    `;
    initLucide();
    return;
  }

  tbody.innerHTML = filtered.map(k => {
    return `
      <tr class="hover:bg-slate-50/80 transition text-xs border-b border-slate-100">
        <td class="py-3 px-4 font-mono font-bold text-pmii-navy whitespace-nowrap">
          ${k.noKta || '-'}
        </td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-3">
            <img src="${k.foto || 'https://via.placeholder.com/80'}" alt="${k.nama}" class="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0">
            <div>
              <span class="font-bold text-slate-800 block text-xs hover:text-blue-700 cursor-pointer" onclick="viewKaderDetail('${k.id}')">${k.nama}</span>
              <span class="text-[11px] text-slate-400 font-mono">NIM: ${k.nim || '-'}</span>
            </div>
          </div>
        </td>
        <td class="py-3 px-4">
          <span class="font-semibold text-slate-800 block">${k.fakultas || '-'}</span>
          <span class="text-[11px] text-slate-500">${k.jurusan || '-'} • Angk. ${k.angkatan || '-'}</span>
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getBadgeClass(k.kaderisasi?.formal)}">
            ${k.kaderisasi?.formal || 'MAPABA'}
          </span>
          ${k.kaderisasi?.kopri && k.kaderisasi?.kopri !== '-' ? `
            <span class="inline-block ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              ${k.kaderisasi.kopri}
            </span>
          ` : ''}
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          <span class="text-slate-700 font-medium">${k.jabatan || 'Anggota Kader'}</span>
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          ${k.whatsapp ? `
            <a href="https://wa.me/${k.whatsapp.replace(/\D/g, '')}" target="_blank" class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
              <i data-lucide="phone" class="w-3 h-3"></i>
              <span>${k.whatsapp}</span>
            </a>
          ` : '<span class="text-slate-400 text-[11px]">-</span>'}
        </td>
        <td class="py-3 px-4 text-right whitespace-nowrap">
          <div class="inline-flex items-center gap-1.5">
            <button onclick="viewKaderDetail('${k.id}')" title="Lihat Profil Lengkap" class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
              <i data-lucide="eye" class="w-4 h-4"></i>
            </button>
            ${!isKader ? `
            <button onclick="openKtaForKader('${k.id}')" title="Cetak E-KTA" class="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition">
              <i data-lucide="credit-card" class="w-4 h-4"></i>
            </button>
            <button onclick="openEditKaderModal('${k.id}')" title="Edit Data" class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition">
              <i data-lucide="edit-3" class="w-4 h-4"></i>
            </button>
            <button onclick="deleteKader('${k.id}')" title="Hapus Data Kader Ini" class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-lg border border-rose-200 hover:border-rose-600 transition shadow-xs">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              <span>Hapus</span>
            </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  initLucide();
}

function populateFakultasFilterOptions() {
  const select = document.getElementById('filter-fakultas');
  if (!select) return;

  const current = filterKaderFakultas;
  const masterFaks = (typeof getFakultasProdiList === 'function' ? getFakultasProdiList() : []).map(item => item.fakultas);
  const kaderFaks = (kaders || []).map(k => k.fakultas).filter(Boolean);
  const fakultasList = [...new Set([...masterFaks, ...kaderFaks])].sort();

  let options = `<option value="all">Semua Fakultas</option>`;
  fakultasList.forEach(f => {
    options += `<option value="${escapeHtml(f)}" ${f === current ? 'selected' : ''}>${escapeHtml(f)}</option>`;
  });

  select.innerHTML = options;
}

function populateAngkatanFilterOptions() {
  const select = document.getElementById('filter-angkatan');
  if (!select) return;

  const current = filterKaderAngkatan;
  const angkatanList = [...new Set(kaders.map(k => k.angkatan).filter(Boolean))].sort((a, b) => b - a);

  let options = `<option value="all">Semua Angkatan</option>`;
  angkatanList.forEach(a => {
    options += `<option value="${a}" ${String(a) === String(current) ? 'selected' : ''}>${a}</option>`;
  });

  select.innerHTML = options;
}

// Kader Filter Event Handlers
function handleSearchChange(val) {
  searchKaderQuery = val;
  renderKaderTable();
}

function handleFakultasFilter(val) {
  filterKaderFakultas = val;
  renderKaderTable();
}

function handleJenjangFilter(val) {
  filterKaderJenjang = val;
  renderKaderTable();
}

function handleGenderFilter(val) {
  filterKaderGender = val;
  renderKaderTable();
}

function handleAngkatanFilter(val) {
  filterKaderAngkatan = val;
  renderKaderTable();
}

// ==========================================
// CENTRAL DATA KADER AUTOCOMPLETE / LOOKUP
// ==========================================
let currentModalMode = 'kader'; // 'kader', 'mapaba', 'pkd'

function handleKaderSearchInModal(query) {
  const container = document.getElementById('kader-autocomplete-results');
  const clearBtn = document.getElementById('btn-clear-kader-search');
  if (!container) return;

  const q = (query || '').trim().toLowerCase();
  if (clearBtn) {
    clearBtn.classList.toggle('hidden', q.length === 0);
  }

  if (q.length < 1) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  const matches = kaders.filter(k => 
    (k.nama && k.nama.toLowerCase().includes(q)) ||
    (k.nim && k.nim.toLowerCase().includes(q)) ||
    (k.fakultas && k.fakultas.toLowerCase().includes(q)) ||
    (k.jurusan && k.jurusan.toLowerCase().includes(q))
  ).slice(0, 8);

  if (matches.length === 0) {
    container.innerHTML = `
      <div class="p-3 text-center text-xs text-slate-400">
        <p class="font-medium">Kader tidak ditemukan di Master Data.</p>
        <p class="text-[10px] text-slate-500 mt-0.5">Silakan isi formulir secara manual di bawah sebagai kader baru.</p>
      </div>
    `;
    container.classList.remove('hidden');
    return;
  }

  container.innerHTML = matches.map(k => {
    const formal = k.kaderisasi?.formal || 'MAPABA';
    let badgeBg = 'bg-blue-100 text-blue-800';
    if (formal === 'MAPABA') badgeBg = 'bg-emerald-100 text-emerald-800';
    else if (formal === 'PKD') badgeBg = 'bg-amber-100 text-amber-800';
    else if (formal === 'PKL') badgeBg = 'bg-indigo-100 text-indigo-800';
    else if (formal === 'PKN') badgeBg = 'bg-purple-100 text-purple-800';

    return `
      <div onclick="selectKaderForModal('${k.id}')" class="p-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between gap-3 transition">
        <div class="flex items-center gap-2.5 min-w-0">
          <img src="${k.foto || 'https://via.placeholder.com/80'}" alt="${k.nama}" class="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0">
          <div class="min-w-0">
            <p class="font-bold text-xs text-slate-800 truncate">${k.nama}</p>
            <p class="text-[10px] text-slate-400 truncate">NIM: ${k.nim || '-'} • ${k.fakultas || '-'} • Angk. ${k.angkatan || '-'}</p>
          </div>
        </div>
        <span class="text-[9px] font-extrabold px-2 py-0.5 rounded-full ${badgeBg} shrink-0">
          ${formal}
        </span>
      </div>
    `;
  }).join('');

  container.classList.remove('hidden');
}

function selectKaderForModal(id) {
  const kader = kaders.find(k => k.id === id);
  if (!kader) return;

  // Fill basic identification
  document.getElementById('kader-id').value = kader.id;
  document.getElementById('kader-nokta').value = kader.noKta || '';
  document.getElementById('kader-nik').value = kader.nik || '';
  document.getElementById('kader-nama').value = kader.nama || '';
  document.getElementById('kader-panggilan').value = kader.panggilan || '';
  document.getElementById('kader-nim').value = kader.nim || '';
  document.getElementById('kader-gender').value = kader.gender || 'Laki-laki';
  populateAdminKaderFakultasSelect(kader.fakultas || '', kader.jurusan || '');
  document.getElementById('kader-angkatan').value = kader.angkatan || '';
  document.getElementById('kader-ttl').value = kader.ttl || '';
  document.getElementById('kader-whatsapp').value = kader.whatsapp || '';
  document.getElementById('kader-email').value = kader.email || '';
  document.getElementById('kader-jabatan').value = kader.jabatan || 'Anggota Kader';
  document.getElementById('kader-alamat').value = kader.alamat || '';
  document.getElementById('kader-foto-url').value = kader.foto || '';
  document.getElementById('kader-foto-preview').src = kader.foto || 'https://via.placeholder.com/120';

  // Kaderisasi Info
  const formalSel = document.getElementById('kader-formal');
  const kopriSel = document.getElementById('kader-kopri');
  const thnMapaba = document.getElementById('kader-tahun-mapaba');
  const penMapaba = document.getElementById('kader-penyelenggara-mapaba');
  const thnPkd = document.getElementById('kader-tahun-pkd');
  const penPkd = document.getElementById('kader-penyelenggara-pkd');
  const thnPkl = document.getElementById('kader-tahun-pkl');
  const penPkl = document.getElementById('kader-penyelenggara-pkl');

  if (currentModalMode === 'mapaba') {
    if (formalSel) formalSel.value = 'MAPABA';
    if (thnMapaba) thnMapaba.value = kader.kaderisasi?.tahunMapaba || new Date().getFullYear();
    if (penMapaba) penMapaba.value = kader.kaderisasi?.penyelenggaraMapaba || komisariat.nama || 'PK PMII ISMU';
  } else if (currentModalMode === 'pkd') {
    if (formalSel) formalSel.value = 'PKD';
    if (thnMapaba) thnMapaba.value = kader.kaderisasi?.tahunMapaba || '';
    if (penMapaba) penMapaba.value = kader.kaderisasi?.penyelenggaraMapaba || 'PK PMII ISMU';
    if (thnPkd) thnPkd.value = kader.kaderisasi?.tahunPkd || new Date().getFullYear();
    if (penPkd) penPkd.value = kader.kaderisasi?.penyelenggaraPkd || 'PC PMII Kab. Sumenep';
  } else {
    if (formalSel) formalSel.value = kader.kaderisasi?.formal || 'MAPABA';
    if (thnMapaba) thnMapaba.value = kader.kaderisasi?.tahunMapaba || '';
    if (penMapaba) penMapaba.value = kader.kaderisasi?.penyelenggaraMapaba || '';
    if (thnPkd) thnPkd.value = kader.kaderisasi?.tahunPkd || '';
    if (penPkd) penPkd.value = kader.kaderisasi?.penyelenggaraPkd || '';
  }

  if (thnPkl) thnPkl.value = kader.kaderisasi?.tahunPkl || '';
  if (penPkl) penPkl.value = kader.kaderisasi?.penyelenggaraPkl || '';
  if (kopriSel) kopriSel.value = kader.kaderisasi?.kopri || '-';

  // Hide dropdown
  const results = document.getElementById('kader-autocomplete-results');
  if (results) results.classList.add('hidden');

  // Input text display
  const searchInput = document.getElementById('kader-autocomplete-input');
  if (searchInput) searchInput.value = `${kader.nama} (${kader.nim || '-'})`;

  const clearBtn = document.getElementById('btn-clear-kader-search');
  if (clearBtn) clearBtn.classList.remove('hidden');

  // Show notice
  const notice = document.getElementById('kader-autofilled-notice');
  const noticeText = document.getElementById('kader-autofilled-text');
  if (notice && noticeText) {
    noticeText.textContent = `✓ Terhubung dengan kader: ${kader.nama} (${kader.nim || '-'})`;
    notice.classList.remove('hidden');
  }

  showToast(`Data kader "${kader.nama}" berhasil dimuat otomatis!`, 'info');
}

function clearKaderSearchInModal() {
  const searchInput = document.getElementById('kader-autocomplete-input');
  if (searchInput) searchInput.value = '';
  const results = document.getElementById('kader-autocomplete-results');
  if (results) results.classList.add('hidden');
  const clearBtn = document.getElementById('btn-clear-kader-search');
  if (clearBtn) clearBtn.classList.add('hidden');
}

function resetAutofillKader() {
  clearKaderSearchInModal();
  const notice = document.getElementById('kader-autofilled-notice');
  if (notice) notice.classList.add('hidden');

  if (currentModalMode === 'mapaba') {
    openAddMapabaModal();
  } else if (currentModalMode === 'pkd') {
    openAddPkdModal();
  } else {
    openAddKaderModal();
  }
}

// ==========================================
// MODAL BAGIKAN LINK FORMULIR MANDIRI KADER
// ==========================================
function getPublicFormKaderUrl() {
  const loc = window.location;
  if (loc && loc.protocol && loc.protocol.startsWith('http')) {
    const basePath = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    return `${loc.origin}${basePath}form-kader.html`;
  } else {
    return 'form-kader.html';
  }
}

function openShareFormModal() {
  const modal = document.getElementById('modal-share-form');
  const inputUrl = document.getElementById('share-form-url-input');
  const qrImg = document.getElementById('share-form-qr-img');
  if (!modal) return;

  const formUrl = getPublicFormKaderUrl();
  if (inputUrl) {
    inputUrl.value = formUrl;
  }

  if (qrImg) {
    const qrTarget = formUrl.startsWith('http') ? formUrl : `https://pmii-ismu.com/${formUrl}`;
    const encoded = encodeURIComponent(qrTarget);
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encoded}&color=061738`;
  }

  modal.classList.remove('hidden');
  initLucide();
}

function closeShareFormModal() {
  const modal = document.getElementById('modal-share-form');
  if (modal) modal.classList.add('hidden');
}

function copyShareFormLink() {
  const inputUrl = document.getElementById('share-form-url-input');
  if (!inputUrl) return;

  inputUrl.select();
  inputUrl.setSelectionRange(0, 99999);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(inputUrl.value).then(() => {
      showToast('Tautan formulir kader berhasil disalin!', 'success');
    }).catch(() => {
      document.execCommand('copy');
      showToast('Tautan formulir kader disalin!', 'success');
    });
  } else {
    document.execCommand('copy');
    showToast('Tautan formulir kader disalin!', 'success');
  }
}

function openFormInNewTab() {
  const url = getPublicFormKaderUrl();
  window.open(url, '_blank');
}

function shareFormToWhatsApp() {
  const url = getPublicFormKaderUrl();
  const namaKom = (komisariat && komisariat.namaLengkap) || 'Pengurus Komisariat PMII ISMU Tarate';
  const pesan = encodeURIComponent(
    `*PEMBERITAHUAN RESMI PENDATAAN KADER PMII*\n` +
    `_${namaKom}_\n\n` +
    `Assalamu'alaikum Warahmatullahi Wabarakatuh Sahabat/i,\n\n` +
    `Diberitahukan kepada seluruh anggota & kader PMII Institut Miftahul Ulum (ISMU) Tarate Sumenep untuk mengisi formulir pendataan keanggotaan dan penerbitan E-KTA digital melalui tautan berikut:\n\n` +
    `👉 *Link Formulir:* ${url}\n\n` +
    `Mohon mengisi biodata diri dengan lengkap dan valid.\n\n` +
    `_Tangan Terkepal dan Maju ke Muka!_\n` +
    `_Salam Pergerakan!_`
  );

  window.open(`https://wa.me/?text=${pesan}`, '_blank');
}

// Modal Kader Handlers
function openAddKaderModal() {
  if (isKaderUser()) {
    showToast('Akses ditolak: Akun Kader bersifat Read-Only (Hanya Lihat).', 'warning');
    return;
  }
  currentModalMode = 'kader';
  const form = document.getElementById('form-kader');
  if (form) form.reset();

  const titleEl = document.getElementById('modal-kader-title');
  if (titleEl) titleEl.textContent = 'Tambah Kader Baru';
  const autoTitleEl = document.getElementById('kader-autocomplete-title');
  if (autoTitleEl) autoTitleEl.textContent = 'Cari & Pilih dari Data Kader (Otomatis Isi Form)';

  document.getElementById('kader-id').value = '';
  document.getElementById('kader-foto-url').value = '';
  document.getElementById('kader-foto-preview').src = 'https://via.placeholder.com/120';

  clearKaderSearchInModal();
  const notice = document.getElementById('kader-autofilled-notice');
  if (notice) notice.classList.add('hidden');

  populateAdminKaderFakultasSelect();

  const modal = document.getElementById('modal-kader');
  if (modal) modal.classList.remove('hidden');
}

function openEditKaderModal(id) {
  if (isKaderUser()) {
    showToast('Akses ditolak: Akun Kader bersifat Read-Only (Hanya Lihat).', 'warning');
    return;
  }
  currentModalMode = 'kader';
  const kader = kaders.find(k => k.id === id);
  if (!kader) return;

  const titleEl = document.getElementById('modal-kader-title');
  if (titleEl) titleEl.textContent = 'Edit Data Kader';
  const autoTitleEl = document.getElementById('kader-autocomplete-title');
  if (autoTitleEl) autoTitleEl.textContent = 'Data Kader Terpilih';

  clearKaderSearchInModal();
  const searchInput = document.getElementById('kader-autocomplete-input');
  if (searchInput) searchInput.value = `${kader.nama} (${kader.nim || '-'})`;

  const notice = document.getElementById('kader-autofilled-notice');
  const noticeText = document.getElementById('kader-autofilled-text');
  if (notice && noticeText) {
    noticeText.textContent = `✓ Mengedit data kader: ${kader.nama}`;
    notice.classList.remove('hidden');
  }

  document.getElementById('kader-id').value = kader.id;
  document.getElementById('kader-foto-url').value = kader.foto || '';
  document.getElementById('kader-foto-preview').src = kader.foto || 'https://via.placeholder.com/120';

  document.getElementById('kader-nokta').value = kader.noKta || '';
  document.getElementById('kader-nik').value = kader.nik || '';
  document.getElementById('kader-nama').value = kader.nama || '';
  document.getElementById('kader-panggilan').value = kader.panggilan || '';
  document.getElementById('kader-nim').value = kader.nim || '';
  document.getElementById('kader-gender').value = kader.gender || 'Laki-laki';
  populateAdminKaderFakultasSelect(kader.fakultas || '', kader.jurusan || '');
  document.getElementById('kader-angkatan').value = kader.angkatan || '';
  document.getElementById('kader-ttl').value = kader.ttl || '';
  document.getElementById('kader-whatsapp').value = kader.whatsapp || '';
  document.getElementById('kader-email').value = kader.email || '';
  document.getElementById('kader-jabatan').value = kader.jabatan || '';
  document.getElementById('kader-alamat').value = kader.alamat || '';

  // Kaderisasi
  document.getElementById('kader-formal').value = kader.kaderisasi?.formal || 'MAPABA';
  document.getElementById('kader-kopri').value = kader.kaderisasi?.kopri || '-';
  document.getElementById('kader-tahun-mapaba').value = kader.kaderisasi?.tahunMapaba || '';
  document.getElementById('kader-penyelenggara-mapaba').value = kader.kaderisasi?.penyelenggaraMapaba || '';
  document.getElementById('kader-tahun-pkd').value = kader.kaderisasi?.tahunPkd || '';
  document.getElementById('kader-penyelenggara-pkd').value = kader.kaderisasi?.penyelenggaraPkd || '';
  document.getElementById('kader-tahun-pkl').value = kader.kaderisasi?.tahunPkl || '';
  document.getElementById('kader-penyelenggara-pkl').value = kader.kaderisasi?.penyelenggaraPkl || '';

  const modal = document.getElementById('modal-kader');
  if (modal) modal.classList.remove('hidden');
}

function closeKaderModal() {
  clearKaderSearchInModal();
  const modal = document.getElementById('modal-kader');
  if (modal) modal.classList.add('hidden');
}

function handleFotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const dataUrl = e.target.result;
    document.getElementById('kader-foto-preview').src = dataUrl;
    document.getElementById('kader-foto-url').value = dataUrl;
  };
  reader.readAsDataURL(file);
}

function saveKaderForm(event) {
  event.preventDefault();

  if (isKaderUser()) {
    showToast('Akses ditolak: Akun Kader bersifat Read-Only (Hanya Lihat).', 'warning');
    return;
  }

  const id = document.getElementById('kader-id').value;
  const isEdit = !!id;

  const kaderData = {
    id: id || `KDR-${Date.now().toString().slice(-6)}`,
    noKta: document.getElementById('kader-nokta').value.trim(),
    nik: document.getElementById('kader-nik').value.trim(),
    nama: document.getElementById('kader-nama').value.trim(),
    panggilan: document.getElementById('kader-panggilan').value.trim(),
    nim: document.getElementById('kader-nim').value.trim(),
    gender: document.getElementById('kader-gender').value,
    fakultas: document.getElementById('kader-fakultas').value.trim(),
    jurusan: document.getElementById('kader-jurusan').value.trim(),
    angkatan: parseInt(document.getElementById('kader-angkatan').value) || new Date().getFullYear(),
    ttl: document.getElementById('kader-ttl').value.trim(),
    whatsapp: document.getElementById('kader-whatsapp').value.trim(),
    email: document.getElementById('kader-email').value.trim(),
    jabatan: document.getElementById('kader-jabatan').value.trim(),
    alamat: document.getElementById('kader-alamat').value.trim(),
    foto: document.getElementById('kader-foto-url').value || 'https://via.placeholder.com/120',
    kaderisasi: {
      formal: document.getElementById('kader-formal').value,
      tahunMapaba: document.getElementById('kader-tahun-mapaba').value.trim(),
      penyelenggaraMapaba: document.getElementById('kader-penyelenggara-mapaba').value.trim(),
      tahunPkd: document.getElementById('kader-tahun-pkd').value.trim(),
      penyelenggaraPkd: document.getElementById('kader-penyelenggara-pkd').value.trim(),
      tahunPkl: document.getElementById('kader-tahun-pkl').value.trim(),
      penyelenggaraPkl: document.getElementById('kader-penyelenggara-pkl').value.trim(),
      kopri: document.getElementById('kader-kopri').value
    }
  };

  if (isEdit) {
    const idx = kaders.findIndex(k => k.id === id);
    if (idx !== -1) {
      kaders[idx] = kaderData;
    } else {
      kaders.unshift(kaderData);
    }
    showToast('Data kader berhasil diperbarui!', 'success');
  } else {
    // Cek apakah kader dengan NIM yang sama sudah terdaftar
    const existingIdx = kaderData.nim ? kaders.findIndex(k => k.nim && k.nim === kaderData.nim) : -1;
    if (existingIdx !== -1) {
      kaderData.id = kaders[existingIdx].id;
      kaders[existingIdx] = kaderData;
      showToast(`Data kader NIM ${kaderData.nim} berhasil diperbarui di Master Data!`, 'success');
    } else {
      kaders.unshift(kaderData);
      showToast('Kader baru berhasil ditambahkan ke Master Data!', 'success');
    }
  }

  saveData();
  closeKaderModal();
  renderKaderSection();
  renderMapabaSection();
  renderPkdSection();
  renderDashboard();
}

function confirmDeleteAllKader() {
  if (isKaderUser()) {
    showToast('Akses ditolak: Akun Kader bersifat Read-Only (Hanya Lihat).', 'warning');
    return;
  }

  if (!kaders || kaders.length === 0) {
    showToast('Tidak ada data kader yang bisa dihapus.', 'info');
    return;
  }

  showConfirmModal({
    title: 'Hapus Semua Data Kader',
    message: `Apakah Anda yakin ingin menghapus <strong>seluruh data kader (${kaders.length} orang)</strong> sekaligus?<br><span class="text-rose-500 font-bold text-xs mt-1 block">Tindakan ini akan mengosongkan tabel kader dan menyinkronkannya ke Neon Cloud.</span>`,
    confirmText: 'Ya, Hapus Semua',
    cancelText: 'Batal',
    type: 'danger',
    icon: 'trash-2',
    onConfirm: () => {
      const count = kaders.length;
      kaders = [];
      saveData();
      showToast(`Berhasil menghapus seluruh data (${count} kader).`, 'success');
      renderKaderSection();
      renderMapabaSection();
      renderPkdSection();
      renderDashboard();
      updateSidebarBadges();
    }
  });
}

function deleteKader(id) {
  if (isKaderUser()) {
    showToast('Akses ditolak: Akun Kader bersifat Read-Only (Hanya Lihat).', 'warning');
    return;
  }

  const kader = kaders.find(k => k.id === id);
  if (!kader) return;

  showConfirmModal({
    title: 'Hapus Data Kader',
    message: `Apakah Anda yakin ingin menghapus data kader: <strong>"${escapeHtml(kader.nama)}"</strong> (NIM: ${escapeHtml(kader.nim || '-')})?<br><span class="text-rose-500 font-bold text-xs mt-1 block">Tindakan ini akan menghapus data kader ini dari sistem dan Neon Cloud.</span>`,
    confirmText: 'Ya, Hapus Data',
    cancelText: 'Batal',
    type: 'danger',
    icon: 'trash-2',
    onConfirm: async () => {
      // 1. Hapus seketika dari database Cloud Neon
      if (typeof executeNeonSql === 'function') {
        try {
          await executeNeonSql(`DELETE FROM tb_kader WHERE id = ${sqlEscape(id)};`);
        } catch (e) {
          console.warn('Gagal delete langsung dari Neon:', e);
        }
      }

      // 2. Hapus dari array kaders lokal
      kaders = kaders.filter(k => k.id !== id);
      saveData();

      showToast(`Data kader "${kader.nama}" berhasil dihapus.`, 'info');
      closeKaderDetailModal();
      renderKaderSection();
      renderMapabaSection();
      renderPkdSection();
      renderDashboard();
      updateSidebarBadges();
    }
  });
}

function deleteKaderFromDetail() {
  if (!currentKaderDetail) return;
  const targetId = currentKaderDetail.id;
  deleteKader(targetId);
}

function viewKaderDetail(id) {
  const kader = kaders.find(k => k.id === id);
  if (!kader) return;

  currentKaderDetail = kader;

  document.getElementById('detail-foto').src = kader.foto || 'https://via.placeholder.com/120';
  document.getElementById('detail-nama').textContent = kader.nama;
  document.getElementById('detail-nokta').textContent = kader.noKta || '-';
  document.getElementById('detail-gender').textContent = kader.gender || '-';
  document.getElementById('detail-jabatan').textContent = kader.jabatan || 'Anggota Kader';

  document.getElementById('detail-nim').textContent = kader.nim || '-';
  document.getElementById('detail-angkatan').textContent = kader.angkatan || '-';
  document.getElementById('detail-fakultas').textContent = kader.fakultas || '-';
  document.getElementById('detail-jurusan').textContent = kader.jurusan || '-';
  document.getElementById('detail-kampus').textContent = komisariat.kampus || 'Universitas Islam Negeri';
  document.getElementById('detail-ttl').textContent = kader.ttl || '-';
  document.getElementById('detail-whatsapp').textContent = kader.whatsapp || '-';
  document.getElementById('detail-email').textContent = kader.email || '-';
  document.getElementById('detail-alamat').textContent = kader.alamat || '-';

  // Kaderisasi Info
  document.getElementById('detail-formal').textContent = kader.kaderisasi?.formal || 'MAPABA';
  document.getElementById('detail-mapaba-info').textContent = kader.kaderisasi?.tahunMapaba ?
    `Tahun ${kader.kaderisasi.tahunMapaba} (${kader.kaderisasi.penyelenggaraMapaba || 'Komisariat'})` : 'Sudah Mengikuti';
  document.getElementById('detail-pkd-info').textContent = kader.kaderisasi?.tahunPkd ?
    `Tahun ${kader.kaderisasi.tahunPkd} (${kader.kaderisasi.penyelenggaraPkd || 'Komisariat'})` : (kader.kaderisasi?.formal !== 'MAPABA' ? 'Sudah Mengikuti' : 'Belum');
  document.getElementById('detail-pkl-info').textContent = kader.kaderisasi?.tahunPkl ?
    `Tahun ${kader.kaderisasi.tahunPkl} (${kader.kaderisasi.penyelenggaraPkl || 'PC PMII'})` : (kader.kaderisasi?.formal === 'PKL' || kader.kaderisasi?.formal === 'PKN' ? 'Sudah Mengikuti' : 'Belum');
  document.getElementById('detail-kopri-info').textContent = kader.kaderisasi?.kopri && kader.kaderisasi?.kopri !== '-' ? kader.kaderisasi.kopri : 'Tidak / Belum';

  const modal = document.getElementById('modal-detail-kader');
  if (modal) modal.classList.remove('hidden');
}

function closeKaderDetailModal() {
  const modal = document.getElementById('modal-detail-kader');
  if (modal) modal.classList.add('hidden');
}

function cetakKtaFromDetail() {
  if (currentKaderDetail) {
    closeKaderDetailModal();
    openKtaForKader(currentKaderDetail.id);
  }
}

// --- Excel: Kader (Template, Import, Export) ---
function downloadKaderTemplate() {
  if (typeof XLSX === 'undefined') {
    showToast('Library Excel belum siap. Silakan muat ulang halaman.', 'error');
    return;
  }

  const sampleData = [
    {
      "No KTA": "1960.05.01.2024.001",
      "Nama Lengkap": "Ahmad Fauzi Ridwan",
      "NIK": "3573012304030001",
      "NIM": "210605110012",
      "Jenis Kelamin": "Laki-laki",
      "Fakultas": "Sains dan Teknologi",
      "Jurusan": "Teknik Informatika",
      "Angkatan": 2021,
      "Tempat Tanggal Lahir": "Sumenep, 12 April 2003",
      "WhatsApp": "081234567801",
      "Email": "fauzi.ridwan@student.ac.id",
      "Jabatan": "Wakil Ketua I",
      "Jenjang Kaderisasi": "PKD",
      "Tahun Mapaba": "2022",
      "Penyelenggara Mapaba": "PK PMII ISMU",
      "Tahun PKD": "2023",
      "Penyelenggara PKD": "PC PMII Kab. Sumenep",
      "Kaderisasi KOPRI": "-",
      "Alamat Domisili": "Tarate, Sumenep"
    },
    {
      "No KTA": "1960.05.01.2024.002",
      "Nama Lengkap": "Dewi Sartika Putri",
      "NIK": "3573016508040002",
      "NIM": "220401110045",
      "Jenis Kelamin": "Perempuan",
      "Fakultas": "Ilmu Tarbiyah dan Keguruan",
      "Jurusan": "Pendidikan Agama Islam",
      "Angkatan": 2022,
      "Tempat Tanggal Lahir": "Sumenep, 25 Agustus 2004",
      "WhatsApp": "081234567802",
      "Email": "dewi.sartika@student.ac.id",
      "Jabatan": "Ketua KOPRI",
      "Jenjang Kaderisasi": "PKD",
      "Tahun Mapaba": "2022",
      "Penyelenggara Mapaba": "PK PMII ISMU",
      "Tahun PKD": "2023",
      "Penyelenggara PKD": "PC PMII Kab. Sumenep",
      "Kaderisasi KOPRI": "SIG",
      "Alamat Domisili": "Jl. Pesantren No. 11, Tarate, Sumenep"
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template Kader");
  XLSX.writeFile(wb, "Template_Import_Kader_PMII.xlsx");
  showToast('Template Excel Data Kader berhasil diunduh!', 'success');
}

function handleImportKaderFile(event) {
  if (isKaderUser()) {
    showToast('Akses ditolak: Akun Kader bersifat Read-Only (Hanya Lihat).', 'warning');
    return;
  }

  const file = event.target.files[0];
  if (!file) return;

  if (typeof XLSX === 'undefined') {
    showToast('Library Excel belum siap.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheet];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      if (!rows || rows.length === 0) {
        showToast('File Excel kosong atau format tidak sesuai.', 'warning');
        return;
      }

      let countSuccess = 0;
      rows.forEach((row, i) => {
        const nama = row['Nama Lengkap'] || row['nama'] || row['Nama'];
        if (!nama) return;

        const newKader = {
          id: `KDR-${Date.now().toString().slice(-6)}-${i}`,
          noKta: String(row['No KTA'] || row['nokta'] || row['KTA'] || `1960.${Date.now()}`),
          nik: String(row['NIK'] || row['nik'] || ''),
          nama: String(nama).trim(),
          panggilan: String(row['Nama Panggilan'] || row['Panggilan'] || ''),
          nim: String(row['NIM'] || row['nim'] || '-'),
          gender: (row['Jenis Kelamin'] || row['Gender'] || '').includes('Perempuan') ? 'Perempuan' : 'Laki-laki',
          fakultas: String(row['Fakultas'] || row['fakultas'] || 'Tarbiyah').trim(),
          jurusan: String(row['Jurusan'] || row['jurusan'] || '-').trim(),
          angkatan: parseInt(row['Angkatan'] || row['angkatan']) || new Date().getFullYear(),
          ttl: String(row['Tempat Tanggal Lahir'] || row['TTL'] || ''),
          whatsapp: String(row['WhatsApp'] || row['No WhatsApp'] || row['No. WhatsApp / HP'] || row['HP'] || ''),
          email: String(row['Email'] || row['email'] || ''),
          jabatan: String(row['Jabatan'] || 'Anggota Kader'),
          alamat: String(row['Alamat Domisili'] || row['Alamat'] || ''),
          foto: 'https://via.placeholder.com/120',
          kaderisasi: {
            formal: (row['Jenjang Kaderisasi'] || row['Jenjang'] || 'MAPABA').toUpperCase(),
            tahunMapaba: String(row['Tahun Mapaba'] || ''),
            penyelenggaraMapaba: String(row['Penyelenggara Mapaba'] || ''),
            tahunPkd: String(row['Tahun PKD'] || ''),
            penyelenggaraPkd: String(row['Penyelenggara PKD'] || ''),
            tahunPkl: String(row['Tahun PKL'] || ''),
            penyelenggaraPkl: String(row['Penyelenggara PKL'] || ''),
            kopri: String(row['Kaderisasi KOPRI'] || '-')
          }
        };

        kaders.unshift(newKader);
        countSuccess++;
      });

      if (countSuccess > 0) {
        saveData();
        renderKaderSection();
        showToast(`Berhasil mengimpor ${countSuccess} data kader baru dari Excel!`, 'success');
      } else {
        showToast('Tidak ada data kader yang valid untuk diimpor.', 'warning');
      }
    } catch (err) {
      console.error('Import kader error:', err);
      showToast('Gagal memproses file Excel: ' + err.message, 'error');
    }

    event.target.value = '';
  };

  reader.readAsArrayBuffer(file);
}

function exportKaderExcel() {
  if (typeof XLSX === 'undefined') {
    showToast('Library Excel belum siap.', 'error');
    return;
  }

  const exportRows = kaders.map((k, index) => ({
    "No": index + 1,
    "No KTA": k.noKta || '-',
    "Nama Lengkap": k.nama,
    "NIM": k.nim || '-',
    "Jenis Kelamin": k.gender,
    "Fakultas": k.fakultas || '-',
    "Jurusan": k.jurusan || '-',
    "Angkatan": k.angkatan || '-',
    "Jenjang Formal": k.kaderisasi?.formal || 'MAPABA',
    "KOPRI": k.kaderisasi?.kopri || '-',
    "No WhatsApp": k.whatsapp || '-',
    "Email": k.email || '-',
    "Jabatan": k.jabatan || 'Anggota',
    "Alamat Domisili": k.alamat || '-'
  }));

  const ws = XLSX.utils.json_to_sheet(exportRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data Kader");
  XLSX.writeFile(wb, `Data_Kader_PMII_${(komisariat.nama || 'Komisariat').replace(/\s+/g, '_')}.xlsx`);
  showToast('Data kader berhasil diexport ke Excel!', 'success');
}

// ==========================================
// 5A. MODUL DATA MAPABA (MASA PENERIMAAN ANGGOTA BARU)
// ==========================================
function renderMapabaSection() {
  populateMapabaFilterOptions();
  renderMapabaTable();
}

function populateMapabaFilterOptions() {
  const mapabaKaders = kaders.filter(k => (k.kaderisasi?.formal || 'MAPABA') === 'MAPABA');
  const selFakultas = document.getElementById('filter-mapaba-fakultas');
  const selAngkatan = document.getElementById('filter-mapaba-angkatan');

  if (selFakultas) {
    const listFakultas = [...new Set(mapabaKaders.map(k => k.fakultas).filter(Boolean))].sort();
    selFakultas.innerHTML = '<option value="all">Semua Fakultas</option>' +
      listFakultas.map(f => `<option value="${f}" ${filterMapabaFakultas === f ? 'selected' : ''}>${f}</option>`).join('');
  }

  if (selAngkatan) {
    const listAngkatan = [...new Set(mapabaKaders.map(k => k.angkatan).filter(Boolean))].sort((a, b) => b - a);
    selAngkatan.innerHTML = '<option value="all">Semua Angkatan</option>' +
      listAngkatan.map(a => `<option value="${a}" ${filterMapabaAngkatan === String(a) ? 'selected' : ''}>Angkatan ${a}</option>`).join('');
  }
}

function handleSearchMapaba(val) {
  searchMapabaQuery = val || '';
  renderMapabaTable();
}

function handleMapabaFakultasFilter(val) {
  filterMapabaFakultas = val;
  renderMapabaTable();
}

function handleMapabaGenderFilter(val) {
  filterMapabaGender = val;
  renderMapabaTable();
}

function handleMapabaAngkatanFilter(val) {
  filterMapabaAngkatan = val;
  renderMapabaTable();
}

function resetMapabaFilter() {
  searchMapabaQuery = '';
  filterMapabaFakultas = 'all';
  filterMapabaGender = 'all';
  filterMapabaAngkatan = 'all';

  const sInput = document.getElementById('search-mapaba-input');
  if (sInput) sInput.value = '';

  populateMapabaFilterOptions();
  renderMapabaTable();
  showToast('Filter data MAPABA di-reset.', 'info');
}

function filterMapabaData() {
  return kaders.filter(k => {
    const formal = k.kaderisasi?.formal || 'MAPABA';
    if (formal !== 'MAPABA') return false;

    const matchSearch = searchMapabaQuery === '' ||
      (k.nama && k.nama.toLowerCase().includes(searchMapabaQuery.toLowerCase())) ||
      (k.nim && k.nim.toLowerCase().includes(searchMapabaQuery.toLowerCase())) ||
      (k.noKta && k.noKta.toLowerCase().includes(searchMapabaQuery.toLowerCase())) ||
      (k.jurusan && k.jurusan.toLowerCase().includes(searchMapabaQuery.toLowerCase())) ||
      (k.fakultas && k.fakultas.toLowerCase().includes(searchMapabaQuery.toLowerCase()));

    const matchFakultas = filterMapabaFakultas === 'all' || k.fakultas === filterMapabaFakultas;
    const matchGender = filterMapabaGender === 'all' || k.gender === filterMapabaGender;
    const matchAngkatan = filterMapabaAngkatan === 'all' || String(k.angkatan) === String(filterMapabaAngkatan);

    return matchSearch && matchFakultas && matchGender && matchAngkatan;
  });
}

function renderMapabaTable() {
  const tbody = document.getElementById('mapaba-table-body');
  const counter = document.getElementById('mapaba-filtered-count');
  if (!tbody) return;

  const isKader = isKaderUser();
  const allMapaba = kaders.filter(k => (k.kaderisasi?.formal || 'MAPABA') === 'MAPABA');
  const filtered = filterMapabaData();

  if (counter) counter.textContent = `Menampilkan ${filtered.length} dari ${allMapaba.length} kader MAPABA`;

  // Update Stat Cards
  const statTotal = document.getElementById('mapaba-stat-total');
  const statLaki = document.getElementById('mapaba-stat-laki');
  const statPerempuan = document.getElementById('mapaba-stat-perempuan');
  const statTahun = document.getElementById('mapaba-stat-tahun');

  const countLaki = allMapaba.filter(k => k.gender === 'Laki-laki').length;
  const countPerempuan = allMapaba.filter(k => k.gender === 'Perempuan').length;
  const lastYear = allMapaba.map(k => k.kaderisasi?.tahunMapaba).filter(Boolean).sort().reverse()[0] || '2024';

  if (statTotal) statTotal.textContent = allMapaba.length;
  if (statLaki) statLaki.textContent = countLaki;
  if (statPerempuan) statPerempuan.textContent = countPerempuan;
  if (statTahun) statTahun.textContent = lastYear;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="p-8 text-center text-slate-400">
          <i data-lucide="user-check" class="w-8 h-8 mx-auto mb-2 text-emerald-300"></i>
          <p class="font-semibold text-xs">Tidak ada data kader MAPABA yang sesuai filter pencarian.</p>
        </td>
      </tr>
    `;
    initLucide();
    return;
  }

  tbody.innerHTML = filtered.map(k => {
    return `
      <tr class="hover:bg-emerald-50/40 transition text-xs border-b border-slate-100">
        <td class="py-3 px-4 font-mono font-bold text-pmii-navy whitespace-nowrap">
          ${k.noKta || '-'}
        </td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-3">
            <img src="${k.foto || 'https://via.placeholder.com/80'}" alt="${k.nama}" class="w-9 h-9 rounded-full object-cover border border-emerald-200 shrink-0">
            <div>
              <span class="font-bold text-slate-800 block text-xs hover:text-emerald-700 cursor-pointer" onclick="viewKaderDetail('${k.id}')">${k.nama}</span>
              <span class="text-[11px] text-slate-400 font-mono">NIM: ${k.nim || '-'}</span>
            </div>
          </div>
        </td>
        <td class="py-3 px-4">
          <span class="font-semibold text-slate-800 block">${k.fakultas || '-'}</span>
          <span class="text-[11px] text-slate-500">${k.jurusan || '-'} • Angk. ${k.angkatan || '-'}</span>
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
            Tahun ${k.kaderisasi?.tahunMapaba || '-'}
          </span>
        </td>
        <td class="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">
          ${k.kaderisasi?.penyelenggaraMapaba || komisariat.nama || 'PK PMII ISMU'}
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          ${k.whatsapp ? `
            <a href="https://wa.me/${k.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <i data-lucide="phone" class="w-3 h-3"></i>
              <span>${k.whatsapp}</span>
            </a>
          ` : '-'}
        </td>
        <td class="py-3 px-4 text-right whitespace-nowrap">
          <div class="flex items-center justify-end gap-1.5">
            <button onclick="viewKaderDetail('${k.id}')" title="Lihat Profil Lengkap" class="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition">
              <i data-lucide="eye" class="w-4 h-4"></i>
            </button>
            ${!isKader ? `
            <button onclick="openEditKaderModal('${k.id}')" title="Edit Data" class="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 transition">
              <i data-lucide="edit" class="w-4 h-4"></i>
            </button>
            <button onclick="quickGenerateKTA('${k.id}')" title="Cetak Kartu Tanda Anggota (KTA)" class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition">
              <i data-lucide="credit-card" class="w-4 h-4"></i>
            </button>
            <button onclick="deleteKader('${k.id}')" title="Hapus Data Kader Ini" class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-lg border border-rose-200 hover:border-rose-600 transition shadow-xs">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              <span>Hapus</span>
            </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  initLucide();
}

function openAddMapabaModal() {
  if (isKaderUser()) {
    showToast('Akses ditolak: Akun Kader bersifat Read-Only (Hanya Lihat).', 'warning');
    return;
  }
  openAddKaderModal();
  currentModalMode = 'mapaba';
  const title = document.getElementById('modal-kader-title');
  if (title) title.textContent = 'Tambah Peserta MAPABA Baru';
  const autoTitle = document.getElementById('kader-autocomplete-title');
  if (autoTitle) autoTitle.textContent = 'Cari Kader dari Data Kader (Otomatis Isi Form MAPABA)';
  const selFormal = document.getElementById('kader-formal');
  if (selFormal) selFormal.value = 'MAPABA';
  const selTahun = document.getElementById('kader-tahun-mapaba');
  if (selTahun) selTahun.value = new Date().getFullYear();
  const selPenyelenggara = document.getElementById('kader-penyelenggara-mapaba');
  if (selPenyelenggara) selPenyelenggara.value = komisariat.nama || 'PK PMII ISMU';
}

function downloadMapabaTemplate() {
  const templateRows = [
    {
      "No KTA": "PMII.048.2024.101",
      "Nama Lengkap": "Ahmad Mujahid",
      "NIM": "240101110001",
      "NIK": "3529012304050099",
      "Jenis Kelamin": "Laki-laki",
      "Fakultas": "Fakultas Tarbiyah",
      "Jurusan": "Pendidikan Agama Islam",
      "Angkatan": 2024,
      "Tahun MAPABA": 2024,
      "Penyelenggara MAPABA": "PK PMII ISMU",
      "KOPRI": "-",
      "No WhatsApp": "081234567890",
      "Email": "mujahid@student.ismu.ac.id",
      "Alamat": "Sumenep"
    }
  ];

  const ws = XLSX.utils.json_to_sheet(templateRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template MAPABA");
  XLSX.writeFile(wb, "Template_Import_Data_MAPABA_PMII_ISMU.xlsx");
  showToast('Template Excel Data MAPABA berhasil diunduh!', 'success');
}

function handleImportMapabaFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (!jsonData || jsonData.length === 0) {
        showToast('File Excel kosong atau format tidak sesuai.', 'warning');
        return;
      }

      let importedCount = 0;
      jsonData.forEach((row, idx) => {
        const nama = row['Nama Lengkap'] || row['Nama'] || row['NAMA'];
        if (!nama) return;

        const newId = `KD-MPB-${Date.now()}-${idx}`;
        const newKader = {
          id: newId,
          noKta: row['No KTA'] || row['No. KTA'] || `PMII.048.${new Date().getFullYear()}.${String(kaders.length + 1).padStart(3, '0')}`,
          nik: String(row['NIK'] || ''),
          nim: String(row['NIM'] || ''),
          nama: String(nama),
          panggilan: String(nama).split(' ')[0],
          gender: (row['Jenis Kelamin'] && row['Jenis Kelamin'].toLowerCase().includes('peremp')) ? 'Perempuan' : 'Laki-laki',
          jurusan: row['Jurusan'] || row['Program Studi'] || 'Pendidikan Agama Islam',
          fakultas: row['Fakultas'] || 'Fakultas Tarbiyah',
          angkatan: Number(row['Angkatan']) || new Date().getFullYear(),
          ttl: row['TTL'] || row['Tempat Tanggal Lahir'] || 'Sumenep',
          whatsapp: String(row['No WhatsApp'] || row['WhatsApp'] || row['No HP'] || ''),
          email: row['Email'] || '',
          alamat: row['Alamat'] || 'Kabupaten Sumenep',
          jabatan: 'Anggota',
          statusKeaktifan: 'Aktif',
          foto: 'https://via.placeholder.com/150',
          kaderisasi: {
            formal: 'MAPABA',
            tahunMapaba: String(row['Tahun MAPABA'] || new Date().getFullYear()),
            penyelenggaraMapaba: row['Penyelenggara MAPABA'] || komisariat.nama || 'PK PMII ISMU',
            tahunPkd: '',
            penyelenggaraPkd: '',
            tahunPkl: '',
            penyelenggaraPkl: '',
            kopri: row['KOPRI'] || '-'
          }
        };

        kaders.push(newKader);
        importedCount++;
      });

      saveData();
      showToast(`Berhasil mengimpor ${importedCount} data kader MAPABA!`, 'success');
      renderMapabaSection();
      e.target.value = '';
    } catch (err) {
      console.error(err);
      showToast('Gagal memproses file Excel: ' + err.message, 'error');
    }
  };
  reader.readAsArrayBuffer(file);
}

function exportMapabaExcel() {
  const mapabaList = filterMapabaData();
  if (mapabaList.length === 0) {
    showToast('Tidak ada data MAPABA untuk diexport.', 'warning');
    return;
  }

  const exportRows = mapabaList.map((k, idx) => ({
    "No": idx + 1,
    "No KTA": k.noKta || '-',
    "Nama Lengkap": k.nama,
    "NIM": k.nim || '-',
    "Jenis Kelamin": k.gender,
    "Fakultas": k.fakultas || '-',
    "Jurusan": k.jurusan || '-',
    "Angkatan": k.angkatan || '-',
    "Tahun MAPABA": k.kaderisasi?.tahunMapaba || '-',
    "Penyelenggara": k.kaderisasi?.penyelenggaraMapaba || '-',
    "KOPRI": k.kaderisasi?.kopri || '-',
    "WhatsApp": k.whatsapp || '-',
    "Alamat": k.alamat || '-'
  }));

  const ws = XLSX.utils.json_to_sheet(exportRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data MAPABA");
  XLSX.writeFile(wb, `Data_MAPABA_PMII_ISMU_${new Date().getFullYear()}.xlsx`);
  showToast('Data MAPABA berhasil diexport ke Excel!', 'success');
}

// ==========================================
// 5B. MODUL DATA PKD (PELATIHAN KADER DASAR)
// ==========================================
function renderPkdSection() {
  populatePkdFilterOptions();
  renderPkdTable();
}

function populatePkdFilterOptions() {
  const pkdKaders = kaders.filter(k => k.kaderisasi?.formal === 'PKD');
  const selFakultas = document.getElementById('filter-pkd-fakultas');
  const selAngkatan = document.getElementById('filter-pkd-angkatan');

  if (selFakultas) {
    const listFakultas = [...new Set(pkdKaders.map(k => k.fakultas).filter(Boolean))].sort();
    selFakultas.innerHTML = '<option value="all">Semua Fakultas</option>' +
      listFakultas.map(f => `<option value="${f}" ${filterPkdFakultas === f ? 'selected' : ''}>${f}</option>`).join('');
  }

  if (selAngkatan) {
    const listAngkatan = [...new Set(pkdKaders.map(k => k.angkatan).filter(Boolean))].sort((a, b) => b - a);
    selAngkatan.innerHTML = '<option value="all">Semua Angkatan</option>' +
      listAngkatan.map(a => `<option value="${a}" ${filterPkdAngkatan === String(a) ? 'selected' : ''}>Angkatan ${a}</option>`).join('');
  }
}

function handleSearchPkd(val) {
  searchPkdQuery = val || '';
  renderPkdTable();
}

function handlePkdFakultasFilter(val) {
  filterPkdFakultas = val;
  renderPkdTable();
}

function handlePkdGenderFilter(val) {
  filterPkdGender = val;
  renderPkdTable();
}

function handlePkdAngkatanFilter(val) {
  filterPkdAngkatan = val;
  renderPkdTable();
}

function resetPkdFilter() {
  searchPkdQuery = '';
  filterPkdFakultas = 'all';
  filterPkdGender = 'all';
  filterPkdAngkatan = 'all';

  const sInput = document.getElementById('search-pkd-input');
  if (sInput) sInput.value = '';

  populatePkdFilterOptions();
  renderPkdTable();
  showToast('Filter data PKD di-reset.', 'info');
}

function filterPkdData() {
  return kaders.filter(k => {
    if (k.kaderisasi?.formal !== 'PKD') return false;

    const matchSearch = searchPkdQuery === '' ||
      (k.nama && k.nama.toLowerCase().includes(searchPkdQuery.toLowerCase())) ||
      (k.nim && k.nim.toLowerCase().includes(searchPkdQuery.toLowerCase())) ||
      (k.noKta && k.noKta.toLowerCase().includes(searchPkdQuery.toLowerCase())) ||
      (k.jurusan && k.jurusan.toLowerCase().includes(searchPkdQuery.toLowerCase())) ||
      (k.fakultas && k.fakultas.toLowerCase().includes(searchPkdQuery.toLowerCase()));

    const matchFakultas = filterPkdFakultas === 'all' || k.fakultas === filterPkdFakultas;
    const matchGender = filterPkdGender === 'all' || k.gender === filterPkdGender;
    const matchAngkatan = filterPkdAngkatan === 'all' || String(k.angkatan) === String(filterPkdAngkatan);

    return matchSearch && matchFakultas && matchGender && matchAngkatan;
  });
}

function renderPkdTable() {
  const tbody = document.getElementById('pkd-table-body');
  const counter = document.getElementById('pkd-filtered-count');
  if (!tbody) return;

  const isKader = isKaderUser();
  const allPkd = kaders.filter(k => k.kaderisasi?.formal === 'PKD');
  const filtered = filterPkdData();

  if (counter) counter.textContent = `Menampilkan ${filtered.length} dari ${allPkd.length} kader PKD`;

  // Update Stat Cards
  const statTotal = document.getElementById('pkd-stat-total');
  const statLaki = document.getElementById('pkd-stat-laki');
  const statPerempuan = document.getElementById('pkd-stat-perempuan');
  const statTahun = document.getElementById('pkd-stat-tahun');

  const countLaki = allPkd.filter(k => k.gender === 'Laki-laki').length;
  const countPerempuan = allPkd.filter(k => k.gender === 'Perempuan').length;
  const lastYear = allPkd.map(k => k.kaderisasi?.tahunPkd).filter(Boolean).sort().reverse()[0] || '2024';

  if (statTotal) statTotal.textContent = allPkd.length;
  if (statLaki) statLaki.textContent = countLaki;
  if (statPerempuan) statPerempuan.textContent = countPerempuan;
  if (statTahun) statTahun.textContent = lastYear;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="p-8 text-center text-slate-400">
          <i data-lucide="shield-check" class="w-8 h-8 mx-auto mb-2 text-amber-300"></i>
          <p class="font-semibold text-xs">Tidak ada data kader PKD yang sesuai filter pencarian.</p>
        </td>
      </tr>
    `;
    initLucide();
    return;
  }

  tbody.innerHTML = filtered.map(k => {
    return `
      <tr class="hover:bg-amber-50/40 transition text-xs border-b border-slate-100">
        <td class="py-3 px-4 font-mono font-bold text-pmii-navy whitespace-nowrap">
          ${k.noKta || '-'}
        </td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-3">
            <img src="${k.foto || 'https://via.placeholder.com/80'}" alt="${k.nama}" class="w-9 h-9 rounded-full object-cover border border-amber-300 shrink-0">
            <div>
              <span class="font-bold text-slate-800 block text-xs hover:text-amber-700 cursor-pointer" onclick="viewKaderDetail('${k.id}')">${k.nama}</span>
              <span class="text-[11px] text-slate-400 font-mono">NIM: ${k.nim || '-'}</span>
            </div>
          </div>
        </td>
        <td class="py-3 px-4">
          <span class="font-semibold text-slate-800 block">${k.fakultas || '-'}</span>
          <span class="text-[11px] text-slate-500">${k.jurusan || '-'} • Angk. ${k.angkatan || '-'}</span>
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
            Tahun ${k.kaderisasi?.tahunPkd || '-'}
          </span>
        </td>
        <td class="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">
          ${k.kaderisasi?.penyelenggaraPkd || komisariat.nama || 'PK PMII ISMU'}
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          <span class="text-[11px] font-bold ${k.kaderisasi?.kopri && k.kaderisasi.kopri !== '-' ? 'text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200' : 'text-slate-400'}">
            ${k.kaderisasi?.kopri || '-'}
          </span>
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          ${k.whatsapp ? `
            <a href="https://wa.me/${k.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <i data-lucide="phone" class="w-3 h-3"></i>
              <span>${k.whatsapp}</span>
            </a>
          ` : '-'}
        </td>
        <td class="py-3 px-4 text-right whitespace-nowrap">
          <div class="flex items-center justify-end gap-1.5">
            <button onclick="viewKaderDetail('${k.id}')" title="Lihat Profil Lengkap" class="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition">
              <i data-lucide="eye" class="w-4 h-4"></i>
            </button>
            ${!isKader ? `
            <button onclick="openEditKaderModal('${k.id}')" title="Edit Data" class="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 transition">
              <i data-lucide="edit" class="w-4 h-4"></i>
            </button>
            <button onclick="quickGenerateKTA('${k.id}')" title="Cetak Kartu Tanda Anggota (KTA)" class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition">
              <i data-lucide="credit-card" class="w-4 h-4"></i>
            </button>
            <button onclick="deleteKader('${k.id}')" title="Hapus Data Kader Ini" class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-lg border border-rose-200 hover:border-rose-600 transition shadow-xs">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              <span>Hapus</span>
            </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  initLucide();
}

function openAddPkdModal() {
  if (isKaderUser()) {
    showToast('Akses ditolak: Akun Kader bersifat Read-Only (Hanya Lihat).', 'warning');
    return;
  }
  openAddKaderModal();
  currentModalMode = 'pkd';
  const title = document.getElementById('modal-kader-title');
  if (title) title.textContent = 'Tambah Kader PKD Baru';
  const autoTitle = document.getElementById('kader-autocomplete-title');
  if (autoTitle) autoTitle.textContent = 'Cari Kader dari Data Kader (Otomatis Naik Jenjang ke PKD)';
  const selFormal = document.getElementById('kader-formal');
  if (selFormal) selFormal.value = 'PKD';
  const selTahun = document.getElementById('kader-tahun-pkd');
  if (selTahun) selTahun.value = new Date().getFullYear();
  const selPenyelenggara = document.getElementById('kader-penyelenggara-pkd');
  if (selPenyelenggara) selPenyelenggara.value = 'PC PMII Kab. Sumenep';
}

function downloadPkdTemplate() {
  const templateRows = [
    {
      "No KTA": "PMII.048.2024.201",
      "Nama Lengkap": "Kader Mujahid",
      "NIM": "230101110022",
      "NIK": "3529012304040088",
      "Jenis Kelamin": "Laki-laki",
      "Fakultas": "Fakultas Syariah",
      "Jurusan": "Hukum Keluarga Islam",
      "Angkatan": 2023,
      "Tahun PKD": 2024,
      "Penyelenggara PKD": "PK PMII ISMU",
      "KOPRI": "-",
      "No WhatsApp": "081234567891",
      "Email": "mujahid.pkd@gmail.com",
      "Alamat": "Sumenep"
    }
  ];

  const ws = XLSX.utils.json_to_sheet(templateRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template PKD");
  XLSX.writeFile(wb, "Template_Import_Data_PKD_PMII_ISMU.xlsx");
  showToast('Template Excel Data PKD berhasil diunduh!', 'success');
}

function handleImportPkdFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (!jsonData || jsonData.length === 0) {
        showToast('File Excel kosong atau format tidak sesuai.', 'warning');
        return;
      }

      let importedCount = 0;
      jsonData.forEach((row, idx) => {
        const nama = row['Nama Lengkap'] || row['Nama'] || row['NAMA'];
        if (!nama) return;

        const newId = `KD-PKD-${Date.now()}-${idx}`;
        const newKader = {
          id: newId,
          noKta: row['No KTA'] || row['No. KTA'] || `PMII.048.${new Date().getFullYear()}.${String(kaders.length + 1).padStart(3, '0')}`,
          nik: String(row['NIK'] || ''),
          nim: String(row['NIM'] || ''),
          nama: String(nama),
          panggilan: String(nama).split(' ')[0],
          gender: (row['Jenis Kelamin'] && row['Jenis Kelamin'].toLowerCase().includes('peremp')) ? 'Perempuan' : 'Laki-laki',
          jurusan: row['Jurusan'] || row['Program Studi'] || 'Hukum Keluarga Islam',
          fakultas: row['Fakultas'] || 'Fakultas Syariah',
          angkatan: Number(row['Angkatan']) || (new Date().getFullYear() - 1),
          ttl: row['TTL'] || row['Tempat Tanggal Lahir'] || 'Sumenep',
          whatsapp: String(row['No WhatsApp'] || row['WhatsApp'] || row['No HP'] || ''),
          email: row['Email'] || '',
          alamat: row['Alamat'] || 'Kabupaten Sumenep',
          jabatan: 'Kader Mujahid',
          statusKeaktifan: 'Aktif',
          foto: 'https://via.placeholder.com/150',
          kaderisasi: {
            formal: 'PKD',
            tahunMapaba: String(Number(row['Tahun PKD'] || new Date().getFullYear()) - 1),
            penyelenggaraMapaba: komisariat.nama || 'PK PMII ISMU',
            tahunPkd: String(row['Tahun PKD'] || new Date().getFullYear()),
            penyelenggaraPkd: row['Penyelenggara PKD'] || komisariat.nama || 'PK PMII ISMU',
            tahunPkl: '',
            penyelenggaraPkl: '',
            kopri: row['KOPRI'] || '-'
          }
        };

        kaders.push(newKader);
        importedCount++;
      });

      saveData();
      showToast(`Berhasil mengimpor ${importedCount} data kader PKD!`, 'success');
      renderPkdSection();
      e.target.value = '';
    } catch (err) {
      console.error(err);
      showToast('Gagal memproses file Excel: ' + err.message, 'error');
    }
  };
  reader.readAsArrayBuffer(file);
}

function exportPkdExcel() {
  const pkdList = filterPkdData();
  if (pkdList.length === 0) {
    showToast('Tidak ada data PKD untuk diexport.', 'warning');
    return;
  }

  const exportRows = pkdList.map((k, idx) => ({
    "No": idx + 1,
    "No KTA": k.noKta || '-',
    "Nama Lengkap": k.nama,
    "NIM": k.nim || '-',
    "Jenis Kelamin": k.gender,
    "Fakultas": k.fakultas || '-',
    "Jurusan": k.jurusan || '-',
    "Angkatan": k.angkatan || '-',
    "Tahun PKD": k.kaderisasi?.tahunPkd || '-',
    "Penyelenggara": k.kaderisasi?.penyelenggaraPkd || '-',
    "KOPRI": k.kaderisasi?.kopri || '-',
    "WhatsApp": k.whatsapp || '-',
    "Alamat": k.alamat || '-'
  }));

  const ws = XLSX.utils.json_to_sheet(exportRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data PKD");
  XLSX.writeFile(wb, `Data_PKD_PMII_ISMU_${new Date().getFullYear()}.xlsx`);
  showToast('Data PKD berhasil diexport ke Excel!', 'success');
}

// ==========================================
// 6. MODUL DATA MABINKOM
// ==========================================
function renderMabinkomSection() {
  renderMabinkomList();
}

function filterMabinkomData() {
  return mabinkom.filter(m => {
    if (!searchMabinkomQuery) return true;
    const q = searchMabinkomQuery.toLowerCase();
    return (m.nama && m.nama.toLowerCase().includes(q)) ||
      (m.jabatan && m.jabatan.toLowerCase().includes(q)) ||
      (m.profesi && m.profesi.toLowerCase().includes(q)) ||
      (m.instansi && m.instansi.toLowerCase().includes(q)) ||
      (m.alamat && m.alamat.toLowerCase().includes(q));
  });
}

function renderMabinkomList() {
  const tbody = document.getElementById('mabinkom-table-body');
  const counter = document.getElementById('mabinkom-filtered-count');
  if (!tbody) return;

  const isKader = isKaderUser();
  const filtered = filterMabinkomData();
  if (counter) counter.textContent = `Menampilkan ${filtered.length} dari ${mabinkom.length} dewan pembina`;

  // Update stat cards
  const totalEl = document.getElementById('stat-mabinkom-total');
  const ketuaEl = document.getElementById('stat-mabinkom-ketua');
  const profesiEl = document.getElementById('stat-mabinkom-profesi-count');

  if (totalEl) totalEl.textContent = mabinkom.length;
  if (ketuaEl) {
    const ketua = mabinkom.find(m => (m.jabatan || '').toLowerCase().includes('ketua'));
    ketuaEl.textContent = ketua ? ketua.nama : '-';
  }
  if (profesiEl) {
    const profesiSet = new Set(mabinkom.map(m => m.profesi).filter(Boolean));
    profesiEl.textContent = `${profesiSet.size} Profesi`;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="p-8 text-center text-slate-400">
          <i data-lucide="shield" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i>
          <p class="font-semibold text-xs">Belum ada data dewan pembina (Mabinkom) yang sesuai filter.</p>
        </td>
      </tr>
    `;
    initLucide();
    return;
  }

  tbody.innerHTML = filtered.map((m, index) => {
    return `
      <tr class="hover:bg-slate-50/80 transition text-xs border-b border-slate-100">
        <td class="py-3 px-4 text-center text-slate-400 font-mono">${index + 1}</td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-3">
            <img src="${m.foto || 'https://via.placeholder.com/80'}" alt="${m.nama}" class="w-9 h-9 rounded-full object-cover border-2 border-pmii-navy/20 shrink-0">
            <div>
              <span class="font-bold text-slate-800 block text-xs hover:text-blue-700 cursor-pointer" onclick="viewMabinkomDetail('${m.id}')">${m.nama}</span>
              <span class="text-[11px] text-slate-400">${m.email || '-'}</span>
            </div>
          </div>
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pmii-navy text-yellow-300">
            ${m.jabatan || 'Dewan Pembina'}
          </span>
        </td>
        <td class="py-3 px-4 text-center font-mono font-bold text-slate-700 whitespace-nowrap">
          ${m.angkatan || '-'}
        </td>
        <td class="py-3 px-4">
          <span class="font-medium text-slate-800 block">${m.profesi || '-'}</span>
          <span class="text-[11px] text-slate-500">${m.instansi || '-'}</span>
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          ${m.whatsapp ? `
            <a href="https://wa.me/${m.whatsapp.replace(/\D/g, '')}" target="_blank" class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
              <i data-lucide="phone" class="w-3 h-3"></i>
              <span>${m.whatsapp}</span>
            </a>
          ` : '<span class="text-slate-400 text-[11px]">-</span>'}
        </td>
        <td class="py-3 px-4 max-w-[150px] truncate text-slate-600">
          ${m.alamat || '-'}
        </td>
        <td class="py-3 px-4 text-right whitespace-nowrap">
          <div class="inline-flex items-center gap-1">
            <button onclick="viewMabinkomDetail('${m.id}')" title="Lihat Profil" class="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
              <i data-lucide="eye" class="w-4 h-4"></i>
            </button>
            ${!isKader ? `
            <button onclick="openEditMabinkomModal('${m.id}')" title="Edit Data" class="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition">
              <i data-lucide="edit-3" class="w-4 h-4"></i>
            </button>
            <button onclick="deleteMabinkom('${m.id}')" title="Hapus Data" class="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  initLucide();
}

function handleSearchMabinkom(val) {
  searchMabinkomQuery = val;
  renderMabinkomList();
}

// Modal Mabinkom Handlers
function openAddMabinkomModal() {
  if (isKaderUser()) {
    showToast('Akses ditolak: Akun Kader bersifat Read-Only (Hanya Lihat).', 'warning');
    return;
  }
  const form = document.getElementById('form-mabinkom');
  if (form) form.reset();

  document.getElementById('modal-mabinkom-title').textContent = 'Tambah Pembina (Mabinkom)';
  document.getElementById('mabinkom-id').value = '';
  document.getElementById('mabinkom-foto-url').value = '';
  document.getElementById('mabinkom-foto-preview').src = 'https://via.placeholder.com/120';

  const modal = document.getElementById('modal-mabinkom');
  if (modal) modal.classList.remove('hidden');
}

function openEditMabinkomModal(id) {
  if (isKaderUser()) {
    showToast('Akses ditolak: Akun Kader bersifat Read-Only (Hanya Lihat).', 'warning');
    return;
  }
  const mbk = mabinkom.find(m => m.id === id);
  if (!mbk) return;

  document.getElementById('modal-mabinkom-title').textContent = 'Edit Data Pembina (Mabinkom)';
  document.getElementById('mabinkom-id').value = mbk.id;
  document.getElementById('mabinkom-foto-url').value = mbk.foto || '';
  document.getElementById('mabinkom-foto-preview').src = mbk.foto || 'https://via.placeholder.com/120';

  document.getElementById('mabinkom-nama').value = mbk.nama || '';
  document.getElementById('mabinkom-jabatan').value = mbk.jabatan || 'Anggota Pengarah';
  document.getElementById('mabinkom-profesi').value = mbk.profesi || '';
  document.getElementById('mabinkom-instansi').value = mbk.instansi || '';
  document.getElementById('mabinkom-alumni-angkatan').value = mbk.angkatan || '';
  document.getElementById('mabinkom-kontak').value = mbk.whatsapp || '';
  document.getElementById('mabinkom-email').value = mbk.email || '';
  document.getElementById('mabinkom-alamat').value = mbk.alamat || '';

  const modal = document.getElementById('modal-mabinkom');
  if (modal) modal.classList.remove('hidden');
}

function closeMabinkomModal() {
  const modal = document.getElementById('modal-mabinkom');
  if (modal) modal.classList.add('hidden');
}

function handleMabinkomFotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const dataUrl = e.target.result;
    document.getElementById('mabinkom-foto-preview').src = dataUrl;
    document.getElementById('mabinkom-foto-url').value = dataUrl;
  };
  reader.readAsDataURL(file);
}

function saveMabinkomForm(event) {
  event.preventDefault();

  if (isKaderUser()) {
    showToast('Akses ditolak: Akun Kader bersifat Read-Only (Hanya Lihat).', 'warning');
    return;
  }

  const id = document.getElementById('mabinkom-id').value;
  const isEdit = !!id;

  const data = {
    id: id || `MBK-${Date.now().toString().slice(-4)}`,
    nama: document.getElementById('mabinkom-nama').value.trim(),
    jabatan: document.getElementById('mabinkom-jabatan').value,
    profesi: document.getElementById('mabinkom-profesi').value.trim(),
    instansi: document.getElementById('mabinkom-instansi').value.trim(),
    angkatan: document.getElementById('mabinkom-alumni-angkatan').value.trim(),
    whatsapp: document.getElementById('mabinkom-kontak').value.trim(),
    email: document.getElementById('mabinkom-email').value.trim(),
    alamat: document.getElementById('mabinkom-alamat').value.trim(),
    foto: document.getElementById('mabinkom-foto-url').value || 'https://via.placeholder.com/120'
  };

  if (isEdit) {
    const idx = mabinkom.findIndex(m => m.id === id);
    if (idx !== -1) mabinkom[idx] = data;
    showToast('Data pembina berhasil diperbarui!', 'success');
  } else {
    mabinkom.push(data);
    showToast('Pembina baru berhasil ditambahkan!', 'success');
  }

  saveData();
  closeMabinkomModal();
  renderMabinkomSection();
}

function deleteMabinkom(id) {
  if (isKaderUser()) {
    showToast('Akses ditolak: Akun Kader bersifat Read-Only (Hanya Lihat).', 'warning');
    return;
  }

  const mbk = (mabinkom || []).find(m => m.id === id);
  if (!mbk) return;

  showConfirmModal({
    title: 'Hapus Dewan Pembina (Mabinkom)',
    message: `Apakah Anda yakin ingin menghapus data dewan pembina: <strong>"${escapeHtml(mbk.nama)}"</strong>?<br><span class="text-rose-500 font-bold text-xs mt-1 block">Tindakan ini akan menghapus pembina ini secara permanen dari Cloud Neon.</span>`,
    confirmText: 'Ya, Hapus',
    cancelText: 'Batal',
    type: 'danger',
    icon: 'trash-2',
    onConfirm: async () => {
      // Direct deletion from Cloud Neon
      if (typeof executeNeonSql === 'function') {
        try {
          await executeNeonSql(`DELETE FROM tb_mabinkom WHERE id = ${sqlEscape(id)};`);
        } catch (e) {
          console.warn('[NEON] Direct delete mabinkom gagal:', e.message);
        }
      }

      mabinkom = (mabinkom || []).filter(m => m.id !== id);
      saveData();
      showToast('Data pembina berhasil dihapus permanen.', 'info');
      renderMabinkomSection();
    }
  });
}

function viewMabinkomDetail(id) {
  const mbk = mabinkom.find(m => m.id === id);
  if (!mbk) return;

  currentMabinkomDetail = mbk;

  document.getElementById('detail-mabinkom-foto').src = mbk.foto || 'https://via.placeholder.com/120';
  document.getElementById('detail-mabinkom-nama').textContent = mbk.nama;
  document.getElementById('detail-mabinkom-jabatan').textContent = mbk.jabatan || 'Dewan Pembina';
  document.getElementById('detail-mabinkom-profesi').textContent = mbk.profesi || '-';

  document.getElementById('detail-mabinkom-instansi').textContent = mbk.instansi || '-';
  document.getElementById('detail-mabinkom-angkatan').textContent = mbk.angkatan || '-';
  document.getElementById('detail-mabinkom-kontak').textContent = mbk.whatsapp || '-';
  document.getElementById('detail-mabinkom-email').textContent = mbk.email || '-';
  document.getElementById('detail-mabinkom-alamat').textContent = mbk.alamat || '-';

  const modal = document.getElementById('modal-detail-mabinkom');
  if (modal) modal.classList.remove('hidden');
}

function closeMabinkomDetailModal() {
  const modal = document.getElementById('modal-detail-mabinkom');
  if (modal) modal.classList.add('hidden');
}

// --- Excel: Mabinkom (Template, Import, Export) ---
function downloadMabinkomTemplate() {
  if (typeof XLSX === 'undefined') {
    showToast('Library Excel belum siap.', 'error');
    return;
  }

  const sampleData = [
    {
      "Nama Lengkap & Gelar": "Dr. H. M. Zainul Muttaqin, M.Pd.I",
      "Jabatan Mabinkom": "Ketua Dewan Mabinkom",
      "Profesi / Aktivitas": "Dosen Pascasarjana & Tokoh Pendidikan",
      "Instansi / Lembaga": "Institut Miftahul Ulum Tarate",
      "Alumni Angkatan": "2002",
      "No WhatsApp": "081234567901",
      "Email": "zainul.muttaqin@gmail.com",
      "Alamat Domisili": "Tarate, Sumenep"
    },
    {
      "Nama Lengkap & Gelar": "Ahmad Baihaqi, S.Kom., M.T.",
      "Jabatan Mabinkom": "Sekretaris Mabinkom",
      "Profesi / Aktivitas": "Praktisi IT & Dosen",
      "Instansi / Lembaga": "PT Inovasi Digital",
      "Alumni Angkatan": "2008",
      "No WhatsApp": "081234567902",
      "Email": "baihaqi.it@gmail.com",
      "Alamat Domisili": "Jl. Trunojoyo No. 45, Sumenep"
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template Mabinkom");
  XLSX.writeFile(wb, "Template_Import_Mabinkom_PMII.xlsx");
  showToast('Template Excel Mabinkom berhasil diunduh!', 'success');
}

function handleImportMabinkomFile(event) {
  if (isKaderUser()) {
    showToast('Akses ditolak: Akun Kader bersifat Read-Only (Hanya Lihat).', 'warning');
    return;
  }

  const file = event.target.files[0];
  if (!file) return;

  if (typeof XLSX === 'undefined') {
    showToast('Library Excel belum siap.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      if (!rows || rows.length === 0) {
        showToast('File Excel kosong atau format tidak sesuai.', 'warning');
        return;
      }

      let countSuccess = 0;
      rows.forEach((row, i) => {
        const nama = row['Nama Lengkap & Gelar'] || row['Nama Lengkap'] || row['Nama'] || row['nama'];
        if (!nama) return;

        const newMbk = {
          id: `MBK-${Date.now().toString().slice(-4)}-${i}`,
          nama: String(nama).trim(),
          jabatan: String(row['Jabatan Mabinkom'] || row['Jabatan'] || 'Anggota Pengarah').trim(),
          profesi: String(row['Profesi / Aktivitas'] || row['Profesi'] || '-').trim(),
          instansi: String(row['Instansi / Lembaga'] || row['Instansi'] || '').trim(),
          angkatan: String(row['Alumni Angkatan'] || row['Angkatan'] || '').trim(),
          whatsapp: String(row['No WhatsApp'] || row['WhatsApp'] || row['Kontak'] || '').trim(),
          email: String(row['Email'] || row['email'] || '').trim(),
          alamat: String(row['Alamat Domisili'] || row['Alamat'] || '').trim(),
          foto: 'https://via.placeholder.com/120'
        };

        mabinkom.push(newMbk);
        countSuccess++;
      });

      if (countSuccess > 0) {
        saveData();
        renderMabinkomSection();
        showToast(`Berhasil mengimpor ${countSuccess} data pembina Mabinkom!`, 'success');
      } else {
        showToast('Tidak ada data pembina yang valid untuk diimpor.', 'warning');
      }
    } catch (err) {
      console.error('Import mabinkom error:', err);
      showToast('Gagal memproses file Excel: ' + err.message, 'error');
    }

    event.target.value = '';
  };

  reader.readAsArrayBuffer(file);
}

function exportMabinkomExcel() {
  if (typeof XLSX === 'undefined') {
    showToast('Library Excel belum siap.', 'error');
    return;
  }

  const exportRows = mabinkom.map((m, index) => ({
    "No": index + 1,
    "Nama Lengkap & Gelar": m.nama,
    "Jabatan Mabinkom": m.jabatan || 'Dewan Pembina',
    "Profesi": m.profesi || '-',
    "Instansi / Lembaga": m.instansi || '-',
    "Alumni Angkatan": m.angkatan || '-',
    "No WhatsApp": m.whatsapp || '-',
    "Email": m.email || '-',
    "Alamat Domisili": m.alamat || '-'
  }));

  const ws = XLSX.utils.json_to_sheet(exportRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data Mabinkom");
  XLSX.writeFile(wb, `Data_Mabinkom_PMII_${(komisariat.nama || 'Komisariat').replace(/\s+/g, '_')}.xlsx`);
  showToast('Data Mabinkom berhasil diexport ke Excel!', 'success');
}

// ==========================================
// 6A. MODUL PENGURUS KOMISARIAT (STRUKTURAL PER TAHUN)
// ==========================================
function isKhidmatMatch(kh, target) {
  if (!kh || !target) return false;
  const targetStr = target.toString().trim();
  const cleanTarget = cleanKhidmatStr(targetStr);
  const targetYears = extractKhidmatYears(targetStr);
  const targetStart = targetYears[0];

  if (kh.id === targetStr) return true;
  if (kh.label === targetStr) return true;
  if (cleanKhidmatStr(kh.label || '') === cleanTarget) return true;
  if (cleanKhidmatStr(kh.id || '') === cleanTarget) return true;
  if (kh.tahunMulai && kh.tahunMulai.toString() === targetStr) return true;
  if (kh.tahunMulai && kh.tahunSelesai && `${kh.tahunMulai} - ${kh.tahunSelesai}` === targetStr) return true;
  if (kh.tahunMulai && kh.tahunSelesai && `${kh.tahunMulai}-${kh.tahunSelesai}` === targetStr) return true;
  if (targetStart && kh.tahunMulai && kh.tahunMulai === targetStart) return true;

  return false;
}

function findPengurusForTahunKhidmat(kh) {
  if (!kh || !pengurus || pengurus.length === 0) return null;
  const startYr = kh.tahunMulai ? kh.tahunMulai.toString() : (extractKhidmatYears(kh.label || '')[0] || '').toString();
  const cleanLabel = cleanKhidmatStr(kh.label || '');
  const cleanId = cleanKhidmatStr(kh.id || '');

  // 1. Direct match
  let p = pengurus.find(item => 
    item.periode === kh.id ||
    item.periode === startYr ||
    item.periode === kh.label ||
    cleanKhidmatStr(item.periode || '') === cleanId ||
    cleanKhidmatStr(item.periode || '') === cleanLabel ||
    cleanKhidmatStr(item.label || '') === cleanLabel
  );
  if (p) return p;

  // 2. Year match
  if (startYr) {
    p = pengurus.find(item => {
      const yrs = extractKhidmatYears((item.periode || '') + ' ' + (item.label || ''));
      return yrs.includes(Number(startYr));
    });
    if (p) return p;
  }

  return null;
}

function renderPengurusSection() {
  renderPengurusPeriodPills();
  renderPengurusCards();
}

function renderPengurusPeriodPills() {
  const container = document.getElementById('pengurus-period-pills');
  if (!container) return;

  if (!tahunKhidmatList || tahunKhidmatList.length === 0) {
    tahunKhidmatList = typeof defaultTahunKhidmatList !== 'undefined' ? JSON.parse(JSON.stringify(defaultTahunKhidmatList)) : [];
  }
  if (!pengurus || pengurus.length === 0) {
    pengurus = typeof defaultPengurus !== 'undefined' ? JSON.parse(JSON.stringify(defaultPengurus)) : [];
  }

  // Ambil daftar periode kepengurusan sesuai yang ada di Pengaturan
  const sortedKhidmat = [...tahunKhidmatList].sort((a, b) => Number(b.tahunMulai || 0) - Number(a.tahunMulai || 0));

  // Tampilkan periode yang sudah memiliki struktur kepengurusan atau yang sedang aktif
  const displayList = sortedKhidmat.filter(kh => {
    const pData = findPengurusForTahunKhidmat(kh);
    return kh.isAktif || (pData && Array.isArray(pData.struktur) && pData.struktur.length > 0);
  });

  const finalDisplay = displayList.length > 0 ? displayList : sortedKhidmat;

  // Pastikan currentPengurusPeriod mengarah ke salah satu periode yang valid
  const currentKh = finalDisplay.find(kh => isKhidmatMatch(kh, currentPengurusPeriod)) || finalDisplay.find(kh => kh.isAktif) || finalDisplay[0];
  if (currentKh && !isKhidmatMatch(currentKh, currentPengurusPeriod)) {
    currentPengurusPeriod = currentKh.id;
  }

  container.innerHTML = finalDisplay.map(kh => {
    const isSelected = isKhidmatMatch(kh, currentPengurusPeriod);
    const periodDisplay = (kh.tahunMulai && kh.tahunSelesai) 
      ? `${kh.tahunMulai} - ${kh.tahunSelesai}` 
      : (kh.label || kh.id).replace(/^Masa Khidmat\s*/i, '');

    return `
      <button 
        type="button" 
        onclick="setPengurusPeriod('${kh.id}')" 
        class="px-3 py-1.5 text-xs font-bold rounded-xl transition ${
          isSelected 
            ? 'bg-blue-600 text-white shadow-xs' 
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }">
        ${periodDisplay} ${kh.isAktif ? '(Aktif)' : ''}
      </button>
    `;
  }).join('');
}

function setPengurusPeriod(year) {
  currentPengurusPeriod = year;
  renderPengurusSection();
}

function getActivePengurusData() {
  if (!pengurus || pengurus.length === 0) return null;

  // 1. Cari dari tahunKhidmatList sesuai currentPengurusPeriod
  if (typeof tahunKhidmatList !== 'undefined' && Array.isArray(tahunKhidmatList)) {
    const matchedKh = tahunKhidmatList.find(kh => isKhidmatMatch(kh, currentPengurusPeriod));
    if (matchedKh) {
      const p = findPengurusForTahunKhidmat(matchedKh);
      if (p) return p;
    }
  }

  // 2. Direct match di pengurus
  const direct = pengurus.find(p => 
    p.periode === currentPengurusPeriod || 
    p.label === currentPengurusPeriod ||
    p.id === currentPengurusPeriod ||
    cleanKhidmatStr(p.periode || '') === cleanKhidmatStr(currentPengurusPeriod || '')
  );
  if (direct) return direct;

  // 3. Fallback match by start year
  const startYr = extractKhidmatYears(currentPengurusPeriod || '')[0];
  if (startYr) {
    const byYr = pengurus.find(p => {
      const yrs = extractKhidmatYears((p.periode || '') + ' ' + (p.label || ''));
      return yrs.includes(startYr);
    });
    if (byYr) return byYr;
  }

  // 4. Default ke yang aktif
  return pengurus.find(p => p.isAktif) || pengurus[0];
}

function renderPengurusCards() {
  const bphGrid = document.getElementById('pengurus-bph-grid');
  const biroGrid = document.getElementById('pengurus-biro-grid');
  const bphCount = document.getElementById('pengurus-bph-count');
  const biroCount = document.getElementById('pengurus-biro-count');
  const statusEl = document.getElementById('pengurus-period-status-text');
  const titleSub = document.getElementById('pengurus-current-period-title');

  const periodData = getActivePengurusData();
  if (!periodData || !periodData.struktur) {
    if (bphGrid) bphGrid.innerHTML = '<p class="text-xs text-slate-400 p-4 col-span-full">Belum ada struktur untuk periode ini.</p>';
    if (biroGrid) biroGrid.innerHTML = '';
    return;
  }

  // Update status info banner
  if (statusEl) {
    if (periodData.isAktif) {
      statusEl.innerHTML = `<span class="text-emerald-700 font-bold flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Periode Berjalan (Aktif)</span>`;
    } else {
      statusEl.innerHTML = `<span class="text-amber-700 font-bold flex items-center gap-1.5"><i data-lucide="archive" class="w-3.5 h-3.5"></i> Arsip Demisioner (${periodData.label || 'Tahun ' + periodData.periode})</span>`;
    }
  }
  if (titleSub) {
    titleSub.textContent = `• ${periodData.label || 'Masa Khidmat ' + periodData.periode} ${periodData.isAktif ? '(Aktif)' : '(Demisioner)'}`;
  }

  const bphList = periodData.struktur.filter(s => s.kategori === 'Badan Pengurus Harian (BPH)' || !s.kategori);
  const biroList = periodData.struktur.filter(s => s.kategori === 'Biro & Departemen');

  if (bphCount) bphCount.textContent = `${bphList.length} Personalia`;
  if (biroCount) biroCount.textContent = `${biroList.length} Personalia`;

  if (bphGrid) {
    if (bphList.length > 0) {
      bphGrid.innerHTML = bphList.map(item => createPengurusCardHTML(item, periodData.periode)).join('');
    } else {
      bphGrid.innerHTML = '<p class="text-xs text-slate-400 p-4 col-span-full">Belum ada pengurus BPH di periode ini.</p>';
    }
  }

  if (biroGrid) {
    if (biroList.length > 0) {
      biroGrid.innerHTML = biroList.map(item => createPengurusCardHTML(item, periodData.periode)).join('');
    } else {
      biroGrid.innerHTML = `
        <div class="col-span-full py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <i data-lucide="folder-clock" class="w-7 h-7 text-slate-300 mx-auto mb-1.5"></i>
          <p class="text-xs font-semibold text-slate-500">Personalia Biro / Departemen Periode ${periodData.periode} Belum Dicatat</p>
          <p class="text-[11px] text-slate-400 mt-0.5">Personalia utama BPH tetap tersimpan lengkap di atas</p>
        </div>
      `;
    }
  }

  initLucide();
}

function createPengurusCardHTML(item, periode) {
  const isKader = isKaderUser();
  return `
    <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md transition flex flex-col justify-between group">
      <div>
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <img src="${item.foto || 'https://via.placeholder.com/100'}" alt="${item.nama}" class="w-12 h-12 rounded-xl object-cover border-2 border-blue-600 shadow-xs shrink-0">
            <div>
              <span class="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider block w-fit mb-0.5">${item.jabatan}</span>
              <h4 class="font-bold text-slate-800 text-xs">${item.nama}</h4>
              <p class="text-[10px] text-slate-400 font-mono">${item.nim ? 'NIM: ' + item.nim : item.fakultas || ''}</p>
            </div>
          </div>
        </div>
        <div class="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600">
          <span class="font-medium">${item.fakultas || '-'}</span>
        </div>
      </div>
      <div class="mt-3 pt-2 flex items-center justify-between">
        ${item.whatsapp ? `
          <a href="https://wa.me/${item.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" class="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
            <i data-lucide="phone" class="w-3 h-3"></i>
            <span>WhatsApp</span>
          </a>
        ` : '<span></span>'}
        ${!isKader ? `
        <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
          <button onclick="openEditPengurusModal('${item.id}', '${periode}')" title="Edit Personalia" class="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100">
            <i data-lucide="edit" class="w-3.5 h-3.5"></i>
          </button>
          <button onclick="deletePengurus('${item.id}', '${periode}')" title="Hapus Personalia" class="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
        ` : ''}
      </div>
    </div>
  `;
}

// ==========================================
// PENGURUS KOMISARIAT AUTOCOMPLETE
// ==========================================
function handlePengurusSearchInModal(query) {
  const container = document.getElementById('pengurus-autocomplete-results');
  const clearBtn = document.getElementById('btn-clear-pengurus-search');
  if (!container) return;

  const q = (query || '').trim().toLowerCase();
  if (clearBtn) clearBtn.classList.toggle('hidden', q.length === 0);

  if (q.length < 1) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  const matches = kaders.filter(k => 
    (k.nama && k.nama.toLowerCase().includes(q)) ||
    (k.nim && k.nim.toLowerCase().includes(q)) ||
    (k.fakultas && k.fakultas.toLowerCase().includes(q)) ||
    (k.jurusan && k.jurusan.toLowerCase().includes(q))
  ).slice(0, 8);

  if (matches.length === 0) {
    container.innerHTML = `
      <div class="p-3 text-center text-xs text-slate-400">
        <p class="font-medium">Kader tidak ditemukan di Data Kader.</p>
        <p class="text-[10px] text-slate-500 mt-0.5">Silakan ketik data personalia secara manual.</p>
      </div>
    `;
    container.classList.remove('hidden');
    return;
  }

  container.innerHTML = matches.map(k => `
    <div onclick="selectKaderForPengurus('${k.id}')" class="p-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between gap-3 transition">
      <div class="flex items-center gap-2.5 min-w-0">
        <img src="${k.foto || 'https://via.placeholder.com/80'}" alt="${k.nama}" class="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0">
        <div class="min-w-0">
          <p class="font-bold text-xs text-slate-800 truncate">${k.nama}</p>
          <p class="text-[10px] text-slate-400 truncate">NIM: ${k.nim || '-'} • ${k.fakultas || '-'} • Angk. ${k.angkatan || '-'}</p>
        </div>
      </div>
      <span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 shrink-0">
        ${k.kaderisasi?.formal || 'Kader'}
      </span>
    </div>
  `).join('');

  container.classList.remove('hidden');
}

function selectKaderForPengurus(id) {
  const kader = kaders.find(k => k.id === id);
  if (!kader) return;

  const elNama = document.getElementById('pengurus-nama');
  const elNim = document.getElementById('pengurus-nim');
  const elFak = document.getElementById('pengurus-fakultas');
  const elWa = document.getElementById('pengurus-whatsapp');
  const elFoto = document.getElementById('pengurus-foto');
  const elFotoUrl = document.getElementById('pengurus-foto-url');

  if (elNama) elNama.value = kader.nama || '';
  if (elNim) elNim.value = kader.nim || '';
  if (elFak) elFak.value = kader.fakultas ? `${kader.fakultas}${kader.jurusan ? ' (' + kader.jurusan + ')' : ''}` : '';
  if (elWa) elWa.value = kader.whatsapp || '';
  if (elFoto) elFoto.value = kader.foto || '';
  if (elFotoUrl) elFotoUrl.value = kader.foto || '';

  // Close dropdown
  const results = document.getElementById('pengurus-autocomplete-results');
  if (results) results.classList.add('hidden');

  const searchInput = document.getElementById('pengurus-autocomplete-input');
  if (searchInput) searchInput.value = `${kader.nama} (${kader.nim || '-'})`;

  const clearBtn = document.getElementById('btn-clear-pengurus-search');
  if (clearBtn) clearBtn.classList.remove('hidden');

  const notice = document.getElementById('pengurus-autofilled-notice');
  const noticeText = document.getElementById('pengurus-autofilled-text');
  if (notice && noticeText) {
    noticeText.textContent = `✓ Data personalia terisi dari: ${kader.nama}`;
    notice.classList.remove('hidden');
  }

  showToast(`Data pengurus untuk "${kader.nama}" otomatis terisi dari Data Kader!`, 'info');
}

function clearPengurusSearchInModal() {
  const searchInput = document.getElementById('pengurus-autocomplete-input');
  if (searchInput) searchInput.value = '';
  const results = document.getElementById('pengurus-autocomplete-results');
  if (results) results.classList.add('hidden');
  const clearBtn = document.getElementById('btn-clear-pengurus-search');
  if (clearBtn) clearBtn.classList.add('hidden');
}

function resetAutofillPengurus() {
  clearPengurusSearchInModal();
  const notice = document.getElementById('pengurus-autofilled-notice');
  if (notice) notice.classList.add('hidden');
  openAddPengurusModal();
}

function openAddPengurusModal(id = null, periode = null) {
  if (isKaderUser()) {
    showToast('Akses ditolak: Akun Kader bersifat Read-Only (Hanya Lihat).', 'warning');
    return;
  }
  const modal = document.getElementById('modal-pengurus');
  if (!modal) return;

  const form = document.getElementById('form-pengurus');
  if (form) form.reset();

  clearPengurusSearchInModal();
  const notice = document.getElementById('pengurus-autofilled-notice');
  if (notice) notice.classList.add('hidden');

  const title = document.getElementById('modal-pengurus-title');
  const selPeriode = document.getElementById('pengurus-periode');

  // Populate periods
  if (selPeriode) {
    if (typeof tahunKhidmatList !== 'undefined' && tahunKhidmatList.length > 0) {
      selPeriode.innerHTML = tahunKhidmatList.map(kh => {
        const pDisp = (kh.tahunMulai && kh.tahunSelesai) ? `${kh.tahunMulai} - ${kh.tahunSelesai}` : kh.label;
        const isSel = isKhidmatMatch(kh, periode || currentPengurusPeriod);
        const val = kh.tahunMulai ? kh.tahunMulai.toString() : kh.id;
        return `<option value="${val}" ${isSel ? 'selected' : ''}>Masa Khidmat ${pDisp} ${kh.isAktif ? '(Aktif)' : ''}</option>`;
      }).join('');
    } else {
      selPeriode.innerHTML = pengurus.map(p => `
        <option value="${p.periode}" ${(periode || currentPengurusPeriod) === p.periode ? 'selected' : ''}>
          Periode ${p.periode} (${p.label || p.periode})
        </option>
      `).join('');
    }
  }

  document.getElementById('pengurus-id').value = '';
  if (title) title.textContent = 'Tambah Personalia Pengurus';

  modal.classList.remove('hidden');
  initLucide();
}

function openEditPengurusModal(id, periode) {
  if (isKaderUser()) {
    showToast('Akses ditolak: Akun Kader bersifat Read-Only (Hanya Lihat).', 'warning');
    return;
  }
  openAddPengurusModal(null, periode);
  const title = document.getElementById('modal-pengurus-title');
  if (title) title.textContent = 'Edit Personalia Pengurus';

  const periodObj = pengurus.find(p => p.periode === periode || isKhidmatMatch(p, periode)) || getActivePengurusData();
  if (!periodObj) return;
  const item = periodObj.struktur.find(s => s.id === id);
  if (!item) return;

  const searchInput = document.getElementById('pengurus-autocomplete-input');
  if (searchInput) searchInput.value = `${item.nama} (${item.nim || '-'})`;

  const notice = document.getElementById('pengurus-autofilled-notice');
  const noticeText = document.getElementById('pengurus-autofilled-text');
  if (notice && noticeText) {
    noticeText.textContent = `✓ Mengedit data personalia: ${item.nama}`;
    notice.classList.remove('hidden');
  }

  document.getElementById('pengurus-id').value = item.id;
  document.getElementById('pengurus-periode').value = periode;
  document.getElementById('pengurus-kategori').value = item.kategori || 'Badan Pengurus Harian (BPH)';
  document.getElementById('pengurus-jabatan').value = item.jabatan || '';
  document.getElementById('pengurus-nama').value = item.nama || '';
  document.getElementById('pengurus-nim').value = item.nim || '';
  document.getElementById('pengurus-fakultas').value = item.fakultas || '';
  document.getElementById('pengurus-whatsapp').value = item.whatsapp || '';
  document.getElementById('pengurus-foto').value = item.foto || '';
  document.getElementById('pengurus-foto-url').value = item.foto || '';
}

function closePengurusModal() {
  clearPengurusSearchInModal();
  const modal = document.getElementById('modal-pengurus');
  if (modal) modal.classList.add('hidden');
}

function savePengurusForm(e) {
  e.preventDefault();

  if (isKaderUser()) {
    showToast('Akses ditolak: Akun Kader bersifat Read-Only (Hanya Lihat).', 'warning');
    return;
  }

  const id = document.getElementById('pengurus-id').value;
  const periode = document.getElementById('pengurus-periode').value;
  const kategori = document.getElementById('pengurus-kategori').value;
  const jabatan = document.getElementById('pengurus-jabatan').value;
  const nama = document.getElementById('pengurus-nama').value;
  const nim = document.getElementById('pengurus-nim').value;
  const fakultas = document.getElementById('pengurus-fakultas').value;
  const whatsapp = document.getElementById('pengurus-whatsapp').value;
  const foto = document.getElementById('pengurus-foto').value || 'https://via.placeholder.com/100';

  let periodObj = pengurus.find(p => p.periode === periode);
  if (!periodObj) {
    periodObj = {
      periode: periode,
      label: `Masa Khidmat ${periode} - ${Number(periode) + 1}`,
      isAktif: true,
      struktur: []
    };
    pengurus.push(periodObj);
  }

  if (id) {
    // Edit
    const itemIndex = periodObj.struktur.findIndex(s => s.id === id);
    if (itemIndex > -1) {
      periodObj.struktur[itemIndex] = {
        ...periodObj.struktur[itemIndex],
        kategori, jabatan, nama, nim, fakultas, whatsapp, foto
      };
      showToast('Data pengurus berhasil diperbarui!', 'success');
    }
  } else {
    // Tambah baru
    const newOfficer = {
      id: `PGR-${periode}-${Date.now().toString().slice(-4)}`,
      kategori,
      jabatan,
      nama,
      nim,
      fakultas,
      whatsapp,
      foto,
      urutan: periodObj.struktur.length + 1
    };
    periodObj.struktur.push(newOfficer);
    showToast('Personalia pengurus baru berhasil ditambahkan!', 'success');
  }

  saveData();
  closePengurusModal();
  renderPengurusSection();
  renderSettingPengurus();
}

function deletePengurus(id, periode) {
  if (isKaderUser()) {
    showToast('Akses ditolak: Akun Kader bersifat Read-Only (Hanya Lihat).', 'warning');
    return;
  }

  const periodObj = pengurus.find(p => p.periode === periode || isKhidmatMatch(p, periode)) || getActivePengurusData();
  if (!periodObj) return;

  const item = periodObj.struktur ? periodObj.struktur.find(s => s.id === id) : null;
  const nameStr = item ? ` <strong>"${escapeHtml(item.nama)}"</strong> (${escapeHtml(item.jabatan)})` : '';

  showConfirmModal({
    title: 'Hapus Personalia Pengurus',
    message: `Apakah Anda yakin ingin menghapus personalia pengurus${nameStr}?<br><span class="text-rose-500 font-bold text-xs mt-1 block">Tindakan ini akan menghapus personalia ini secara permanen dari Cloud Neon.</span>`,
    confirmText: 'Ya, Hapus',
    cancelText: 'Batal',
    type: 'danger',
    icon: 'trash-2',
    onConfirm: async () => {
      // Direct deletion from Cloud Neon
      if (typeof executeNeonSql === 'function') {
        try {
          await executeNeonSql(`DELETE FROM tb_struktur_pengurus WHERE id = ${sqlEscape(id)};`);
        } catch (e) {
          console.warn('[NEON] Direct delete pengurus gagal:', e.message);
        }
      }

      periodObj.struktur = (periodObj.struktur || []).filter(s => s.id !== id);
      saveData();
      showToast('Personalia berhasil dihapus dari struktur!', 'info');
      renderPengurusSection();
      renderSettingPengurus();
    }
  });
}

function promptTambahPeriodeBaru() {
  // Arahkan ke modul manajemen Tahun Khidmat resmi agar data terintegrasi
  openModalTambahTahunKhidmat();
}

// ==========================================
// 6B. MODUL KETUM KOM (KETUA UMUM DARI MASA KE MASA)
// ==========================================
function renderKetumSection() {
  const container = document.getElementById('ketum-grid');
  if (!container) return;

  const isKader = isKaderUser();
  if (!ketumKom || ketumKom.length === 0) {
    ketumKom = typeof defaultKetumKom !== 'undefined' ? JSON.parse(JSON.stringify(defaultKetumKom)) : [];
  }

  // Sort descending by year
  const sorted = [...ketumKom].sort((a, b) => Number(b.tahun || 0) - Number(a.tahun || 0));

  container.innerHTML = sorted.map(k => {
    const isAktif = k.status && k.status.toLowerCase().includes('aktif');
    return `
      <div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition flex flex-col justify-between group relative overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-yellow-300/20 to-transparent rounded-bl-full pointer-events-none"></div>

        <div>
          <!-- Header Badge -->
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isAktif 
                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }">
              Periode ${k.periode || k.tahun}
            </span>
            <span class="text-[10px] font-bold ${isAktif ? 'text-emerald-600' : 'text-slate-400'}">
              ${k.status || 'Demisioner'}
            </span>
          </div>

          <!-- Profile -->
          <div class="flex items-center gap-3.5 mb-3">
            <img src="${k.foto || 'https://via.placeholder.com/120'}" alt="${k.nama}" class="w-14 h-14 rounded-full object-cover border-2 border-yellow-400 shadow-sm shrink-0">
            <div>
              <h4 class="font-extrabold text-slate-900 text-sm leading-snug">${k.nama}</h4>
              <p class="text-[11px] text-blue-700 font-semibold mt-0.5">${k.fakultas || 'PK PMII ISMU'}</p>
            </div>
          </div>

          <!-- Visi & Prestasi -->
          <div class="space-y-2 text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div>
              <span class="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Visi Kepemimpinan:</span>
              <p class="text-slate-700 italic text-[11px] leading-relaxed">"${k.visi || 'Memajukan dakwah dan kaderisasi Ahlussunnah wal Jamaah'}"</p>
            </div>
            ${k.prestasi ? `
              <div class="pt-1.5 border-t border-slate-200/60">
                <span class="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Capaian Monumental:</span>
                <p class="text-slate-700 text-[11px] font-medium leading-relaxed">${k.prestasi}</p>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            ${k.whatsapp ? `
              <a href="https://wa.me/${k.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" class="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition" title="Hubungi via WhatsApp">
                <i data-lucide="phone" class="w-3.5 h-3.5"></i>
              </a>
            ` : ''}
            ${k.email ? `
              <a href="mailto:${k.email}" class="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition" title="Kirim Email">
                <i data-lucide="mail" class="w-3.5 h-3.5"></i>
              </a>
            ` : ''}
          </div>

          ${!isKader ? `
          <div class="flex items-center gap-1">
            <button onclick="openEditKetumModal('${k.id}')" title="Edit Riwayat Ketum" class="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition">
              <i data-lucide="edit" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="deleteKetum('${k.id}')" title="Hapus Riwayat Ketum" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
          ` : ''}
        </div>

      </div>
    `;
  }).join('');

  initLucide();
}

// ==========================================
// KETUM KOM AUTOCOMPLETE
// ==========================================
function handleKetumSearchInModal(query) {
  const container = document.getElementById('ketum-autocomplete-results');
  const clearBtn = document.getElementById('btn-clear-ketum-search');
  if (!container) return;

  const q = (query || '').trim().toLowerCase();
  if (clearBtn) clearBtn.classList.toggle('hidden', q.length === 0);

  if (q.length < 1) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  const matches = kaders.filter(k => 
    (k.nama && k.nama.toLowerCase().includes(q)) ||
    (k.nim && k.nim.toLowerCase().includes(q)) ||
    (k.fakultas && k.fakultas.toLowerCase().includes(q))
  ).slice(0, 8);

  if (matches.length === 0) {
    container.innerHTML = `
      <div class="p-3 text-center text-xs text-slate-400">
        <p class="font-medium">Kader tidak ditemukan di Data Kader.</p>
        <p class="text-[10px] text-slate-500 mt-0.5">Silakan ketik data Ketua Umum secara manual.</p>
      </div>
    `;
    container.classList.remove('hidden');
    return;
  }

  container.innerHTML = matches.map(k => `
    <div onclick="selectKaderForKetum('${k.id}')" class="p-2.5 hover:bg-amber-50 cursor-pointer flex items-center justify-between gap-3 transition">
      <div class="flex items-center gap-2.5 min-w-0">
        <img src="${k.foto || 'https://via.placeholder.com/80'}" alt="${k.nama}" class="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0">
        <div class="min-w-0">
          <p class="font-bold text-xs text-slate-800 truncate">${k.nama}</p>
          <p class="text-[10px] text-slate-400 truncate">NIM: ${k.nim || '-'} • ${k.fakultas || '-'}</p>
        </div>
      </div>
      <span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 shrink-0">
        ${k.kaderisasi?.formal || 'Kader'}
      </span>
    </div>
  `).join('');

  container.classList.remove('hidden');
}

function selectKaderForKetum(id) {
  const kader = kaders.find(k => k.id === id);
  if (!kader) return;

  const elNama = document.getElementById('ketum-nama');
  const elFak = document.getElementById('ketum-fakultas');
  const elWa = document.getElementById('ketum-whatsapp');
  const elEmail = document.getElementById('ketum-email');
  const elFoto = document.getElementById('ketum-foto');
  const elFotoUrl = document.getElementById('ketum-foto-url');

  if (elNama) elNama.value = kader.nama || '';
  if (elFak) elFak.value = kader.fakultas ? `${kader.fakultas}${kader.jurusan ? ' (' + kader.jurusan + ')' : ''}` : '';
  if (elWa) elWa.value = kader.whatsapp || '';
  if (elEmail) elEmail.value = kader.email || '';
  if (elFoto) elFoto.value = kader.foto || '';
  if (elFotoUrl) elFotoUrl.value = kader.foto || '';

  const results = document.getElementById('ketum-autocomplete-results');
  if (results) results.classList.add('hidden');

  const searchInput = document.getElementById('ketum-autocomplete-input');
  if (searchInput) searchInput.value = `${kader.nama} (${kader.nim || '-'})`;

  const clearBtn = document.getElementById('btn-clear-ketum-search');
  if (clearBtn) clearBtn.classList.remove('hidden');

  const notice = document.getElementById('ketum-autofilled-notice');
  const noticeText = document.getElementById('ketum-autofilled-text');
  if (notice && noticeText) {
    noticeText.textContent = `✓ Data Ketum terisi dari: ${kader.nama}`;
    notice.classList.remove('hidden');
  }

  showToast(`Data Ketua Umum untuk "${kader.nama}" otomatis terisi dari Data Kader!`, 'info');
}

function clearKetumSearchInModal() {
  const searchInput = document.getElementById('ketum-autocomplete-input');
  if (searchInput) searchInput.value = '';
  const results = document.getElementById('ketum-autocomplete-results');
  if (results) results.classList.add('hidden');
  const clearBtn = document.getElementById('btn-clear-ketum-search');
  if (clearBtn) clearBtn.classList.add('hidden');
}

function resetAutofillKetum() {
  clearKetumSearchInModal();
  const notice = document.getElementById('ketum-autofilled-notice');
  if (notice) notice.classList.add('hidden');
  openAddKetumModal();
}

function openAddKetumModal(id = null) {
  if (isKaderUser()) {
    showToast('Akses ditolak: Akun Kader bersifat Read-Only (Hanya Lihat).', 'warning');
    return;
  }
  const modal = document.getElementById('modal-ketum');
  if (!modal) return;

  const form = document.getElementById('form-ketum');
  if (form) form.reset();

  clearKetumSearchInModal();
  const notice = document.getElementById('ketum-autofilled-notice');
  if (notice) notice.classList.add('hidden');

  const title = document.getElementById('modal-ketum-title');
  document.getElementById('ketum-id').value = '';
  if (title) title.textContent = 'Tambah Riwayat KETUM KOM';

  modal.classList.remove('hidden');
  initLucide();
}

function openEditKetumModal(id) {
  if (isKaderUser()) {
    showToast('Akses ditolak: Akun Kader bersifat Read-Only (Hanya Lihat).', 'warning');
    return;
  }
  openAddKetumModal();
  const title = document.getElementById('modal-ketum-title');
  if (title) title.textContent = 'Edit Riwayat KETUM KOM';

  const item = ketumKom.find(k => k.id === id);
  if (!item) return;

  const searchInput = document.getElementById('ketum-autocomplete-input');
  if (searchInput) searchInput.value = `${item.nama}`;

  const notice = document.getElementById('ketum-autofilled-notice');
  const noticeText = document.getElementById('ketum-autofilled-text');
  if (notice && noticeText) {
    noticeText.textContent = `✓ Mengedit riwayat Ketum: ${item.nama}`;
    notice.classList.remove('hidden');
  }

  document.getElementById('ketum-id').value = item.id;
  document.getElementById('ketum-tahun').value = item.tahun || '';
  document.getElementById('ketum-periode').value = item.periode || '';
  document.getElementById('ketum-nama').value = item.nama || '';
  document.getElementById('ketum-fakultas').value = item.fakultas || '';
  document.getElementById('ketum-status').value = item.status || 'Demisioner';
  document.getElementById('ketum-visi').value = item.visi || '';
  document.getElementById('ketum-prestasi').value = item.prestasi || '';
  document.getElementById('ketum-whatsapp').value = item.whatsapp || '';
  document.getElementById('ketum-email').value = item.email || '';
  document.getElementById('ketum-foto').value = item.foto || '';
  document.getElementById('ketum-foto-url').value = item.foto || '';
}

function closeKetumModal() {
  clearKetumSearchInModal();
  const modal = document.getElementById('modal-ketum');
  if (modal) modal.classList.add('hidden');
}

function saveKetumForm(e) {
  e.preventDefault();

  if (isKaderUser()) {
    showToast('Akses ditolak: Akun Kader bersifat Read-Only (Hanya Lihat).', 'warning');
    return;
  }

  const id = document.getElementById('ketum-id').value;
  const tahun = document.getElementById('ketum-tahun').value;
  const periode = document.getElementById('ketum-periode').value;
  const nama = document.getElementById('ketum-nama').value;
  const fakultas = document.getElementById('ketum-fakultas').value;
  const status = document.getElementById('ketum-status').value;
  const visi = document.getElementById('ketum-visi').value;
  const prestasi = document.getElementById('ketum-prestasi').value;
  const whatsapp = document.getElementById('ketum-whatsapp').value;
  const email = document.getElementById('ketum-email').value;
  const foto = document.getElementById('ketum-foto').value || 'https://via.placeholder.com/120';

  if (id) {
    const idx = ketumKom.findIndex(k => k.id === id);
    if (idx > -1) {
      ketumKom[idx] = { ...ketumKom[idx], tahun, periode, nama, fakultas, status, visi, prestasi, whatsapp, email, foto };
      showToast('Data Ketua Umum berhasil diperbarui!', 'success');
    }
  } else {
    const newKetum = {
      id: `KTM-${Date.now().toString().slice(-4)}`,
      tahun,
      periode,
      nama,
      fakultas,
      status,
      visi,
      prestasi,
      whatsapp,
      email,
      foto
    };
    ketumKom.unshift(newKetum);
    showToast('Riwayat Ketua Umum berhasil ditambahkan!', 'success');
  }

  saveData();
  closeKetumModal();
  renderKetumSection();
  renderSettingKetum();
}

function deleteKetum(id) {
  if (isKaderUser()) {
    showToast('Akses ditolak: Akun Kader bersifat Read-Only (Hanya Lihat).', 'warning');
    return;
  }

  const item = ketumKom.find(k => k.id === id);
  const nameStr = item ? ` <strong>"${escapeHtml(item.nama)}"</strong> (${escapeHtml(item.periode || '')})` : '';

  showConfirmModal({
    title: 'Hapus Riwayat Ketua Umum',
    message: `Apakah Anda yakin ingin menghapus data riwayat Ketua Umum${nameStr}?<br><span class="text-rose-500 font-bold text-xs mt-1 block">Tindakan ini akan menghapus riwayat Ketua Umum ini secara permanen dari Cloud Neon.</span>`,
    confirmText: 'Ya, Hapus',
    cancelText: 'Batal',
    type: 'danger',
    icon: 'trash-2',
    onConfirm: async () => {
      // Direct deletion from Cloud Neon
      if (typeof executeNeonSql === 'function') {
        try {
          await executeNeonSql(`DELETE FROM tb_ketum_kom WHERE id = ${sqlEscape(id)};`);
        } catch (e) {
          console.warn('[NEON] Direct delete ketum gagal:', e.message);
        }
      }

      ketumKom = (ketumKom || []).filter(k => k.id !== id);
      saveData();
      showToast('Data Ketua Umum berhasil dihapus permanen!', 'info');
      renderKetumSection();
      renderSettingKetum();
    }
  });
}

function exportKetumExcel() {
  if (!ketumKom || ketumKom.length === 0) {
    showToast('Belum ada data Ketua Umum untuk diexport.', 'warning');
    return;
  }

  const exportRows = ketumKom.map((k, idx) => ({
    "No": idx + 1,
    "Tahun": k.tahun || '-',
    "Periode Khidmat": k.periode || '-',
    "Nama Lengkap Ketum": k.nama,
    "Fakultas / Prodi": k.fakultas || '-',
    "Status": k.status || '-',
    "Visi Kepemimpinan": k.visi || '-',
    "Prestasi Monumental": k.prestasi || '-',
    "WhatsApp": k.whatsapp || '-',
    "Email": k.email || '-'
  }));

  const ws = XLSX.utils.json_to_sheet(exportRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Dewan KETUM KOM");
  XLSX.writeFile(wb, `Dewan_Ketua_Umum_PMII_ISMU_${new Date().getFullYear()}.xlsx`);
  showToast('Data Dewan KETUM KOM berhasil diexport ke Excel!', 'success');
}

// ==========================================
// MANAJEMEN TAHUN KHIDMAT & ARSIP ORGANISASI
// ==========================================
function cleanKhidmatStr(str) {
  if (!str) return '';
  return str.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function extractKhidmatYears(str) {
  if (!str) return [];
  const matches = str.toString().match(/\b(20\d\d)\b/g);
  return matches ? matches.map(Number) : [];
}

function isItemMatchTahunKhidmat(item, targetKhidmat) {
  if (!item) return false;
  const target = targetKhidmat || currentTahunKhidmat;
  const cleanTarget = cleanKhidmatStr(target);
  const targetYears = extractKhidmatYears(target);
  const startTargetYear = targetYears.length > 0 ? targetYears[0] : null;

  // 1. Direct match on item.tahunKhidmat
  if (item.tahunKhidmat) {
    const cleanItem = cleanKhidmatStr(item.tahunKhidmat);
    if (cleanItem === cleanTarget || cleanItem.includes(cleanTarget) || cleanTarget.includes(cleanItem)) {
      return true;
    }
    const itemYears = extractKhidmatYears(item.tahunKhidmat);
    if (startTargetYear && itemYears.length > 0 && itemYears[0] === startTargetYear) {
      return true;
    }
  }

  // 2. Fallback based on date string (tanggal / tanggalTarget)
  const dateStr = item.tanggal || item.tanggalTarget || '';
  if (dateStr && dateStr.length >= 4 && startTargetYear) {
    const yr = parseInt(dateStr.substring(0, 4), 10);
    if (!isNaN(yr)) {
      if (targetYears.includes(yr) || yr === startTargetYear) {
        return true;
      }
    }
  }

  // 3. Fallback based on kegiatan / program text
  if (item.kegiatan && startTargetYear) {
    if (item.kegiatan.includes(startTargetYear.toString())) {
      return true;
    }
  }

  return false;
}

function renderSettingTahunKhidmat() {
  const badgeId = document.getElementById('setting-active-khd-id-badge');
  const labelEl = document.getElementById('setting-active-khd-label');
  const ketumEl = document.getElementById('setting-active-khd-ketum');
  const pengEl = document.getElementById('setting-active-khd-pengeluaran');
  const agrEl = document.getElementById('setting-active-khd-anggaran');
  const mskEl = document.getElementById('setting-active-khd-pemasukan');
  const tbody = document.getElementById('setting-tahun-khidmat-table-body');

  if (!tahunKhidmatList || tahunKhidmatList.length === 0) {
    tahunKhidmatList = typeof defaultTahunKhidmatList !== 'undefined' ? JSON.parse(JSON.stringify(defaultTahunKhidmatList)) : [];
  }

  // Cari tahun khidmat yang aktif
  let activeItem = tahunKhidmatList.find(t => t.isAktif);
  if (!activeItem) {
    activeItem = tahunKhidmatList[0];
    if (activeItem) activeItem.isAktif = true;
  }

  if (activeItem) {
    currentTahunKhidmat = activeItem.label;
    if (badgeId) badgeId.textContent = `• ID: ${activeItem.id}`;
    if (labelEl) labelEl.textContent = activeItem.label;
    if (ketumEl) {
      const ktm = activeItem.ketuaKomisariat || komisariat.ketuaKomisariat || 'Sahabat Ketua Umum';
      const sk = activeItem.nomorSK || komisariat.nomorSK || '-';
      ketumEl.textContent = `Ketua Umum: ${ktm} • SK: ${sk}`;
    }
  }

  // Kalkulasi belanja & anggaran tahun aktif
  const activePeng = (pengeluaran || []).filter(p => isItemMatchTahunKhidmat(p, currentTahunKhidmat));
  const totPeng = activePeng.reduce((sum, p) => sum + (Number(p.jumlah) || 0), 0);

  const activeAgr = (anggaran || []).filter(a => isItemMatchTahunKhidmat(a, currentTahunKhidmat));
  const totAgr = activeAgr.reduce((sum, a) => sum + (Number(a.jumlah) || 0), 0);

  // Pemasukan kas organisasi tetap sebagai patokan total pendapatan
  const totMsk = (pemasukan || []).reduce((sum, m) => sum + (Number(m.jumlah) || 0), 0);

  if (pengEl) pengEl.textContent = formatRupiah(totPeng);
  if (agrEl) agrEl.textContent = formatRupiah(totAgr);
  if (mskEl) mskEl.textContent = formatRupiah(totMsk);

  if (!tbody) return;

  tbody.innerHTML = tahunKhidmatList.map(t => {
    const yrPeng = (pengeluaran || []).filter(p => isItemMatchTahunKhidmat(p, t.label));
    const sumPeng = yrPeng.reduce((s, p) => s + (Number(p.jumlah) || 0), 0);

    const yrAgr = (anggaran || []).filter(a => isItemMatchTahunKhidmat(a, t.label));
    const sumAgr = yrAgr.reduce((s, a) => s + (Number(a.jumlah) || 0), 0);

    const pYear = t.tahunMulai ? t.tahunMulai.toString() : '';
    const perPengurus = (pengurus || []).find(p => p.periode === pYear);
    const countStruktur = perPengurus && perPengurus.struktur ? perPengurus.struktur.length : 0;

    const isActive = t.isAktif;

    return `
      <tr class="hover:bg-slate-50 border-b border-slate-100 ${isActive ? 'bg-blue-50/40' : ''}">
        <td class="py-2.5 px-3">
          <p class="font-bold text-slate-800 text-xs">${t.label}</p>
          <span class="text-[10px] text-slate-400 font-mono">Tahun: ${t.tahunMulai || '-'} s/d ${t.tahunSelesai || '-'}</span>
        </td>
        <td class="py-2.5 px-3 text-center whitespace-nowrap">
          ${isActive 
            ? '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200"><span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Sedang Aktif</span>' 
            : '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">Arsip Historis</span>'}
        </td>
        <td class="py-2.5 px-3 font-semibold text-slate-700">
          ${t.ketuaKomisariat || '<span class="text-slate-400 italic">Belum diisi</span>'}
        </td>
        <td class="py-2.5 px-3 text-right font-bold text-rose-600 font-mono">
          ${formatRupiah(sumPeng)}
          <span class="block text-[9px] text-slate-400 font-sans font-normal">${yrPeng.length} belanja</span>
        </td>
        <td class="py-2.5 px-3 text-right font-bold text-blue-700 font-mono">
          ${formatRupiah(sumAgr)}
          <span class="block text-[9px] text-slate-400 font-sans font-normal">${yrAgr.length} item</span>
        </td>
        <td class="py-2.5 px-3 text-center whitespace-nowrap">
          <span class="px-2 py-0.5 text-[10px] font-bold rounded-lg ${countStruktur > 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-400'}">
            ${countStruktur} Pengurus
          </span>
        </td>
        <td class="py-2.5 px-3 text-right whitespace-nowrap">
          <div class="inline-flex items-center gap-1.5">
            ${!isActive ? `
              <button 
                type="button" 
                onclick="setActiveTahunKhidmat('${t.id}')" 
                title="Jadikan Tahun Khidmat aktif saat ini" 
                class="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition cursor-pointer">
                Aktifkan
              </button>
            ` : ''}
            <button 
              type="button" 
              onclick="openModalTambahTahunKhidmat('${t.id}')" 
              title="Edit informasi tahun khidmat" 
              class="p-1 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition cursor-pointer">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
            </button>
            ${!isActive ? `
              <button 
                type="button" 
                onclick="deleteTahunKhidmat('${t.id}')" 
                title="Hapus arsip tahun khidmat ini" 
                class="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  populateTahunKhidmatSelects();
  initLucide();
}

function populateTahunKhidmatSelects() {
  const selPeng = document.getElementById('filter-pengeluaran-tahun-select');
  const selAgr = document.getElementById('filter-anggaran-tahun-select');
  const selInPeng = document.getElementById('pengeluaran-tahun-khidmat');
  const selInAgr = document.getElementById('anggaran-tahun-khidmat');

  if (!tahunKhidmatList || tahunKhidmatList.length === 0) return;

  const optionsHtml = tahunKhidmatList.map(t => `
    <option value="${t.label}" ${t.label === currentTahunKhidmat ? 'selected' : ''}>
      ${t.label} ${t.isAktif ? '★ (Aktif)' : ''}
    </option>
  `).join('');

  if (selPeng) {
    selPeng.innerHTML = optionsHtml;
    if (selectedPengeluaranTahunKhidmat) selPeng.value = selectedPengeluaranTahunKhidmat;
    else selPeng.value = currentTahunKhidmat;
  }

  if (selAgr) {
    selAgr.innerHTML = optionsHtml;
    if (selectedAnggaranTahunKhidmat) selAgr.value = selectedAnggaranTahunKhidmat;
    else selAgr.value = currentTahunKhidmat;
  }

  if (selInPeng) {
    selInPeng.innerHTML = optionsHtml;
    selInPeng.value = currentTahunKhidmat;
  }

  if (selInAgr) {
    selInAgr.innerHTML = optionsHtml;
    selInAgr.value = currentTahunKhidmat;
  }
}

function handlePengeluaranTahunKhidmatChange(val) {
  selectedPengeluaranTahunKhidmat = val;
  const badge = document.getElementById('badge-pengeluaran-tahun-status');
  const desc = document.getElementById('filter-pengeluaran-tahun-desc');
  if (badge) {
    if (val === currentTahunKhidmat) {
      badge.textContent = '★ Periode Aktif';
      badge.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200';
    } else {
      badge.textContent = 'Arsip Historis';
      badge.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200';
    }
  }
  if (desc) {
    desc.textContent = `Menampilkan catatan belanja kas untuk ${val}`;
  }
  renderPengeluaranSection();
}

function handleAnggaranTahunKhidmatChange(val) {
  selectedAnggaranTahunKhidmat = val;
  const badge = document.getElementById('badge-anggaran-tahun-status');
  const desc = document.getElementById('filter-anggaran-tahun-desc');
  if (badge) {
    if (val === currentTahunKhidmat) {
      badge.textContent = '★ Periode Aktif';
      badge.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200';
    } else {
      badge.textContent = 'Arsip Historis';
      badge.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200';
    }
  }
  if (desc) {
    desc.textContent = `Menampilkan rancangan anggaran (RAB) untuk ${val}`;
  }
  renderAnggaranSection();
}

function setActiveTahunKhidmat(targetIdOrLabel) {
  const item = tahunKhidmatList.find(t => t.id === targetIdOrLabel || t.label === targetIdOrLabel);
  if (!item) return;

  // Set active flag
  tahunKhidmatList.forEach(t => {
    t.isAktif = (t.id === item.id);
  });

  currentTahunKhidmat = item.label;
  komisariat.masaKhidmat = item.label;

  // Sinkronkan nama Ketum, Sekum, Bendahara jika ada
  if (item.ketuaKomisariat) komisariat.ketuaKomisariat = item.ketuaKomisariat;
  if (item.sekretarisKomisariat) komisariat.sekretarisKomisariat = item.sekretarisKomisariat;
  if (item.bendaharaKomisariat) komisariat.bendaharaKomisariat = item.bendaharaKomisariat;
  if (item.nomorSK) komisariat.nomorSK = item.nomorSK;

  // Sinkronkan struktur kepengurusan
  const startYr = item.tahunMulai ? item.tahunMulai.toString() : (extractKhidmatYears(item.label)[0] || '2026').toString();
  currentPengurusPeriod = startYr;
  currentSettingPengurusPeriod = startYr;

  if (!pengurus.some(p => p.periode === startYr)) {
    const initStruktur = [];
    if (item.ketuaKomisariat) {
      initStruktur.push({
        id: `PGR-${startYr}-001`,
        kategori: "Badan Pengurus Harian (BPH)",
        jabatan: "Ketua Umum Komisariat",
        nama: item.ketuaKomisariat,
        nim: "",
        fakultas: "",
        whatsapp: "",
        foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
        urutan: 1
      });
    }
    if (item.sekretarisKomisariat) {
      initStruktur.push({
        id: `PGR-${startYr}-002`,
        kategori: "Badan Pengurus Harian (BPH)",
        jabatan: "Sekretaris Umum Komisariat",
        nama: item.sekretarisKomisariat,
        nim: "",
        fakultas: "",
        whatsapp: "",
        foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
        urutan: 2
      });
    }
    if (item.bendaharaKomisariat) {
      initStruktur.push({
        id: `PGR-${startYr}-003`,
        kategori: "Badan Pengurus Harian (BPH)",
        jabatan: "Bendahara Umum Komisariat",
        nama: item.bendaharaKomisariat,
        nim: "",
        fakultas: "",
        whatsapp: "",
        foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces",
        urutan: 3
      });
    }

    pengurus.unshift({
      periode: startYr,
      label: item.label,
      isAktif: true,
      struktur: initStruktur
    });
  } else {
    pengurus.forEach(p => { p.isAktif = (p.periode === startYr); });
  }

  selectedPengeluaranTahunKhidmat = currentTahunKhidmat;
  selectedAnggaranTahunKhidmat = currentTahunKhidmat;

  saveData();
  renderApp();
  renderSettingTahunKhidmat();
  renderSettingPengurus();
  initLucide();

  showToast(`Tahun Khidmat "${item.label}" sekarang aktif! Catatan pengeluaran & anggaran disesuaikan untuk periode ini, kas masuk tetap aman.`, 'success');
}

function openModalTambahTahunKhidmat(editId = null) {
  const modal = document.getElementById('modal-tahun-khidmat');
  const title = document.getElementById('modal-tahun-khidmat-title');
  const inId = document.getElementById('tahun-khidmat-id');
  const inMulai = document.getElementById('tahun-khidmat-mulai');
  const inSelesai = document.getElementById('tahun-khidmat-selesai');
  const inLabel = document.getElementById('tahun-khidmat-label');
  const inKetum = document.getElementById('tahun-khidmat-ketum');
  const inSekum = document.getElementById('tahun-khidmat-sekum');
  const inBendahara = document.getElementById('tahun-khidmat-bendahara');
  const inSk = document.getElementById('tahun-khidmat-sk');
  const inActive = document.getElementById('tahun-khidmat-set-active');
  const optBox = document.getElementById('tahun-khidmat-struktur-opt-box');

  if (!modal) return;

  if (editId) {
    const item = tahunKhidmatList.find(t => t.id === editId);
    if (!item) return;

    if (title) title.textContent = 'Edit Data Tahun Khidmat';
    if (inId) inId.value = item.id;
    if (inMulai) inMulai.value = item.tahunMulai || '';
    if (inSelesai) inSelesai.value = item.tahunSelesai || '';
    if (inLabel) inLabel.value = item.label || '';
    if (inKetum) inKetum.value = item.ketuaKomisariat || '';
    if (inSekum) inSekum.value = item.sekretarisKomisariat || '';
    if (inBendahara) inBendahara.value = item.bendaharaKomisariat || '';
    if (inSk) inSk.value = item.nomorSK || '';
    if (inActive) inActive.checked = item.isAktif;
    if (optBox) optBox.classList.add('hidden');
  } else {
    // Mode tambah baru: hitung tahun berikutnya secara otomatis
    const allYears = tahunKhidmatList.map(t => Number(t.tahunMulai)).filter(Boolean);
    const maxYear = allYears.length > 0 ? Math.max(...allYears) : 2026;
    const nextStart = maxYear + 1;
    const nextEnd = nextStart + 1;

    if (title) title.textContent = 'Tambah Tahun Khidmat Baru';
    if (inId) inId.value = '';
    if (inMulai) inMulai.value = nextStart;
    if (inSelesai) inSelesai.value = nextEnd;
    if (inLabel) inLabel.value = `Masa Khidmat ${nextStart} - ${nextEnd}`;
    if (inKetum) inKetum.value = '';
    if (inSekum) inSekum.value = '';
    if (inBendahara) inBendahara.value = '';
    if (inSk) inSk.value = '';
    if (inActive) inActive.checked = true;
    if (optBox) optBox.classList.remove('hidden');
  }

  modal.classList.remove('hidden');
  initLucide();
}

function closeModalTahunKhidmat() {
  const modal = document.getElementById('modal-tahun-khidmat');
  if (modal) modal.classList.add('hidden');
}

function handleTahunKhidmatMulaiChange(val) {
  const m = parseInt(val, 10);
  if (!isNaN(m)) {
    const s = m + 1;
    const inSelesai = document.getElementById('tahun-khidmat-selesai');
    const inLabel = document.getElementById('tahun-khidmat-label');
    if (inSelesai) inSelesai.value = s;
    if (inLabel) inLabel.value = `Masa Khidmat ${m} - ${s}`;
  }
}

function handleTahunKhidmatSelesaiChange(val) {
  const s = parseInt(val, 10);
  const inMulai = document.getElementById('tahun-khidmat-mulai');
  const inLabel = document.getElementById('tahun-khidmat-label');
  const m = inMulai ? parseInt(inMulai.value, 10) : (s - 1);
  if (inLabel && !isNaN(m) && !isNaN(s)) {
    inLabel.value = `Masa Khidmat ${m} - ${s}`;
  }
}

function saveTahunKhidmatForm(event) {
  if (event) event.preventDefault();

  const id = document.getElementById('tahun-khidmat-id')?.value.trim();
  const mulai = parseInt(document.getElementById('tahun-khidmat-mulai')?.value, 10);
  const selesai = parseInt(document.getElementById('tahun-khidmat-selesai')?.value, 10);
  const label = document.getElementById('tahun-khidmat-label')?.value.trim();
  const ketum = document.getElementById('tahun-khidmat-ketum')?.value.trim();
  const sekum = document.getElementById('tahun-khidmat-sekum')?.value.trim();
  const bendahara = document.getElementById('tahun-khidmat-bendahara')?.value.trim();
  const sk = document.getElementById('tahun-khidmat-sk')?.value.trim();
  const setActive = document.getElementById('tahun-khidmat-set-active')?.checked;
  const copyOpt = document.querySelector('input[name="tahun-khidmat-copy-opt"]:checked')?.value || 'copy';

  if (!mulai || !selesai || !label) {
    showToast('Tahun mulai, selesai, dan label masa khidmat wajib diisi!', 'warning');
    return;
  }

  if (id) {
    // Mode Edit
    const item = tahunKhidmatList.find(t => t.id === id);
    if (!item) return;

    item.tahunMulai = mulai;
    item.tahunSelesai = selesai;
    item.label = label;
    item.ketuaKomisariat = ketum;
    item.sekretarisKomisariat = sekum;
    item.bendaharaKomisariat = bendahara;
    item.nomorSK = sk;

    if (setActive) {
      setActiveTahunKhidmat(item.id);
    } else {
      saveData();
      renderSettingTahunKhidmat();
      showToast(`Data "${label}" berhasil diperbarui.`, 'success');
    }
  } else {
    // Mode Tambah Baru
    const newId = `${mulai}-${selesai}`;
    if (tahunKhidmatList.some(t => t.id === newId || t.label.toLowerCase() === label.toLowerCase())) {
      showToast(`Tahun Khidmat ${label} sudah ada di daftar.`, 'warning');
      return;
    }

    const newObj = {
      id: newId,
      label: label,
      tahunMulai: mulai,
      tahunSelesai: selesai,
      isAktif: false,
      ketuaKomisariat: ketum,
      sekretarisKomisariat: sekum,
      bendaharaKomisariat: bendahara,
      nomorSK: sk,
      keterangan: 'Tahun khidmat baru'
    };

    // Siapkan struktur pengurus baru
    const startYr = mulai.toString();
    let newStruktur = [];
    if (copyOpt === 'copy') {
      const activePer = pengurus.find(p => p.isAktif) || pengurus[0];
      if (activePer && activePer.struktur) {
        newStruktur = activePer.struktur.map((s, idx) => ({
          id: `PGR-${startYr}-${String(idx + 1).padStart(3, '0')}`,
          kategori: s.kategori,
          jabatan: s.jabatan,
          nama: (s.jabatan.includes('Ketua Umum') && ketum) ? ketum : (s.jabatan.includes('Sekretaris Umum') && sekum ? sekum : (s.jabatan.includes('Bendahara Umum') && bendahara ? bendahara : '')),
          nim: '',
          fakultas: '',
          whatsapp: '',
          foto: '',
          urutan: s.urutan || (idx + 1)
        }));
      }
    } else {
      if (ketum) {
        newStruktur.push({
          id: `PGR-${startYr}-001`,
          kategori: 'Badan Pengurus Harian (BPH)',
          jabatan: 'Ketua Umum Komisariat',
          nama: ketum,
          nim: '',
          fakultas: '',
          whatsapp: '',
          foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
          urutan: 1
        });
      }
      if (sekum) {
        newStruktur.push({
          id: `PGR-${startYr}-002`,
          kategori: 'Badan Pengurus Harian (BPH)',
          jabatan: 'Sekretaris Umum Komisariat',
          nama: sekum,
          nim: '',
          fakultas: '',
          whatsapp: '',
          foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
          urutan: 2
        });
      }
      if (bendahara) {
        newStruktur.push({
          id: `PGR-${startYr}-003`,
          kategori: 'Badan Pengurus Harian (BPH)',
          jabatan: 'Bendahara Umum Komisariat',
          nama: bendahara,
          nim: '',
          fakultas: '',
          whatsapp: '',
          foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces',
          urutan: 3
        });
      }
    }

    pengurus.unshift({
      periode: startYr,
      label: label,
      isAktif: false,
      struktur: newStruktur
    });

    tahunKhidmatList.unshift(newObj);

    if (setActive) {
      setActiveTahunKhidmat(newObj.id);
      showToast(`Alhamdulillah! "${label}" berhasil diaktifkan. Pengeluaran & RAB baru bersih dari Rp 0, kas masuk tetap utuh.`, 'success');
    } else {
      saveData();
      renderSettingTahunKhidmat();
      showToast(`Tahun Khidmat "${label}" berhasil ditambahkan sebagai arsip.`, 'success');
    }
  }

  closeModalTahunKhidmat();
}

function deleteTahunKhidmat(id) {
  const item = tahunKhidmatList.find(t => t.id === id);
  if (!item) return;

  if (item.isAktif) {
    showToast('Tahun Khidmat yang sedang aktif tidak dapat dihapus!', 'warning');
    return;
  }

  showConfirmModal({
    title: 'Hapus Tahun Khidmat',
    message: `Apakah Anda yakin ingin menghapus arsip "${item.label}"? Catatan yang berelasi dengan tahun ini akan tetap berada di database.`,
    confirmText: 'Ya, Hapus',
    onConfirm: () => {
      tahunKhidmatList = tahunKhidmatList.filter(t => t.id !== id);
      saveData();
      renderSettingTahunKhidmat();
      showToast(`Arsip "${item.label}" berhasil dihapus.`, 'info');
    }
  });
}

// Helper untuk Pengaturan Struktural & Ketum
function renderSettingPengurus() {
  const selPeriode = document.getElementById('setting-pengurus-period-select');
  const tbody = document.getElementById('setting-pengurus-table-body');
  if (!selPeriode || !tbody) return;

  if (!pengurus || pengurus.length === 0) {
    pengurus = typeof defaultPengurus !== 'undefined' ? JSON.parse(JSON.stringify(defaultPengurus)) : [];
  }

  if (typeof tahunKhidmatList !== 'undefined' && tahunKhidmatList.length > 0) {
    selPeriode.innerHTML = tahunKhidmatList.map(kh => {
      const pDisp = (kh.tahunMulai && kh.tahunSelesai) ? `${kh.tahunMulai} - ${kh.tahunSelesai}` : kh.label;
      const isSel = isKhidmatMatch(kh, currentSettingPengurusPeriod);
      const val = kh.tahunMulai ? kh.tahunMulai.toString() : kh.id;
      return `<option value="${val}" ${isSel ? 'selected' : ''}>Masa Khidmat ${pDisp} ${kh.isAktif ? '★ Aktif' : ''}</option>`;
    }).join('');
  } else {
    selPeriode.innerHTML = pengurus.map(p => `
      <option value="${p.periode}" ${currentSettingPengurusPeriod === p.periode ? 'selected' : ''}>
        Periode ${p.periode} (${p.label || p.periode}) ${p.isAktif ? '★ Aktif' : ''}
      </option>
    `).join('');
  }

  const activePeriod = pengurus.find(p => p.periode === currentSettingPengurusPeriod || isKhidmatMatch(p, currentSettingPengurusPeriod)) || pengurus[0];
  if (!activePeriod || !activePeriod.struktur || activePeriod.struktur.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-slate-400">Belum ada data pengurus di periode ${currentSettingPengurusPeriod}. Silakan klik "+ Tambah Personalia".</td></tr>`;
    return;
  }

  tbody.innerHTML = activePeriod.struktur.map(s => `
    <tr class="hover:bg-slate-50 border-b border-slate-100">
      <td class="py-2.5 px-3 font-semibold text-slate-700 whitespace-nowrap">${s.kategori}</td>
      <td class="py-2.5 px-3 font-bold text-blue-700 whitespace-nowrap">${s.jabatan}</td>
      <td class="py-2.5 px-3 font-bold text-slate-800">${s.nama}</td>
      <td class="py-2.5 px-3 text-slate-500 whitespace-nowrap">${s.nim || '-'} • ${s.fakultas || '-'}</td>
      <td class="py-2.5 px-3 text-slate-600 whitespace-nowrap">${s.whatsapp || '-'}</td>
      <td class="py-2.5 px-3 text-right whitespace-nowrap">
        <button onclick="openEditPengurusModal('${s.id}', '${activePeriod.periode}')" class="text-blue-600 hover:underline font-bold mr-2">Edit</button>
        <button onclick="deletePengurus('${s.id}', '${activePeriod.periode}')" class="text-rose-600 hover:underline font-bold">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function handleSettingPengurusPeriodChange(year) {
  currentSettingPengurusPeriod = year;
  renderSettingPengurus();
}

function renderSettingKetum() {
  const tbody = document.getElementById('setting-ketum-table-body');
  if (!tbody) return;

  if (!ketumKom || ketumKom.length === 0) {
    ketumKom = typeof defaultKetumKom !== 'undefined' ? JSON.parse(JSON.stringify(defaultKetumKom)) : [];
  }

  const sorted = [...ketumKom].sort((a, b) => Number(b.tahun || 0) - Number(a.tahun || 0));

  tbody.innerHTML = sorted.map(k => `
    <tr class="hover:bg-slate-50 border-b border-slate-100">
      <td class="py-2.5 px-3 font-bold text-pmii-navy whitespace-nowrap">${k.periode || k.tahun}</td>
      <td class="py-2.5 px-3 font-bold text-slate-800">${k.nama}</td>
      <td class="py-2.5 px-3 text-slate-500 whitespace-nowrap">${k.fakultas || '-'}</td>
      <td class="py-2.5 px-3 whitespace-nowrap">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${k.status && k.status.includes('Aktif') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
          ${k.status || 'Demisioner'}
        </span>
      </td>
      <td class="py-2.5 px-3 text-slate-600 max-w-xs truncate">${k.visi || k.prestasi || '-'}</td>
      <td class="py-2.5 px-3 text-right whitespace-nowrap">
        <button onclick="openEditKetumModal('${k.id}')" class="text-blue-600 hover:underline font-bold mr-2">Edit</button>
        <button onclick="deleteKetum('${k.id}')" class="text-rose-600 hover:underline font-bold">Hapus</button>
      </td>
    </tr>
  `).join('');
}

// ==========================================
// 6B-2. MANAJEMEN FAKULTAS & PROGRAM STUDI (PRODI)
// ==========================================

function getFakultasProdiList() {
  if (Array.isArray(fakultasProdiList) && fakultasProdiList.length > 0) {
    return fakultasProdiList;
  }
  const saved = localStorage.getItem('pmii_fakultas_prodi');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        fakultasProdiList = parsed;
        return fakultasProdiList;
      }
    } catch (e) {}
  }
  fakultasProdiList = (typeof defaultFakultasProdi !== 'undefined')
    ? JSON.parse(JSON.stringify(defaultFakultasProdi))
    : [];
  return fakultasProdiList;
}

async function saveFakultasProdiList(silent = false) {
  localStorage.setItem('pmii_fakultas_prodi', JSON.stringify(fakultasProdiList));

  // Sync seketika ke Cloud Neon di tabel tb_komisariat
  const cfg = getCloudConfig();
  if (cfg && cfg.type === 'neon' && typeof executeNeonSql === 'function') {
    try {
      await executeNeonSql(`UPDATE tb_komisariat SET fakultas_prodi = ${sqlEscape(JSON.stringify(fakultasProdiList))} WHERE id = 1;`);
      console.log('[NEON] Master fakultas & prodi berhasil disinkronkan ke Cloud.');
    } catch (e) {
      console.warn('[NEON] Gagal sync fakultas_prodi ke cloud:', e.message);
    }
  }

  renderSettingFakultasProdi();
  populateFakultasFilterOptions();
  populateAdminKaderFakultasSelect();
  if (typeof renderFakultasBarChart === 'function') renderFakultasBarChart();

  if (!silent) {
    showToast('Data fakultas & program studi berhasil disimpan & disinkronkan!', 'success');
  }
}

function renderSettingFakultasProdi() {
  const container = document.getElementById('setting-fakultas-prodi-container');
  if (!container) return;

  const list = getFakultasProdiList();
  if (!list || list.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <i data-lucide="graduation-cap" class="w-10 h-10 text-slate-300 mx-auto mb-2"></i>
        <p class="text-xs font-bold text-slate-600">Belum ada fakultas terdaftar</p>
        <p class="text-[11px] text-slate-400 mt-0.5">Silakan klik "+ Tambah Fakultas Baru" atau "Reset Default".</p>
        <button type="button" onclick="openModalTambahFakultas()"
          class="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition">
          + Tambah Fakultas Pertama
        </button>
      </div>
    `;
    initLucide();
    return;
  }

  container.innerHTML = list.map((item, fakIdx) => {
    const prodiArr = Array.isArray(item.prodi) ? item.prodi : [];
    const totalKaderFakultas = (kaders || []).filter(k => k.fakultas === item.fakultas).length;

    const prodiItemsHtml = prodiArr.length > 0
      ? prodiArr.map((p, pIdx) => {
          const kaderInProdi = (kaders || []).filter(k => k.fakultas === item.fakultas && k.jurusan === p).length;
          return `
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200/70 transition group">
              <div class="flex items-center gap-2.5 min-w-0 pr-2">
                <div class="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                  ${pIdx + 1}
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-bold text-slate-800 truncate">${escapeHtml(p)}</p>
                  <span class="text-[10px] text-slate-400 font-medium">${kaderInProdi} Kader terdaftar</span>
                </div>
              </div>
              <div class="flex items-center gap-1 shrink-0">
                <button type="button" onclick="openModalEditProdi('${escapeHtml(item.fakultas)}', '${escapeHtml(p)}')"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer" title="Edit nama prodi">
                  <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                </button>
                <button type="button" onclick="deleteProdi('${escapeHtml(item.fakultas)}', '${escapeHtml(p)}')"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer" title="Hapus prodi ini">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>
          `;
        }).join('')
      : `
        <div class="col-span-full text-center py-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
          Belum ada program studi di fakultas ini. Klik <strong class="text-emerald-700">+ Tambah Prodi</strong> di atas.
        </div>
      `;

    return `
      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3.5">
        <!-- Header Fakultas -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-900 text-yellow-400 flex items-center justify-center shadow-xs shrink-0">
              <i data-lucide="building-2" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-sm font-black text-slate-800">${escapeHtml(item.fakultas)}</h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200/70">
                  ${prodiArr.length} Prodi
                </span>
              </div>
              <p class="text-[11px] text-slate-400 mt-0.5">Total Mahasiswa / Kader: <strong class="text-slate-700">${totalKaderFakultas} orang</strong></p>
            </div>
          </div>

          <!-- Action Buttons Fakultas -->
          <div class="flex items-center gap-1.5 w-full sm:w-auto justify-end flex-wrap">
            <button type="button" onclick="openModalTambahProdi('${escapeHtml(item.fakultas)}')"
              class="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition flex items-center gap-1 border border-emerald-200 cursor-pointer">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i>
              <span>+ Tambah Prodi</span>
            </button>
            <button type="button" onclick="openModalEditFakultas('${escapeHtml(item.fakultas)}')"
              class="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1 border border-slate-200 cursor-pointer"
              title="Ganti nama fakultas">
              <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
              <span>Edit</span>
            </button>
            <button type="button" onclick="deleteFakultas('${escapeHtml(item.fakultas)}')"
              class="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition flex items-center gap-1 border border-rose-200 cursor-pointer"
              title="Hapus fakultas beserta prodinya">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              <span>Hapus</span>
            </button>
          </div>
        </div>

        <!-- List of Prodi -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Daftar Program Studi (Jurusan):</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            ${prodiItemsHtml}
          </div>
        </div>
      </div>
    `;
  }).join('');

  initLucide();
}

// Modal Fakultas
function openModalTambahFakultas() {
  document.getElementById('modal-fakultas-title').textContent = 'Tambah Fakultas Baru';
  document.getElementById('fakultas-old-name').value = '';
  document.getElementById('fakultas-nama-input').value = '';
  const modal = document.getElementById('modal-fakultas');
  if (modal) modal.classList.remove('hidden');
  initLucide();
}

function openModalEditFakultas(nama) {
  document.getElementById('modal-fakultas-title').textContent = 'Edit Nama Fakultas';
  document.getElementById('fakultas-old-name').value = nama;
  document.getElementById('fakultas-nama-input').value = nama;
  const modal = document.getElementById('modal-fakultas');
  if (modal) modal.classList.remove('hidden');
  initLucide();
}

function closeModalFakultas() {
  const modal = document.getElementById('modal-fakultas');
  if (modal) modal.classList.add('hidden');
}

async function handleFakultasFormSubmit(event) {
  event.preventDefault();
  const oldName = document.getElementById('fakultas-old-name').value.trim();
  const newName = document.getElementById('fakultas-nama-input').value.trim();

  if (!newName) {
    showToast('Nama fakultas tidak boleh kosong!', 'warning');
    return;
  }

  const list = getFakultasProdiList();

  if (oldName) {
    // Edit Mode
    const found = list.find(item => item.fakultas === oldName);
    if (found) {
      found.fakultas = newName;

      // Update data kader yang terdaftar pada fakultas ini
      let updatedKaders = 0;
      (kaders || []).forEach(k => {
        if (k.fakultas === oldName) {
          k.fakultas = newName;
          updatedKaders++;
        }
      });

      // Update data pengurus jika ada
      (pengurus || []).forEach(p => {
        if (Array.isArray(p.struktur)) {
          p.struktur.forEach(s => {
            if (s.fakultas === oldName) s.fakultas = newName;
          });
        }
      });

      if (updatedKaders > 0) {
        saveData();
      }
    }
    showToast(`Fakultas "${newName}" berhasil diperbarui!`, 'success');
  } else {
    // Tambah Mode
    if (list.some(item => item.fakultas.toLowerCase() === newName.toLowerCase())) {
      showToast('Fakultas dengan nama tersebut sudah ada!', 'warning');
      return;
    }
    list.push({
      fakultas: newName,
      prodi: []
    });
    showToast(`Fakultas "${newName}" berhasil ditambahkan!`, 'success');
  }

  closeModalFakultas();
  await saveFakultasProdiList(true);
}

function deleteFakultas(nama) {
  const list = getFakultasProdiList();
  const found = list.find(item => item.fakultas === nama);
  if (!found) return;

  const countKader = (kaders || []).filter(k => k.fakultas === nama).length;
  const countProdi = (found.prodi || []).length;

  showConfirmModal({
    title: 'Hapus Fakultas',
    message: `Apakah Anda yakin ingin menghapus <strong>"${escapeHtml(nama)}"</strong>?<br><span class="text-slate-600 text-xs mt-1 block">Fakultas ini memiliki ${countProdi} program studi. ${countKader > 0 ? `<strong>${countKader} kader</strong> saat ini tercatat di fakultas ini.` : 'Belum ada kader terdaftar.'}</span>`,
    confirmText: 'Ya, Hapus Fakultas',
    cancelText: 'Batal',
    type: 'danger',
    icon: 'trash-2',
    onConfirm: async () => {
      fakultasProdiList = list.filter(item => item.fakultas !== nama);
      await saveFakultasProdiList(true);
      showToast(`Fakultas "${nama}" berhasil dihapus.`, 'info');
    }
  });
}

// Modal Program Studi (Prodi)
function openModalTambahProdi(fakultasNama) {
  document.getElementById('modal-prodi-title').textContent = 'Tambah Program Studi';
  document.getElementById('prodi-fakultas-target').value = fakultasNama;
  document.getElementById('prodi-fakultas-display').value = fakultasNama;
  document.getElementById('prodi-old-name').value = '';
  document.getElementById('prodi-nama-input').value = '';
  const modal = document.getElementById('modal-prodi');
  if (modal) modal.classList.remove('hidden');
  initLucide();
}

function openModalEditProdi(fakultasNama, prodiNama) {
  document.getElementById('modal-prodi-title').textContent = 'Edit Program Studi';
  document.getElementById('prodi-fakultas-target').value = fakultasNama;
  document.getElementById('prodi-fakultas-display').value = fakultasNama;
  document.getElementById('prodi-old-name').value = prodiNama;
  document.getElementById('prodi-nama-input').value = prodiNama;
  const modal = document.getElementById('modal-prodi');
  if (modal) modal.classList.remove('hidden');
  initLucide();
}

function closeModalProdi() {
  const modal = document.getElementById('modal-prodi');
  if (modal) modal.classList.add('hidden');
}

async function handleProdiFormSubmit(event) {
  event.preventDefault();
  const fakultasNama = document.getElementById('prodi-fakultas-target').value.trim();
  const oldName = document.getElementById('prodi-old-name').value.trim();
  const newName = document.getElementById('prodi-nama-input').value.trim();

  if (!newName) {
    showToast('Nama program studi tidak boleh kosong!', 'warning');
    return;
  }

  const list = getFakultasProdiList();
  const foundFak = list.find(item => item.fakultas === fakultasNama);
  if (!foundFak) {
    showToast('Fakultas induk tidak ditemukan!', 'error');
    return;
  }

  if (!Array.isArray(foundFak.prodi)) {
    foundFak.prodi = [];
  }

  if (oldName) {
    // Edit Mode
    const pIdx = foundFak.prodi.indexOf(oldName);
    if (pIdx !== -1) {
      foundFak.prodi[pIdx] = newName;

      // Update data kader yang memiliki jurusan ini
      let updatedKaders = 0;
      (kaders || []).forEach(k => {
        if (k.fakultas === fakultasNama && k.jurusan === oldName) {
          k.jurusan = newName;
          updatedKaders++;
        }
      });
      if (updatedKaders > 0) {
        saveData();
      }
    }
    showToast(`Program studi "${newName}" berhasil diperbarui!`, 'success');
  } else {
    // Tambah Mode
    if (foundFak.prodi.some(p => p.toLowerCase() === newName.toLowerCase())) {
      showToast('Program studi dengan nama tersebut sudah ada di fakultas ini!', 'warning');
      return;
    }
    foundFak.prodi.push(newName);
    showToast(`Program studi "${newName}" berhasil ditambahkan ke ${fakultasNama}!`, 'success');
  }

  closeModalProdi();
  await saveFakultasProdiList(true);
}

function deleteProdi(fakultasNama, prodiNama) {
  const list = getFakultasProdiList();
  const foundFak = list.find(item => item.fakultas === fakultasNama);
  if (!foundFak || !Array.isArray(foundFak.prodi)) return;

  const countKader = (kaders || []).filter(k => k.fakultas === fakultasNama && k.jurusan === prodiNama).length;

  showConfirmModal({
    title: 'Hapus Program Studi',
    message: `Apakah Anda yakin ingin menghapus prodi <strong>"${escapeHtml(prodiNama)}"</strong> dari ${escapeHtml(fakultasNama)}?<br><span class="text-slate-600 text-xs mt-1 block">${countKader > 0 ? `<strong>${countKader} kader</strong> saat ini tercatat pada program studi ini.` : 'Belum ada kader terdaftar di prodi ini.'}</span>`,
    confirmText: 'Ya, Hapus Prodi',
    cancelText: 'Batal',
    type: 'danger',
    icon: 'trash-2',
    onConfirm: async () => {
      foundFak.prodi = foundFak.prodi.filter(p => p !== prodiNama);
      await saveFakultasProdiList(true);
      showToast(`Program studi "${prodiNama}" berhasil dihapus.`, 'info');
    }
  });
}

function resetFakultasProdiDefault() {
  showConfirmModal({
    title: 'Reset Fakultas & Prodi Default',
    message: 'Apakah Anda yakin ingin mengembalikan daftar fakultas dan jurusan ke pengaturan awal kampus ISMU Tarate?',
    confirmText: 'Ya, Kembalikan Default',
    cancelText: 'Batal',
    type: 'warning',
    icon: 'rotate-ccw',
    onConfirm: async () => {
      fakultasProdiList = (typeof defaultFakultasProdi !== 'undefined')
        ? JSON.parse(JSON.stringify(defaultFakultasProdi))
        : [];
      await saveFakultasProdiList(true);
      showToast('Susunan fakultas & prodi berhasil direset ke default ISMU!', 'success');
    }
  });
}

// Helper untuk Dropdown Form Kader di Modal Admin
function populateAdminKaderFakultasSelect(selectedFakultas = '', selectedJurusan = '') {
  const selFak = document.getElementById('kader-fakultas');
  if (!selFak) return;

  const list = getFakultasProdiList();
  let options = '';
  list.forEach(item => {
    const isSel = item.fakultas === selectedFakultas ? 'selected' : '';
    options += `<option value="${escapeHtml(item.fakultas)}" ${isSel}>${escapeHtml(item.fakultas)}</option>`;
  });

  // Jika kader memiliki fakultas kustom yang tidak ada di master list, pertahankan
  if (selectedFakultas && !list.some(item => item.fakultas === selectedFakultas)) {
    options += `<option value="${escapeHtml(selectedFakultas)}" selected>${escapeHtml(selectedFakultas)} (Lainnya)</option>`;
  }

  selFak.innerHTML = options;

  const activeFak = selectedFakultas || (list[0] ? list[0].fakultas : '');
  handleAdminKaderFakultasChange(activeFak, selectedJurusan);
}

function handleAdminKaderFakultasChange(fakultas, selectedJurusan = '') {
  const selJur = document.getElementById('kader-jurusan');
  if (!selJur) return;

  const list = getFakultasProdiList();
  const found = list.find(item => item.fakultas === fakultas);
  const prodiArr = found ? (found.prodi || []) : [];

  let options = '';
  prodiArr.forEach(p => {
    const isSel = p === selectedJurusan ? 'selected' : '';
    options += `<option value="${escapeHtml(p)}" ${isSel}>${escapeHtml(p)}</option>`;
  });

  // Jika kader memiliki jurusan kustom lama, pertahankan
  if (selectedJurusan && !prodiArr.includes(selectedJurusan)) {
    options += `<option value="${escapeHtml(selectedJurusan)}" selected>${escapeHtml(selectedJurusan)} (Lainnya)</option>`;
  }

  selJur.innerHTML = options;
}

// ==========================================
// 6C. MODUL RAPAT & PRESENSI PENGURUS KOMISARIAT
// ==========================================
function getActivePengurusList() {
  const periodData = typeof getActivePengurusData === 'function' ? getActivePengurusData() : null;
  if (periodData && Array.isArray(periodData.struktur) && periodData.struktur.length > 0) {
    return periodData.struktur.map(s => ({
      id: s.id || ('PGR-' + Math.random().toString(36).substr(2, 6)),
      nama: s.nama || 'Pengurus',
      jabatan: s.jabatan || 'Anggota Pengurus',
      fakultas: s.fakultas || '',
      kontak: s.kontak || ''
    }));
  }
  if (typeof defaultPengurus !== 'undefined' && defaultPengurus[0] && Array.isArray(defaultPengurus[0].struktur)) {
    return defaultPengurus[0].struktur;
  }
  return [];
}

function renderRapatSection() {
  const statTotal = document.getElementById('rapat-stat-total');
  const statHadirRate = document.getElementById('rapat-stat-hadir-rate');
  const statPengurusCount = document.getElementById('rapat-stat-pengurus-count');
  const countInfo = document.getElementById('rapat-count-info');
  const container = document.getElementById('rapat-list-container');

  if (statTotal) statTotal.textContent = `${rapat.length} Rapat`;

  // Hitung rata-rata tingkat kehadiran pengurus
  let totalPresensiRecorded = 0;
  let totalHadirRecorded = 0;
  (rapat || []).forEach(r => {
    if (Array.isArray(r.presensi)) {
      totalPresensiRecorded += r.presensi.length;
      totalHadirRecorded += r.presensi.filter(p => p.status === 'Hadir').length;
    }
  });

  const avgRate = totalPresensiRecorded > 0 ? Math.round((totalHadirRecorded / totalPresensiRecorded) * 100) : 0;
  if (statHadirRate) statHadirRate.textContent = `${avgRate}%`;

  const pengurusList = getActivePengurusList();
  if (statPengurusCount) statPengurusCount.textContent = `${pengurusList.length} Orang`;

  const query = (searchRapatQuery || '').toLowerCase();
  const filtered = (rapat || []).filter(r => {
    if (!query) return true;
    return (r.agenda && r.agenda.toLowerCase().includes(query)) ||
      (r.tempat && r.tempat.toLowerCase().includes(query)) ||
      (r.pimpinan && r.pimpinan.toLowerCase().includes(query)) ||
      (r.notulis && r.notulis.toLowerCase().includes(query)) ||
      (r.tanggal && r.tanggal.toLowerCase().includes(query)) ||
      (r.notulensi && r.notulensi.toLowerCase().includes(query));
  });

  if (countInfo) countInfo.textContent = `Menampilkan ${filtered.length} agenda rapat`;

  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-2xl p-8 border border-slate-100 shadow-xs text-center">
        <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <i data-lucide="calendar-x" class="w-6 h-6"></i>
        </div>
        <h3 class="text-sm font-bold text-slate-800">Tidak ada agenda rapat yang ditemukan</h3>
        <p class="text-xs text-slate-400 mt-1">Belum ada rapat yang tersimpan atau tidak sesuai kata kunci pencarian.</p>
        <button onclick="openAddRapatModal()" class="mt-4 px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-xs rounded-xl transition inline-flex items-center gap-1.5 shadow-sm">
          <i data-lucide="plus-circle" class="w-4 h-4"></i>
          <span>Buat Agenda Rapat Baru</span>
        </button>
      </div>
    `;
    initLucide();
    return;
  }

  container.innerHTML = filtered.map(r => {
    const list = Array.isArray(r.presensi) ? r.presensi : [];
    const hadir = list.filter(p => p.status === 'Hadir').length;
    const izin = list.filter(p => p.status === 'Izin').length;
    const sakit = list.filter(p => p.status === 'Sakit').length;
    const alpa = list.filter(p => p.status === 'Alpa' || p.status === 'Tanpa Keterangan').length;
    const totalPeserta = list.length || 1;
    const pctHadir = Math.round((hadir / totalPeserta) * 100);

    return `
      <div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:border-indigo-100 transition space-y-4">
        
        <!-- Header Rapat -->
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                ${r.tanggal || '-'}
              </span>
              <span class="text-xs text-slate-400">• ${r.waktu || 'Waktu Fleksibel'}</span>
              <span class="text-xs text-slate-400">• ${r.tempat || 'Sekretariat'}</span>
            </div>
            <h3 class="text-base font-extrabold text-slate-800">${r.agenda}</h3>
            <p class="text-xs text-slate-500 flex flex-wrap items-center gap-3">
              <span><strong class="text-slate-700 font-semibold">Pimpinan:</strong> ${r.pimpinan || '-'}</span>
              <span><strong class="text-slate-700 font-semibold">Notulis:</strong> ${r.notulis || '-'}</span>
            </p>
          </div>

          <!-- Kehadiran Summary Chips -->
          <div class="flex flex-wrap sm:flex-col items-end gap-1.5 shrink-0">
            <div class="flex items-center gap-1.5">
              <span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200" title="Jumlah pengurus yang hadir">
                ✓ Hadir: ${hadir}
              </span>
              <span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200" title="Jumlah izin">
                ! Izin: ${izin}
              </span>
              <span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200" title="Jumlah sakit">
                + Sakit: ${sakit}
              </span>
              <span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200" title="Tanpa keterangan">
                ✕ Alpa: ${alpa}
              </span>
            </div>
            <span class="text-[11px] font-bold text-slate-500">
              Partisipasi: <strong class="text-indigo-700">${pctHadir}%</strong> (${hadir}/${totalPeserta} Pengurus)
            </span>
          </div>
        </div>

        <!-- Notulensi Preview -->
        <div>
          <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1">Hasil & Keputusan Rapat:</span>
          <p class="text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100 whitespace-pre-line leading-relaxed max-h-24 overflow-y-auto">
            ${r.notulensi || 'Belum ada catatan hasil keputusan rapat.'}
          </p>
        </div>

        <!-- Action Footer -->
        <div class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-50">
          <div class="flex items-center gap-2">
            <button onclick="viewRapatDetail('${r.id}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold rounded-xl border border-indigo-200 transition">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i>
              <span>Lihat Detail Presensi</span>
            </button>
            <button onclick="shareRapatToWhatsApp('${r.id}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-xs transition">
              <i data-lucide="send" class="w-3.5 h-3.5 text-white"></i>
              <span>Kirim ke WhatsApp</span>
            </button>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="openBroadcastForRapat('${r.id}')" class="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition" title="Kirim Undangan WA Rapat ini ke Pengurus">
              <i data-lucide="message-square-share" class="w-3.5 h-3.5 text-emerald-600"></i>
              <span>Undang WA</span>
            </button>
            <button onclick="openEditRapatModal('${r.id}')" class="text-xs font-bold text-blue-600 hover:text-blue-800 px-2.5 py-1.5 hover:bg-blue-50 rounded-lg transition">
              Edit
            </button>
            <button onclick="deleteRapat('${r.id}')" class="text-xs font-bold text-rose-600 hover:text-rose-800 px-2.5 py-1.5 hover:bg-rose-50 rounded-lg transition">
              Hapus
            </button>
          </div>
        </div>

      </div>
    `;
  }).join('');

  initLucide();
}

function handleSearchRapat(val) {
  searchRapatQuery = (val || '').trim();
  renderRapatSection();
}

function openAddRapatModal(itemToEdit = null) {
  const modal = document.getElementById('modal-rapat');
  if (!modal) return;

  const idInput = document.getElementById('rapat-id');
  const agendaInput = document.getElementById('rapat-agenda');
  const tanggalInput = document.getElementById('rapat-tanggal');
  const waktuInput = document.getElementById('rapat-waktu');
  const tempatInput = document.getElementById('rapat-tempat');
  const pimpinanInput = document.getElementById('rapat-pimpinan');
  const notulisInput = document.getElementById('rapat-notulis');
  const notulensiInput = document.getElementById('rapat-notulensi');
  const titleEl = document.getElementById('modal-rapat-title');
  const container = document.getElementById('form-rapat-presensi-container');

  const pengurusList = getActivePengurusList();

  if (itemToEdit) {
    if (titleEl) titleEl.textContent = 'Edit Agenda & Presensi Rapat';
    if (idInput) idInput.value = itemToEdit.id;
    if (agendaInput) agendaInput.value = itemToEdit.agenda || '';
    if (tanggalInput) tanggalInput.value = itemToEdit.tanggal || '';
    if (waktuInput) waktuInput.value = itemToEdit.waktu || '';
    if (tempatInput) tempatInput.value = itemToEdit.tempat || '';
    if (pimpinanInput) pimpinanInput.value = itemToEdit.pimpinan || '';
    if (notulisInput) notulisInput.value = itemToEdit.notulis || '';
    if (notulensiInput) notulensiInput.value = itemToEdit.notulensi || '';
  } else {
    if (titleEl) titleEl.textContent = 'Buat Agenda & Presensi Rapat Baru';
    if (idInput) idInput.value = '';
    if (agendaInput) agendaInput.value = '';
    if (tanggalInput) tanggalInput.value = new Date().toISOString().split('T')[0];
    if (waktuInput) waktuInput.value = '19.30 - Selesai';
    if (tempatInput) tempatInput.value = 'Sekretariat PK PMII ISMU Tarate';
    if (pimpinanInput) pimpinanInput.value = komisariat.ketuaKomisariat || 'Ahmad Zainuri (Ketua Umum)';
    if (notulisInput) notulisInput.value = komisariat.sekretarisKomisariat || 'M. Fathur Rozak (Sekretaris)';
    if (notulensiInput) notulensiInput.value = '';
  }

  // Isi baris daftar hadir pengurus
  if (container) {
    if (pengurusList.length === 0) {
      container.innerHTML = `
        <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          Belum ada data pengurus komisariat aktif. Silakan isi terlebih dahulu di tab Pengurus Komisariat.
        </div>
      `;
    } else {
      const pastPresensi = itemToEdit && Array.isArray(itemToEdit.presensi) ? itemToEdit.presensi : [];
      container.innerHTML = pengurusList.map((p, idx) => {
        const found = pastPresensi.find(item => item.id === p.id || item.nama === p.nama);
        const currentStatus = found ? found.status : 'Hadir';
        const currentKet = found ? (found.keterangan || '') : '';

        return `
          <div class="presensi-row p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5" data-id="${p.id}" data-nama="${p.nama}" data-jabatan="${p.jabatan}">
            <div class="space-y-0.5">
              <span class="text-xs font-extrabold text-slate-800 block">${p.nama}</span>
              <span class="text-[11px] text-slate-500">${p.jabatan}</span>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <label class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 cursor-pointer">
                <input type="radio" name="presensi_${idx}" value="Hadir" ${currentStatus === 'Hadir' ? 'checked' : ''} class="text-emerald-600 focus:ring-emerald-500">
                <span>Hadir</span>
              </label>
              <label class="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 cursor-pointer">
                <input type="radio" name="presensi_${idx}" value="Izin" ${currentStatus === 'Izin' ? 'checked' : ''} class="text-amber-600 focus:ring-amber-500">
                <span>Izin</span>
              </label>
              <label class="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200 cursor-pointer">
                <input type="radio" name="presensi_${idx}" value="Sakit" ${currentStatus === 'Sakit' ? 'checked' : ''} class="text-blue-600 focus:ring-blue-500">
                <span>Sakit</span>
              </label>
              <label class="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200 cursor-pointer">
                <input type="radio" name="presensi_${idx}" value="Alpa" ${currentStatus === 'Alpa' || currentStatus === 'Tanpa Keterangan' ? 'checked' : ''} class="text-rose-600 focus:ring-rose-500">
                <span>Alpa</span>
              </label>
              <input 
                type="text" 
                class="presensi-ket-input w-28 text-[11px] bg-white border border-slate-200 rounded-lg px-2 py-1 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400" 
                placeholder="Catatan..." 
                value="${currentKet}"
              >
            </div>
          </div>
        `;
      }).join('');
    }
  }

  modal.classList.remove('hidden');
  initLucide();
}

function openEditRapatModal(id) {
  const item = rapat.find(r => r.id === id);
  if (item) {
    openAddRapatModal(item);
  }
}

function closeRapatModal() {
  const modal = document.getElementById('modal-rapat');
  if (modal) modal.classList.add('hidden');
}

function setAllPresensiStatus(status) {
  const container = document.getElementById('form-rapat-presensi-container');
  if (!container) return;
  const radios = container.querySelectorAll(`input[type="radio"][value="${status}"]`);
  radios.forEach(r => { r.checked = true; });
  showToast(`Semua pengurus ditandai "${status}"`, 'info');
}

function saveRapatForm(event) {
  event.preventDefault();

  const id = document.getElementById('rapat-id').value;
  const agenda = document.getElementById('rapat-agenda').value.trim();
  const tanggal = document.getElementById('rapat-tanggal').value;
  const waktu = document.getElementById('rapat-waktu').value.trim();
  const tempat = document.getElementById('rapat-tempat').value.trim();
  const pimpinan = document.getElementById('rapat-pimpinan').value.trim();
  const notulis = document.getElementById('rapat-notulis').value.trim();
  const notulensi = document.getElementById('rapat-notulensi').value.trim();

  // Ambil list presensi
  const container = document.getElementById('form-rapat-presensi-container');
  const presensiRows = container ? container.querySelectorAll('.presensi-row') : [];
  const presensi = [];

  presensiRows.forEach(row => {
    const memberId = row.getAttribute('data-id');
    const memberNama = row.getAttribute('data-nama');
    const memberJabatan = row.getAttribute('data-jabatan');
    const checkedRadio = row.querySelector('input[type="radio"]:checked');
    const status = checkedRadio ? checkedRadio.value : 'Hadir';
    const ketInput = row.querySelector('.presensi-ket-input');
    const ket = ketInput ? ketInput.value.trim() : '';

    presensi.push({
      id: memberId,
      nama: memberNama,
      jabatan: memberJabatan,
      status: status,
      keterangan: ket
    });
  });

  if (id) {
    const idx = rapat.findIndex(r => r.id === id);
    if (idx !== -1) {
      rapat[idx] = {
        ...rapat[idx],
        agenda,
        tanggal,
        waktu,
        tempat,
        pimpinan,
        notulis,
        notulensi,
        presensi
      };
      showToast('Agenda rapat dan presensi berhasil diperbarui!', 'success');
    }
  } else {
    const newRapat = {
      id: 'RPT-' + new Date().getFullYear() + '-' + String(rapat.length + 1).padStart(3, '0') + '-' + Math.random().toString(36).substr(2, 4),
      agenda,
      tanggal,
      waktu,
      tempat,
      pimpinan,
      notulis,
      notulensi,
      presensi
    };
    rapat.unshift(newRapat);
    showToast('Agenda rapat dan presensi berhasil disimpan!', 'success');
  }

  saveData();
  closeRapatModal();
  renderRapatSection();
  if (typeof renderLaporanSection === 'function') renderLaporanSection();
}

function deleteRapat(id) {
  const item = (rapat || []).find(r => r.id === id);
  if (!item) return;

  showConfirmModal({
    title: 'Hapus Agenda Rapat',
    message: `Apakah Anda yakin ingin menghapus agenda rapat <strong>"${escapeHtml(item.agenda)}"</strong>?<br><span class="text-rose-500 font-bold text-xs mt-1 block">Seluruh data agenda, presensi & notulensi rapat ini akan dihapus permanen dari Cloud Neon.</span>`,
    confirmText: 'Ya, Hapus Rapat',
    cancelText: 'Batal',
    type: 'danger',
    icon: 'trash-2',
    onConfirm: async () => {
      // Direct deletion from Cloud Neon (hapus presensi rapat terlebih dahulu karena relasi FK)
      if (typeof executeNeonSql === 'function') {
        try {
          await executeNeonSql(`DELETE FROM tb_presensi_rapat WHERE rapat_id = ${sqlEscape(id)};`);
          await executeNeonSql(`DELETE FROM tb_rapat WHERE id = ${sqlEscape(id)};`);
        } catch (e) {
          console.warn('[NEON] Direct delete rapat gagal:', e.message);
        }
      }

      rapat = (rapat || []).filter(r => r.id !== id);
      saveData();
      renderRapatSection();
      if (typeof renderLaporanSection === 'function') renderLaporanSection();
      showToast('Agenda rapat berhasil dihapus permanen.', 'info');
    }
  });
}

function generateRapatWhatsAppText(item) {
  if (!item) return '';
  const list = Array.isArray(item.presensi) ? item.presensi : [];
  const hadirList = list.filter(p => p.status === 'Hadir');
  const izinList = list.filter(p => p.status === 'Izin');
  const sakitList = list.filter(p => p.status === 'Sakit');
  const alpaList = list.filter(p => p.status === 'Alpa' || p.status === 'Tanpa Keterangan');

  let text = `📋 *NOTULENSI & PRESENSI RAPAT PENGURUS*\n`;
  text += `🏛️ *${komisariat.namaLengkap || 'PK PMII ISMU TARATE'}*\n`;
  text += `_${komisariat.cabang || 'PC PMII Kab. Sumenep'}_\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `📌 *Agenda:* ${item.agenda}\n`;
  text += `📅 *Hari/Tanggal:* ${item.tanggal || '-'}\n`;
  text += `⏰ *Waktu:* ${item.waktu || '-'}\n`;
  text += `📍 *Tempat:* ${item.tempat || '-'}\n`;
  text += `👤 *Pimpinan Rapat:* ${item.pimpinan || '-'}\n`;
  text += `✍️ *Notulis:* ${item.notulis || '-'}\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  text += `📊 *REKAP KEHADIRAN PENGURUS (${list.length} Orang)*\n`;
  text += `✅ *Hadir (${hadirList.length}):*\n`;
  if (hadirList.length > 0) {
    hadirList.forEach((p, idx) => {
      text += `${idx + 1}. ${p.nama} (${p.jabatan})${p.keterangan ? ' - ' + p.keterangan : ''}\n`;
    });
  } else {
    text += `- Tidak ada yang hadir\n`;
  }

  text += `\n⚠️ *Izin (${izinList.length}):*\n`;
  if (izinList.length > 0) {
    izinList.forEach((p, idx) => {
      text += `${idx + 1}. ${p.nama} (${p.jabatan})${p.keterangan ? ' - ' + p.keterangan : ''}\n`;
    });
  } else {
    text += `- Nihil\n`;
  }

  text += `\n🏥 *Sakit (${sakitList.length}):*\n`;
  if (sakitList.length > 0) {
    sakitList.forEach((p, idx) => {
      text += `${idx + 1}. ${p.nama} (${p.jabatan})${p.keterangan ? ' - ' + p.keterangan : ''}\n`;
    });
  } else {
    text += `- Nihil\n`;
  }

  text += `\n❌ *Alpa / Tanpa Keterangan (${alpaList.length}):*\n`;
  if (alpaList.length > 0) {
    alpaList.forEach((p, idx) => {
      text += `${idx + 1}. ${p.nama} (${p.jabatan})${p.keterangan ? ' - ' + p.keterangan : ''}\n`;
    });
  } else {
    text += `- Nihil (Semua berpartisipasi/berketerangan)\n`;
  }

  text += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `📝 *POIN HASIL & KEPUTUSAN RAPAT:*\n`;
  text += `${item.notulensi || 'Belum ada catatan hasil keputusan rapat.'}\n\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `_DZIKIR, FIKIR, AMAL SHOLEH_\n`;
  text += `_"Tangan Terkepal dan Maju ke Muka!"_ ✊\n`;

  return text;
}

function viewRapatDetail(id) {
  const item = rapat.find(r => r.id === id);
  if (!item) return;

  currentRapatDetail = item;
  const modal = document.getElementById('modal-detail-rapat');
  if (!modal) return;

  const agendaEl = document.getElementById('detail-rapat-agenda');
  const metaEl = document.getElementById('detail-rapat-meta');
  const countHadir = document.getElementById('detail-rapat-count-hadir');
  const countIzin = document.getElementById('detail-rapat-count-izin');
  const countSakit = document.getElementById('detail-rapat-count-sakit');
  const countAlpa = document.getElementById('detail-rapat-count-alpa');
  const waPreview = document.getElementById('detail-rapat-wa-preview');
  const notulensiEl = document.getElementById('detail-rapat-notulensi');

  if (agendaEl) agendaEl.textContent = item.agenda;
  if (metaEl) metaEl.textContent = `📅 ${item.tanggal || '-'} • ⏰ ${item.waktu || '-'} • 📍 ${item.tempat || '-'}`;

  const list = Array.isArray(item.presensi) ? item.presensi : [];
  const hadir = list.filter(p => p.status === 'Hadir').length;
  const izin = list.filter(p => p.status === 'Izin').length;
  const sakit = list.filter(p => p.status === 'Sakit').length;
  const alpa = list.filter(p => p.status === 'Alpa' || p.status === 'Tanpa Keterangan').length;

  if (countHadir) countHadir.textContent = hadir;
  if (countIzin) countIzin.textContent = izin;
  if (countSakit) countSakit.textContent = sakit;
  if (countAlpa) countAlpa.textContent = alpa;

  const waText = generateRapatWhatsAppText(item);
  if (waPreview) waPreview.textContent = waText;
  if (notulensiEl) notulensiEl.textContent = item.notulensi || 'Belum ada catatan hasil keputusan rapat.';

  modal.classList.remove('hidden');
  initLucide();
}

function closeDetailRapatModal() {
  const modal = document.getElementById('modal-detail-rapat');
  if (modal) modal.classList.add('hidden');
}

function sendCurrentRapatToWhatsApp() {
  if (!currentRapatDetail) return;
  const text = generateRapatWhatsAppText(currentRapatDetail);
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank');
}

function shareRapatToWhatsApp(id) {
  const item = rapat.find(r => r.id === id);
  if (!item) return;
  const text = generateRapatWhatsAppText(item);
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank');
}

function copyCurrentRapatWa() {
  if (!currentRapatDetail) return;
  const text = generateRapatWhatsAppText(currentRapatDetail);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Format pesan laporan WhatsApp berhasil disalin!', 'success');
    }).catch(() => {
      copyFallbackText(text);
    });
  } else {
    copyFallbackText(text);
  }
}

function copyFallbackText(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  showToast('Format pesan laporan WhatsApp berhasil disalin!', 'success');
}

function exportRapatExcel() {
  if (typeof XLSX === 'undefined') {
    showToast('Library Excel (SheetJS) belum siap.', 'error');
    return;
  }

  if (rapat.length === 0) {
    showToast('Belum ada data agenda rapat untuk diexport.', 'warning');
    return;
  }

  const wb = XLSX.utils.book_new();

  // Sheet 1: Agenda Rapat Summary
  const rowsAgenda = rapat.map((r, i) => {
    const list = Array.isArray(r.presensi) ? r.presensi : [];
    const hadir = list.filter(p => p.status === 'Hadir').length;
    const izin = list.filter(p => p.status === 'Izin').length;
    const sakit = list.filter(p => p.status === 'Sakit').length;
    const alpa = list.filter(p => p.status === 'Alpa' || p.status === 'Tanpa Keterangan').length;
    const pct = list.length > 0 ? Math.round((hadir / list.length) * 100) : 0;

    return {
      "No": i + 1,
      "Agenda Rapat": r.agenda || '-',
      "Tanggal": r.tanggal || '-',
      "Waktu": r.waktu || '-',
      "Tempat / Lokasi": r.tempat || '-',
      "Pimpinan Rapat": r.pimpinan || '-',
      "Notulis": r.notulis || '-',
      "Pengurus Hadir": hadir,
      "Pengurus Izin": izin,
      "Pengurus Sakit": sakit,
      "Pengurus Alpa": alpa,
      "% Tingkat Kehadiran": `${pct}%`,
      "Poin Hasil & Keputusan": r.notulensi || '-'
    };
  });
  const ws1 = XLSX.utils.json_to_sheet(rowsAgenda);
  XLSX.utils.book_append_sheet(wb, ws1, "Daftar Agenda Rapat");

  // Sheet 2: Detail Absensi Pengurus
  const rowsPresensi = [];
  rapat.forEach((r) => {
    const list = Array.isArray(r.presensi) ? r.presensi : [];
    list.forEach((p) => {
      rowsPresensi.push({
        "No": rowsPresensi.length + 1,
        "Agenda Rapat": r.agenda || '-',
        "Tanggal Rapat": r.tanggal || '-',
        "Nama Pengurus": p.nama || '-',
        "Jabatan": p.jabatan || '-',
        "Status Kehadiran": p.status || 'Hadir',
        "Keterangan / Catatan": p.keterangan || '-'
      });
    });
  });

  const ws2 = XLSX.utils.json_to_sheet(rowsPresensi);
  XLSX.utils.book_append_sheet(wb, ws2, "Detail Presensi Pengurus");

  XLSX.writeFile(wb, `Laporan_Presensi_Rapat_PMII_${(komisariat.nama || 'Komisariat').replace(/\s+/g, '_')}.xlsx`);
  showToast('Data agenda dan presensi rapat berhasil diexport ke Excel!', 'success');
}

// ==========================================
// 6B. MODUL BROADCAST & UNDANGAN WHATSAPP KETUM
// ==========================================

const BROADCAST_TEMPLATES = {
  rapat: `*UNDANGAN RESMI RAPAT PENGURUS*
*PENGURUS KOMISARIAT PMII ISMU*
Masa Khidmat {masa_khidmat}
━━━━━━━━━━━━━━━━━━━━━

Assalamu'alaikum Warahmatullahi Wabarakatuh.
Salam silaturahmi teriring doa dan restu kami sampaikan, semoga Sahabat/i *{nama}* senantiasa dalam limpahan hidayah Allah SWT. Amin.

Mengharap dengan hormat kehadiran Sahabat/i (*{jabatan}*) dalam rangka agenda:

📌 *Agenda:* {agenda}
🗓️ *Hari, Tanggal:* {hari_tanggal}
⏰ *Waktu:* {waktu}
📍 *Tempat:* {tempat}
{link_section}
Mengingat betapa pentingnya agenda ini demi optimalisasi gerakan dan kelancaran organisasi komisariat, kami sangat mengharapkan kehadiran Sahabat/i tepat pada waktunya.

Demikian undangan ini kami sampaikan. Atas perhatian, dedikasi, dan kehadirannya diucapkan terima kasih.

_Wallahul Muwaffiq Ila Aqwamith Tharieq_
_Wassalamu'alaikum Warahmatullahi Wabarakatuh._

Sumenep, {tanggal_hari_ini}
*Pengurus Komisariat PMII ISMU*

*Ketua Umum:* {ketum}
*WhatsApp Ketum:* {no_ketum}
*Sekretaris Umum:* {sekum}`,

  kaderisasi: `*UNDANGAN KEGIATAN KADERISASI FORMAL*
*PK PMII ISMU (Institut Miftahul Ulum Tarate)*
━━━━━━━━━━━━━━━━━━━━━

Assalamu'alaikum Warahmatullahi Wabarakatuh.
Salam pergerakan! ✊

Kepada Yth. Sahabat/i *{nama}*
di Tempat.

Dengan penuh rasa takdzim dan semangat perjuangan Aswaja, Pengurus Komisariat PMII ISMU mengundang segenap Sahabat/i untuk menghadiri dan menyukseskan:

🌟 *Kegiatan:* {agenda}
🗓️ *Pelaksanaan:* {hari_tanggal}
⏰ *Waktu:* {waktu}
📍 *Lokasi:* {tempat}
{link_section}
Mari bersama-sama merapatkan barisan, memupuk militansi kader, dan mencetak generasi mujahid pergerakan yang berintelektual tinggi serta berkarakter kebangsaan.

Kehadiran dan doa restu Sahabat/i adalah kehormatan besar bagi kami.

_Tangan Terkepal dan Maju Ke Muka!_
_Wallahul Muwaffiq Ila Aqwamith Tharieq_
_Wassalamu'alaikum Warahmatullahi Wabarakatuh._

*PENGURUS KOMISARIAT PMII ISMU*
Ketua Umum: *{ketum}*
WhatsApp Ketum: {no_ketum}`,

  harlah: `*UNDANGAN PERINGATAN HARLAH PMII & DOA BERSAMA*
*PK PMII ISMU SUMENEP*
━━━━━━━━━━━━━━━━━━━━━

Assalamu'alaikum Warahmatullahi Wabarakatuh.
Salam silaturahmi dan salam pergerakan!

Kepada Yth. Sahabat/i *{nama}*
di Tempat.

Dalam rangka memperingati Hari Lahir PMII serta mempererat tali persaudaraan antar kader, pengurus, alumni, dan para kyai/sesepuh, kami mengundang Sahabat/i pada:

🕌 *Acara:* {agenda}
🗓️ *Hari, Tanggal:* {hari_tanggal}
⏰ *Pukul:* {waktu}
📍 *Tempat:* {tempat}
{link_section}
Agenda meliputi: Khatmil Qur'an, Istighatsah Kubro, Refleksi Perjuangan, dan Tasyakuran Bersama.

Besar harapan kami Sahabat/i dapat hadir berkumpul bersama keluarga besar pergerakan.

_Wallahul Muwaffiq Ila Aqwamith Tharieq_
_Wassalamu'alaikum Warahmatullahi Wabarakatuh._

*Keluarga Besar PK PMII ISMU*
Ketua Umum: *{ketum}* (WA: {no_ketum})`,

  silaturahmi: `*UNDANGAN SILATURAHMI & KONSULTASI ORGANISASI*
*PENGURUS KOMISARIAT PMII ISMU*
━━━━━━━━━━━━━━━━━━━━━

Assalamu'alaikum Warahmatullahi Wabarakatuh.

Kepada Yth.
*Bapak/Ibu/Sahabat {nama}*
({jabatan})
di Tempat.

Dengan hormat,
Semoga Bapak/Ibu senantiasa dalam keadaan sehat wal afiat dan sukses dalam menjalankan amanah keumatan dan kebangsaan.

Sehubungan dengan perkembangan kaderisasi serta agenda:
📌 *Agenda:* {agenda}
🗓️ *Hari, Tanggal:* {hari_tanggal}
⏰ *Waktu:* {waktu}
📍 *Tempat:* {tempat}
{link_section}
Kami Pengurus Komisariat PMII ISMU memohon kesediaan waktu serta arahan dan bimbingan dari Bapak/Ibu demi kemajuan kaderisasi generasi penerus PMII ISMU.

Demikian permohonan dan undangan ini kami haturkan. Atas perkenan dan bimbingannya kami haturkan terima kasih yang sedalam-dalamnya.

_Wallahul Muwaffiq Ila Aqwamith Tharieq_
_Wassalamu'alaikum Warahmatullahi Wabarakatuh._

Hormat kami,
*Ketua Umum PK PMII ISMU*
*{ketum}*
WhatsApp: {no_ketum}`,

  bebas: `*PEMBERITAHUAN RESMI PK PMII ISMU*
━━━━━━━━━━━━━━━━━━━━━

Assalamu'alaikum Warahmatullahi Wabarakatuh.
Salam pergerakan! ✊

Yth. Sahabat/i *{nama}*
({jabatan})

📌 *Agenda:* {agenda}
🗓️ *Hari, Tanggal:* {hari_tanggal}
⏰ *Waktu:* {waktu}
📍 *Tempat:* {tempat}
{link_section}
Demikian pemberitahuan resmi ini kami sampaikan. Mohon dapat disimak dan dilaksanakan bersama demi kemaslahatan organisasi kita tercinta.

_Wallahul Muwaffiq Ila Aqwamith Tharieq_
_Wassalamu'alaikum Warahmatullahi Wabarakatuh._

*Pengurus Komisariat PMII ISMU*
Ketua Umum: *{ketum}*
WhatsApp: {no_ketum}`
};

let broadcastState = {
  target: 'pengurus', // 'pengurus' | 'kader' | 'mabinkom'
  kaderFilter: {
    jenjang: 'semua',
    fakultas: 'semua',
    angkatan: 'semua'
  },
  selectedTemplate: 'rapat',
  agenda: 'Rapat Pleno BPH & Persiapan Kaderisasi',
  tanggal: '',
  waktu: '19.30 WIB - Selesai',
  tempat: 'Sekretariat PK PMII ISMU Tarate',
  link: '',
  ketumNama: '',
  ketumWa: '',
  messageTemplate: '',
  recipients: [],
  searchQuery: '',
  runner: {
    isRunning: false,
    isPaused: false,
    currentIndex: 0,
    delaySeconds: 4,
    timerId: null
  }
};

/**
 * Mengambil template kustom yang pernah disimpan Ketum dari localStorage
 */
function getCustomBroadcastTemplates() {
  try {
    const saved = localStorage.getItem('pmii_custom_bc_templates');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return {};
}

/**
 * Mengambil teks template aktif: prioritaskan custom hasil edit Ketum
 */
function getActiveTemplateText(tplKey) {
  const customs = getCustomBroadcastTemplates();
  if (customs && customs[tplKey]) {
    return customs[tplKey];
  }
  return BROADCAST_TEMPLATES[tplKey] || BROADCAST_TEMPLATES.rapat;
}

/**
 * Normalisasi nomor telepon format Indonesia:
 * 0812... -> 62812...
 * +62812... -> 62812...
 * 812... -> 62812...
 */
function formatIndonesianPhoneNumber(raw) {
  if (!raw) return '';
  let cleaned = String(raw).replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

/**
 * Tanggal hari ini dalam format Bahasa Indonesia
 */
function getIndonesianDateString(dateObj = new Date()) {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
}

/**
 * Inisialisasi & Render Section Broadcast WA
 */
function renderBroadcastSection() {
  // Set default tanggal hari ini jika masih kosong
  if (!broadcastState.tanggal) {
    const d = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    broadcastState.tanggal = `${days[d.getDay()]}, ${getIndonesianDateString(d)}`;
  }

  // Muat identitas Ketum pengirim dari localStorage atau komisariat
  const savedKetumNama = localStorage.getItem('pmii_ketum_nama_sender');
  const savedKetumWa = localStorage.getItem('pmii_ketum_wa_sender');

  if (!broadcastState.ketumNama) {
    broadcastState.ketumNama = savedKetumNama || (komisariat && komisariat.ketuaKomisariat) || 'Sahabat M. Ilham Fathoni';
  }
  if (!broadcastState.ketumWa) {
    let foundKetumWa = savedKetumWa || (komisariat && komisariat.telepon) || '';
    if (!foundKetumWa && Array.isArray(defaultPengurus) && defaultPengurus[0] && Array.isArray(defaultPengurus[0].struktur)) {
      const pKetum = defaultPengurus[0].struktur.find(s => s.jabatan && s.jabatan.toLowerCase().includes('ketua umum'));
      if (pKetum && pKetum.whatsapp) foundKetumWa = pKetum.whatsapp;
    }
    broadcastState.ketumWa = foundKetumWa || '081234567801';
  }

  const inKetumNama = document.getElementById('bc-input-ketum-nama');
  const inKetumWa = document.getElementById('bc-input-ketum-wa');
  if (inKetumNama) inKetumNama.value = broadcastState.ketumNama;
  if (inKetumWa) inKetumWa.value = broadcastState.ketumWa;

  // Muat teks template aktif (prioritaskan template hasil editan Ketum yang tersimpan)
  broadcastState.messageTemplate = getActiveTemplateText(broadcastState.selectedTemplate);
  const inTpl = document.getElementById('bc-message-template');
  if (inTpl) inTpl.value = broadcastState.messageTemplate;

  updateTemplateSavedStatusBadge();

  // Sinkronkan input form dengan state
  const inAgenda = document.getElementById('bc-input-agenda');
  const inTanggal = document.getElementById('bc-input-tanggal');
  const inWaktu = document.getElementById('bc-input-waktu');
  const inTempat = document.getElementById('bc-input-tempat');
  const inLink = document.getElementById('bc-input-link');

  if (inAgenda && !inAgenda.value) inAgenda.value = broadcastState.agenda;
  if (inTanggal && !inTanggal.value) inTanggal.value = broadcastState.tanggal;
  if (inWaktu && !inWaktu.value) inWaktu.value = broadcastState.waktu;
  if (inTempat && !inTempat.value) inTempat.value = broadcastState.tempat;
  if (inLink && !inLink.value) inLink.value = broadcastState.link;

  // Muat daftar penerima sesuai target
  loadBroadcastRecipients();

  // Update UI tombol template & target
  updateBroadcastTargetUI();
  updateBroadcastTemplateButtonsUI();

  // Render preview dan tabel
  renderBroadcastPreview();
  renderBroadcastRecipientTable();
  updateBroadcastStats();
  initLucide();
}

/**
 * Update badge status penyimpanan template
 */
function updateTemplateSavedStatusBadge() {
  const badge = document.getElementById('bc-template-saved-status');
  if (!badge) return;
  const customs = getCustomBroadcastTemplates();
  if (customs && customs[broadcastState.selectedTemplate]) {
    badge.textContent = '✓ Tersimpan (Kustom)';
    badge.className = 'text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 transition';
  } else {
    badge.textContent = 'Bawaan PMII';
    badge.className = 'text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200';
  }
}

/**
 * Mengubah target penerima: 'pengurus' | 'kader' | 'mabinkom'
 */
function setBroadcastTarget(targetKey) {
  if (broadcastState.runner.isRunning) {
    showToast('Harap hentikan pengiriman otomatis sebelum mengganti target.', 'warning');
    return;
  }
  broadcastState.target = targetKey;

  // Jika ganti ke Mabinkom, otomatis sarankan template silaturahmi
  if (targetKey === 'mabinkom' && broadcastState.selectedTemplate === 'rapat') {
    selectBroadcastTemplate('silaturahmi');
  }

  updateBroadcastTargetUI();
  loadBroadcastRecipients();
  renderBroadcastPreview();
  renderBroadcastRecipientTable();
  updateBroadcastStats();
}

/**
 * Update styling tombol pilihan target di UI
 */
function updateBroadcastTargetUI() {
  const btnPengurus = document.getElementById('bc-btn-target-pengurus');
  const btnKader = document.getElementById('bc-btn-target-kader');
  const btnMabinkom = document.getElementById('bc-btn-target-mabinkom');
  const filterKaderBox = document.getElementById('bc-kader-filters');
  const targetLabel = document.getElementById('bc-stat-target-label');

  const activeClass = 'bg-white text-blue-950 font-bold shadow-xs border border-slate-200';
  const inactiveClass = 'text-slate-600 font-semibold hover:text-slate-900 border border-transparent';

  if (btnPengurus) btnPengurus.className = `py-2 px-3 rounded-lg text-xs transition flex items-center justify-center gap-1.5 ${broadcastState.target === 'pengurus' ? activeClass : inactiveClass}`;
  if (btnKader) btnKader.className = `py-2 px-3 rounded-lg text-xs transition flex items-center justify-center gap-1.5 ${broadcastState.target === 'kader' ? activeClass : inactiveClass}`;
  if (btnMabinkom) btnMabinkom.className = `py-2 px-3 rounded-lg text-xs transition flex items-center justify-center gap-1.5 ${broadcastState.target === 'mabinkom' ? activeClass : inactiveClass}`;

  if (filterKaderBox) {
    if (broadcastState.target === 'kader') {
      filterKaderBox.classList.remove('hidden');
    } else {
      filterKaderBox.classList.add('hidden');
    }
  }

  if (targetLabel) {
    if (broadcastState.target === 'pengurus') targetLabel.textContent = 'Pengurus Aktif';
    else if (broadcastState.target === 'kader') targetLabel.textContent = 'Seluruh Kader';
    else if (broadcastState.target === 'mabinkom') targetLabel.textContent = 'Dewan Mabinkom';
  }
}

/**
 * Handle perubahan filter khusus kader
 */
function handleBroadcastKaderFilterChange() {
  const fJenjang = document.getElementById('bc-filter-jenjang')?.value || 'semua';
  const fFakultas = document.getElementById('bc-filter-fakultas')?.value || 'semua';
  const fAngkatan = document.getElementById('bc-filter-angkatan')?.value || 'semua';

  broadcastState.kaderFilter = {
    jenjang: fJenjang,
    fakultas: fFakultas,
    angkatan: fAngkatan
  };

  loadBroadcastRecipients();
  renderBroadcastPreview();
  renderBroadcastRecipientTable();
  updateBroadcastStats();
}

/**
 * Mengisi daftar penerima (recipients) berdasarkan target yang dipilih
 */
function loadBroadcastRecipients() {
  const currentStatusMap = new Map();
  (broadcastState.recipients || []).forEach(r => {
    currentStatusMap.set(r.id, { isSelected: r.isSelected, status: r.status });
  });

  let rawList = [];

  if (broadcastState.target === 'pengurus') {
    const list = getActivePengurusList();
    rawList = (list || []).map(p => ({
      id: p.id || ('PGR-' + Math.random().toString(36).substr(2, 6)),
      nama: p.nama || 'Pengurus',
      panggilan: (p.nama || '').replace(/^(Sahabat|Sahabati|Dr\.|H\.|Drs\.)\s+/i, '').split(' ')[0] || 'Sahabat',
      jabatan: p.jabatan || 'Pengurus Komisariat',
      fakultas: p.fakultas || '',
      noHp: p.whatsapp || p.kontak || '',
      category: 'Pengurus'
    }));
  } else if (broadcastState.target === 'kader') {
    let kdrs = Array.isArray(kaders) ? [...kaders] : [];
    
    // Terapkan filter jenjang
    if (broadcastState.kaderFilter.jenjang !== 'semua') {
      if (broadcastState.kaderFilter.jenjang === 'KOPRI') {
        kdrs = kdrs.filter(k => k.gender === 'Perempuan' || (k.kaderisasi && k.kaderisasi.kopri && k.kaderisasi.kopri !== '-'));
      } else {
        kdrs = kdrs.filter(k => k.kaderisasi && k.kaderisasi.formal === broadcastState.kaderFilter.jenjang);
      }
    }

    // Filter fakultas
    if (broadcastState.kaderFilter.fakultas !== 'semua') {
      kdrs = kdrs.filter(k => k.fakultas === broadcastState.kaderFilter.fakultas);
    }

    // Filter angkatan
    if (broadcastState.kaderFilter.angkatan !== 'semua') {
      kdrs = kdrs.filter(k => String(k.angkatan) === String(broadcastState.kaderFilter.angkatan));
    }

    rawList = kdrs.map(k => ({
      id: k.id,
      nama: k.nama,
      panggilan: k.namaPanggilan || k.panggilan || (k.nama || '').replace(/^(Sahabat|Sahabati)\s+/i, '').split(' ')[0] || 'Sahabat',
      jabatan: (k.kaderisasi && k.kaderisasi.formal) ? `Kader ${k.kaderisasi.formal}` : 'Kader PMII',
      fakultas: k.fakultas || '',
      noHp: k.whatsapp || '',
      category: 'Kader'
    }));
  } else if (broadcastState.target === 'mabinkom') {
    const list = Array.isArray(mabinkom) ? mabinkom : [];
    rawList = list.map(m => ({
      id: m.id,
      nama: m.nama,
      panggilan: (m.nama || '').replace(/^(Dr\.|H\.|Hj\.|Drs\.|Sahabat)\s+/i, '').split(' ')[0] || 'Sahabat',
      jabatan: m.jabatan || 'Dewan Pembina Komisariat',
      fakultas: m.instansi || '',
      noHp: m.whatsapp || m.kontak || '',
      category: 'Mabinkom'
    }));
  }

  // Format dan validasi nomor telepon
  broadcastState.recipients = rawList.map(item => {
    const clean = formatIndonesianPhoneNumber(item.noHp);
    const isValid = clean.length >= 10 && clean.length <= 15;
    const prev = currentStatusMap.get(item.id);

    return {
      ...item,
      cleanNoHp: clean,
      isValid: isValid,
      isSelected: prev ? prev.isSelected : isValid, // default checked jika valid
      status: prev ? prev.status : (isValid ? 'idle' : 'invalid')
    };
  });

  const totalValid = broadcastState.recipients.filter(r => r.isValid).length;
  const summaryEl = document.getElementById('bc-target-summary');
  if (summaryEl) {
    summaryEl.textContent = `${totalValid} No. WA Siap Kirim`;
  }
}

/**
 * Memilih template undangan
 */
function selectBroadcastTemplate(tplKey) {
  if (!BROADCAST_TEMPLATES[tplKey]) return;
  broadcastState.selectedTemplate = tplKey;
  
  // Prioritaskan custom template hasil edit yang pernah disimpan
  broadcastState.messageTemplate = getActiveTemplateText(tplKey);

  const inTpl = document.getElementById('bc-message-template');
  if (inTpl) inTpl.value = broadcastState.messageTemplate;

  updateBroadcastTemplateButtonsUI();
  updateTemplateSavedStatusBadge();
  renderBroadcastPreview();
}

function updateBroadcastTemplateButtonsUI() {
  const buttons = document.querySelectorAll('.bc-tpl-btn');
  buttons.forEach(btn => {
    const key = btn.getAttribute('data-tpl');
    if (key === broadcastState.selectedTemplate) {
      btn.className = 'bc-tpl-btn px-3 py-1.5 rounded-xl text-xs font-bold border transition bg-emerald-600 text-white border-emerald-600 shadow-xs';
    } else {
      btn.className = 'bc-tpl-btn px-3 py-1.5 rounded-xl text-xs font-semibold border transition bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
    }
  });
}

function handleBroadcastInputChange() {
  broadcastState.agenda = (document.getElementById('bc-input-agenda')?.value || '').trim();
  broadcastState.tanggal = (document.getElementById('bc-input-tanggal')?.value || '').trim();
  broadcastState.waktu = (document.getElementById('bc-input-waktu')?.value || '').trim();
  broadcastState.tempat = (document.getElementById('bc-input-tempat')?.value || '').trim();
  broadcastState.link = (document.getElementById('bc-input-link')?.value || '').trim();

  // Input identitas Ketum pengirim
  const inKetumNama = document.getElementById('bc-input-ketum-nama');
  const inKetumWa = document.getElementById('bc-input-ketum-wa');
  if (inKetumNama) broadcastState.ketumNama = inKetumNama.value.trim();
  if (inKetumWa) broadcastState.ketumWa = inKetumWa.value.trim();

  renderBroadcastPreview();
}

function handleBroadcastMessageTemplateChange() {
  const inTpl = document.getElementById('bc-message-template');
  if (inTpl) {
    broadcastState.messageTemplate = inTpl.value;
    renderBroadcastPreview();

    const badge = document.getElementById('bc-template-saved-status');
    if (badge) {
      badge.textContent = '● Ada perubahan belum disimpan';
      badge.className = 'text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 animate-pulse';
    }
  }
}

/**
 * Menyimpan editan teks template dan No. WA Ketum ke localStorage secara permanen
 */
function saveCustomBroadcastTemplate() {
  const inTpl = document.getElementById('bc-message-template');
  const inKetumNama = document.getElementById('bc-input-ketum-nama');
  const inKetumWa = document.getElementById('bc-input-ketum-wa');

  const textToSave = (inTpl?.value || '').trim();
  if (!textToSave) {
    showToast('Teks template undangan tidak boleh kosong.', 'warning');
    return;
  }

  // 1. Simpan custom template ke localStorage
  const customs = getCustomBroadcastTemplates();
  customs[broadcastState.selectedTemplate] = textToSave;
  localStorage.setItem('pmii_custom_bc_templates', JSON.stringify(customs));
  broadcastState.messageTemplate = textToSave;

  // 2. Simpan identitas Ketum pengirim ke localStorage
  if (inKetumNama) {
    broadcastState.ketumNama = inKetumNama.value.trim();
    localStorage.setItem('pmii_ketum_nama_sender', broadcastState.ketumNama);
  }
  if (inKetumWa) {
    broadcastState.ketumWa = inKetumWa.value.trim();
    localStorage.setItem('pmii_ketum_wa_sender', broadcastState.ketumWa);
  }

  updateTemplateSavedStatusBadge();
  renderBroadcastPreview();

  const tplNames = {
    rapat: 'Undangan Rapat',
    kaderisasi: 'Kaderisasi',
    harlah: 'Harlah & Doa',
    silaturahmi: 'Silaturahmi Mabinkom',
    bebas: 'Pengumuman Bebas'
  };
  const label = tplNames[broadcastState.selectedTemplate] || 'Undangan';
  showToast(`Perubahan template "${label}" & No. WA Ketum berhasil disimpan permanen!`, 'success');
}

/**
 * Mengembalikan teks template saat ini ke teks bawaan PMII
 */
function resetCurrentBroadcastTemplate() {
  const defaultText = BROADCAST_TEMPLATES[broadcastState.selectedTemplate] || BROADCAST_TEMPLATES.rapat;
  const customs = getCustomBroadcastTemplates();
  delete customs[broadcastState.selectedTemplate];
  localStorage.setItem('pmii_custom_bc_templates', JSON.stringify(customs));

  broadcastState.messageTemplate = defaultText;
  const inTpl = document.getElementById('bc-message-template');
  if (inTpl) inTpl.value = defaultText;

  updateTemplateSavedStatusBadge();
  renderBroadcastPreview();

  showToast('Template dikembalikan ke format teks bawaan resmi PMII.', 'info');
}

function insertVariableTag(tag) {
  const inTpl = document.getElementById('bc-message-template');
  if (!inTpl) return;

  const start = inTpl.selectionStart || 0;
  const end = inTpl.selectionEnd || 0;
  const text = inTpl.value;
  inTpl.value = text.substring(0, start) + tag + text.substring(end);
  inTpl.focus();
  inTpl.selectionStart = inTpl.selectionEnd = start + tag.length;

  handleBroadcastMessageTemplateChange();
}

/**
 * Generate pesan yang sudah diisi variabel untuk satu orang tertentu
 */
function generateBroadcastMessage(recipient) {
  let text = broadcastState.messageTemplate || BROADCAST_TEMPLATES.rapat;

  const namaRec = recipient?.nama || 'Sahabat/i';
  const panggilanRec = recipient?.panggilan || namaRec.split(' ')[0] || 'Sahabat';
  const jabatanRec = recipient?.jabatan || 'Kader PMII';

  let linkSection = '';
  if (broadcastState.link) {
    linkSection = `🔗 *Tautan / Link Kegiatan:* ${broadcastState.link}\n`;
  }

  const ketumName = broadcastState.ketumNama || (komisariat && komisariat.ketuaKomisariat) || 'Sahabat M. Ilham Fathoni';
  const ketumWa = broadcastState.ketumWa || (komisariat && komisariat.telepon) || '081234567801';
  const cleanKetumWa = formatIndonesianPhoneNumber(ketumWa);
  const sekumName = (komisariat && komisariat.sekretarisKomisariat) ? komisariat.sekretarisKomisariat : 'Sahabat Sekretaris Umum';
  const masaKhidmat = (komisariat && komisariat.masaKhidmat) ? komisariat.masaKhidmat : '2026 - 2027';
  const komisariatNama = (komisariat && komisariat.namaLengkap) ? komisariat.namaLengkap : (komisariat && komisariat.nama ? komisariat.nama : 'PK PMII ISMU');
  const kampusNama = (komisariat && komisariat.kampus) ? komisariat.kampus : 'INSTITUT MIFTAHUL ULUM TARATE';

  text = text.replace(/\{nama\}/g, namaRec);
  text = text.replace(/\{panggilan\}/g, panggilanRec);
  text = text.replace(/\{jabatan\}/g, jabatanRec);
  text = text.replace(/\{agenda\}/g, broadcastState.agenda || 'Agenda Kegiatan');
  text = text.replace(/\{hari_tanggal\}/g, broadcastState.tanggal || getIndonesianDateString());
  text = text.replace(/\{waktu\}/g, broadcastState.waktu || 'Waktu Menyesuaikan');
  text = text.replace(/\{tempat\}/g, broadcastState.tempat || 'Sekretariat PK PMII ISMU');
  text = text.replace(/\{link_section\}\n?/g, linkSection);
  text = text.replace(/\{link\}/g, broadcastState.link || '');
  text = text.replace(/\{ketum\}/g, ketumName);
  text = text.replace(/\{no_ketum\}/g, ketumWa);
  text = text.replace(/\{ketum_wa\}/g, ketumWa);
  text = text.replace(/\{clean_no_ketum\}/g, cleanKetumWa);
  text = text.replace(/\{link_wa_ketum\}/g, cleanKetumWa ? `https://wa.me/${cleanKetumWa}` : '');
  text = text.replace(/\{sekum\}/g, sekumName);
  text = text.replace(/\{masa_khidmat\}/g, masaKhidmat);
  text = text.replace(/\{komisariat\}/g, komisariatNama);
  text = text.replace(/\{kampus\}/g, kampusNama);
  text = text.replace(/\{tanggal_hari_ini\}/g, getIndonesianDateString());

  return text;
}

/**
 * Format teks WhatsApp ke HTML aman untuk pratinjau
 */
function formatWhatsAppMarkup(text) {
  if (!text) return '';
  let html = escapeHtml(text);

  // Bold: *teks*
  html = html.replace(/\*([^*\n]+)\*/g, '<strong class="font-extrabold text-slate-900">$1</strong>');
  // Italic: _teks_
  html = html.replace(/_([^_\n]+)_/g, '<em class="italic text-slate-700">$1</em>');
  // Strikethrough: ~teks~
  html = html.replace(/~([^~\n]+)~/g, '<del class="line-through text-slate-400">$1</del>');
  // Line break
  html = html.replace(/\n/g, '<br>');

  return html;
}

/**
 * Render Live WhatsApp Phone Preview
 */
function renderBroadcastPreview() {
  const previewBox = document.getElementById('bc-preview-bubble-content');
  const previewName = document.getElementById('bc-preview-recipient-name');
  const previewAvatar = document.getElementById('bc-preview-avatar');
  const previewTime = document.getElementById('bc-preview-time');

  // Ambil penerima pertama sebagai sampel pratinjau
  const sampleRecipient = (broadcastState.recipients && broadcastState.recipients.length > 0)
    ? broadcastState.recipients[0]
    : { nama: 'Sahabat Ahmad Fauzi', panggilan: 'Fauzi', jabatan: 'Wakil Ketua I (Kaderisasi)' };

  if (previewName) previewName.textContent = sampleRecipient.nama;
  if (previewAvatar) {
    const clean = sampleRecipient.nama.replace(/^(Sahabat|Sahabati|Dr\.|H\.)\s+/i, '').trim();
    previewAvatar.textContent = (clean.substring(0, 2) || 'SB').toUpperCase();
  }

  if (previewTime) {
    const now = new Date();
    previewTime.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  if (previewBox) {
    const rawMsg = generateBroadcastMessage(sampleRecipient);
    previewBox.innerHTML = formatWhatsAppMarkup(rawMsg);
  }
}

/**
 * Render Tabel Antrean Penerima
 */
function renderBroadcastRecipientTable() {
  const tbody = document.getElementById('bc-recipient-table-body');
  const tableCountLabel = document.getElementById('bc-table-count-label');
  if (!tbody) return;

  const q = (broadcastState.searchQuery || '').toLowerCase();
  const filtered = broadcastState.recipients.filter(r => {
    return !q || r.nama.toLowerCase().includes(q) || (r.jabatan && r.jabatan.toLowerCase().includes(q)) || (r.noHp && r.noHp.includes(q));
  });

  if (tableCountLabel) {
    tableCountLabel.textContent = `Menampilkan ${filtered.length} dari ${broadcastState.recipients.length} target (${broadcastState.recipients.filter(r => r.isValid).length} valid WhatsApp)`;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-slate-400">
          <i data-lucide="user-x" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i>
          <p class="font-bold text-xs">Tidak ada penerima yang cocok.</p>
          <p class="text-[11px] text-slate-400">Pastikan data pengurus/kader sudah diinput dan memiliki nomor WhatsApp.</p>
        </td>
      </tr>
    `;
    initLucide();
    return;
  }

  tbody.innerHTML = filtered.map((r, idx) => {
    let statusBadge = '';
    if (!r.isValid) {
      statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">No. WA Kosong</span>';
    } else if (r.status === 'sent') {
      statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 justify-center"><i data-lucide="check" class="w-3 h-3"></i><span>Terkirim</span></span>';
    } else if (r.status === 'sending') {
      statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse flex items-center gap-1 justify-center"><span>Membuka...</span></span>';
    } else {
      statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Antrean</span>';
    }

    const cleanName = r.nama.replace(/^(Sahabat|Sahabati|Dr\.|H\.)\s+/i, '').trim();
    const initials = (cleanName.substring(0, 2) || 'SB').toUpperCase();

    return `
      <tr class="hover:bg-slate-50/80 transition ${!r.isValid ? 'opacity-60 bg-slate-50/50' : ''}">
        <td class="py-3 px-3 text-center">
          <input 
            type="checkbox" 
            ${r.isSelected ? 'checked' : ''} 
            ${!r.isValid ? 'disabled' : ''} 
            onchange="toggleRecipientSelection('${r.id}', this.checked)" 
            class="rounded text-emerald-600 focus:ring-0 cursor-pointer disabled:cursor-not-allowed"
          >
        </td>
        <td class="py-3 px-3 text-center text-slate-400 font-bold text-[11px]">${idx + 1}</td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[10px] shrink-0">
              ${initials}
            </div>
            <div>
              <p class="font-extrabold text-slate-800 text-xs">${r.nama}</p>
              <p class="text-[10px] text-slate-400">${r.category || 'Anggota'}</p>
            </div>
          </div>
        </td>
        <td class="py-3 px-4">
          <span class="font-semibold text-slate-700">${r.jabatan || '-'}</span>
          ${r.fakultas ? `<p class="text-[10px] text-slate-400">${r.fakultas}</p>` : ''}
        </td>
        <td class="py-3 px-4 font-mono text-xs">
          ${r.isValid ? `
            <a href="https://wa.me/${r.cleanNoHp}" target="_blank" class="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200" title="Buka obrolan">
              <i data-lucide="phone" class="w-3 h-3 text-emerald-600"></i>
              <span>${r.noHp}</span>
            </a>
          ` : `
            <span class="text-slate-400 italic text-[11px]">${r.noHp || '(Nomor belum diinput)'}</span>
          `}
        </td>
        <td class="py-3 px-3 text-center">
          ${statusBadge}
        </td>
        <td class="py-3 px-4 text-center">
          ${r.isValid ? `
            <button 
              type="button" 
              onclick="sendIndividualBroadcast('${r.id}')" 
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition cursor-pointer"
              title="Kirim pesan langsung ke orang ini via WhatsApp"
            >
              <i data-lucide="send" class="w-3 h-3"></i>
              <span>Kirim WA</span>
            </button>
          ` : `
            <button disabled class="px-2.5 py-1 text-[11px] font-semibold text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed">
              Tidak Ada WA
            </button>
          `}
        </td>
      </tr>
    `;
  }).join('');

  initLucide();
}

function handleBroadcastSearch(val) {
  broadcastState.searchQuery = val || '';
  renderBroadcastRecipientTable();
}

function toggleRecipientSelection(id, checked) {
  const item = broadcastState.recipients.find(r => r.id === id);
  if (item && item.isValid) {
    item.isSelected = checked;
  }
  updateBroadcastStats();
}

function toggleSelectAllRecipients(selectAll) {
  const q = (broadcastState.searchQuery || '').toLowerCase();
  broadcastState.recipients.forEach(r => {
    if (r.isValid) {
      if (!q || r.nama.toLowerCase().includes(q) || (r.noHp && r.noHp.includes(q))) {
        r.isSelected = selectAll;
      }
    }
  });

  const checkAllEl = document.getElementById('bc-check-all');
  if (checkAllEl) checkAllEl.checked = selectAll;

  renderBroadcastRecipientTable();
  updateBroadcastStats();
}

function updateBroadcastStats() {
  const total = broadcastState.recipients.length;
  const valid = broadcastState.recipients.filter(r => r.isValid).length;
  const invalid = total - valid;
  const selectedValid = broadcastState.recipients.filter(r => r.isValid && r.isSelected);
  const sent = selectedValid.filter(r => r.status === 'sent').length;
  const totalToSend = selectedValid.length;
  const remaining = totalToSend - sent;
  const pct = totalToSend > 0 ? Math.round((sent / totalToSend) * 100) : 0;

  const statTotal = document.getElementById('bc-stat-total');
  const statValid = document.getElementById('bc-stat-valid');
  const statInvalidLabel = document.getElementById('bc-stat-invalid-label');
  const statSent = document.getElementById('bc-stat-sent');
  const statRemaining = document.getElementById('bc-stat-remaining-label');
  const statPct = document.getElementById('bc-stat-pct');
  const statBar = document.getElementById('bc-stat-progress-bar');

  if (statTotal) statTotal.textContent = `${total} Orang`;
  if (statValid) statValid.textContent = `${valid} Nomor`;
  if (statInvalidLabel) statInvalidLabel.textContent = `${invalid} tanpa nomor WA`;
  if (statSent) statSent.textContent = `${sent} / ${totalToSend}`;
  if (statRemaining) statRemaining.textContent = `${remaining} tersisa`;
  if (statPct) statPct.textContent = `${pct}%`;
  if (statBar) statBar.style.width = `${pct}%`;
}

/**
 * Kirim pesan WhatsApp individual (1-klik per orang)
 */
function sendIndividualBroadcast(recipientId) {
  const recipient = broadcastState.recipients.find(r => r.id === recipientId);
  if (!recipient || !recipient.isValid) {
    showToast('Nomor WhatsApp penerima tidak valid atau kosong.', 'error');
    return;
  }

  const message = generateBroadcastMessage(recipient);
  const waUrl = `https://api.whatsapp.com/send?phone=${recipient.cleanNoHp}&text=${encodeURIComponent(message)}`;

  // Buka WhatsApp di jendela/tab baru
  window.open(waUrl, '_blank');

  // Tandai sudah terkirim / dibuka
  recipient.status = 'sent';
  renderBroadcastRecipientTable();
  updateBroadcastStats();

  showToast(`Chat WhatsApp dibuka untuk ${recipient.nama}!`, 'success');
}

/**
 * Auto-Runner: Mengirim ke antrean secara otomatis berurutan dengan jeda aman
 */
function startAutoBroadcastRunner() {
  const runner = broadcastState.runner;

  const delaySelect = document.getElementById('bc-delay-seconds');
  runner.delaySeconds = parseInt(delaySelect?.value || '4', 10);

  // Ambil penerima yang terpilih dan belum terkirim
  const pending = broadcastState.recipients.filter(r => r.isValid && r.isSelected && r.status !== 'sent');

  if (pending.length === 0) {
    showToast('Seluruh penerima terpilih sudah terkirim atau tidak ada nomor valid yang dipilih.', 'info');
    return;
  }

  runner.isRunning = true;
  runner.isPaused = false;
  updateRunnerUI('running');

  showToast(`Memulai Auto-Blast WhatsApp (${pending.length} antrean, jeda ${runner.delaySeconds} detik)...`, 'info');

  processNextInBroadcastQueue();
}

function processNextInBroadcastQueue() {
  const runner = broadcastState.runner;
  if (!runner.isRunning || runner.isPaused) return;

  // Cari item berikutnya yang siap kirim
  const nextItem = broadcastState.recipients.find(r => r.isValid && r.isSelected && r.status !== 'sent');

  if (!nextItem) {
    // Selesai seluruh antrean!
    stopAutoBroadcastRunner();
    showToast('Alhamdulillah! Seluruh antrean undangan WhatsApp selesai dikirim!', 'success');
    return;
  }

  // Tandai sedang dibuka
  nextItem.status = 'sending';
  renderBroadcastRecipientTable();
  updateBroadcastStats();

  const runnerStatusEl = document.getElementById('bc-stat-runner-status');
  if (runnerStatusEl) {
    runnerStatusEl.textContent = `Membuka chat: ${nextItem.nama}...`;
  }

  const message = generateBroadcastMessage(nextItem);
  const waUrl = `https://api.whatsapp.com/send?phone=${nextItem.cleanNoHp}&text=${encodeURIComponent(message)}`;

  // Buka WhatsApp Web / App
  window.open(waUrl, '_blank');

  // Setelah jendela dibuka, ubah status ke 'sent'
  nextItem.status = 'sent';
  renderBroadcastRecipientTable();
  updateBroadcastStats();

  // Jadwalkan item berikutnya setelah jeda detik
  runner.timerId = setTimeout(() => {
    processNextInBroadcastQueue();
  }, runner.delaySeconds * 1000);
}

function pauseAutoBroadcastRunner() {
  const runner = broadcastState.runner;
  if (!runner.isRunning) return;

  runner.isPaused = true;
  if (runner.timerId) clearTimeout(runner.timerId);

  updateRunnerUI('paused');
  showToast('Pengiriman otomatis dijeda.', 'info');
}

function stopAutoBroadcastRunner() {
  const runner = broadcastState.runner;
  runner.isRunning = false;
  runner.isPaused = false;
  if (runner.timerId) clearTimeout(runner.timerId);

  // Kembalikan item yang berstatus 'sending' ke 'idle'
  broadcastState.recipients.forEach(r => {
    if (r.status === 'sending') r.status = 'idle';
  });

  updateRunnerUI('stopped');
  renderBroadcastRecipientTable();
  updateBroadcastStats();
}

function updateRunnerUI(state) {
  const btnStart = document.getElementById('btn-bc-start');
  const btnStartLabel = document.getElementById('btn-bc-start-label');
  const btnPause = document.getElementById('btn-bc-pause');
  const btnStop = document.getElementById('btn-bc-stop');
  const runnerBadge = document.getElementById('bc-runner-badge');
  const runnerStatus = document.getElementById('bc-stat-runner-status');

  if (state === 'running') {
    if (btnStart) {
      btnStart.disabled = true;
      btnStart.className = 'w-full py-3 px-4 rounded-xl text-xs font-black text-white bg-slate-400 opacity-60 cursor-not-allowed flex items-center justify-center gap-2';
      if (btnStartLabel) btnStartLabel.textContent = 'Auto-Blast Sedang Berjalan...';
    }
    if (btnPause) {
      btnPause.disabled = false;
      btnPause.className = 'py-2 px-3 rounded-xl text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition flex items-center justify-center gap-1.5 cursor-pointer';
    }
    if (btnStop) {
      btnStop.disabled = false;
      btnStop.className = 'py-2 px-3 rounded-xl text-xs font-bold text-rose-800 bg-rose-100 hover:bg-rose-200 border border-rose-300 transition flex items-center justify-center gap-1.5 cursor-pointer';
    }
    if (runnerBadge) {
      runnerBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 animate-pulse';
      runnerBadge.textContent = '● Berjalan Otomatis';
    }
  } else if (state === 'paused') {
    if (btnStart) {
      btnStart.disabled = false;
      btnStart.className = 'w-full py-3 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 shadow-md transition flex items-center justify-center gap-2 cursor-pointer';
      if (btnStartLabel) btnStartLabel.textContent = 'Lanjutkan Auto-Blast';
    }
    if (btnPause) {
      btnPause.disabled = true;
      btnPause.className = 'py-2 px-3 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 opacity-50 cursor-not-allowed flex items-center justify-center gap-1.5';
    }
    if (runnerBadge) {
      runnerBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800';
      runnerBadge.textContent = '❚❚ Dijeda';
    }
    if (runnerStatus) runnerStatus.textContent = 'Antrean dijeda oleh pengguna';
  } else {
    // stopped / idle
    if (btnStart) {
      btnStart.disabled = false;
      btnStart.className = 'w-full py-3 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer';
      if (btnStartLabel) btnStartLabel.textContent = 'Mulai Kirim Otomatis (Auto-Blast)';
    }
    if (btnPause) {
      btnPause.disabled = true;
      btnPause.className = 'py-2 px-3 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 opacity-50 cursor-not-allowed flex items-center justify-center gap-1.5';
    }
    if (btnStop) {
      btnStop.disabled = true;
      btnStop.className = 'py-2 px-3 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 opacity-50 cursor-not-allowed flex items-center justify-center gap-1.5';
    }
    if (runnerBadge) {
      runnerBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600';
      runnerBadge.textContent = 'Standby';
    }
    if (runnerStatus) runnerStatus.textContent = 'Antrean standby';
  }
}

/**
 * Reset antrean kirim kembali ke status 'idle'
 */
function resetBroadcastQueue() {
  if (broadcastState.runner.isRunning) {
    stopAutoBroadcastRunner();
  }

  broadcastState.recipients.forEach(r => {
    r.status = r.isValid ? 'idle' : 'invalid';
  });

  renderBroadcastRecipientTable();
  updateBroadcastStats();
  showToast('Status antrean WhatsApp berhasil di-reset.', 'info');
}

/**
 * Salin teks pesan undangan yang aktif
 */
function copyBroadcastMessageText() {
  const sample = (broadcastState.recipients && broadcastState.recipients[0]) || { nama: 'Sahabat/i', panggilan: 'Sahabat', jabatan: 'Pengurus' };
  const text = generateBroadcastMessage(sample);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Teks pesan undangan berhasil disalin ke clipboard!', 'success');
    }).catch(() => {
      copyFallbackText(text);
      showToast('Teks pesan undangan berhasil disalin!', 'success');
    });
  } else {
    copyFallbackText(text);
    showToast('Teks pesan undangan berhasil disalin!', 'success');
  }
}

/**
 * Salin seluruh nomor telepon yang valid dalam format koma
 */
function copyAllBroadcastNumbers() {
  const validList = broadcastState.recipients.filter(r => r.isValid && r.isSelected);
  if (validList.length === 0) {
    showToast('Tidak ada nomor WhatsApp yang valid terpilih.', 'warning');
    return;
  }

  const numbers = validList.map(r => r.cleanNoHp).join(', ');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(numbers).then(() => {
      showToast(`${validList.length} nomor WhatsApp berhasil disalin ke clipboard!`, 'success');
    }).catch(() => {
      copyFallbackText(numbers);
      showToast(`${validList.length} nomor WhatsApp berhasil disalin!`, 'success');
    });
  } else {
    copyFallbackText(numbers);
    showToast(`${validList.length} nomor WhatsApp berhasil disalin!`, 'success');
  }
}

/**
 * Uji kirim ke nomor penguji / nomor sendiri
 */
function testSendToSelf() {
  const defaultNo = broadcastState.ketumWa || '081234567801';
  const sampleMsg = generateBroadcastMessage({
    nama: 'Sahabat Pengurus (Uji Coba)',
    panggilan: 'Sahabat',
    jabatan: 'Ketua Umum'
  });

  const promptNumber = prompt('Kirim pesan uji coba ke Nomor WhatsApp Ketum:', defaultNo);
  if (!promptNumber) return;

  const cleanNo = formatIndonesianPhoneNumber(promptNumber);
  if (cleanNo.length < 10) {
    showToast('Format nomor WhatsApp tidak valid.', 'error');
    return;
  }

  const waUrl = `https://api.whatsapp.com/send?phone=${cleanNo}&text=${encodeURIComponent(sampleMsg)}`;
  window.open(waUrl, '_blank');
  showToast(`Membuka WhatsApp untuk nomor uji coba (${cleanNo})...`, 'info');
}

/**
 * Membuka studio broadcast secara instan dari agenda rapat tertentu
 */
function openBroadcastForRapat(rapatId = null) {
  let targetMeeting = null;

  if (rapatId) {
    targetMeeting = (rapat || []).find(r => r.id === rapatId);
  } else if (rapat && rapat.length > 0) {
    targetMeeting = rapat[0];
  }

  // Set target ke pengurus aktif
  broadcastState.target = 'pengurus';
  broadcastState.selectedTemplate = 'rapat';

  if (targetMeeting) {
    broadcastState.agenda = targetMeeting.agenda || 'Rapat Pengurus Komisariat';
    broadcastState.tanggal = targetMeeting.tanggal || getIndonesianDateString();
    broadcastState.waktu = targetMeeting.waktu || '19.30 WIB - Selesai';
    broadcastState.tempat = targetMeeting.tempat || 'Sekretariat PK PMII ISMU';
  }

  // Muat ulang template rapat
  broadcastState.messageTemplate = BROADCAST_TEMPLATES.rapat;

  // Buka tab broadcast
  switchTab('broadcast');
  showToast(`Agenda "${broadcastState.agenda}" berhasil dimuat ke Broadcast WA Pengurus!`, 'success');
}

// ==========================================
// 7. MODUL PEMASUKAN KAS (KHUSUS KAS MASUK)
// ==========================================
function renderPemasukanSection() {
  renderPemasukanTable();
}

function filterPemasukanData() {
  return pemasukan.filter(item => {
    const matchSearch = !searchPemasukanQuery ||
      (item.keterangan && item.keterangan.toLowerCase().includes(searchPemasukanQuery.toLowerCase())) ||
      (item.diterimaDari && item.diterimaDari.toLowerCase().includes(searchPemasukanQuery.toLowerCase())) ||
      (item.pic && item.pic.toLowerCase().includes(searchPemasukanQuery.toLowerCase())) ||
      (item.bukti && item.bukti.toLowerCase().includes(searchPemasukanQuery.toLowerCase()));

    const matchKategori = filterPemasukanKategori === 'all' || item.kategori === filterPemasukanKategori;

    let matchPeriode = true;
    if (filterPemasukanPeriode !== 'all') {
      const currentYear = new Date().getFullYear();
      const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
      if (filterPemasukanPeriode === 'this_month') {
        matchPeriode = item.tanggal && item.tanggal.startsWith(`${currentYear}-${currentMonth}`);
      } else if (filterPemasukanPeriode === 'this_year') {
        matchPeriode = item.tanggal && item.tanggal.startsWith(`${currentYear}`);
      }
    }

    return matchSearch && matchKategori && matchPeriode;
  });
}

function renderPemasukanTable() {
  const tbody = document.getElementById('pemasukan-table-body');
  const counter = document.getElementById('pemasukan-filtered-count');
  if (!tbody) return;

  const filtered = filterPemasukanData();
  if (counter) counter.textContent = `Menampilkan ${filtered.length} dari ${pemasukan.length} catatan kas masuk`;

  // Update Stat Cards Pemasukan
  const totalNominal = pemasukan.reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);
  const statTotal = document.getElementById('pemasukan-stat-total');
  if (statTotal) statTotal.textContent = formatRupiah(totalNominal);

  const currentYearMonth = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;
  const bulanIniNominal = pemasukan
    .filter(p => p.tanggal && p.tanggal.startsWith(currentYearMonth))
    .reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);
  const statBulanIni = document.getElementById('pemasukan-stat-bulan');
  if (statBulanIni) statBulanIni.textContent = formatRupiah(bulanIniNominal);

  const statFreq = document.getElementById('pemasukan-stat-count');
  if (statFreq) statFreq.textContent = `${pemasukan.length} Transaksi`;

  // Update Acuan Kebutuhan Anggaran di Modul Pemasukan Kas
  const totalAnggaran = (anggaran || []).reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);
  const sisaKebutuhan = Math.max(0, totalAnggaran - totalNominal);
  const pctTerkumpul = totalAnggaran > 0 ? Math.min(100, Math.round((totalNominal / totalAnggaran) * 100)) : 100;

  const elAcuanTotal = document.getElementById('pemasukan-acuan-anggaran-total');
  const elAcuanMasuk = document.getElementById('pemasukan-acuan-masuk-total');
  const elAcuanSisa = document.getElementById('pemasukan-acuan-sisa');
  const elAcuanBar = document.getElementById('pemasukan-acuan-bar');
  const elAcuanPct = document.getElementById('pemasukan-acuan-pct');

  if (elAcuanTotal) elAcuanTotal.textContent = formatRupiah(totalAnggaran);
  if (elAcuanMasuk) elAcuanMasuk.textContent = formatRupiah(totalNominal);
  if (elAcuanSisa) elAcuanSisa.textContent = formatRupiah(sisaKebutuhan);
  if (elAcuanBar) elAcuanBar.style.width = `${pctTerkumpul}%`;
  if (elAcuanPct) elAcuanPct.textContent = `${pctTerkumpul}% Terkumpul`;

  // Acuan Target Anggaran per Pos di Modul Pemasukan
  const agrPlt = (anggaran || []).filter(a => a.pos === 'Pelantikan').reduce((a, b) => a + (Number(b.jumlah) || 0), 0);
  const agrPkd = (anggaran || []).filter(a => a.pos === 'PKD').reduce((a, b) => a + (Number(b.jumlah) || 0), 0);
  const agrMpb = (anggaran || []).filter(a => a.pos === 'MAPABA').reduce((a, b) => a + (Number(b.jumlah) || 0), 0);
  const agrLain = (anggaran || []).filter(a => a.pos === 'Lain-lain').reduce((a, b) => a + (Number(b.jumlah) || 0), 0);

  const elAcuanPlt = document.getElementById('pemasukan-acuan-pelantikan');
  const elAcuanPkd = document.getElementById('pemasukan-acuan-pkd');
  const elAcuanMpb = document.getElementById('pemasukan-acuan-mapaba');
  const elAcuanLain = document.getElementById('pemasukan-acuan-lain');

  if (elAcuanPlt) elAcuanPlt.textContent = formatRupiah(agrPlt);
  if (elAcuanPkd) elAcuanPkd.textContent = formatRupiah(agrPkd);
  if (elAcuanMpb) elAcuanMpb.textContent = formatRupiah(agrMpb);
  if (elAcuanLain) elAcuanLain.textContent = formatRupiah(agrLain);

  // Update Footer Total
  const footerTotal = document.getElementById('pemasukan-footer-total');
  const filteredTotal = filtered.reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);
  if (footerTotal) footerTotal.textContent = formatRupiah(filteredTotal);

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="p-8 text-center text-slate-400">
          <i data-lucide="arrow-down-left" class="w-8 h-8 mx-auto mb-2 text-emerald-300"></i>
          <p class="font-semibold text-xs">Belum ada catatan kas masuk yang sesuai filter.</p>
        </td>
      </tr>
    `;
    initLucide();
    return;
  }

  tbody.innerHTML = filtered.map((item, idx) => {
    return `
      <tr class="hover:bg-emerald-50/40 transition text-xs border-b border-slate-100">
        <td class="py-3 px-4 text-center text-slate-400 font-mono">${idx + 1}</td>
        <td class="py-3 px-4 whitespace-nowrap">
          <span class="font-bold text-slate-800 block">${item.tanggal || '-'}</span>
          <span class="text-[11px] font-mono text-slate-400">${item.bukti || '-'}</span>
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            ${item.kategori || 'Pemasukan Kas'}
          </span>
        </td>
        <td class="py-3 px-4">
          <span class="font-medium text-slate-800 block">${item.keterangan || '-'}</span>
          <span class="text-[11px] text-slate-500">Dari: ${item.diterimaDari || item.pic || '-'}</span>
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          <span class="text-slate-600 block text-[11px]">${item.pic || 'Bendahara'}</span>
        </td>
        <td class="py-3 px-4 text-right whitespace-nowrap">
          <span class="font-black text-emerald-600 font-mono text-xs">+ ${formatRupiah(item.jumlah)}</span>
        </td>
        <td class="py-3 px-4 text-right whitespace-nowrap">
          <div class="inline-flex items-center gap-1">
            <button onclick="viewPemasukanDetail('${item.id}')" title="Kwitansi Kas Masuk" class="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition">
              <i data-lucide="file-text" class="w-4 h-4"></i>
            </button>
            <button onclick="openEditPemasukanModal('${item.id}')" title="Edit" class="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
              <i data-lucide="edit-3" class="w-4 h-4"></i>
            </button>
            <button onclick="deletePemasukan('${item.id}')" title="Hapus" class="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  initLucide();
}

function handleSearchPemasukan(val) {
  searchPemasukanQuery = val;
  renderPemasukanTable();
}

function handleFilterPemasukanKategori(val) {
  filterPemasukanKategori = val;
  renderPemasukanTable();
}

function handleFilterPemasukanPeriode(val) {
  filterPemasukanPeriode = val;
  renderPemasukanTable();
}

function resetPemasukanFilter() {
  searchPemasukanQuery = '';
  filterPemasukanKategori = 'all';
  filterPemasukanPeriode = 'all';

  const sInput = document.getElementById('search-pemasukan-input');
  const fKat = document.getElementById('filter-pemasukan-kategori');
  const fPer = document.getElementById('filter-pemasukan-periode');

  if (sInput) sInput.value = '';
  if (fKat) fKat.value = 'all';
  if (fPer) fPer.value = 'all';

  renderPemasukanTable();
  showToast('Filter pemasukan kas di-reset.', 'info');
}

function handlePemasukanNominalInput(val) {
  const num = parseInt(val) || 0;
  const preview = document.getElementById('pemasukan-jumlah-preview');
  if (preview) {
    preview.textContent = num > 0 ? `${formatRupiah(num)} (${terbilang(num)} rupiah)` : '';
  }
}

// Modal Pemasukan Handlers
function openAddPemasukanModal() {
  const form = document.getElementById('form-pemasukan');
  if (form) form.reset();

  document.getElementById('modal-pemasukan-title').textContent = 'Catat Pemasukan Kas';
  document.getElementById('pemasukan-id').value = '';
  document.getElementById('pemasukan-tanggal').value = new Date().toISOString().split('T')[0];
  document.getElementById('pemasukan-jumlah-preview').textContent = '';

  const modal = document.getElementById('modal-pemasukan');
  if (modal) modal.classList.remove('hidden');
}

function openEditPemasukanModal(id) {
  const item = pemasukan.find(p => p.id === id);
  if (!item) return;

  document.getElementById('modal-pemasukan-title').textContent = 'Edit Data Pemasukan Kas';
  document.getElementById('pemasukan-id').value = item.id;
  document.getElementById('pemasukan-tanggal').value = item.tanggal || '';
  document.getElementById('pemasukan-kategori').value = item.kategori || 'Iuran Kas Anggota';
  document.getElementById('pemasukan-jumlah').value = item.jumlah || '';
  handlePemasukanNominalInput(item.jumlah);
  document.getElementById('pemasukan-keterangan').value = item.keterangan || '';
  document.getElementById('pemasukan-diterima-dari').value = item.diterimaDari || item.pic || '';
  document.getElementById('pemasukan-pic').value = item.pic || '';
  document.getElementById('pemasukan-bukti').value = item.bukti || '';

  const modal = document.getElementById('modal-pemasukan');
  if (modal) modal.classList.remove('hidden');
}

function closePemasukanModal() {
  const modal = document.getElementById('modal-pemasukan');
  if (modal) modal.classList.add('hidden');
}

function savePemasukanForm(event) {
  event.preventDefault();

  const id = document.getElementById('pemasukan-id').value;
  const isEdit = !!id;

  const data = {
    id: id || `MSK-${Date.now().toString().slice(-6)}`,
    tanggal: document.getElementById('pemasukan-tanggal').value,
    kategori: document.getElementById('pemasukan-kategori').value,
    jumlah: parseInt(document.getElementById('pemasukan-jumlah').value) || 0,
    keterangan: document.getElementById('pemasukan-keterangan').value.trim(),
    diterimaDari: document.getElementById('pemasukan-diterima-dari').value.trim(),
    pic: document.getElementById('pemasukan-pic').value.trim() || 'Bendahara Komisariat',
    bukti: document.getElementById('pemasukan-bukti').value.trim() || `KM-${Date.now().toString().slice(-4)}`
  };

  if (isEdit) {
    const idx = pemasukan.findIndex(p => p.id === id);
    if (idx !== -1) pemasukan[idx] = data;
    showToast('Catatan pemasukan berhasil diperbarui!', 'success');
  } else {
    pemasukan.unshift(data);
    showToast('Pemasukan kas berhasil dicatat!', 'success');
  }

  saveData();
  closePemasukanModal();
  renderPemasukanSection();
}

function deletePemasukan(id) {
  const item = (pemasukan || []).find(p => p.id === id);
  if (!item) return;

  showConfirmModal({
    title: 'Hapus Catatan Kas Masuk',
    message: `Apakah Anda yakin ingin menghapus catatan kas masuk sebesar <strong>${formatRupiah(item.jumlah)}</strong> ("${escapeHtml(item.keterangan)}")?<br><span class="text-rose-500 font-bold text-xs mt-1 block">Tindakan ini akan menghapus catatan kas masuk ini secara permanen dari Cloud Neon.</span>`,
    confirmText: 'Ya, Hapus Kas',
    cancelText: 'Batal',
    type: 'danger',
    icon: 'trash-2',
    onConfirm: async () => {
      // Direct deletion from Cloud Neon
      if (typeof executeNeonSql === 'function') {
        try {
          await executeNeonSql(`DELETE FROM tb_pemasukan WHERE id = ${sqlEscape(id)};`);
        } catch (e) {
          console.warn('[NEON] Direct delete pemasukan gagal:', e.message);
        }
      }

      pemasukan = (pemasukan || []).filter(p => p.id !== id);
      saveData();
      showToast('Catatan pemasukan kas berhasil dihapus permanen.', 'info');
      renderPemasukanSection();
      renderDashboard();
      renderLaporanSection();
    }
  });
}

function viewPemasukanDetail(id) {
  const item = pemasukan.find(p => p.id === id);
  if (!item) return;

  currentPemasukanDetail = item;

  document.getElementById('kwitansi-pemasukan-kampus').textContent = `${komisariat.kampus || 'Universitas'} • ${komisariat.nama || 'Komisariat'}`;
  document.getElementById('kwitansi-pemasukan-id').textContent = item.id;
  document.getElementById('kwitansi-pemasukan-bukti').textContent = item.bukti || '-';
  document.getElementById('kwitansi-pemasukan-tanggal').textContent = item.tanggal || '-';
  document.getElementById('kwitansi-pemasukan-dari').textContent = item.diterimaDari || item.pic || '-';
  document.getElementById('kwitansi-pemasukan-kategori').textContent = item.kategori || 'Kas Masuk';
  document.getElementById('kwitansi-pemasukan-uraian').textContent = item.keterangan || '-';
  document.getElementById('kwitansi-pemasukan-terbilang').textContent = `# ${terbilang(item.jumlah)} rupiah #`;
  document.getElementById('kwitansi-pemasukan-jumlah').textContent = formatRupiah(item.jumlah);
  document.getElementById('kwitansi-pemasukan-titimangsa').textContent = `Sumenep, ${item.tanggal || '-'}`;
  document.getElementById('kwitansi-pemasukan-signer').textContent = komisariat.bendaharaKomisariat || 'Bendahara Komisariat';

  const modal = document.getElementById('modal-detail-pemasukan');
  if (modal) modal.classList.remove('hidden');
}

function closePemasukanDetailModal() {
  const modal = document.getElementById('modal-detail-pemasukan');
  if (modal) modal.classList.add('hidden');
}

function deletePemasukanFromDetail() {
  if (!currentPemasukanDetail || !currentPemasukanDetail.id) return;
  const targetId = currentPemasukanDetail.id;
  closePemasukanDetailModal();
  deletePemasukan(targetId);
}

function printKwitansiPemasukan() {
  window.print();
}

// --- Excel: Pemasukan (Template, Import, Export) ---
function downloadPemasukanTemplate() {
  if (typeof XLSX === 'undefined') {
    showToast('Library Excel belum siap.', 'error');
    return;
  }

  const sampleData = [
    {
      "Tanggal": "2024-10-01",
      "Kategori Pemasukan": "Iuran Kas Anggota",
      "Nominal": 1500000,
      "Uraian / Keterangan": "Iuran kas wajib seluruh kader bulan Oktober 2024",
      "Diterima Dari": "Seluruh Kader Komisariat",
      "Penerima / PIC": "Sahabati Siti (Bendahara)",
      "No Bukti": "KM-2024-001"
    },
    {
      "Tanggal": "2024-10-05",
      "Kategori Pemasukan": "Bantuan / Sumbangan Mabinkom",
      "Nominal": 2000000,
      "Uraian / Keterangan": "Bantuan pembinaan dan operasional dari Dewan Mabinkom",
      "Diterima Dari": "Dr. H. M. Zainul Muttaqin",
      "Penerima / PIC": "Sahabat Ilham (Ketua)",
      "No Bukti": "KM-2024-002"
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template Pemasukan");
  XLSX.writeFile(wb, "Template_Import_Pemasukan_Kas.xlsx");
  showToast('Template Excel Pemasukan Kas berhasil diunduh!', 'success');
}

function handleImportPemasukanFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (typeof XLSX === 'undefined') {
    showToast('Library Excel belum siap.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      if (!rows || rows.length === 0) {
        showToast('File Excel kosong atau format tidak sesuai.', 'warning');
        return;
      }

      let countSuccess = 0;
      rows.forEach((row, i) => {
        const nominal = parseInt(row['Nominal'] || row['Jumlah'] || row['nominal'] || 0);
        const keterangan = row['Uraian / Keterangan'] || row['Keterangan'] || row['Uraian'] || row['keterangan'];
        if (!keterangan || nominal <= 0) return;

        let tanggalVal = row['Tanggal'] || row['tanggal'] || new Date().toISOString().split('T')[0];
        if (typeof tanggalVal === 'number') {
          const dateObj = new Date(Math.round((tanggalVal - 25569) * 86400 * 1000));
          tanggalVal = dateObj.toISOString().split('T')[0];
        }

        const newPemasukan = {
          id: `MSK-${Date.now().toString().slice(-6)}-${i}`,
          tanggal: String(tanggalVal),
          kategori: String(row['Kategori Pemasukan'] || row['Kategori'] || 'Iuran Kas Anggota').trim(),
          jumlah: nominal,
          keterangan: String(keterangan).trim(),
          diterimaDari: String(row['Diterima Dari'] || row['Sumber Dana'] || '-').trim(),
          pic: String(row['Penerima / PIC'] || row['Penerima'] || 'Bendahara').trim(),
          bukti: String(row['No Bukti'] || row['Bukti'] || `KM-${Date.now().toString().slice(-4)}`).trim()
        };

        pemasukan.unshift(newPemasukan);
        countSuccess++;
      });

      if (countSuccess > 0) {
        saveData();
        renderPemasukanSection();
        showToast(`Berhasil mengimpor ${countSuccess} catatan kas masuk dari Excel!`, 'success');
      } else {
        showToast('Tidak ada data pemasukan valid untuk diimpor.', 'warning');
      }
    } catch (err) {
      console.error('Import pemasukan error:', err);
      showToast('Gagal memproses file Excel: ' + err.message, 'error');
    }

    event.target.value = '';
  };

  reader.readAsArrayBuffer(file);
}

function exportPemasukanExcel() {
  if (typeof XLSX === 'undefined') {
    showToast('Library Excel belum siap.', 'error');
    return;
  }

  const exportRows = pemasukan.map((item, index) => ({
    "No": index + 1,
    "No Bukti": item.bukti || '-',
    "Tanggal": item.tanggal || '-',
    "Kategori Pemasukan": item.kategori || 'Pemasukan Kas',
    "Uraian / Keterangan": item.keterangan || '-',
    "Diterima Dari": item.diterimaDari || '-',
    "Penerima / PIC": item.pic || '-',
    "Nominal Pemasukan (Rp)": item.jumlah || 0
  }));

  const ws = XLSX.utils.json_to_sheet(exportRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pemasukan Kas");
  XLSX.writeFile(wb, `Pemasukan_Kas_PMII_${(komisariat.nama || 'Komisariat').replace(/\s+/g, '_')}.xlsx`);
  showToast('Daftar pemasukan kas berhasil diexport ke Excel!', 'success');
}

// ==========================================
// 8. MODUL PENGELUARAN KAS
// Pos Terpisah & Mandiri: Pelantikan, PKD, MAPABA, Lain-lain
// ==========================================

function togglePengeluaranNav(forceOpen = null) {
  const wrapper = document.getElementById('subnav-pengeluaran-wrapper');
  const chevron = document.getElementById('pengeluaran-nav-chevron');
  if (!wrapper) return;

  const isHidden = wrapper.classList.contains('hidden');
  const shouldOpen = forceOpen !== null ? forceOpen : isHidden;

  if (shouldOpen) {
    wrapper.classList.remove('hidden');
    if (chevron) chevron.classList.add('rotate-180');
    if (currentTab !== 'pengeluaran') {
      switchTab('pengeluaran');
    }
  } else {
    wrapper.classList.add('hidden');
    if (chevron) chevron.classList.remove('rotate-180');
  }
}

function switchPengeluaranPosFilter(pos) {
  const validPos = ['Pelantikan', 'PKD', 'MAPABA', 'Lain-lain'];
  if (!pos || !validPos.includes(pos)) {
    pos = 'Pelantikan';
  }
  filterPengeluaranPos = pos;
  togglePengeluaranNav(true);
  if (currentTab !== 'pengeluaran') {
    switchTab('pengeluaran');
  } else {
    renderPengeluaranSection();
  }
}

function renderPengeluaranSection() {
  populateTahunKhidmatSelects();
  updatePengeluaranPosTabs();
  renderPengeluaranPosBanner();
  renderPengeluaranTable();
  initLucide();
}

function updatePengeluaranPills() {
  updatePengeluaranPosTabs();
}

function setPengeluaranPosFilter(pos) {
  switchPengeluaranPosFilter(pos);
}

function resetPengeluaranFilter() {
  searchPengeluaranQuery = '';
  const sInput = document.getElementById('search-pengeluaran-input');
  if (sInput) sInput.value = '';
  renderPengeluaranTable();
  showToast('Pencarian pengeluaran di-reset.', 'info');
}

function matchPengeluaranPos(itemPos, targetPos) {
  if (!itemPos || !targetPos) return false;
  const i = itemPos.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
  const t = targetPos.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (t === 'lainlain' || t === 'lain') {
    return i === 'lainlain' || i === 'lain' || i === 'operasional';
  }
  return i === t || i.includes(t) || t.includes(i);
}

function updatePengeluaranPosTabs() {
  const targetYear = selectedPengeluaranTahunKhidmat || currentTahunKhidmat;
  const posConfigs = [
    { name: 'Pelantikan', btnId: 'btn-tab-peng-pelantikan', badgeId: 'tab-peng-badge-pelantikan', countId: 'tab-peng-count-pelantikan', subBtnId: 'btn-subnav-peng-pelantikan', subBadgeId: 'subnav-peng-badge-pelantikan' },
    { name: 'PKD', btnId: 'btn-tab-peng-pkd', badgeId: 'tab-peng-badge-pkd', countId: 'tab-peng-count-pkd', subBtnId: 'btn-subnav-peng-pkd', subBadgeId: 'subnav-peng-badge-pkd' },
    { name: 'MAPABA', btnId: 'btn-tab-peng-mapaba', badgeId: 'tab-peng-badge-mapaba', countId: 'tab-peng-count-mapaba', subBtnId: 'btn-subnav-peng-mapaba', subBadgeId: 'subnav-peng-badge-mapaba' },
    { name: 'Lain-lain', btnId: 'btn-tab-peng-lain', badgeId: 'tab-peng-badge-lain', countId: 'tab-peng-count-lain', subBtnId: 'btn-subnav-peng-lain', subBadgeId: 'subnav-peng-badge-lain' }
  ];

  posConfigs.forEach(cfg => {
    const items = (pengeluaran || []).filter(p => matchPengeluaranPos(p.pos, cfg.name) && isItemMatchTahunKhidmat(p, targetYear));
    const total = items.reduce((sum, item) => sum + (Number(item.jumlah) || 0), 0);
    const count = items.length;

    // 1. Update Tab Badge & Count
    const tabBadge = document.getElementById(cfg.badgeId);
    const tabCount = document.getElementById(cfg.countId);
    if (tabBadge) tabBadge.textContent = formatRupiah(total);
    if (tabCount) tabCount.textContent = `${count} Transaksi Belanja`;

    // 2. Update Sidebar Subnav Item Count Badge
    const subBadge = document.getElementById(cfg.subBadgeId);
    if (subBadge) subBadge.textContent = count;

    const isActive = (filterPengeluaranPos || 'Pelantikan').toLowerCase() === cfg.name.toLowerCase();

    // 3. Style Pos Switcher Button
    const tabBtn = document.getElementById(cfg.btnId);
    if (tabBtn) {
      const pTitle = tabBtn.querySelector('p.text-xs');
      if (isActive) {
        tabBtn.className = 'p-3.5 rounded-2xl border-2 border-rose-600 bg-rose-950 text-white transition text-left flex flex-col justify-between shadow-md transform -translate-y-0.5';
        if (pTitle) pTitle.className = 'text-xs font-black text-rose-300';
        if (tabCount) tabCount.className = 'text-[10px] text-rose-200 font-medium';
        if (tabBadge) tabBadge.className = 'text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500 text-white shadow-xs';
      } else {
        tabBtn.className = 'p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition text-left flex flex-col justify-between shadow-xs hover:border-slate-300';
        if (pTitle) pTitle.className = 'text-xs font-black text-slate-800';
        if (tabCount) tabCount.className = 'text-[10px] text-slate-500 font-medium';
        if (tabBadge) tabBadge.className = 'text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700';
      }
    }

    // 4. Style Sidebar Subnav Button
    const subBtn = document.getElementById(cfg.subBtnId);
    if (subBtn) {
      if (isActive && currentTab === 'pengeluaran') {
        subBtn.className = 'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-rose-900 bg-rose-100 transition text-left border-l-2 border-rose-700';
        if (subBadge) subBadge.className = 'text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-rose-200 text-rose-900';
      } else {
        subBtn.className = 'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-500 hover:text-rose-700 hover:bg-rose-50/80 transition text-left';
        if (subBadge) subBadge.className = 'text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500';
      }
    }
  });
}

function renderPengeluaranPosBanner() {
  const currentPos = filterPengeluaranPos || 'Pelantikan';
  const targetYear = selectedPengeluaranTahunKhidmat || currentTahunKhidmat;

  // 1. Plafon RAB untuk pos ini di tahun ini
  const posAnggaran = (anggaran || []).filter(a => (a.pos || '').toLowerCase() === currentPos.toLowerCase() && isItemMatchTahunKhidmat(a, targetYear));
  const plafonRab = posAnggaran.reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);

  // 2. Realisasi Pengeluaran kas untuk pos ini di tahun ini
  const posPengeluaran = (pengeluaran || []).filter(p => matchPengeluaranPos(p.pos, currentPos) && isItemMatchTahunKhidmat(p, targetYear));
  const totalRealisasi = posPengeluaran.reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);

  // 3. Sisa Pagu Anggaran
  const sisaPagu = Math.max(0, plafonRab - totalRealisasi);
  const pctSerapan = plafonRab > 0 ? Math.min(100, Math.round((totalRealisasi / plafonRab) * 100)) : (totalRealisasi > 0 ? 100 : 0);

  const elCalcTitle = document.getElementById('peng-calc-title');
  const elCalcSubtitle = document.getElementById('peng-calc-subtitle');
  const elTargetRab = document.getElementById('peng-pos-target-rab');
  const elTotalRealisasi = document.getElementById('peng-pos-total-realisasi');
  const elTransCount = document.getElementById('peng-pos-trans-count');
  const elSisaPagu = document.getElementById('peng-pos-sisa-pagu');
  const elSisaDesc = document.getElementById('peng-pos-sisa-desc');
  const elBar = document.getElementById('peng-pos-bar');
  const elBarPctText = document.getElementById('peng-pos-bar-pct-text');
  const elTableTitle = document.getElementById('pengeluaran-table-title');
  const elBtnTambah = document.getElementById('pengeluaran-btn-tambah-text');
  const elBtnExport = document.getElementById('pengeluaran-btn-export-text');

  if (elCalcTitle) elCalcTitle.textContent = `Kalkulasi Realisasi Belanja Pos ${currentPos}`;
  if (elCalcSubtitle) elCalcSubtitle.textContent = `Perhitungan belanja kas dipotong mandiri dan terpisah untuk kegiatan ${currentPos} (${targetYear})`;
  if (elTargetRab) elTargetRab.textContent = formatRupiah(plafonRab);
  if (elTotalRealisasi) elTotalRealisasi.textContent = formatRupiah(totalRealisasi);
  if (elTransCount) elTransCount.textContent = `${posPengeluaran.length} Transaksi Belanja`;
  if (elSisaPagu) elSisaPagu.textContent = formatRupiah(sisaPagu);
  if (elSisaDesc) {
    elSisaDesc.textContent = totalRealisasi > plafonRab && plafonRab > 0
      ? `Melebihi alokasi RAB sebesar ${formatRupiah(totalRealisasi - plafonRab)}`
      : 'Sisa pagu yang belum terpakai';
  }
  if (elBar) elBar.style.width = `${pctSerapan}%`;
  if (elBarPctText) elBarPctText.textContent = `${pctSerapan}% Terserap (${formatRupiah(totalRealisasi)} / ${formatRupiah(plafonRab)})`;
  if (elTableTitle) elTableTitle.textContent = `Buku Pengeluaran: Pos ${currentPos} (${targetYear})`;
  if (elBtnTambah) elBtnTambah.textContent = `+ Catat Pengeluaran ${currentPos}`;
  if (elBtnExport) elBtnExport.textContent = `Export Excel ${currentPos}`;
}

function filterPengeluaranData() {
  const currentPos = filterPengeluaranPos || 'Pelantikan';
  const targetYear = selectedPengeluaranTahunKhidmat || currentTahunKhidmat;
  return pengeluaran.filter(item => {
    const matchYear = isItemMatchTahunKhidmat(item, targetYear);
    const matchPos = matchPengeluaranPos(item.pos, currentPos);
    const matchSearch = !searchPengeluaranQuery ||
      (item.keterangan && item.keterangan.toLowerCase().includes(searchPengeluaranQuery.toLowerCase())) ||
      (item.pic && item.pic.toLowerCase().includes(searchPengeluaranQuery.toLowerCase())) ||
      (item.bukti && item.bukti.toLowerCase().includes(searchPengeluaranQuery.toLowerCase())) ||
      (item.kategori && item.kategori.toLowerCase().includes(searchPengeluaranQuery.toLowerCase()));

    return matchYear && matchPos && matchSearch;
  });
}

function renderPengeluaranTable() {
  const tbody = document.getElementById('pengeluaran-table-body');
  const footerLabel = document.getElementById('pengeluaran-pos-footer-label');
  const footerTotal = document.getElementById('pengeluaran-footer-total');
  if (!tbody) return;

  const currentPos = filterPengeluaranPos || 'Pelantikan';
  const filtered = filterPengeluaranData();
  const sumFiltered = filtered.reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);

  if (footerLabel) footerLabel.textContent = `Total Pengeluaran ${currentPos}:`;
  if (footerTotal) footerTotal.textContent = formatRupiah(sumFiltered);

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="p-8 text-center text-slate-400">
          <i data-lucide="arrow-up-right" class="w-8 h-8 mx-auto mb-2 text-rose-300"></i>
          <p class="font-semibold text-xs">Belum ada catatan pengeluaran belanja untuk <strong>Pos ${currentPos}</strong>.</p>
        </td>
      </tr>
    `;
    initLucide();
    return;
  }

  const badgeMap = {
    'Pelantikan': 'bg-blue-100 text-blue-800 border-blue-200',
    'PKD': 'bg-amber-100 text-amber-800 border-amber-200',
    'MAPABA': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Lain-lain': 'bg-purple-100 text-purple-800 border-purple-200'
  };

  tbody.innerHTML = filtered.map((item, idx) => {
    const badgeColor = badgeMap[item.pos] || 'bg-slate-100 text-slate-700 border-slate-200';
    return `
      <tr class="hover:bg-rose-50/40 transition text-xs border-b border-slate-100">
        <td class="py-3 px-4 text-center text-slate-400 font-mono">${idx + 1}</td>
        <td class="py-3 px-4 whitespace-nowrap">
          <span class="font-bold text-slate-800 block">${item.tanggal || '-'}</span>
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          <span class="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">${item.bukti || '-'}</span>
        </td>
        <td class="py-3 px-4 whitespace-nowrap text-center">
          <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${badgeColor}">
            ${item.pos}
          </span>
          <span class="block text-[11px] text-slate-500 mt-0.5">${item.kategori || '-'}</span>
        </td>
        <td class="py-3 px-4">
          <span class="font-bold text-slate-800 block text-xs">${item.keterangan || '-'}</span>
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          <span class="text-slate-600 block text-[11px] font-medium">${item.pic || '-'}</span>
        </td>
        <td class="py-3 px-4 text-right whitespace-nowrap">
          <span class="font-black text-rose-600 font-mono text-xs">- ${formatRupiah(item.jumlah)}</span>
        </td>
        <td class="py-3 px-4 text-center whitespace-nowrap">
          <div class="inline-flex items-center gap-1 justify-center">
            <button onclick="viewPengeluaranDetail('${item.id}')" title="Bukti Kas Keluar" class="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition">
              <i data-lucide="file-text" class="w-4 h-4"></i>
            </button>
            <button onclick="openEditPengeluaranModal('${item.id}')" title="Edit" class="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
              <i data-lucide="edit-3" class="w-4 h-4"></i>
            </button>
            <button onclick="deletePengeluaran('${item.id}')" title="Hapus" class="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  initLucide();
}

function handleSearchPengeluaran(val) {
  searchPengeluaranQuery = (val || '').trim();
  renderPengeluaranTable();
}

function handlePengeluaranNominalInput(val) {
  const num = parseInt(val) || 0;
  const preview = document.getElementById('pengeluaran-jumlah-preview');
  if (preview) {
    preview.textContent = num > 0 ? `${formatRupiah(num)} (${terbilang(num)} rupiah)` : '';
  }
}

// Modal Pengeluaran Handlers
function openAddPengeluaranModal(defaultPos = null) {
  const form = document.getElementById('form-pengeluaran');
  if (form) form.reset();

  const currentPos = defaultPos || filterPengeluaranPos || 'Pelantikan';
  document.getElementById('modal-pengeluaran-title').textContent = `Catat Pengeluaran Kas (Pos ${currentPos})`;
  document.getElementById('pengeluaran-id').value = '';
  document.getElementById('pengeluaran-tanggal').value = new Date().toISOString().split('T')[0];
  document.getElementById('pengeluaran-jumlah-preview').textContent = '';

  document.getElementById('pengeluaran-pos').value = currentPos;
  const radio = document.querySelector(`input[name="radio-pengeluaran-pos"][value="${currentPos}"]`);
  if (radio) radio.checked = true;

  const modal = document.getElementById('modal-pengeluaran');
  if (modal) modal.classList.remove('hidden');
  initLucide();
}

function openEditPengeluaranModal(id) {
  const item = pengeluaran.find(p => p.id === id);
  if (!item) return;

  document.getElementById('modal-pengeluaran-title').textContent = `Edit Pengeluaran Kas (Pos ${item.pos})`;
  document.getElementById('pengeluaran-id').value = item.id;

  const posVal = item.pos || 'Pelantikan';
  document.getElementById('pengeluaran-pos').value = posVal;
  const radio = document.querySelector(`input[name="radio-pengeluaran-pos"][value="${posVal}"]`);
  if (radio) radio.checked = true;

  document.getElementById('pengeluaran-tanggal').value = item.tanggal || '';
  document.getElementById('pengeluaran-kategori').value = item.kategori || 'Konsumsi & Logistik';
  document.getElementById('pengeluaran-jumlah').value = item.jumlah || '';
  handlePengeluaranNominalInput(item.jumlah);
  document.getElementById('pengeluaran-keterangan').value = item.keterangan || '';
  document.getElementById('pengeluaran-pic').value = item.pic || '';
  document.getElementById('pengeluaran-bukti').value = item.bukti || '';

  const modal = document.getElementById('modal-pengeluaran');
  if (modal) modal.classList.remove('hidden');
  initLucide();
}

function closePengeluaranModal() {
  const modal = document.getElementById('modal-pengeluaran');
  if (modal) modal.classList.add('hidden');
}

function savePengeluaranForm(event) {
  if (event) event.preventDefault();

  const id = document.getElementById('pengeluaran-id').value;
  const isEdit = !!id;
  const pos = document.getElementById('pengeluaran-pos').value || 'Pelantikan';
  const tahunKhidmat = document.getElementById('pengeluaran-tahun-khidmat')?.value || selectedPengeluaranTahunKhidmat || currentTahunKhidmat;

  const data = {
    id: id || `KLR-${Date.now().toString().slice(-6)}`,
    pos: pos,
    tahunKhidmat: tahunKhidmat,
    tanggal: document.getElementById('pengeluaran-tanggal').value,
    kategori: document.getElementById('pengeluaran-kategori').value,
    jumlah: parseInt(document.getElementById('pengeluaran-jumlah').value) || 0,
    keterangan: document.getElementById('pengeluaran-keterangan').value.trim(),
    pic: document.getElementById('pengeluaran-pic').value.trim() || 'Panitia / Sie',
    bukti: document.getElementById('pengeluaran-bukti').value.trim() || `KK-${Date.now().toString().slice(-4)}`
  };

  if (isEdit) {
    const idx = pengeluaran.findIndex(p => p.id === id);
    if (idx !== -1) pengeluaran[idx] = data;
    showToast(`Catatan pengeluaran Pos ${pos} berhasil diperbarui!`, 'success');
  } else {
    pengeluaran.unshift(data);
    showToast(`Pengeluaran Pos ${pos} berhasil dicatat!`, 'success');
  }

  if (pos && pos !== filterPengeluaranPos) {
    filterPengeluaranPos = pos;
  }

  saveData();
  closePengeluaranModal();
  renderPengeluaranSection();
  renderDashboard();
  renderLaporanSection();
  renderAnggaranSection();
}

function deletePengeluaran(id) {
  const item = (pengeluaran || []).find(p => p.id === id);
  if (!item) return;

  showConfirmModal({
    title: 'Hapus Catatan Kas Keluar',
    message: `Apakah Anda yakin ingin menghapus catatan kas keluar pos <strong>${item.pos}</strong> sebesar <strong>${formatRupiah(item.jumlah)}</strong> ("${escapeHtml(item.keterangan)}")?<br><span class="text-rose-500 font-bold text-xs mt-1 block">Tindakan ini akan menghapus catatan kas keluar ini secara permanen dari Cloud Neon.</span>`,
    confirmText: 'Ya, Hapus Kas',
    cancelText: 'Batal',
    type: 'danger',
    icon: 'trash-2',
    onConfirm: async () => {
      // Direct deletion from Cloud Neon
      if (typeof executeNeonSql === 'function') {
        try {
          await executeNeonSql(`DELETE FROM tb_pengeluaran WHERE id = ${sqlEscape(id)};`);
        } catch (e) {
          console.warn('[NEON] Direct delete pengeluaran gagal:', e.message);
        }
      }

      pengeluaran = (pengeluaran || []).filter(p => p.id !== id);
      saveData();
      showToast('Catatan pengeluaran kas berhasil dihapus permanen.', 'info');
      renderPengeluaranSection();
      renderDashboard();
      renderLaporanSection();
      renderAnggaranSection();
    }
  });
}

function viewPengeluaranDetail(id) {
  const item = pengeluaran.find(p => p.id === id);
  if (!item) return;

  currentPengeluaranDetail = item;

  document.getElementById('kwitansi-pengeluaran-kampus').textContent = `${komisariat.kampus || 'Universitas'} • ${komisariat.nama || 'Komisariat'}`;
  document.getElementById('kwitansi-pengeluaran-id').textContent = item.id;
  document.getElementById('kwitansi-pengeluaran-pos-badge').textContent = `Kas Keluar • ${item.pos || 'Lain-lain'}`;
  document.getElementById('kwitansi-pengeluaran-pos').textContent = `POS ANGGARAN: ${item.pos || 'Lain-lain'}`;
  document.getElementById('kwitansi-pengeluaran-bukti').textContent = item.bukti || '-';
  document.getElementById('kwitansi-pengeluaran-tanggal').textContent = item.tanggal || '-';
  document.getElementById('kwitansi-pengeluaran-pic').textContent = item.pic || '-';
  document.getElementById('kwitansi-pengeluaran-kategori').textContent = item.kategori || 'Pengeluaran';
  document.getElementById('kwitansi-pengeluaran-uraian').textContent = item.keterangan || '-';
  document.getElementById('kwitansi-pengeluaran-terbilang').textContent = `# ${terbilang(item.jumlah)} rupiah #`;
  document.getElementById('kwitansi-pengeluaran-jumlah').textContent = formatRupiah(item.jumlah);
  document.getElementById('kwitansi-pengeluaran-titimangsa').textContent = `Sumenep, ${item.tanggal || '-'}`;
  document.getElementById('kwitansi-pengeluaran-signer').textContent = komisariat.bendaharaKomisariat || 'Bendahara Komisariat';

  const modal = document.getElementById('modal-detail-pengeluaran');
  if (modal) modal.classList.remove('hidden');
  initLucide();
}

function closePengeluaranDetailModal() {
  const modal = document.getElementById('modal-detail-pengeluaran');
  if (modal) modal.classList.add('hidden');
}

function deletePengeluaranFromDetail() {
  if (!currentPengeluaranDetail || !currentPengeluaranDetail.id) return;
  const targetId = currentPengeluaranDetail.id;
  closePengeluaranDetailModal();
  deletePengeluaran(targetId);
}

function printKwitansiPengeluaran() {
  window.print();
}

// --- Excel: Pengeluaran (Template, Import, Export) ---
function downloadPengeluaranTemplate() {
  if (typeof XLSX === 'undefined') {
    showToast('Library Excel belum siap.', 'error');
    return;
  }

  const sampleData = [
    {
      "Pos Anggaran (Pelantikan/PKD/MAPABA/Lain-lain)": "Pelantikan",
      "Tanggal": "2026-02-14",
      "Kategori Pengeluaran": "Sewa Tempat / Sound / Akomodasi",
      "Nominal": 2500000,
      "Uraian / Keterangan": "Sewa aula gedung pertemuan & sound pelantikan",
      "Penanggung Jawab / PIC": "Sahabat Rizky (Sie Acara)",
      "No Bukti": "NOTA-PLT-01"
    },
    {
      "Pos Anggaran (Pelantikan/PKD/MAPABA/Lain-lain)": "MAPABA",
      "Tanggal": "2024-09-25",
      "Kategori Pengeluaran": "Sewa Tempat / Sound / Akomodasi",
      "Nominal": 1800000,
      "Uraian / Keterangan": "Sewa aula dan sound system pembukaan Mapaba",
      "Penanggung Jawab / PIC": "Sahabat Rizky (Sie Acara)",
      "No Bukti": "NOTA-MAPABA-01"
    },
    {
      "Pos Anggaran (Pelantikan/PKD/MAPABA/Lain-lain)": "PKD",
      "Tanggal": "2024-10-10",
      "Kategori Pengeluaran": "Honor Pemateri & Narasumber",
      "Nominal": 1200000,
      "Uraian / Keterangan": "Honor narasumber materi Aswaja dan Ke-PMII-an PKD",
      "Penanggung Jawab / PIC": "Sahabati Maya (Steering Committee)",
      "No Bukti": "NOTA-PKD-02"
    },
    {
      "Pos Anggaran (Pelantikan/PKD/MAPABA/Lain-lain)": "Lain-lain",
      "Tanggal": "2024-10-15",
      "Kategori Pengeluaran": "Kesekretariatan & ATK",
      "Nominal": 350000,
      "Uraian / Keterangan": "Pembelian kertas HVS, tinta printer & map komisariat",
      "Penanggung Jawab / PIC": "Sahabat Faruq (Sekretaris)",
      "No Bukti": "NOTA-ATK-05"
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template Pengeluaran");
  XLSX.writeFile(wb, "Template_Import_Pengeluaran_Kas.xlsx");
  showToast('Template Excel Pengeluaran (Pelantikan/PKD/MAPABA/Lain-lain) berhasil diunduh!', 'success');
}

function handleImportPengeluaranFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (typeof XLSX === 'undefined') {
    showToast('Library Excel belum siap.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      if (!rows || rows.length === 0) {
        showToast('File Excel kosong atau format tidak sesuai.', 'warning');
        return;
      }

      let countSuccess = 0;
      rows.forEach((row, i) => {
        const nominal = parseInt(row['Nominal'] || row['Jumlah'] || row['nominal'] || 0);
        const keterangan = row['Uraian / Keterangan'] || row['Keterangan'] || row['Uraian'] || row['keterangan'];
        if (!keterangan || nominal <= 0) return;

        let posRaw = (row['Pos Anggaran (Pelantikan/PKD/MAPABA/Lain-lain)'] || row['Pos Anggaran'] || row['Pos'] || row['pos'] || 'Lain-lain').toString().trim();
        if (posRaw.toLowerCase().includes('pelantikan')) posRaw = 'Pelantikan';
        else if (posRaw.toLowerCase().includes('pkd')) posRaw = 'PKD';
        else if (posRaw.toLowerCase().includes('mapaba')) posRaw = 'MAPABA';
        else posRaw = 'Lain-lain';

        let tanggalVal = row['Tanggal'] || row['tanggal'] || new Date().toISOString().split('T')[0];
        if (typeof tanggalVal === 'number') {
          const dateObj = new Date(Math.round((tanggalVal - 25569) * 86400 * 1000));
          tanggalVal = dateObj.toISOString().split('T')[0];
        }

        const newPengeluaran = {
          id: `KLR-${Date.now().toString().slice(-6)}-${i}`,
          pos: posRaw,
          tahunKhidmat: selectedPengeluaranTahunKhidmat || currentTahunKhidmat,
          tanggal: String(tanggalVal),
          kategori: String(row['Kategori Pengeluaran'] || row['Kategori'] || 'Pengeluaran').trim(),
          jumlah: nominal,
          keterangan: String(keterangan).trim(),
          pic: String(row['Penanggung Jawab / PIC'] || row['PIC'] || 'Sie Terkait').trim(),
          bukti: String(row['No Bukti'] || row['Bukti'] || `KK-${Date.now().toString().slice(-4)}`).trim()
        };

        pengeluaran.unshift(newPengeluaran);
        countSuccess++;
      });

      if (countSuccess > 0) {
        saveData();
        renderPengeluaranSection();
        showToast(`Berhasil mengimpor ${countSuccess} catatan pengeluaran dari Excel!`, 'success');
      } else {
        showToast('Tidak ada data pengeluaran valid untuk diimpor.', 'warning');
      }
    } catch (err) {
      console.error('Import pengeluaran error:', err);
      showToast('Gagal memproses file Excel: ' + err.message, 'error');
    }

    event.target.value = '';
  };

  reader.readAsArrayBuffer(file);
}

function exportPengeluaranExcel() {
  if (typeof XLSX === 'undefined') {
    showToast('Library Excel belum siap.', 'error');
    return;
  }

  const currentPos = filterPengeluaranPos || 'Pelantikan';
  const filtered = filterPengeluaranData();
  if (filtered.length === 0) {
    showToast(`Tidak ada data pengeluaran untuk Pos ${currentPos} yang dapat diexport.`, 'warning');
    return;
  }

  const exportRows = filtered.map((item, index) => ({
    "No": index + 1,
    "Pos Anggaran": item.pos,
    "No Bukti / Nota": item.bukti || '-',
    "Tanggal": item.tanggal || '-',
    "Kategori Pengeluaran": item.kategori || 'Pengeluaran',
    "Uraian / Keterangan": item.keterangan || '-',
    "Penanggung Jawab / PIC": item.pic || '-',
    "Nominal Pengeluaran (Rp)": item.jumlah || 0
  }));

  const ws = XLSX.utils.json_to_sheet(exportRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Pengeluaran ${currentPos}`);
  XLSX.writeFile(wb, `Pengeluaran_${currentPos.replace(/\s+/g, '_')}_PMII_ISMU_${new Date().toISOString().split('T')[0]}.xlsx`);
  showToast(`Daftar pengeluaran Pos ${currentPos} berhasil diexport ke Excel!`, 'success');
}

// ==========================================
// 8.B MODUL RENCANA ANGGARAN BIAYA (ANGGARAN / RAB)
// Pos Terpisah & Mandiri: Pelantikan, PKD, MAPABA, Lain-lain
// ==========================================

function toggleAnggaranNav(forceOpen = null) {
  const wrapper = document.getElementById('subnav-anggaran-wrapper');
  const chevron = document.getElementById('anggaran-nav-chevron');
  if (!wrapper) return;

  const isHidden = wrapper.classList.contains('hidden');
  const shouldOpen = forceOpen !== null ? forceOpen : isHidden;

  if (shouldOpen) {
    wrapper.classList.remove('hidden');
    if (chevron) chevron.classList.add('rotate-180');
    if (currentTab !== 'anggaran') {
      switchTab('anggaran');
    }
  } else {
    wrapper.classList.add('hidden');
    if (chevron) chevron.classList.remove('rotate-180');
  }
}

function switchAnggaranPosFilter(pos) {
  const validPos = ['Pelantikan', 'PKD', 'MAPABA', 'Lain-lain'];
  if (!pos || !validPos.includes(pos)) {
    pos = 'Pelantikan';
  }
  filterAnggaranPos = pos;
  toggleAnggaranNav(true);
  if (currentTab !== 'anggaran') {
    switchTab('anggaran');
  } else {
    renderAnggaranSection();
  }
}

function renderAnggaranSection() {
  populateTahunKhidmatSelects();
  updateAnggaranPosTabs();
  renderAnggaranPosBanner();
  renderAnggaranTable();
  initLucide();
}

// Alias untuk kompatibilitas fungsi lama
function updateAnggaranPosPills() {
  updateAnggaranPosTabs();
}

function updateAnggaranPosTabs() {
  const targetYear = selectedAnggaranTahunKhidmat || currentTahunKhidmat;
  const posConfigs = [
    { name: 'Pelantikan', btnId: 'btn-tab-pos-pelantikan', badgeId: 'tab-badge-pelantikan', countId: 'tab-count-pelantikan', subBtnId: 'btn-subnav-anggaran-pelantikan', subBadgeId: 'subnav-badge-pelantikan' },
    { name: 'PKD', btnId: 'btn-tab-pos-pkd', badgeId: 'tab-badge-pkd', countId: 'tab-count-pkd', subBtnId: 'btn-subnav-anggaran-pkd', subBadgeId: 'subnav-badge-pkd' },
    { name: 'MAPABA', btnId: 'btn-tab-pos-mapaba', badgeId: 'tab-badge-mapaba', countId: 'tab-count-mapaba', subBtnId: 'btn-subnav-anggaran-mapaba', subBadgeId: 'subnav-badge-mapaba' },
    { name: 'Lain-lain', btnId: 'btn-tab-pos-lain', badgeId: 'tab-badge-lain', countId: 'tab-count-lain', subBtnId: 'btn-subnav-anggaran-lain', subBadgeId: 'subnav-badge-lain' }
  ];

  posConfigs.forEach(cfg => {
    const items = (anggaran || []).filter(a => (a.pos || '').toLowerCase() === cfg.name.toLowerCase() && isItemMatchTahunKhidmat(a, targetYear));
    const total = items.reduce((sum, item) => sum + (Number(item.jumlah) || 0), 0);
    const count = items.length;

    // 1. Update Tab Badge & Count
    const tabBadge = document.getElementById(cfg.badgeId);
    const tabCount = document.getElementById(cfg.countId);
    if (tabBadge) tabBadge.textContent = formatRupiah(total);
    if (tabCount) tabCount.textContent = `${count} Item Kebutuhan`;

    // 2. Update Sidebar Subnav Item Count Badge
    const subBadge = document.getElementById(cfg.subBadgeId);
    if (subBadge) subBadge.textContent = count;

    const isActive = (filterAnggaranPos || 'Pelantikan').toLowerCase() === cfg.name.toLowerCase();

    // 3. Style Pos Switcher Button
    const tabBtn = document.getElementById(cfg.btnId);
    if (tabBtn) {
      const pTitle = tabBtn.querySelector('p.text-xs');
      if (isActive) {
        tabBtn.className = 'p-3.5 rounded-2xl border-2 border-blue-600 bg-blue-900 text-white transition text-left flex flex-col justify-between shadow-md transform -translate-y-0.5';
        if (pTitle) pTitle.className = 'text-xs font-black text-yellow-300';
        if (tabCount) tabCount.className = 'text-[10px] text-blue-200 font-medium';
        if (tabBadge) tabBadge.className = 'text-[10px] font-black px-2 py-0.5 rounded-full bg-yellow-400 text-blue-950 shadow-xs';
      } else {
        tabBtn.className = 'p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition text-left flex flex-col justify-between shadow-xs hover:border-slate-300';
        if (pTitle) pTitle.className = 'text-xs font-black text-slate-800';
        if (tabCount) tabCount.className = 'text-[10px] text-slate-500 font-medium';
        if (tabBadge) tabBadge.className = 'text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700';
      }
    }

    // 4. Style Sidebar Subnav Button
    const subBtn = document.getElementById(cfg.subBtnId);
    if (subBtn) {
      if (isActive && currentTab === 'anggaran') {
        subBtn.className = 'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-blue-900 bg-blue-100 transition text-left border-l-2 border-blue-700';
        if (subBadge) subBadge.className = 'text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-200 text-blue-900';
      } else {
        subBtn.className = 'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-500 hover:text-blue-700 hover:bg-blue-50/80 transition text-left';
        if (subBadge) subBadge.className = 'text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500';
      }
    }
  });
}

function renderAnggaranPosBanner() {
  const currentPos = filterAnggaranPos || 'Pelantikan';
  const targetYear = selectedAnggaranTahunKhidmat || currentTahunKhidmat;

  const metaPos = {
    'Pelantikan': {
      badge: 'Pos Anggaran Pelantikan',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
      title: 'Rencana Anggaran: Pelantikan Pengurus & Harlah',
      subtitle: 'Pencatatan rincian target kebutuhan belanja khusus kegiatan Pelantikan Pengurus PK PMII ISMU',
      addText: '+ Tambah Anggaran Pelantikan',
      exportText: 'Export Excel Pelantikan'
    },
    'PKD': {
      badge: 'Pos Anggaran PKD',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      title: 'Rencana Anggaran: Pelatihan Kader Dasar (PKD)',
      subtitle: 'Pencatatan target kebutuhan belanja khusus kaderisasi formal tingkat kedua (PKD)',
      addText: '+ Tambah Anggaran PKD',
      exportText: 'Export Excel PKD'
    },
    'MAPABA': {
      badge: 'Pos Anggaran MAPABA',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      title: 'Rencana Anggaran: Masa Penerimaan Anggota Baru (MAPABA)',
      subtitle: 'Pencatatan target kebutuhan belanja kaderisasi formal pertama (MAPABA)',
      addText: '+ Tambah Anggaran MAPABA',
      exportText: 'Export Excel MAPABA'
    },
    'Lain-lain': {
      badge: 'Pos Anggaran Lain-lain',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
      title: 'Rencana Anggaran: Pos Lain-lain & Operasional Komisariat',
      subtitle: 'Pencatatan target kebutuhan belanja kesekretariatan, ATK, konsolidasi, dan syiar komisariat',
      addText: '+ Tambah Anggaran Lain-lain',
      exportText: 'Export Excel Lain-lain'
    }
  };

  const meta = metaPos[currentPos] || metaPos['Pelantikan'];

  // 1. Action Button Text
  const elAddText = document.getElementById('anggaran-btn-tambah-text');
  const elExportText = document.getElementById('anggaran-btn-export-text');

  if (elAddText) elAddText.textContent = meta.addText;
  if (elExportText) elExportText.textContent = meta.exportText;

  // 2. Banner Kalkulasi Kebutuhan Dana KHUSUS Pos Ini di Tahun Terpilih
  const posItems = (anggaran || []).filter(a => (a.pos || '').toLowerCase() === currentPos.toLowerCase() && isItemMatchTahunKhidmat(a, targetYear));
  const posTotal = posItems.reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);

  // Realisasi belanja kas untuk pos ini di tahun terpilih
  let posRealisasi = 0;
  if (currentPos.toLowerCase() === 'pelantikan') {
    posRealisasi = (pengeluaran || []).filter(p => 
      matchPengeluaranPos(p.pos, 'Pelantikan') && isItemMatchTahunKhidmat(p, targetYear)
    ).reduce((a, b) => a + (Number(b.jumlah) || 0), 0);
  } else if (currentPos.toLowerCase() === 'pkd') {
    posRealisasi = (pengeluaran || []).filter(p => matchPengeluaranPos(p.pos, 'PKD') && isItemMatchTahunKhidmat(p, targetYear)).reduce((a, b) => a + (Number(b.jumlah) || 0), 0);
  } else if (currentPos.toLowerCase() === 'mapaba') {
    posRealisasi = (pengeluaran || []).filter(p => matchPengeluaranPos(p.pos, 'MAPABA') && isItemMatchTahunKhidmat(p, targetYear)).reduce((a, b) => a + (Number(b.jumlah) || 0), 0);
  } else {
    posRealisasi = (pengeluaran || []).filter(p => matchPengeluaranPos(p.pos, 'Lain-lain') && isItemMatchTahunKhidmat(p, targetYear)).reduce((a, b) => a + (Number(b.jumlah) || 0), 0);
  }

  const posSisa = Math.max(0, posTotal - posRealisasi);
  const posPct = posTotal > 0 ? Math.min(100, Math.round((posRealisasi / posTotal) * 100)) : 0;

  const elCalcTitle = document.getElementById('anggaran-calc-title');
  const elCalcSubtitle = document.getElementById('anggaran-calc-subtitle');
  const elTotalKebutuhan = document.getElementById('anggaran-pos-total-kebutuhan');
  const elItemCount = document.getElementById('anggaran-pos-item-count');
  const elRealisasi = document.getElementById('anggaran-pos-realisasi');
  const elSisa = document.getElementById('anggaran-pos-sisa');
  const elPct = document.getElementById('anggaran-pos-pct');
  const elBar = document.getElementById('anggaran-pos-bar');
  const elBarPctText = document.getElementById('anggaran-bar-pct-text');
  const elTableTitle = document.getElementById('anggaran-table-title');

  if (elCalcTitle) elCalcTitle.textContent = `Kalkulasi Kebutuhan Anggaran Pos ${currentPos}`;
  if (elCalcSubtitle) elCalcSubtitle.textContent = `Target dana belanja khusus ${currentPos} (${targetYear}) dihitung mandiri terpisah`;
  if (elTotalKebutuhan) elTotalKebutuhan.textContent = formatRupiah(posTotal);
  if (elItemCount) elItemCount.textContent = `${posItems.length} Item Belanja Terdata`;
  if (elRealisasi) elRealisasi.textContent = formatRupiah(posRealisasi);
  if (elSisa) elSisa.textContent = formatRupiah(posSisa);
  if (elPct) elPct.textContent = `${posPct}% Belanja Terpenuhi`;
  if (elBar) elBar.style.width = `${posPct}%`;
  if (elBarPctText) elBarPctText.textContent = `${posPct}% Terealisasi (${formatRupiah(posRealisasi)} / ${formatRupiah(posTotal)})`;
  if (elTableTitle) elTableTitle.textContent = `Daftar Rincian Kebutuhan Anggaran ${currentPos} (${targetYear})`;
}

function filterAnggaranData() {
  const currentPos = filterAnggaranPos || 'Pelantikan';
  const targetYear = selectedAnggaranTahunKhidmat || currentTahunKhidmat;
  return (anggaran || []).filter(item => {
    const matchYear = isItemMatchTahunKhidmat(item, targetYear);
    const matchPos = (item.pos || '').toLowerCase() === currentPos.toLowerCase();
    const matchSearch = !searchAnggaranQuery ||
      (item.nama && item.nama.toLowerCase().includes(searchAnggaranQuery.toLowerCase())) ||
      (item.kegiatan && item.kegiatan.toLowerCase().includes(searchAnggaranQuery.toLowerCase())) ||
      (item.keterangan && item.keterangan.toLowerCase().includes(searchAnggaranQuery.toLowerCase()));

    return matchYear && matchPos && matchSearch;
  });
}

function renderAnggaranTable() {
  const tbody = document.getElementById('anggaran-table-body');
  const footerLabel = document.getElementById('anggaran-pos-footer-label');
  const footerTotal = document.getElementById('anggaran-footer-total');
  if (!tbody) return;

  const currentPos = filterAnggaranPos || 'Pelantikan';
  const data = filterAnggaranData();
  const sumFiltered = data.reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);

  if (footerLabel) {
    footerLabel.textContent = `Total Anggaran ${currentPos}:`;
  }
  if (footerTotal) {
    footerTotal.textContent = formatRupiah(sumFiltered);
  }

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-12 text-slate-400 text-xs">
          <i data-lucide="target" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i>
          Tidak ada data kebutuhan anggaran untuk <strong>Pos ${currentPos}</strong>.
        </td>
      </tr>
    `;
    initLucide();
    return;
  }

  const badgeMap = {
    'Pelantikan': 'bg-blue-100 text-blue-800 border-blue-200',
    'PKD': 'bg-amber-100 text-amber-800 border-amber-200',
    'MAPABA': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Lain-lain': 'bg-purple-100 text-purple-800 border-purple-200'
  };

  const statusMap = {
    'Menunggu Kas': 'bg-slate-100 text-slate-700 border-slate-200',
    'Proses Pendanaan': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Terpenuhi': 'bg-emerald-100 text-emerald-800 border-emerald-200'
  };

  tbody.innerHTML = data.map((item, idx) => {
    const badgeClass = badgeMap[item.pos] || 'bg-slate-100 text-slate-700 border-slate-200';
    const statusClass = statusMap[item.status] || 'bg-slate-100 text-slate-700 border-slate-200';
    return `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100">
        <td class="py-3 px-4 text-xs font-semibold text-slate-500 text-center">${idx + 1}</td>
        <td class="py-3 px-4 text-xs font-bold">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${badgeClass}">
            ${item.pos}
          </span>
        </td>
        <td class="py-3 px-4">
          <div class="font-extrabold text-slate-800 text-xs">${item.nama}</div>
          <div class="text-[11px] text-slate-400 mt-0.5">${item.kegiatan || '-'}</div>
          ${item.keterangan ? `<div class="text-[10px] text-slate-500 mt-0.5 italic line-clamp-1">${item.keterangan}</div>` : ''}
        </td>
        <td class="py-3 px-4 text-xs text-slate-600 whitespace-nowrap">
          <div class="flex items-center gap-1.5 font-semibold">
            <i data-lucide="calendar" class="w-3.5 h-3.5 text-slate-400"></i>
            <span>${item.tanggalTarget || '-'}</span>
          </div>
        </td>
        <td class="py-3 px-4 text-right">
          <span class="text-xs font-black text-slate-900">${formatRupiah(item.jumlah)}</span>
        </td>
        <td class="py-3 px-4 text-center">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusClass}">
            ${item.status || 'Menunggu Kas'}
          </span>
        </td>
        <td class="py-3 px-4 text-center whitespace-nowrap">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="viewAnggaranDetail('${item.id}')" title="Detail Anggaran" class="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
              <i data-lucide="eye" class="w-4 h-4"></i>
            </button>
            <button onclick="openEditAnggaranModal('${item.id}')" title="Edit Anggaran" class="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition">
              <i data-lucide="edit-3" class="w-4 h-4"></i>
            </button>
            <button onclick="deleteAnggaran('${item.id}')" title="Hapus Anggaran" class="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
  initLucide();
}

function handleSearchAnggaran(val) {
  searchAnggaranQuery = (val || '').trim();
  renderAnggaranTable();
}

function openAddAnggaranModal(item = null) {
  const modal = document.getElementById('modal-anggaran');
  const title = document.getElementById('modal-anggaran-title');
  const form = document.getElementById('form-anggaran');
  if (!modal || !form) return;

  form.reset();

  const currentPos = filterAnggaranPos || 'Pelantikan';

  if (item) {
    if (title) title.textContent = `Edit Rincian Anggaran (Pos ${item.pos})`;
    document.getElementById('anggaran-id').value = item.id || '';
    document.getElementById('anggaran-pos').value = item.pos || currentPos;
    document.getElementById('anggaran-kegiatan').value = item.kegiatan || '';
    document.getElementById('anggaran-nama').value = item.nama || '';
    document.getElementById('anggaran-jumlah').value = item.jumlah || '';
    document.getElementById('anggaran-tanggal').value = item.tanggalTarget || '';
    document.getElementById('anggaran-status').value = item.status || 'Menunggu Kas';
    document.getElementById('anggaran-keterangan').value = item.keterangan || '';
  } else {
    if (title) title.textContent = `Tambah Rincian Anggaran: Pos ${currentPos}`;
    document.getElementById('anggaran-id').value = '';
    document.getElementById('anggaran-pos').value = currentPos;
    document.getElementById('anggaran-kegiatan').value = `Kegiatan ${currentPos}`;
    document.getElementById('anggaran-tanggal').value = new Date().toISOString().split('T')[0];
    document.getElementById('anggaran-status').value = 'Menunggu Kas';
  }

  modal.classList.remove('hidden');
  initLucide();
}

function closeAnggaranModal() {
  const modal = document.getElementById('modal-anggaran');
  if (modal) modal.classList.add('hidden');
}

function saveAnggaran(event) {
  if (event) event.preventDefault();

  const id = document.getElementById('anggaran-id').value.trim();
  const pos = document.getElementById('anggaran-pos').value;
  const kegiatan = document.getElementById('anggaran-kegiatan').value.trim();
  const nama = document.getElementById('anggaran-nama').value.trim();
  const jumlah = Number(document.getElementById('anggaran-jumlah').value) || 0;
  const tanggalTarget = document.getElementById('anggaran-tanggal').value;
  const status = document.getElementById('anggaran-status').value;
  const keterangan = document.getElementById('anggaran-keterangan').value.trim();
  const tahunKhidmat = document.getElementById('anggaran-tahun-khidmat')?.value || selectedAnggaranTahunKhidmat || currentTahunKhidmat;

  if (!nama) {
    showToast('Nama kebutuhan / uraian anggaran wajib diisi!', 'warning');
    return;
  }
  if (jumlah <= 0) {
    showToast('Target jumlah anggaran harus lebih besar dari 0!', 'warning');
    return;
  }

  if (id) {
    // Edit existing
    const idx = (anggaran || []).findIndex(a => a.id === id);
    if (idx !== -1) {
      anggaran[idx] = {
        ...anggaran[idx],
        pos,
        tahunKhidmat,
        kegiatan: kegiatan || `Anggaran ${pos}`,
        nama,
        jumlah,
        tanggalTarget,
        status,
        keterangan
      };
      showToast(`Data anggaran Pos ${pos} berhasil diperbarui!`, 'success');
    }
  } else {
    // New item
    const newId = `AGR-${Date.now().toString().slice(-6)}`;
    anggaran.unshift({
      id: newId,
      pos,
      tahunKhidmat,
      kegiatan: kegiatan || `Anggaran ${pos}`,
      nama,
      jumlah,
      tanggalTarget,
      status,
      keterangan
    });
    showToast(`Item anggaran Pos ${pos} berhasil ditambahkan!`, 'success');
  }

  // Jika menambah/mengedit di pos lain, fokus pindah ke pos tersebut
  if (pos && pos !== filterAnggaranPos) {
    filterAnggaranPos = pos;
  }

  saveData();
  closeAnggaranModal();
  renderAnggaranSection();
  renderDashboard();
  renderPemasukanSection();
  renderPengeluaranSection();
}

function openEditAnggaranModal(id) {
  const item = (anggaran || []).find(a => a.id === id);
  if (item) {
    openAddAnggaranModal(item);
  }
}

function deleteAnggaran(id) {
  const item = (anggaran || []).find(a => a.id === id);
  if (!item) return;

  showConfirmModal({
    title: 'Hapus Rencana Anggaran (RAB)',
    message: `Apakah Anda yakin ingin menghapus item anggaran <strong>"${escapeHtml(item.nama)}"</strong> (Pos: ${item.pos}) sebesar <strong>${formatRupiah(item.jumlah)}</strong>?<br><span class="text-rose-500 font-bold text-xs mt-1 block">Tindakan ini akan menghapus rencana anggaran ini secara permanen dari Cloud Neon.</span>`,
    confirmText: 'Ya, Hapus Anggaran',
    cancelText: 'Batal',
    type: 'danger',
    icon: 'trash-2',
    onConfirm: async () => {
      // Direct deletion from Cloud Neon
      if (typeof executeNeonSql === 'function') {
        try {
          await executeNeonSql(`DELETE FROM tb_anggaran_rab WHERE id = ${sqlEscape(id)};`);
        } catch (e) {
          console.warn('[NEON] Direct delete anggaran gagal:', e.message);
        }
      }

      anggaran = (anggaran || []).filter(a => a.id !== id);
      saveData();
      renderAnggaranSection();
      renderDashboard();
      renderPemasukanSection();
      renderPengeluaranSection();
      showToast('Item anggaran berhasil dihapus permanen.', 'info');
    }
  });
}

function viewAnggaranDetail(id) {
  const item = (anggaran || []).find(a => a.id === id);
  if (!item) return;

  currentAnggaranDetail = item;
  const modal = document.getElementById('modal-detail-anggaran');
  if (!modal) return;

  document.getElementById('detail-anggaran-nama').textContent = item.nama;
  document.getElementById('detail-anggaran-pos').textContent = `Pos: ${item.pos}`;
  document.getElementById('detail-anggaran-kegiatan').textContent = item.kegiatan || '-';
  document.getElementById('detail-anggaran-jumlah').textContent = formatRupiah(item.jumlah);
  document.getElementById('detail-anggaran-tanggal').textContent = item.tanggalTarget || '-';
  document.getElementById('detail-anggaran-status').textContent = item.status || 'Menunggu Kas';
  document.getElementById('detail-anggaran-keterangan').textContent = item.keterangan || 'Tidak ada catatan tambahan.';

  modal.classList.remove('hidden');
  initLucide();
}

function closeDetailAnggaranModal() {
  const modal = document.getElementById('modal-detail-anggaran');
  if (modal) modal.classList.add('hidden');
}

function deleteAnggaranFromDetail() {
  if (!currentAnggaranDetail || !currentAnggaranDetail.id) return;
  const targetId = currentAnggaranDetail.id;
  closeDetailAnggaranModal();
  deleteAnggaran(targetId);
}

// --- Excel: Anggaran RAB (Template, Import, Export) ---
function downloadAnggaranTemplate() {
  if (typeof XLSX === 'undefined') {
    showToast('Library Excel (SheetJS) belum siap.', 'error');
    return;
  }

  const sampleData = [
    {
      "Pos Anggaran (Pelantikan/PKD/MAPABA/Lain-lain)": "Pelantikan",
      "Uraian Kebutuhan Belanja": "Sewa Gedung Pertemuan & Sound System",
      "Program / Kegiatan": "Pelantikan Pengurus Komisariat 2026",
      "Target Nominal Anggaran (Rp)": 2500000,
      "Target Tanggal Kebutuhan (YYYY-MM-DD)": "2026-02-15",
      "Status (Menunggu Kas/Proses Pendanaan/Terpenuhi)": "Proses Pendanaan",
      "Keterangan & Spesifikasi": "Sewa aula pertemuan kapasitas 200 orang beserta sound system"
    },
    {
      "Pos Anggaran (Pelantikan/PKD/MAPABA/Lain-lain)": "Pelantikan",
      "Uraian Kebutuhan Belanja": "Konsumsi Tamu Undangan, Mabinkom & Pengurus (150 Porsi)",
      "Program / Kegiatan": "Pelantikan Pengurus Komisariat 2026",
      "Target Nominal Anggaran (Rp)": 3000000,
      "Target Tanggal Kebutuhan (YYYY-MM-DD)": "2026-02-15",
      "Status (Menunggu Kas/Proses Pendanaan/Terpenuhi)": "Menunggu Kas",
      "Keterangan & Spesifikasi": "Konsumsi prasmanan tamu kehormatan PC PMII, Mabinkom, Alumni, dan pengurus"
    },
    {
      "Pos Anggaran (Pelantikan/PKD/MAPABA/Lain-lain)": "PKD",
      "Uraian Kebutuhan Belanja": "Modul Materi & Buku Saku Peserta PKD (40 Eks)",
      "Program / Kegiatan": "Pelatihan Kader Dasar (PKD) 2026",
      "Target Nominal Anggaran (Rp)": 2000000,
      "Target Tanggal Kebutuhan (YYYY-MM-DD)": "2026-05-20",
      "Status (Menunggu Kas/Proses Pendanaan/Terpenuhi)": "Menunggu Kas",
      "Keterangan & Spesifikasi": "Cetak jilid buku saku materi NDP, Aswaja, Paradigma Kritis"
    },
    {
      "Pos Anggaran (Pelantikan/PKD/MAPABA/Lain-lain)": "MAPABA",
      "Uraian Kebutuhan Belanja": "Kelengkapan Atribut Peserta MAPABA (Syal, PIN & ID Card)",
      "Program / Kegiatan": "Masa Penerimaan Anggota Baru (MAPABA) 2026",
      "Target Nominal Anggaran (Rp)": 3200000,
      "Target Tanggal Kebutuhan (YYYY-MM-DD)": "2026-09-10",
      "Status (Menunggu Kas/Proses Pendanaan/Terpenuhi)": "Menunggu Kas",
      "Keterangan & Spesifikasi": "Pengadaan paket atribut peserta MAPABA ISMU Tarate 80 orang"
    },
    {
      "Pos Anggaran (Pelantikan/PKD/MAPABA/Lain-lain)": "Lain-lain",
      "Uraian Kebutuhan Belanja": "Operasional Rutin Sekretariat, Listrik & Wifi Tahunan",
      "Program / Kegiatan": "Operasional Rutin Sekretariat Komisariat",
      "Target Nominal Anggaran (Rp)": 2400000,
      "Target Tanggal Kebutuhan (YYYY-MM-DD)": "2026-01-30",
      "Status (Menunggu Kas/Proses Pendanaan/Terpenuhi)": "Proses Pendanaan",
      "Keterangan & Spesifikasi": "Biaya penunjang aktivitas harian sekretariat komisariat, listrik, air, dan internet"
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);

  // Set lebar kolom Excel agar rapi
  worksheet['!cols'] = [
    { wch: 34 }, // Pos
    { wch: 44 }, // Uraian
    { wch: 38 }, // Kegiatan
    { wch: 26 }, // Nominal
    { wch: 26 }, // Tanggal
    { wch: 30 }, // Status
    { wch: 54 }  // Keterangan
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template Anggaran RAB");
  XLSX.writeFile(workbook, "Template_Import_Anggaran_RAB_PMII_ISMU.xlsx");
  showToast('Template Excel Rencana Anggaran (RAB) berhasil diunduh!', 'success');
}

function handleImportAnggaranFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (typeof XLSX === 'undefined') {
    showToast('Library Excel (SheetJS) belum siap.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      if (!rows || rows.length === 0) {
        showToast('File Excel kosong atau format kolom tidak sesuai.', 'warning');
        return;
      }

      let countSuccess = 0;
      let targetPosToFocus = null;

      rows.forEach((row, i) => {
        // Ambil Pos Anggaran
        const rawPos = (row['Pos Anggaran (Pelantikan/PKD/MAPABA/Lain-lain)'] || row['Pos Anggaran'] || row['Pos'] || row['pos'] || '').toString().trim();
        let pos = 'Pelantikan';
        const lowerPos = rawPos.toLowerCase();
        if (lowerPos.includes('pelantikan')) pos = 'Pelantikan';
        else if (lowerPos.includes('pkd')) pos = 'PKD';
        else if (lowerPos.includes('mapaba')) pos = 'MAPABA';
        else if (lowerPos.includes('lain')) pos = 'Lain-lain';
        else if (filterAnggaranPos) pos = filterAnggaranPos;

        if (!targetPosToFocus) targetPosToFocus = pos;

        // Ambil Uraian / Nama Kebutuhan
        const nama = (row['Uraian Kebutuhan Belanja'] || row['Uraian Kebutuhan'] || row['Nama Kebutuhan'] || row['Nama Item'] || row['Uraian'] || row['nama'] || '').toString().trim();
        if (!nama) return; // Lewati jika uraian kosong

        // Ambil Program / Kegiatan
        const kegiatan = (row['Program / Kegiatan'] || row['Kegiatan'] || row['kegiatan'] || row['Program'] || `Anggaran ${pos}`).toString().trim();

        // Ambil Target Nominal Anggaran
        let rawNominal = row['Target Nominal Anggaran (Rp)'] || row['Target Anggaran (Rp)'] || row['Target Anggaran'] || row['Nominal'] || row['Jumlah'] || row['jumlah'] || 0;
        if (typeof rawNominal === 'string') {
          rawNominal = rawNominal.replace(/[^0-9]/g, '');
        }
        const jumlah = parseInt(rawNominal, 10) || 0;
        if (jumlah <= 0) return; // Lewati jika nominal tidak valid

        // Ambil Target Tanggal Kebutuhan
        let tanggalTarget = row['Target Tanggal Kebutuhan (YYYY-MM-DD)'] || row['Target Tanggal Kebutuhan'] || row['Tanggal Target'] || row['Tanggal'] || row['tanggalTarget'] || '';
        if (typeof tanggalTarget === 'number') {
          // Tangani serial number tanggal dari Excel
          const dateObj = new Date(Math.round((tanggalTarget - 25569) * 86400 * 1000));
          if (!isNaN(dateObj.getTime())) {
            tanggalTarget = dateObj.toISOString().split('T')[0];
          }
        } else if (typeof tanggalTarget === 'string') {
          tanggalTarget = tanggalTarget.trim();
        }

        // Ambil Status Pemenuhan
        let status = (row['Status (Menunggu Kas/Proses Pendanaan/Terpenuhi)'] || row['Status Pemenuhan'] || row['Status'] || row['status'] || 'Menunggu Kas').toString().trim();
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes('terpenuhi') || lowerStatus.includes('selesai')) status = 'Terpenuhi';
        else if (lowerStatus.includes('proses') || lowerStatus.includes('pendanaan')) status = 'Proses Pendanaan';
        else status = 'Menunggu Kas';

        // Ambil Keterangan & Spesifikasi
        const keterangan = (row['Keterangan & Spesifikasi'] || row['Keterangan'] || row['keterangan'] || row['Spesifikasi'] || '').toString().trim();

        // Buat ID unik
        const posCode = pos === 'Pelantikan' ? 'PLT' : (pos === 'PKD' ? 'PKD' : (pos === 'MAPABA' ? 'MPB' : 'LL'));
        const newId = `AGR-${posCode}-${Date.now().toString().slice(-5)}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`;

        anggaran.unshift({
          id: newId,
          pos,
          tahunKhidmat: selectedAnggaranTahunKhidmat || currentTahunKhidmat,
          kegiatan,
          nama,
          jumlah,
          tanggalTarget: tanggalTarget || new Date().toISOString().split('T')[0],
          status,
          keterangan
        });

        countSuccess++;
      });

      if (countSuccess > 0) {
        if (targetPosToFocus) {
          filterAnggaranPos = targetPosToFocus;
        }
        saveData();
        renderAnggaranSection();
        renderDashboard();
        renderPengeluaranSection();
        if (typeof renderLaporanSection === 'function') renderLaporanSection();

        showToast(`Alhamdulillah! Berhasil mengimpor ${countSuccess} rincian anggaran (RAB) dari Excel!`, 'success');
      } else {
        showToast('Tidak ada data valid yang dapat diimpor. Pastikan kolom Uraian Kebutuhan dan Nominal terisi dengan benar.', 'warning');
      }

    } catch (err) {
      console.error('Import Anggaran Error:', err);
      showToast('Gagal membaca file Excel: ' + err.message, 'error');
    } finally {
      // Reset input agar bisa import file yang sama lagi jika ada perbaikan
      event.target.value = '';
    }
  };

  reader.readAsArrayBuffer(file);
}

function exportAnggaranExcel() {
  if (typeof XLSX === 'undefined') {
    showToast('Library Excel (SheetJS) belum siap.', 'error');
    return;
  }

  const currentPos = filterAnggaranPos || 'Pelantikan';
  const data = filterAnggaranData();
  if (data.length === 0) {
    showToast(`Tidak ada data anggaran untuk Pos ${currentPos} yang dapat diexport.`, 'warning');
    return;
  }

  const exportData = data.map((item, idx) => ({
    'No': idx + 1,
    'Pos Anggaran': item.pos,
    'Uraian Kebutuhan': item.nama,
    'Program / Kegiatan': item.kegiatan || '-',
    'Target Anggaran (Rp)': item.jumlah,
    'Target Tanggal Kebutuhan': item.tanggalTarget || '-',
    'Status Pemenuhan': item.status || 'Menunggu Kas',
    'Keterangan & Spesifikasi': item.keterangan || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `RAB ${currentPos}`);
  XLSX.writeFile(workbook, `RAB_Anggaran_${currentPos.replace(/\s+/g, '_')}_PMII_ISMU_${new Date().toISOString().split('T')[0]}.xlsx`);
  showToast(`Daftar Anggaran Pos ${currentPos} berhasil diexport ke Excel!`, 'success');
}

// ==========================================
// 9. MODUL E-KTA KADER PMII
// ==========================================
function renderKtaSection() {
  const select = document.getElementById('select-kta-kader');
  if (!select) return;

  let options = `<option value="">-- Pilih Kader Untuk Mencetak KTA --</option>`;
  kaders.forEach(k => {
    options += `<option value="${k.id}" ${currentKaderForKTA && currentKaderForKTA.id === k.id ? 'selected' : ''}>${k.nama} (${k.nim || '-'}) - ${k.fakultas || '-'}</option>`;
  });
  select.innerHTML = options;

  if (currentKaderForKTA) {
    renderKtaCard(currentKaderForKTA);
  } else if (kaders.length > 0) {
    currentKaderForKTA = kaders[0];
    select.value = currentKaderForKTA.id;
    renderKtaCard(currentKaderForKTA);
  }
}

function handleSelectKaderForKta(kaderId) {
  const kader = kaders.find(k => k.id === kaderId);
  if (kader) {
    currentKaderForKTA = kader;
    renderKtaCard(kader);
  }
}

function openKtaForKader(id) {
  const kader = kaders.find(k => k.id === id);
  if (kader) {
    currentKaderForKTA = kader;
    switchTab('kta');
  }
}

function renderKtaCard(kader) {
  if (!kader) return;

  // Front KTA
  const frontFoto = document.getElementById('kta-front-foto');
  const frontNama = document.getElementById('kta-front-nama');
  const frontNokta = document.getElementById('kta-front-nokta');
  const frontNim = document.getElementById('kta-front-nim');
  const frontFakultas = document.getElementById('kta-front-fakultas');
  const frontJurusan = document.getElementById('kta-front-jurusan');
  const frontKomisariat = document.getElementById('kta-front-komisariat');
  const frontJenjang = document.getElementById('kta-front-jenjang');

  if (frontFoto) frontFoto.src = kader.foto || 'https://via.placeholder.com/120';
  if (frontNama) frontNama.textContent = kader.nama;
  if (frontNokta) frontNokta.textContent = kader.noKta || '-';
  if (frontNim) frontNim.textContent = kader.nim || '-';
  if (frontFakultas) frontFakultas.textContent = kader.fakultas || '-';
  if (frontJurusan) frontJurusan.textContent = kader.jurusan || '-';
  if (frontKomisariat) frontKomisariat.textContent = (komisariat.nama || 'PK PMII ISMU').toUpperCase();
  if (frontJenjang) frontJenjang.textContent = kader.kaderisasi?.formal || 'MAPABA';

  // Back KTA
  const backCabang = document.getElementById('kta-back-cabang');
  const backTtl = document.getElementById('kta-back-ttl');
  const backAlamat = document.getElementById('kta-back-alamat');
  const backKampus = document.getElementById('kta-back-kampus');
  const backKetua = document.getElementById('kta-back-ketua');
  const backSekretaris = document.getElementById('kta-back-sekretaris');

  if (backCabang) backCabang.textContent = (komisariat.cabang || 'PC PMII Kab. Sumenep').toUpperCase();
  if (backTtl) backTtl.textContent = kader.ttl || '-';
  if (backAlamat) backAlamat.textContent = kader.alamat || '-';
  if (backKampus) backKampus.textContent = komisariat.kampus || 'INSTITUT MIFTAHUL ULUM TARATE';
  if (backKetua) backKetua.textContent = komisariat.ketuaKomisariat || 'Ketua Komisariat';
  if (backSekretaris) backSekretaris.textContent = komisariat.sekretarisKomisariat || 'Sekretaris Komisariat';

  // QR Code generator
  const qrContainer = document.getElementById('kta-qrcode');
  if (qrContainer && typeof QRCode !== 'undefined') {
    qrContainer.innerHTML = '';
    new QRCode(qrContainer, {
      text: `PMII-KTA:${kader.noKta}|${kader.nama}|${kader.nim}|${kader.fakultas}`,
      width: 64,
      height: 64,
      colorDark: "#1E3A8A",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });
  }
}

function downloadKtaImage(side = 'front') {
  if (typeof html2canvas === 'undefined') {
    showToast('Library pembuat gambar sedang dimuat, silakan coba sesaat lagi.', 'warning');
    return;
  }

  const elId = side === 'front' ? 'kta-card-front' : 'kta-card-back';
  const element = document.getElementById(elId);
  if (!element || !currentKaderForKTA) return;

  showToast('Sedang membuat gambar KTA...', 'info');

  html2canvas(element, { scale: 3, useCORS: true }).then(canvas => {
    const link = document.createElement('a');
    link.download = `E-KTA_${side.toUpperCase()}_${currentKaderForKTA.nama.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast(`E-KTA sisi ${side === 'front' ? 'depan' : 'belakang'} berhasil diunduh!`, 'success');
  }).catch(err => {
    console.error('KTA download error:', err);
    showToast('Gagal mengunduh gambar KTA.', 'error');
  });
}

function printKta() {
  window.print();
}

// ==========================================
// 10. MODUL LAPORAN & REKAPITULASI
// ==========================================
function renderLaporanSection() {
  // 1. Rekapitulasi Kader per Fakultas
  const tbodyFakultas = document.getElementById('laporan-rekap-rayon-body');
  if (tbodyFakultas) {
    const fakultasMap = {};
    kaders.forEach(k => {
      const fak = k.fakultas || 'Fakultas Lain';
      if (!fakultasMap[fak]) {
        fakultasMap[fak] = { total: 0, mapaba: 0, pkd: 0, pkl: 0, laki: 0, perempuan: 0 };
      }
      fakultasMap[fak].total++;
      const jenjang = k.kaderisasi?.formal || 'MAPABA';
      if (jenjang === 'PKD') fakultasMap[fak].pkd++;
      else if (jenjang === 'PKL' || jenjang === 'PKN') fakultasMap[fak].pkl++;
      else fakultasMap[fak].mapaba++;

      if (k.gender === 'Perempuan') fakultasMap[fak].perempuan++;
      else fakultasMap[fak].laki++;
    });

    const rows = Object.keys(fakultasMap).map((fak, i) => {
      const d = fakultasMap[fak];
      return `
        <tr class="hover:bg-slate-50 border-b border-slate-100 text-xs">
          <td class="py-3 px-4 text-center text-slate-400 font-mono">${i + 1}</td>
          <td class="py-3 px-4 font-bold text-slate-800">${fak}</td>
          <td class="py-3 px-4 text-center font-bold text-blue-900">${d.total}</td>
          <td class="py-3 px-4 text-center text-amber-700 font-semibold">${d.mapaba}</td>
          <td class="py-3 px-4 text-center text-blue-700 font-semibold">${d.pkd}</td>
          <td class="py-3 px-4 text-center text-purple-700 font-semibold">${d.pkl}</td>
          <td class="py-3 px-4 text-center text-slate-600">${d.laki}</td>
          <td class="py-3 px-4 text-center text-rose-600">${d.perempuan}</td>
        </tr>
      `;
    }).join('');

    tbodyFakultas.innerHTML = rows || `<tr><td colspan="8" class="p-6 text-center text-slate-400 text-xs">Belum ada data kader.</td></tr>`;

    // Update Footers
    const elAll = document.getElementById('lap-total-all');
    const elMap = document.getElementById('lap-total-mapaba');
    const elPkd = document.getElementById('lap-total-pkd');
    const elPkl = document.getElementById('lap-total-pkl');
    const elSahabat = document.getElementById('lap-total-sahabat');
    const elSahabati = document.getElementById('lap-total-sahabati');

    if (elAll) elAll.textContent = kaders.length;
    if (elMap) elMap.textContent = kaders.filter(k => (k.kaderisasi?.formal || 'MAPABA') === 'MAPABA').length;
    if (elPkd) elPkd.textContent = kaders.filter(k => k.kaderisasi?.formal === 'PKD').length;
    if (elPkl) elPkl.textContent = kaders.filter(k => k.kaderisasi?.formal === 'PKL' || k.kaderisasi?.formal === 'PKN').length;
    if (elSahabat) elSahabat.textContent = kaders.filter(k => k.gender !== 'Perempuan').length;
    if (elSahabati) elSahabati.textContent = kaders.filter(k => k.gender === 'Perempuan').length;
  }

  // 2. Rekapitulasi Keuangan per Pos Anggaran
  const tbodyKeuangan = document.getElementById('laporan-rekap-keuangan-body');
  if (tbodyKeuangan) {
    const totPemasukan = pemasukan.reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);
    const activePengeluaranLap = (pengeluaran || []).filter(p => isItemMatchTahunKhidmat(p, currentTahunKhidmat));
    const totPelantikan = activePengeluaranLap.filter(p => matchPengeluaranPos(p.pos, 'Pelantikan')).reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);
    const totMapaba = activePengeluaranLap.filter(p => matchPengeluaranPos(p.pos, 'MAPABA')).reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);
    const totPkd = activePengeluaranLap.filter(p => matchPengeluaranPos(p.pos, 'PKD')).reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);
    const totLain = activePengeluaranLap.filter(p => matchPengeluaranPos(p.pos, 'Lain-lain')).reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);
    const totPengeluaran = totPelantikan + totMapaba + totPkd + totLain;
    const saldoAkhir = totPemasukan - totPengeluaran;

    const countPelantikan = activePengeluaranLap.filter(p => matchPengeluaranPos(p.pos, 'Pelantikan')).length;
    const countMapaba = activePengeluaranLap.filter(p => matchPengeluaranPos(p.pos, 'MAPABA')).length;
    const countPkd = activePengeluaranLap.filter(p => matchPengeluaranPos(p.pos, 'PKD')).length;
    const countLain = activePengeluaranLap.filter(p => matchPengeluaranPos(p.pos, 'Lain-lain')).length;

    tbodyKeuangan.innerHTML = `
      <tr class="hover:bg-slate-50 border-b border-slate-100 text-xs">
        <td class="py-3 px-4 text-center text-slate-400 font-mono">1</td>
        <td class="py-3 px-4 font-bold text-slate-800">Pemasukan Kas Komisariat (Iuran & Donasi)</td>
        <td class="py-3 px-4"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Kas Masuk</span></td>
        <td class="py-3 px-4 text-center font-semibold text-slate-700">${pemasukan.length} Transaksi</td>
        <td class="py-3 px-4 text-right font-bold text-emerald-600 font-mono">+ ${formatRupiah(totPemasukan)}</td>
      </tr>
      <tr class="hover:bg-slate-50 border-b border-slate-100 text-xs">
        <td class="py-3 px-4 text-center text-slate-400 font-mono">2</td>
        <td class="py-3 px-4 font-bold text-slate-800">Pos Anggaran PELANTIKAN (Pelantikan Pengurus Baru)</td>
        <td class="py-3 px-4"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">Kas Keluar</span></td>
        <td class="py-3 px-4 text-center font-semibold text-slate-700">${countPelantikan} Transaksi</td>
        <td class="py-3 px-4 text-right font-bold text-rose-600 font-mono">- ${formatRupiah(totPelantikan)}</td>
      </tr>
      <tr class="hover:bg-slate-50 border-b border-slate-100 text-xs">
        <td class="py-3 px-4 text-center text-slate-400 font-mono">3</td>
        <td class="py-3 px-4 font-bold text-slate-800">Pos Anggaran MAPABA (Masa Penerimaan Anggota Baru)</td>
        <td class="py-3 px-4"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Kas Keluar</span></td>
        <td class="py-3 px-4 text-center font-semibold text-slate-700">${countMapaba} Transaksi</td>
        <td class="py-3 px-4 text-right font-bold text-rose-600 font-mono">- ${formatRupiah(totMapaba)}</td>
      </tr>
      <tr class="hover:bg-slate-50 border-b border-slate-100 text-xs">
        <td class="py-3 px-4 text-center text-slate-400 font-mono">4</td>
        <td class="py-3 px-4 font-bold text-slate-800">Pos Anggaran PKD (Pelatihan Kader Dasar)</td>
        <td class="py-3 px-4"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Kas Keluar</span></td>
        <td class="py-3 px-4 text-center font-semibold text-slate-700">${countPkd} Transaksi</td>
        <td class="py-3 px-4 text-right font-bold text-rose-600 font-mono">- ${formatRupiah(totPkd)}</td>
      </tr>
      <tr class="hover:bg-slate-50 border-b border-slate-100 text-xs">
        <td class="py-3 px-4 text-center text-slate-400 font-mono">5</td>
        <td class="py-3 px-4 font-bold text-slate-800">Pos Anggaran LAIN-LAIN (ATK, Kesekretariatan & Operasional)</td>
        <td class="py-3 px-4"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">Kas Keluar</span></td>
        <td class="py-3 px-4 text-center font-semibold text-slate-700">${countLain} Transaksi</td>
        <td class="py-3 px-4 text-right font-bold text-rose-600 font-mono">- ${formatRupiah(totLain)}</td>
      </tr>
    `;

    // Update Footers Keuangan
    const elLapMasuk = document.getElementById('lap-keuangan-total-masuk');
    const elLapKeluar = document.getElementById('lap-keuangan-total-keluar');
    const elLapSaldo = document.getElementById('lap-keuangan-total-saldo');

    if (elLapMasuk) elLapMasuk.textContent = formatRupiah(totPemasukan);
    if (elLapKeluar) elLapKeluar.textContent = formatRupiah(totPengeluaran);
    if (elLapSaldo) elLapSaldo.textContent = formatRupiah(saldoAkhir);
  }

  // 3. Rekapitulasi Presensi & Agenda Rapat Pengurus
  const tbodyRapat = document.getElementById('laporan-rekap-rapat-body');
  if (tbodyRapat) {
    if (!rapat || rapat.length === 0) {
      tbodyRapat.innerHTML = `<tr><td colspan="10" class="p-6 text-center text-slate-400 text-xs">Belum ada agenda rapat yang tercatat.</td></tr>`;
    } else {
      tbodyRapat.innerHTML = rapat.map((r, i) => {
        const list = Array.isArray(r.presensi) ? r.presensi : [];
        const hadir = list.filter(p => p.status === 'Hadir').length;
        const izin = list.filter(p => p.status === 'Izin').length;
        const sakit = list.filter(p => p.status === 'Sakit').length;
        const alpa = list.filter(p => p.status === 'Alpa' || p.status === 'Tanpa Keterangan').length;
        const pct = list.length > 0 ? Math.round((hadir / list.length) * 100) : 0;

        return `
          <tr class="hover:bg-slate-50 border-b border-slate-100 text-xs">
            <td class="py-3 px-4 text-center text-slate-400 font-mono">${i + 1}</td>
            <td class="py-3 px-4 font-bold text-slate-800 max-w-xs">${r.agenda}</td>
            <td class="py-3 px-4 text-slate-600 whitespace-nowrap">${r.tanggal || '-'} <br><span class="text-[10px] text-slate-400">${r.tempat || '-'}</span></td>
            <td class="py-3 px-4 text-slate-600 whitespace-nowrap">${r.pimpinan || '-'}<br><span class="text-[10px] text-slate-400">Notulis: ${r.notulis || '-'}</span></td>
            <td class="py-3 px-4 text-center font-bold text-emerald-700 bg-emerald-50/50">${hadir}</td>
            <td class="py-3 px-4 text-center font-bold text-amber-700 bg-amber-50/50">${izin}</td>
            <td class="py-3 px-4 text-center font-bold text-blue-700 bg-blue-50/50">${sakit}</td>
            <td class="py-3 px-4 text-center font-bold text-rose-700 bg-rose-50/50">${alpa}</td>
            <td class="py-3 px-4 text-center font-black text-indigo-700">${pct}%</td>
            <td class="py-3 px-4 text-center whitespace-nowrap">
              <button onclick="viewRapatDetail('${r.id}')" class="text-indigo-600 hover:underline font-bold mr-2 text-[11px]">Detail</button>
              <button onclick="shareRapatToWhatsApp('${r.id}')" class="text-emerald-600 hover:underline font-bold text-[11px]">Kirim WA</button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  initLucide();
}

function printLaporanKas() {
  window.print();
}

function exportKeuanganToExcel() {
  if (typeof XLSX === 'undefined') {
    showToast('Library Excel belum siap.', 'error');
    return;
  }

  const wb = XLSX.utils.book_new();

  // Sheet 1: Pemasukan Kas
  const rowsPemasukan = pemasukan.map((p, i) => ({
    "No": i + 1,
    "No Bukti": p.bukti || '-',
    "Tanggal": p.tanggal || '-',
    "Kategori": p.kategori || '-',
    "Uraian / Keterangan": p.keterangan || '-',
    "Diterima Dari": p.diterimaDari || '-',
    "PIC Bendahara": p.pic || '-',
    "Nominal Masuk (Rp)": p.jumlah || 0
  }));
  const ws1 = XLSX.utils.json_to_sheet(rowsPemasukan);
  XLSX.utils.book_append_sheet(wb, ws1, "Kas Masuk");

  // Sheet 2: Pengeluaran Kas
  const rowsPengeluaran = pengeluaran.map((k, i) => ({
    "No": i + 1,
    "Pos Anggaran": k.pos || 'LAIN-LAIN',
    "No Bukti": k.bukti || '-',
    "Tanggal": k.tanggal || '-',
    "Kategori": k.kategori || '-',
    "Uraian / Keterangan": k.keterangan || '-',
    "Penanggung Jawab / PIC": k.pic || '-',
    "Nominal Keluar (Rp)": k.jumlah || 0
  }));
  const ws2 = XLSX.utils.json_to_sheet(rowsPengeluaran);
  XLSX.utils.book_append_sheet(wb, ws2, "Kas Keluar");

  // Sheet 3: Rencana Anggaran Biaya (RAB)
  const rowsAnggaran = (anggaran || []).map((a, i) => ({
    "No": i + 1,
    "Pos Anggaran": a.pos || '-',
    "Program / Kegiatan": a.kegiatan || '-',
    "Uraian Kebutuhan": a.nama || '-',
    "Target Biaya (Rp)": a.jumlah || 0,
    "Target Tanggal": a.tanggalTarget || '-',
    "Status Pemenuhan": a.status || 'Menunggu Kas',
    "Keterangan": a.keterangan || '-'
  }));
  const ws3 = XLSX.utils.json_to_sheet(rowsAnggaran);
  XLSX.utils.book_append_sheet(wb, ws3, "Rencana Anggaran (RAB)");

  // Sheet 4: Rekap Presensi & Agenda Rapat
  if (Array.isArray(rapat) && rapat.length > 0) {
    const rowsRapat = rapat.map((r, i) => {
      const list = Array.isArray(r.presensi) ? r.presensi : [];
      const hadir = list.filter(p => p.status === 'Hadir').length;
      const izin = list.filter(p => p.status === 'Izin').length;
      const sakit = list.filter(p => p.status === 'Sakit').length;
      const alpa = list.filter(p => p.status === 'Alpa' || p.status === 'Tanpa Keterangan').length;
      return {
        "No": i + 1,
        "Agenda Rapat": r.agenda || '-',
        "Tanggal": r.tanggal || '-',
        "Tempat": r.tempat || '-',
        "Pimpinan": r.pimpinan || '-',
        "Hadir": hadir,
        "Izin": izin,
        "Sakit": sakit,
        "Alpa": alpa,
        "% Kehadiran": list.length > 0 ? `${Math.round((hadir / list.length) * 100)}%` : '0%'
      };
    });
    const ws4 = XLSX.utils.json_to_sheet(rowsRapat);
    XLSX.utils.book_append_sheet(wb, ws4, "Presensi Rapat Pengurus");
  }

  XLSX.writeFile(wb, `Laporan_Keuangan_Lengkap_PMII_${(komisariat.nama || 'Komisariat').replace(/\s+/g, '_')}.xlsx`);
  showToast('Laporan keuangan lengkap (Kas Masuk, Keluar & RAB) berhasil diexport ke Excel!', 'success');
}

// ==========================================
// 11. PENGATURAN & BACKUP / RESTORE
// ==========================================
function loadPengaturanForm() {
  const fNama = document.getElementById('setting-nama');
  const fLengkap = document.getElementById('setting-nama-lengkap');
  const fKampus = document.getElementById('setting-kampus');
  const fCabang = document.getElementById('setting-cabang');
  const fPkc = document.getElementById('setting-pkc');
  const fMasa = document.getElementById('setting-masa');
  const fKetua = document.getElementById('setting-ketua');
  const fSekretaris = document.getElementById('setting-sekretaris');
  const fBendahara = document.getElementById('setting-bendahara');
  const fSk = document.getElementById('setting-sk');
  const fAlamat = document.getElementById('setting-alamat');
  const fEmail = document.getElementById('setting-email');
  const fTelp = document.getElementById('setting-telepon');

  if (fNama) fNama.value = komisariat.nama || '';
  if (fLengkap) fLengkap.value = komisariat.namaLengkap || '';
  if (fKampus) fKampus.value = komisariat.kampus || '';
  if (fCabang) fCabang.value = komisariat.cabang || '';
  if (fPkc) fPkc.value = komisariat.pkc || '';
  if (fMasa) fMasa.value = komisariat.masaKhidmat || '';
  if (fKetua) fKetua.value = komisariat.ketuaKomisariat || '';
  if (fSekretaris) fSekretaris.value = komisariat.sekretarisKomisariat || '';
  if (fBendahara) fBendahara.value = komisariat.bendaharaKomisariat || '';
  if (fSk) fSk.value = komisariat.nomorSK || '';
  if (fAlamat) fAlamat.value = komisariat.alamat || '';
  if (fEmail) fEmail.value = komisariat.email || '';
  if (fTelp) fTelp.value = komisariat.telepon || '';

  // Cloud Database Credentials
  const elCloudUrl = document.getElementById('cloud-db-url');
  const elCloudKey = document.getElementById('cloud-db-key');
  const defaultUrl = (typeof DEFAULT_CLOUD_CONFIG !== 'undefined' && DEFAULT_CLOUD_CONFIG.url) ? DEFAULT_CLOUD_CONFIG.url : '';
  const defaultKey = (typeof DEFAULT_CLOUD_CONFIG !== 'undefined' && DEFAULT_CLOUD_CONFIG.key) ? DEFAULT_CLOUD_CONFIG.key : '';
  const savedUrl = localStorage.getItem('pmii_cloud_db_url') || '';
  const savedKey = localStorage.getItem('pmii_cloud_db_key') || '';
  const finalUrl = (!savedUrl || savedUrl.includes('xyzcompany') || savedUrl.includes('ep-xxx') || savedUrl.includes('ep-cool-fog')) ? defaultUrl : savedUrl;
  const finalKey = (!savedKey || savedKey.includes('eyJhbG')) ? defaultKey : savedKey;
  if (elCloudUrl) elCloudUrl.value = finalUrl;
  if (elCloudKey) elCloudKey.value = finalKey;

  renderSettingTahunKhidmat();
  renderSettingFakultasProdi();
  renderSettingPengurus();
  renderSettingKetum();
}

async function saveCloudDbConfig() {
  const url = (document.getElementById('cloud-db-url')?.value || '').trim();
  const key = (document.getElementById('cloud-db-key')?.value || '').trim();

  if (!url && !key) {
    showToast('Silakan masukkan Host / Connection String Neon terlebih dahulu.', 'warning');
    return;
  }

  localStorage.setItem('pmii_cloud_db_url', url);
  localStorage.setItem('pmii_cloud_db_key', key);

  showToast('Menyimpan konfigurasi & menguji koneksi ke Neon Cloud...', 'info');

  const ok = await testCloudConnection(false);
  if (ok) {
    // Tarik data terbaru dari Neon agar sinkron dengan yang ada di server
    await fetchDataFromCloud(false);
    // Aktifkan auto-sync berkala di background
    startAutoSync();
  }
}

function savePengaturanForm(event) {
  event.preventDefault();

  komisariat.nama = document.getElementById('setting-nama').value.trim();
  komisariat.namaLengkap = document.getElementById('setting-nama-lengkap').value.trim();
  komisariat.kampus = document.getElementById('setting-kampus').value.trim();
  komisariat.cabang = document.getElementById('setting-cabang').value.trim();
  komisariat.pkc = document.getElementById('setting-pkc').value.trim();
  komisariat.masaKhidmat = document.getElementById('setting-masa').value.trim();
  komisariat.ketuaKomisariat = document.getElementById('setting-ketua').value.trim();
  komisariat.sekretarisKomisariat = document.getElementById('setting-sekretaris').value.trim();
  komisariat.bendaharaKomisariat = document.getElementById('setting-bendahara').value.trim();
  komisariat.nomorSK = document.getElementById('setting-sk').value.trim();
  komisariat.alamat = document.getElementById('setting-alamat').value.trim();
  komisariat.email = document.getElementById('setting-email').value.trim();
  komisariat.telepon = document.getElementById('setting-telepon').value.trim();

  // Sinkronkan juga ke entri Tahun Khidmat yang sedang aktif
  const activeKhidmat = tahunKhidmatList.find(t => t.isAktif);
  if (activeKhidmat) {
    activeKhidmat.label = komisariat.masaKhidmat;
    activeKhidmat.ketuaKomisariat = komisariat.ketuaKomisariat;
    activeKhidmat.sekretarisKomisariat = komisariat.sekretarisKomisariat;
    activeKhidmat.bendaharaKomisariat = komisariat.bendaharaKomisariat;
    activeKhidmat.nomorSK = komisariat.nomorSK;
    currentTahunKhidmat = komisariat.masaKhidmat;
  }

  saveData();
  renderHeader();
  renderSettingTahunKhidmat();
  showToast('Pengaturan identitas komisariat berhasil disimpan!', 'success');
}

function backupDatabase() {
  const fullBackup = {
    app: "Sistem Informasi Pendataan Kader PMII",
    version: "2.6",
    exportedAt: new Date().toISOString(),
    komisariat,
    tahunKhidmatList,
    currentTahunKhidmat,
    kaders,
    mabinkom,
    pemasukan,
    pengeluaran,
    pengurus,
    ketumKom,
    rapat,
    anggaran,
    fakultasProdi: getFakultasProdiList()
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", `Backup_Database_PMII_${new Date().toISOString().split('T')[0]}.json`);
  dlAnchor.click();
  showToast('Backup database JSON berhasil diunduh!', 'success');
}

function restoreDatabase(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.komisariat) komisariat = data.komisariat;
      if (Array.isArray(data.tahunKhidmatList)) tahunKhidmatList = data.tahunKhidmatList;
      if (data.currentTahunKhidmat) currentTahunKhidmat = data.currentTahunKhidmat;
      if (Array.isArray(data.kaders)) kaders = data.kaders;
      if (Array.isArray(data.mabinkom)) mabinkom = data.mabinkom;
      if (Array.isArray(data.pemasukan)) pemasukan = data.pemasukan;
      if (Array.isArray(data.pengeluaran)) pengeluaran = data.pengeluaran;
      if (Array.isArray(data.pengurus)) pengurus = data.pengurus;
      if (Array.isArray(data.ketumKom)) ketumKom = data.ketumKom;
      if (Array.isArray(data.rapat)) rapat = data.rapat;
      if (Array.isArray(data.anggaran)) anggaran = data.anggaran;
      if (Array.isArray(data.fakultasProdi)) {
        fakultasProdiList = data.fakultasProdi;
        localStorage.setItem('pmii_fakultas_prodi', JSON.stringify(fakultasProdiList));
      }

      saveData();
      renderApp();
      showToast('Database berhasil dipulihkan dari file backup!', 'success');
    } catch (err) {
      console.error('Restore error:', err);
      showToast('Gagal memulihkan database: file JSON tidak valid.', 'error');
    }
  };
  reader.readAsText(file);
}

// ==========================================
// 12. UTILITY & HELPER FUNCTIONS
// ==========================================
function formatRupiah(amount) {
  const num = Number(amount) || 0;
  return 'Rp ' + num.toLocaleString('id-ID');
}

function terbilang(angka) {
  const bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  angka = Math.floor(Math.abs(Number(angka) || 0));

  function convert(n) {
    if (n < 12) return bilangan[n];
    if (n < 20) return convert(n - 10) + ' Belas';
    if (n < 100) return convert(Math.floor(n / 10)) + ' Puluh ' + convert(n % 10);
    if (n < 200) return 'Seratus ' + convert(n - 100);
    if (n < 1000) return convert(Math.floor(n / 100)) + ' Ratus ' + convert(n % 100);
    if (n < 2000) return 'Seribu ' + convert(n - 1000);
    if (n < 1000000) return convert(Math.floor(n / 1000)) + ' Ribu ' + convert(n % 1000);
    if (n < 1000000000) return convert(Math.floor(n / 1000000)) + ' Juta ' + convert(n % 1000000);
    if (n < 1000000000000) return convert(Math.floor(n / 1000000000)) + ' Miliar ' + convert(n % 1000000000);
    return convert(Math.floor(n / 1000000000000)) + ' Triliun ' + convert(n % 1000000000000);
  }

  if (angka === 0) return 'Nol';
  return convert(angka).replace(/\s+/g, ' ').trim();
}

// ==========================================
// 13. PWA INSTALLATION CONTROLLER (Cross-Device)
// ==========================================
let deferredPwaPrompt = null;

function isPwaStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true || 
         (document.referrer && document.referrer.includes('android-app://'));
}

function initPwaInstallHandlers() {
  if (isPwaStandalone()) {
    console.log('[PWA] Aplikasi sudah berjalan dalam mode standalone (terpasang).');
    updatePwaButtonsVisibility(false);
    return;
  }

  // Tangkap event sebelum instalasi muncul otomatis
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPwaPrompt = e;
    console.log('[PWA] beforeinstallprompt tertangkap, menampilkan tombol install');
    updatePwaButtonsVisibility(true);
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] Aplikasi berhasil dipasang!');
    deferredPwaPrompt = null;
    updatePwaButtonsVisibility(false);
    if (typeof showToast === 'function') {
      showToast('Aplikasi berhasil dipasang di layar utama!', 'success');
    }
  });

  // Untuk perangkat mobile / iOS (Safari) agar tombol tetap muncul
  const isMobile = /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
  if (isMobile && !isPwaStandalone()) {
    setTimeout(() => {
      updatePwaButtonsVisibility(true);
    }, 1000);
  }
}

function updatePwaButtonsVisibility(show) {
  if (isPwaStandalone()) {
    show = false;
  }
  const btnIds = [
    'header-pwa-install-btn',
    'sidebar-pwa-install-btn',
    'login-pwa-install-container',
    'btn-install-form'
  ];
  btnIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (show) {
        el.classList.remove('hidden');
        if (el.tagName === 'BUTTON') {
          el.classList.add('inline-flex');
        } else {
          el.classList.add('block');
        }
      } else {
        el.classList.add('hidden');
        el.classList.remove('inline-flex', 'block', 'flex');
      }
    }
  });
}

function triggerPwaInstall() {
  if (deferredPwaPrompt) {
    deferredPwaPrompt.prompt();
    deferredPwaPrompt.userChoice.then((choiceResult) => {
      if (choiceResult && choiceResult.outcome === 'accepted') {
        console.log('[PWA] Pengguna menerima pemasangan aplikasi.');
        if (typeof showToast === 'function') {
          showToast('Menginstal aplikasi ke perangkat Anda...', 'info');
        }
      } else {
        console.log('[PWA] Pengguna menolak pemasangan aplikasi.');
      }
      deferredPwaPrompt = null;
    });
  } else {
    openPwaGuideModal();
  }
}

function openPwaGuideModal() {
  const modal = document.getElementById('modal-pwa-guide');
  const container = document.getElementById('pwa-guide-steps');
  if (!modal || !container) return;

  const userAgent = navigator.userAgent || '';
  const isIos = /iphone|ipad|ipod/i.test(userAgent);
  const isAndroid = /android/i.test(userAgent);

  let stepsHtml = '';
  if (isIos) {
    stepsHtml = `
      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
        <p class="font-bold text-slate-800 flex items-center gap-2">
          <span class="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">1</span>
          <span>Buka di browser Safari</span>
        </p>
        <p class="text-slate-600 pl-7 text-[11px]">Pastikan tautan dibuka di aplikasi <strong>Safari</strong> bawaan iPhone/iPad Anda.</p>
      </div>
      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
        <p class="font-bold text-slate-800 flex items-center gap-2">
          <span class="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">2</span>
          <span>Ketuk tombol Bagikan (Share)</span>
        </p>
        <p class="text-slate-600 pl-7 text-[11px]">Ketuk ikon kotak dengan panah ke atas (<strong>Share</strong>) di bilah bawah Safari.</p>
      </div>
      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
        <p class="font-bold text-slate-800 flex items-center gap-2">
          <span class="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">3</span>
          <span>Pilih "Tambahkan ke Layar Utama"</span>
        </p>
        <p class="text-slate-600 pl-7 text-[11px]">Gulir ke bawah dan ketuk <strong>"Add to Home Screen"</strong>, lalu klik <strong>Tambah</strong> di pojok kanan atas.</p>
      </div>
    `;
  } else if (isAndroid) {
    stepsHtml = `
      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
        <p class="font-bold text-slate-800 flex items-center gap-2">
          <span class="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">1</span>
          <span>Buka Menu Browser Chrome</span>
        </p>
        <p class="text-slate-600 pl-7 text-[11px]">Ketuk tombol <strong>titik tiga (⋮)</strong> di pojok kanan atas browser Google Chrome.</p>
      </div>
      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
        <p class="font-bold text-slate-800 flex items-center gap-2">
          <span class="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">2</span>
          <span>Pilih "Instal Aplikasi" / "Tambahkan ke Layar Utama"</span>
        </p>
        <p class="text-slate-600 pl-7 text-[11px]">Ketuk menu <strong>"Instal aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.</p>
      </div>
      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
        <p class="font-bold text-slate-800 flex items-center gap-2">
          <span class="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">3</span>
          <span>Ketuk "Instal"</span>
        </p>
        <p class="text-slate-600 pl-7 text-[11px]">Aplikasi PMII ISMU akan terpasang di layar utama HP Anda dengan ikon resmi.</p>
      </div>
    `;
  } else {
    // Desktop / Laptop
    stepsHtml = `
      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
        <p class="font-bold text-slate-800 flex items-center gap-2">
          <span class="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">1</span>
          <span>Klik Ikon Install di Kolom URL</span>
        </p>
        <p class="text-slate-600 pl-7 text-[11px]">Di sisi kanan kolom alamat URL browser (Chrome / Edge), klik ikon <strong>komputer / pasang aplikasi</strong>.</p>
      </div>
      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
        <p class="font-bold text-slate-800 flex items-center gap-2">
          <span class="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">2</span>
          <span>Klik "Install"</span>
        </p>
        <p class="text-slate-600 pl-7 text-[11px]">Aplikasi akan terbuka mandiri di Desktop & Start Menu komputer Anda.</p>
      </div>
    `;
  }

  container.innerHTML = stepsHtml;
  modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closePwaGuideModal() {
  const modal = document.getElementById('modal-pwa-guide');
  if (modal) modal.classList.add('hidden');
}

// Inisialisasi otomatis
if (typeof window !== 'undefined') {
  initPwaInstallHandlers();
}

// ==========================================
// MODUL: JOIN KADER (PENDAFTARAN MANDIRI KADER)
// ==========================================
let newlyJoinedKaderId = null;

const JOIN_PRODI_BY_FAKULTAS = {
  "Fakultas Tarbiyah": [
    "Pendidikan Agama Islam (PAI)",
    "Manajemen Pendidikan Islam (MPI)",
    "Pendidikan Guru Madrasah Ibtidaiyah (PGMI)"
  ],
  "Fakultas Syariah": [
    "Hukum Keluarga Islam (HKI / Ahwal Syakhshiyyah)",
    "Hukum Ekonomi Syariah (HES / Muamalah)"
  ],
  "Fakultas Ekonomi & Bisnis Islam": [
    "Ekonomi Syariah",
    "Perbankan Syariah"
  ],
  "Program Pascasarjana": [
    "Magister Pendidikan Agama Islam (S2 PAI)"
  ]
};

function initJoinKaderTab() {
  const selFakultas = document.getElementById('join-fakultas');
  if (selFakultas) {
    handleJoinKaderFakultasChange(selFakultas.value || 'Fakultas Tarbiyah');
  }
  const selGender = document.getElementById('join-gender');
  if (selGender) {
    handleJoinKaderGenderChange(selGender.value || 'Laki-laki');
  }
  initLucide();
}

function handleJoinKaderFakultasChange(fakultas) {
  const selJurusan = document.getElementById('join-jurusan');
  if (!selJurusan) return;

  const prodiList = JOIN_PRODI_BY_FAKULTAS[fakultas] || JOIN_PRODI_BY_FAKULTAS["Fakultas Tarbiyah"];
  selJurusan.innerHTML = prodiList.map(p => `<option value="${p}">${p}</option>`).join('');
}

function handleJoinKaderGenderChange(gender) {
  const kopriSec = document.getElementById('join-section-kopri');
  if (!kopriSec) return;
  if (gender === 'Perempuan') {
    kopriSec.classList.remove('hidden');
  } else {
    kopriSec.classList.add('hidden');
  }
}

function handleJoinKaderFotoUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const maxDim = 500;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDim) {
          height *= maxDim / width;
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width *= maxDim / height;
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
      const previewImg = document.getElementById('join-foto-preview');
      const hiddenInput = document.getElementById('join-foto-base64');

      if (previewImg) previewImg.src = compressedBase64;
      if (hiddenInput) hiddenInput.value = compressedBase64;
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

async function handleJoinKaderFormSubmit(event) {
  if (event) event.preventDefault();

  const btnSubmit = document.getElementById('btn-submit-joinkader');
  if (btnSubmit) {
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<span class="inline-block animate-spin mr-2">⏳</span><span>Menyimpan Pendaftaran...</span>';
  }

  try {
    const nama = (document.getElementById('join-nama')?.value || '').trim();
    const panggilan = (document.getElementById('join-panggilan')?.value || '').trim();
    const gender = document.getElementById('join-gender')?.value || 'Laki-laki';
    const nik = (document.getElementById('join-nik')?.value || '').trim();
    const tempatLahir = (document.getElementById('join-tempat-lahir')?.value || '').trim();
    const tanggalLahir = document.getElementById('join-tanggal-lahir')?.value || '';
    const alamat = (document.getElementById('join-alamat')?.value || '').trim();

    const nim = (document.getElementById('join-nim')?.value || '').trim();
    const angkatan = parseInt(document.getElementById('join-angkatan')?.value) || new Date().getFullYear();
    const fakultas = document.getElementById('join-fakultas')?.value || 'Fakultas Tarbiyah';
    const jurusan = document.getElementById('join-jurusan')?.value || 'Pendidikan Agama Islam (PAI)';

    const rawWa = (document.getElementById('join-whatsapp')?.value || '').trim();
    let whatsapp = rawWa.replace(/[^0-9]/g, '');
    if (whatsapp.startsWith('0')) whatsapp = '62' + whatsapp.slice(1);
    const email = (document.getElementById('join-email')?.value || '').trim();

    const formal = document.getElementById('join-formal')?.value || 'MAPABA';
    const jabatan = (document.getElementById('join-jabatan')?.value || '').trim() || 'Anggota Kader';
    const tahunMapaba = (document.getElementById('join-tahun-mapaba')?.value || '').trim() || String(angkatan);
    const penyMapaba = (document.getElementById('join-penyelenggara-mapaba')?.value || '').trim() || (komisariat.nama || 'PK PMII ISMU');
    const kopri = (gender === 'Perempuan') ? (document.getElementById('join-kopri')?.value || '-') : '-';

    // Foto default jika belum upload
    const defaultMale = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces';
    const defaultFemale = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=faces';
    const foto = document.getElementById('join-foto-base64')?.value || (gender === 'Perempuan' ? defaultFemale : defaultMale);

    const generatedId = `KD-${angkatan}-${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedKta = `13.01.${angkatan}.${Math.floor(100 + Math.random() * 900)}`;

    const existingIdx = kaders.findIndex(k => k.nim === nim);
    let finalId = generatedId;
    let finalKta = generatedKta;
    if (existingIdx !== -1) {
      finalId = kaders[existingIdx].id || generatedId;
      finalKta = kaders[existingIdx].noKta || generatedKta;
    }

    const newKader = {
      id: finalId,
      noKta: finalKta,
      nik: nik,
      nim: nim,
      nama: nama,
      panggilan: panggilan || nama,
      namaPanggilan: panggilan || nama,
      gender: gender,
      tempatLahir: tempatLahir,
      tanggalLahir: tanggalLahir,
      ttl: tempatLahir ? `${tempatLahir}, ${tanggalLahir || ''}` : (tanggalLahir || '-'),
      fakultas: fakultas,
      jurusan: jurusan,
      angkatan: String(angkatan),
      statusKuliah: 'Aktif',
      statusKader: 'Aktif',
      statusKeaktifan: 'Aktif',
      whatsapp: whatsapp,
      email: email,
      alamat: alamat,
      jabatan: jabatan,
      foto: foto,
      kaderisasi: {
        formal: formal,
        tahunMapaba: tahunMapaba,
        penyelenggaraMapaba: penyMapaba,
        tahunPkd: formal === 'PKD' ? String(angkatan) : '',
        penyelenggaraPkd: formal === 'PKD' ? 'PC PMII Kab. Sumenep' : '',
        kopri: kopri
      }
    };

    // 1. Simpan langsung ke database Neon Cloud jika online
    if (typeof executeNeonSql === 'function') {
      try {
        const sql = `
          INSERT INTO tb_kader (
            id, no_kta, nik, nim, nama, nama_panggilan, gender, tempat_lahir, tanggal_lahir,
            fakultas, jurusan, angkatan, status_kuliah, alamat, whatsapp, email, foto,
            status_kader, formal, tahun_mapaba, penyelenggara_mapaba, kopri
          ) VALUES (
            ${sqlEscape(newKader.id)}, ${sqlEscape(newKader.noKta)}, ${sqlEscape(newKader.nik)}, ${sqlEscape(newKader.nim)},
            ${sqlEscape(newKader.nama)}, ${sqlEscape(newKader.namaPanggilan)}, ${sqlEscape(newKader.gender)},
            ${sqlEscape(newKader.tempatLahir)}, ${newKader.tanggalLahir ? sqlEscape(newKader.tanggalLahir) : 'NULL'},
            ${sqlEscape(newKader.fakultas)}, ${sqlEscape(newKader.jurusan)}, ${sqlEscape(String(newKader.angkatan))},
            'Aktif', ${sqlEscape(newKader.alamat)}, ${sqlEscape(newKader.whatsapp)}, ${sqlEscape(newKader.email)},
            ${sqlEscape(newKader.foto)}, 'Aktif', ${sqlEscape(newKader.kaderisasi.formal)},
            ${sqlEscape(newKader.kaderisasi.tahunMapaba)}, ${sqlEscape(newKader.kaderisasi.penyelenggaraMapaba)},
            ${sqlEscape(newKader.kaderisasi.kopri)}
          ) ON CONFLICT (id) DO UPDATE SET
            nama = EXCLUDED.nama,
            nama_panggilan = EXCLUDED.nama_panggilan,
            no_kta = EXCLUDED.no_kta,
            nim = EXCLUDED.nim,
            fakultas = EXCLUDED.fakultas,
            jurusan = EXCLUDED.jurusan,
            angkatan = EXCLUDED.angkatan,
            whatsapp = EXCLUDED.whatsapp,
            foto = COALESCE(EXCLUDED.foto, tb_kader.foto),
            updated_at = CURRENT_TIMESTAMP;
        `;
        await executeNeonSql(sql);
      } catch (neonErr) {
        console.warn('Gagal simpan langsung ke Neon Cloud:', neonErr);
      }
    }

    // 2. Simpan ke array lokal kaders
    if (existingIdx !== -1) {
      kaders[existingIdx] = Object.assign(kaders[existingIdx], newKader);
    } else {
      kaders.unshift(newKader);
    }
    saveData();

    newlyJoinedKaderId = newKader.id;

    // 3. Update tabel data & UI
    if (typeof renderKaderTable === 'function') renderKaderTable();
    if (typeof renderMapabaTable === 'function') renderMapabaTable();
    if (typeof renderPkdTable === 'function') renderPkdTable();
    if (typeof renderDashboard === 'function') renderDashboard();

    // 4. Tampilkan box sukses
    const successBox = document.getElementById('join-kader-success-box');
    const successKta = document.getElementById('join-kader-success-kta');
    const successNama = document.getElementById('join-kader-success-nama');
    if (successKta) successKta.textContent = newKader.noKta;
    if (successNama) successNama.textContent = `${newKader.nama} (NIM: ${newKader.nim})`;
    if (successBox) {
      successBox.classList.remove('hidden');
      successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    showToast(`Pendaftaran kader "${newKader.nama}" berhasil tersimpan!`, 'success');

    // Reset input form
    const formEl = document.getElementById('form-join-kader');
    if (formEl) formEl.reset();

    // Reset preview foto
    const previewImg = document.getElementById('join-foto-preview');
    if (previewImg) previewImg.src = 'assets/logo-pmii.webp';
    const hiddenFoto = document.getElementById('join-foto-base64');
    if (hiddenFoto) hiddenFoto.value = '';

  } finally {
    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = '<i data-lucide="send" class="w-4 h-4 text-yellow-300"></i><span>Kirim Formulir Pendaftaran Kader</span>';
      initLucide();
    }
  }
}

function viewKtaAfterJoin() {
  if (newlyJoinedKaderId) {
    switchTab('kta');
    if (typeof openKtaForKader === 'function') {
      openKtaForKader(newlyJoinedKaderId);
    }
  } else {
    switchTab('kta');
  }
}

