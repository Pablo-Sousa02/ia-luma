import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Registra o service worker para habilitar o PWA
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    // Aqui você pode avisar o usuário que há uma nova versão
    if (window.confirm('Nova versão disponível! Deseja atualizar agora?')) {
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  },
});
