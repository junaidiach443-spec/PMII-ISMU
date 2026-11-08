/**
 * Service Worker - Sistem Informasi & Pendataan Kader PK PMII ISMU
 * Versi 3.1: Resilient Cache & Cross-Device PWA Support
 */

const CACHE_NAME = 'pmii-ismu-v3.2';
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

// Install: Cache aset satu per satu agar tidak gagal total jika satu berkas redirect
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const asset of STATIC_ASSETS) {
        try {
          const res = await fetch(asset, { redirect: 'follow' });
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

// Activate: Bersihkan cache versi lama
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

  // 2. Navigasi Dokumen HTML (PWA Start URL & Halaman): Network-First
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req, { redirect: 'follow' })
        .then(response => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(req, copy));
          }
          return response;
        })
        .catch(async () => {
          // Offline Fallback
          const cached = await caches.match(req);
          if (cached) return cached;

          const rootCached = await caches.match('./') || 
                             await caches.match('./index.html') || 
                             await caches.match('/');
          if (rootCached) return rootCached;

          return new Response(
            '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>PMII ISMU - Offline</title></head><body style="font-family:sans-serif;text-align:center;padding:50px 20px;"><h2>Aplikasi Sedang Offline</h2><p>Silakan hubungkan perangkat Anda ke internet dan muat ulang halaman ini.</p><button onclick="location.reload()" style="padding:10px 20px;border-radius:10px;background:#002b66;color:#fff;border:none;cursor:pointer;">Muat Ulang</button></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
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
            caches.open(CACHE_NAME).then(c => c.put(req, copy));
          }
          return networkRes;
        })
        .catch(() => null);

      if (cached) return cached;
      return fetchPromise.then(res => res || new Response('', { status: 404 }));
    })
  );
});
