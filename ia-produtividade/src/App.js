import React from 'react';
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

// Componente para animação das páginas
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

function AppWrapper() {
  // Hook para pegar a localização atual da rota (para animação)
  const location = useLocation();

  return (
    <>
      <Navbar />
      <div className="container mt-4" style={{ minHeight: '80vh' }}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/cadastro" element={<PageTransition><RegisterPage /></PageTransition>} />

            <Route
              path="/tarefas"
              element={
                <PrivateRoute>
                  <PageTransition><TaskList /></PageTransition>
                </PrivateRoute>
              }
            />
            <Route
              path="/metas"
              element={
                <PrivateRoute>
                  <PageTransition><GoalTracker /></PageTransition>
                </PrivateRoute>
              }
            />
            <Route 
              path="/perfil"
              element={
                <PrivateRoute>
                  <PageTransition><MeuPerfil /></PageTransition>
                </PrivateRoute>
              }
            />
            <Route 
              path="/pomodoro"
              element={
                <PrivateRoute>
                  <PageTransition><PomodoroTimer /></PageTransition>
                </PrivateRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
}

// Como o hook useLocation só funciona dentro do Router, criamos um wrapper para usar dentro do Router
function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
