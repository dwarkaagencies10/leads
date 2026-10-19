// Site Leads service worker: makes the app installable and open instantly.
//
// How it stays fast: the app opens straight from the copy saved on the phone,
// and checks GitHub for a newer copy in the background. A new version (or a
// changed link in config.js) is used the NEXT time the app is opened.
//
// When you change the app, bump the version below so phones pick up the new files.
const CACHE = 'site-leads-v1.5.0';
const FONTS = 'site-leads-fonts';
const SHELL = ['./', './index.html', './config.js', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== FONTS).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: keep a copy on the phone so text never waits for the internet
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONTS).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok || res.type === 'opaque') c.put(req, res.clone());
      return res;
    }));
    return;
  }

  // Google Sheet, Drive and Maps always go to the network
  if (url.origin !== self.location.origin) return;

  // The app's own files: answer from the phone immediately, refresh the saved copy in the background
  const key = req.mode === 'navigate' ? './index.html' : req;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(key, { ignoreSearch: true });
    const fresh = fetch(req, { cache: 'no-cache' })
      .then(res => { if (res && res.ok) c.put(key, res.clone()); return res; })
      .catch(() => null);
    if (hit) { e.waitUntil(fresh); return hit; }
    return (await fresh) || (await c.match('./index.html')) || Response.error();
  }));
});
