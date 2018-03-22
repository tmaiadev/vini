const CACHE_VERSION = `{{version}}`;

self.addEventListener('install', e => {
    console.log('[Service Worker] installed');
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