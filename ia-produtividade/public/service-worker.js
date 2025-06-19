    const CACHE_NAME = 'motiv-ai-cache-v2'; // Atualize a versão do cache para forçar limpeza
    const urlsToCache = [
    '/',
    '/index.html',
    '/favicon.ico',
    '/logo192.png',
    '/logo512.png',
    '/manifest.json',
    // Inclua outros assets estáticos importantes para cache
    ];

    // Durante a instalação, cacheia arquivos essenciais
    self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando e cacheando arquivos...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
        }).then(() => self.skipWaiting()) // Força o novo SW ativar imediatamente
    );
    });

    // Ativação: limpa caches antigos
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
        }).then(() => self.clients.claim()) // Garante controle imediato das páginas abertas
    );
    });

    // Intercepta requisições e responde com cache ou faz fetch da rede
    self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
            return cachedResponse; // Retorna cache se disponível
        }

        return fetch(event.request).then((networkResponse) => {
            // Só cacheia respostas válidas e do mesmo domínio (tipo basic)
            if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== 'basic'
            ) {
            return networkResponse;
            }

            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
            // Evita cachear requisições cruzadas de outros domínios
            if (event.request.url.startsWith(self.location.origin)) {
                cache.put(event.request, responseClone);
            }
            });

            return networkResponse;
        });
        }).catch(() => {
        // Fallback para navegação offline (caso crie /offline.html)
        if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
        }
        })
    );
    });

    // Escuta mensagem para ativar imediatamente a nova versão do SW
    self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
        self.clients.claim();
    }
    });
