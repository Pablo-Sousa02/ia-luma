import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Offcanvas, Modal as BootstrapModal } from 'bootstrap';

import { FaHome, FaTasks, FaBullseye, FaUserPlus, FaUser, FaStopwatch, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const offcanvasRef = useRef(null);
  const modalRef = useRef(null);
  const bsModalInstance = useRef(null);
  const [isLogged, setIsLogged] = useState(false);

  // Estados para hover dos links
  const [hoverInicio, setHoverInicio] = useState(false);
  const [hoverTarefas, setHoverTarefas] = useState(false);
  const [hoverMetas, setHoverMetas] = useState(false);

  useEffect(() => {
    if (offcanvasRef.current) {
      const instance = Offcanvas.getInstance(offcanvasRef.current) || new Offcanvas(offcanvasRef.current);
      instance.hide();
    }

    const token = localStorage.getItem('token');
    setIsLogged(!!token);

    if (modalRef.current && !bsModalInstance.current) {
      bsModalInstance.current = new BootstrapModal(modalRef.current, {
        backdrop: 'static',
        keyboard: false,
        focus: true,
      });
    }
  }, [location]);

  const openModal = () => {
    if (bsModalInstance.current) bsModalInstance.current.show();
  };

  const closeModal = () => {
    if (bsModalInstance.current) bsModalInstance.current.hide();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLogged(false);
    closeModal();
    navigate('/login');
  };

  // Styles base e hover
  const baseLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'rgba(255, 255, 255, 0.85)',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const hoverEffect = {
    color: '#0ff',
    textShadow: '0 0 8px #0ff',
    transform: 'scale(1.05)',
  };

  return (
    <>
      <nav
        className="navbar navbar-dark shadow-sm px-3"
        style={{
          backgroundColor: '#1e1e2f',
          borderBottom: '2px solid #0ff4',
        }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Logo */}
          <Link
            className="navbar-brand d-flex align-items-center"
            to="/"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              fontSize: '1.5rem',
              color: '#0ff',
              letterSpacing: '0.1em',
            }}
          >
            <span style={{ color: '#ff00ff', marginRight: '6px', fontSize: '1.8rem' }}>
              &#x25B6;
            </span>
            Motiv.<span style={{ color: '#fff' }}>AI</span>
          </Link>

          {/* Botão menu lateral */}
          <button
            className="btn btn-outline-light"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
          >
            <i className="bi bi-list fs-4"></i>
          </button>
        </div>
      </nav>

      {/* Offcanvas Menu */}
      <div
        ref={offcanvasRef}
        className="offcanvas offcanvas-end text-bg-dark"
        tabIndex="1"
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
        style={{ maxWidth: '250px' }}
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
            Menu
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body">
          <ul className="navbar-nav flex-column gap-2">
            <li className="nav-item">
              <Link
                to="/"
                style={{ ...baseLinkStyle, ...(hoverInicio ? hoverEffect : {}) }}
                onMouseEnter={() => setHoverInicio(true)}
                onMouseLeave={() => setHoverInicio(false)}
              >
                <FaHome /> Início
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/tarefas"
                style={{ ...baseLinkStyle, ...(hoverTarefas ? hoverEffect : {}) }}
                onMouseEnter={() => setHoverTarefas(true)}
                onMouseLeave={() => setHoverTarefas(false)}
              >
                <FaTasks /> Tarefas
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/metas"
                style={{ ...baseLinkStyle, ...(hoverMetas ? hoverEffect : {}) }}
                onMouseEnter={() => setHoverMetas(true)}
                onMouseLeave={() => setHoverMetas(false)}
              >
                <FaBullseye /> Metas
              </Link>
            </li>

            {!isLogged && (
              <>
                <li className="nav-item mt-3">
                  <Link className="btn btn-outline-info w-100 d-flex align-items-center justify-content-center gap-2" to="/login">
                    <FaSignInAlt /> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2" to="/cadastro">
                    <FaUserPlus /> Cadastro
                  </Link>
                </li>
              </>
            )}

            {isLogged && (
              <>
                <li className="nav-item mt-3">
                  <Link className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center gap-2" to="/perfil">
                    <FaUser /> Meu Perfil
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-warning w-100 d-flex align-items-center justify-content-center gap-2" to="/pomodoro">
                    <FaStopwatch /> Pomodoro
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2" onClick={openModal}>
                    <FaSignOutAlt /> Sair
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Modal de Logout */}
      <div
        className="modal fade"
        id="profileModal"
        tabIndex="-1"
        aria-labelledby="profileModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark text-white border border-info shadow">
            <div className="modal-header border-bottom border-info">
              <h5 className="modal-title" id="profileModalLabel">Perfil</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={closeModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p className="mb-3">Você está logado.</p>
              <Link to="/perfil" className="btn btn-outline-info w-100" onClick={closeModal}>
                Ver perfil completo
              </Link>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-danger" onClick={handleLogout}>
                Sair da conta
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
