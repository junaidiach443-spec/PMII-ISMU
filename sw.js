/**
 * Service Worker - Sistem Informasi & Pendataan Kader PK PMII ISMU
 * Versi 3.4: Fix ERR_FAILED & Bulletproof Offline Fallback
 */

const CACHE_NAME = 'pmii-ismu-v3.4';
const STATIC_ASSETS = [
  './',
  './index.html',
  './portal-kader.html',
  './form-kader.html',
  './css/style.css',
  './js/data.js',
  './js/app.js',
  './assets/logo-pmii.webp',
  './manifest.json'
];

// Install: Cache aset penting satu per satu secara aman
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const asset of STATIC_ASSETS) {
        try {
          const res = await fetch(asset);
          if (res && res.status === 200) {
            await cache.put(asset, res);
          }
        } catch (err) {
          console.warn('[SW] Lewati cache aset:', asset, err);
        }
      }
    })
  );
});

// Activate: Hapus cache versi lama secara tuntas & ambil alih klien aktif
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Handler
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // 1. Lewati request non-GET dan endpoint API backend
  if (req.method !== 'GET' || url.pathname.includes('/api/')) {
    return;
  }

  // 2. Navigasi Halaman HTML (PWA Start URL & Navigasi Antar Tab/Halaman)
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Jangan berikan opsi kedua ke fetch(req) pada mode navigate karena memicu TypeError ERR_FAILED di Chromium
          const networkRes = await fetch(req);
          if (networkRes && networkRes.status === 200) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then(c => c.put(req, copy)).catch(() => {});
          }
          return networkRes;
        } catch (fetchErr) {
          console.warn('[SW] Navigasi offline, mencoba mengambil dari cache...', fetchErr);
          // Coba cari cache yang cocok
          const cached = await caches.match(req);
          if (cached) return cached;

          const rootCached = (await caches.match('./')) || 
                             (await caches.match('./index.html')) || 
                             (await caches.match('/index.html')) || 
                             (await caches.match('/'));
          if (rootCached) return rootCached;

          return new Response(
            '<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>PMII ISMU - Mode Offline</title><style>body{font-family:sans-serif;text-align:center;padding:50px 20px;background:#f8fafc;color:#1e293b;}h2{color:#002b66;}button{padding:12px 24px;border-radius:12px;background:#002b66;color:#fff;border:none;cursor:pointer;font-weight:bold;margin-top:16px;}</style></head><body><h2>Aplikasi Sedang Offline</h2><p>Silakan hubungkan perangkat Anda ke internet untuk memuat data terbaru.</p><button onclick="location.reload()">Muat Ulang Halaman</button></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        }
      })()
    );
    return;
  }

  // 3. Aset Statis (CSS, JS, Gambar): Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req)
        .then(networkRes => {
          if (networkRes && networkRes.status === 200) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then(c => c.put(req, copy)).catch(() => {});
          }
          return networkRes;
        })
        .catch(() => null);

      if (cached) return cached;
      return fetchPromise.then(res => res || new Response('', { status: 404 }));
    })
  );
});
