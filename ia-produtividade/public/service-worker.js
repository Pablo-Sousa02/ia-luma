    const CACHE_NAME = 'motiv-ai-cache-v1';
    const urlsToCache = [
    '/',
    '/index.html',
    '/favicon.ico',
    '/logo192.png',
    '/logo512.png',
    '/manifest.json',
    // Bootstrap e outros assets podem ser incluídos aqui, se quiser cachear
    ];

    // Durante a instalação, o service worker vai cachear os arquivos essenciais
    self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando e cacheando arquivos...');
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
    });

    // Ativação do service worker: limpa caches antigos
    self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Ativando e limpando caches antigos...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
                console.log('[Service Worker] Deletando cache antigo:', cacheName);
                return caches.delete(cacheName);
            }
            })
        );
        })
    );
    self.clients.claim();
    });

    // Intercepta requisições e responde com cache ou faz fetch da rede
    self.addEventListener('fetch', (event) => {
    // Para requisições GET
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
        .then((cachedResponse) => {
            if (cachedResponse) {
            // Retorna do cache
            return cachedResponse;
            }
            // Se não tiver no cache, faz fetch da rede e adiciona ao cache
            return fetch(event.request).then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                return networkResponse;
            }
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
            });
            return networkResponse;
            });
        }).catch(() => {
            // Se a rede falhar e não tiver cache, você pode retornar um fallback
            // Por exemplo, uma página offline:
            if (event.request.mode === 'navigate') {
            return caches.match('/offline.html'); // Caso crie uma página offline
            }
        })
    );
    });

    // Opcional: escuta mensagens para ativar imediatamente nova versão do SW
    self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    });
