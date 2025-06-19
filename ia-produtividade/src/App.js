import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { AnimatePresence, motion } from 'framer-motion';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import TaskList from './components/TaskList';
import GoalTracker from './components/GoalTracker';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MeuPerfil from './components/MeuPerfil';
import PomodoroTimer from './components/PomodoroTimer';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Animação de transição entre páginas
const PageTransition = ({ children }) => {
  const variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ height: '100%' }}
    >
      {children}
    </motion.div>
  );
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Componente visual do aviso de atualização
const UpdateNotification = ({ onReload }) => (
  <div
    style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      backgroundColor: '#101758',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      cursor: 'pointer',
      zIndex: 10000,
      fontWeight: 'bold',
      userSelect: 'none',
    }}
    onClick={onReload}
    title="Clique para atualizar"
  >
    🚀 Nova versão disponível! Clique aqui para atualizar.
  </div>
);

function AppWrapper() {
  const location = useLocation();
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    let newWorker;

    const checkForUpdate = async (registration) => {
      if (registration) {
        await registration.update();
      }
    };

    serviceWorkerRegistration.register({
      onUpdate: (registration) => {
        newWorker = registration.waiting;
        setUpdateAvailable(true);
      },
      onSuccess: (registration) => {
        // Força checagem ao abrir o app
        checkForUpdate(registration);

        // Checa nova versão a cada 60 segundos (opcional)
        setInterval(() => checkForUpdate(registration), 60000);
      },
    });

    // Armazena worker globalmente para acesso externo
    window.newWorker = newWorker;
  }, []);

  const reloadPage = () => {
    if (window.newWorker) {
      window.newWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4" style={{ minHeight: '80vh' }}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/cadastro" element={<PageTransition><RegisterPage /></PageTransition>} />
            <Route path="/tarefas" element={<PrivateRoute><PageTransition><TaskList /></PageTransition></PrivateRoute>} />
            <Route path="/metas" element={<PrivateRoute><PageTransition><GoalTracker /></PageTransition></PrivateRoute>} />
            <Route path="/perfil" element={<PrivateRoute><PageTransition><MeuPerfil /></PageTransition></PrivateRoute>} />
            <Route path="/pomodoro" element={<PrivateRoute><PageTransition><PomodoroTimer /></PageTransition></PrivateRoute>} />
          </Routes>
        </AnimatePresence>
      </div>

      {updateAvailable && <UpdateNotification onReload={reloadPage} />}
    </>
  );
}

export default App;
