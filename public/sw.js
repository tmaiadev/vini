const CACHE_VERSION = `{{cache-version}}`;

var urlsToCache = [
    '/',
    '/assets/icon-backward.svg',
    '/assets/icon-forward.svg',
    '/assets/icon-loading.svg',
    '/assets/icon-pause.svg',
    '/assets/icon-play.svg',
    '/assets/vini-maia-poeira-estelar-cover-mini.png',
    '/assets/vini-maia-poeira-estelar-cover.jpg',
    '/assets/vini-maia.jpg',
    '/assets/flaticon/applemusic.svg',
    '/assets/flaticon/deezer.svg',
    '/assets/flaticon/email.svg',
    '/assets/flaticon/facebook.svg',
    '/assets/flaticon/playstore.svg',
    '/assets/flaticon/spotify.svg',
    '/assets/flaticon/twitter.svg',
    '/assets/flaticon/youtube.svg',
    '/static/js/main.{{js-cache-version}}.js'
];

self.addEventListener('install', e => {
    console.log('[Service Worker] installed');

    e.waitUntil(
        caches.open(CACHE_VERSION)
        .then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', () => {
    console.log('[Service Worker] activated');
});

self.addEventListener('fetch', e => {
    console.log('[Service Worker] fetching', e.request.url);

    e.respondWith(
        caches.match(e.request)
        .then(async response => {
            if (response) {
                console.log('[Service Worker] found cache for', e.request.url);
                return response;
            }

            if (/(svg|png|jpg|jpeg|mp3)$/.test(e.request.url)) {
                const fetchRequest = e.request.clone();
            
                const fetchResponse = await fetch(fetchRequest);
                
                if ( ! fetchResponse || fetchResponse.status !== 200) {
                    return fetchResponse;
                }

                const responseToCache = fetchResponse.clone();

                const cache = await caches.open(CACHE_VERSION);
                cache.put(e.request, responseToCache);

                console.log('[Service Worker] cached', e.request.url);
                
                return fetchResponse;
            } else {
                return fetch(e.request);
            }
        })
    );
});