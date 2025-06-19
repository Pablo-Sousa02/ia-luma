import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLogged(!!token); // true se existir token
  }, []);

  return (
    <div className="container py-5" style={{ maxWidth: '900px' }}>
      <h1 className="mb-4 text-center" style={{ color: '#101758' }}>
        Bem-vindo ao Motiv.AI!
      </h1>

      <p className="lead text-center mb-5">
        Sua assistente inteligente para aumentar a produtividade e organizar suas tarefas com a ajuda da IA.
      </p>

      <div className="bg-light p-4 rounded shadow-sm mb-5">
        <h2 className="mb-3" style={{ color: '#101758' }}>
          Como o Motiv.AI funciona?
        </h2>
        <ul className="list-unstyled fs-5">
          <li className="mb-3">
            <strong>1. Cadastro e Login:</strong> Crie sua conta para manter suas tarefas seguras.
          </li>
          <li className="mb-3">
            <strong>2. Gerencie suas tarefas:</strong> Adicione, conclua e remova tarefas facilmente. A IA pode ajudar a organizar melhor sua lista.
          </li>
          <li className="mb-3">
            <strong>3. Mensagens Motivacionais:</strong> Receba mensagens personalizadas para manter sua motivação em alta.
          </li>
          <li className="mb-3">
            <strong>4. Chat com IA :</strong> Converse com a IA para obter ajuda personalizada e otimizar sua produtividade.
          </li>
          <li className="mb-3">
            <strong>5. Técnica Pomodoro:</strong> Utilize a técnica Pomodoro para gerenciar seu tempo de forma eficaz.
          </li>
        </ul>
      </div>

      {!isLogged && (
        <>
          <p className="text-center text-muted fs-6">
            Comece agora criando seu cadastro ou fazendo login!
          </p>
          <div className="d-flex justify-content-center gap-4 mt-4">
            <Link to="/login" className="btn btn-primary px-4 py-2 shadow">
              👤 Login
            </Link>
            <Link to="/cadastro" className="btn btn-success px-4 py-2 shadow">
              📝 Cadastro
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
