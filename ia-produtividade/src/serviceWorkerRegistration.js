    // Verifica se o navegador suporta service workers
    const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 range para localhost IPv4
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4]\d|1?\d{1,2})){3}$/
    )
    );

    export function register(config) {
    if ('serviceWorker' in navigator) {
        // O endereço do service worker
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

        if (isLocalhost) {
        // Se estiver em localhost, faz uma verificação especial
        checkValidServiceWorker(swUrl, config);

        navigator.serviceWorker.ready.then(() => {
            console.log(
            'Este aplicativo está sendo servido em cache pelo service worker.'
            );
        });
        } else {
        // Se não for localhost, registra direto
        registerValidSW(swUrl, config);
        }
    }
    }

    function registerValidSW(swUrl, config) {
    navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
        registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (!installingWorker) return;

            installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                // Novo conteúdo disponível, avisar usuário para atualizar
                console.log('Novo conteúdo disponível; por favor, atualize a página.');

                // Se o usuário passou uma função de callback, chama ela
                if (config && config.onUpdate) {
                    config.onUpdate(registration);
                }
                } else {
                // Conteúdo cacheado para uso offline
                console.log('Conteúdo cacheado para uso offline.');

                if (config && config.onSuccess) {
                    config.onSuccess(registration);
                }
                }
            }
            };
        };
        })
        .catch(error => {
        console.error('Erro ao registrar o service worker:', error);
        });
    }

    function checkValidServiceWorker(swUrl, config) {
    // Faz um fetch para checar se o service worker existe
    fetch(swUrl, {
        headers: { 'Service-Worker': 'script' },
    })
        .then(response => {
        // Se não achar ou o conteúdo não for javascript, força reload da página
        const contentType = response.headers.get('content-type');
        if (
            response.status === 404 ||
            (contentType && contentType.indexOf('javascript') === -1)
        ) {
            // Service worker não encontrado, faz reload sem cache
            navigator.serviceWorker.ready.then(registration => {
            registration.unregister().then(() => {
                window.location.reload();
            });
            });
        } else {
            // Service worker existe, registra normalmente
            registerValidSW(swUrl, config);
        }
        })
        .catch(() => {
        console.log(
            'Sem conexão com a internet. O app funcionará offline.'
        );
        });
    }

    export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
        .then(registration => {
            registration.unregister();
        })
        .catch(error => {
            console.error(error.message);
        });
    }
    }
