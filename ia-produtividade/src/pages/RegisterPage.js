    import React, { useState } from 'react';
    import { useNavigate, Link } from 'react-router-dom';

    function RegisterPage() {
    const navigate = useNavigate();

    // Estados para controlar os inputs e mensagens
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false); // estado loading

    const handleRegister = async (e) => {
        e.preventDefault();

        setMensagem('');
        setErro('');
        setLoading(true); // começa loading

        try {
        // Requisição POST para o backend com os dados do cadastro
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha }),
        });

        const data = await response.json();

        if (response.ok) {
            setMensagem('Cadastro realizado com sucesso! Redirecionando para login...');
            setTimeout(() => {
            navigate('/login');
            }, 1500);
        } else {
            setErro(data.message || 'Erro no cadastro.');
        }
        } catch (error) {
        setErro('Erro ao conectar com o servidor.');
        } finally {
        setLoading(false); // termina loading
        }
    };

    return (
        <div className="container mt-5">
        <div className="text-center mb-4">
            <h1 className="fw-bold">Motiv.AI</h1>
            <p className="text-muted">Sua assistente virtual para produtividade, foco e motivação diária.</p>
        </div>

        <div className="card mx-auto" style={{ maxWidth: '400px' }}>
            <div className="card-body">
            <h4 className="card-title text-center mb-3">Cadastrar</h4>

            {mensagem && <div className="alert alert-success">{mensagem}</div>}
            {erro && <div className="alert alert-danger">{erro}</div>}

            <form onSubmit={handleRegister}>
                <div className="mb-3">
                <label>Nome</label>
                <input
                    type="text"
                    className="form-control"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={loading} // desabilita input durante loading
                />
                </div>

                <div className="mb-3">
                <label>Email</label>
                <input
                    type="email"
                    className="form-control"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading} // desabilita input durante loading
                />
                </div>

                <div className="mb-3">
                <label>Senha</label>
                <input
                    type="password"
                    className="form-control"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    disabled={loading} // desabilita input durante loading
                />
                </div>

                <button type="submit" className="btn btn-success w-100" disabled={loading}>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center">
                    <div
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                    ></div>
                    Carregando...
                    </div>
                ) : (
                    'Cadastrar'
                )}
                </button>
            </form>

            <div className="text-center mt-3">
                <span>Já tem uma conta? </span>
                <Link to="/login">Fazer Login</Link>
            </div>
            </div>
        </div>
        </div>
    );
    }

    export default RegisterPage;
