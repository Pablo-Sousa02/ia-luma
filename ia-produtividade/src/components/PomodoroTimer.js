import React, { useState, useEffect, useRef } from 'react';

function PomodoroTimer() {
  const [tempo, setTempo] = useState(1500); // 25 minutos
  const [ativo, setAtivo] = useState(false);
  const [modo, setModo] = useState('foco');
  const [pomodoros, setPomodoros] = useState(0);
  const [mensagem, setMensagem] = useState(false);
  const [pomodorosSemana, setPomodorosSemana] = useState(0);
  const intervalRef = useRef(null);

  // 🧠 Verifica se uma data pertence à semana atual
  function isSameWeek(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const firstDay = new Date(now);
    firstDay.setDate(now.getDate() - now.getDay());
    firstDay.setHours(0, 0, 0, 0);

    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6);
    lastDay.setHours(23, 59, 59, 999);

    return date >= firstDay && date <= lastDay;
  }

  // 🧠 Atualiza os pomodoros da semana ao iniciar
  useEffect(() => {
    try {
      const salvos = JSON.parse(localStorage.getItem('pomodorosFeitos'));
      const dadosSalvos = Array.isArray(salvos) ? salvos : [];
      const daSemana = dadosSalvos.filter(data => isSameWeek(data));
      setPomodorosSemana(daSemana.length);
    } catch (err) {
      console.error('Erro ao carregar pomodorosFeitos:', err);
      setPomodorosSemana(0);
    }
  }, []);

  // ⏳ Timer
  useEffect(() => {
    if (ativo) {
      intervalRef.current = setInterval(() => {
        setTempo((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [ativo]);

  // 🏁 Ao finalizar o tempo
  useEffect(() => {
    if (tempo === 0) {
      if (modo === 'foco') {
        const novoTotal = pomodoros + 1;
        setPomodoros(novoTotal);
        setMensagem(true);
        setTimeout(() => setMensagem(false), 5000);

        const hoje = new Date().toISOString();
        try {
          const salvos = JSON.parse(localStorage.getItem('pomodorosFeitos')) || [];
          salvos.push(hoje);
          localStorage.setItem('pomodorosFeitos', JSON.stringify(salvos));

          const daSemana = salvos.filter(data => isSameWeek(data));
          setPomodorosSemana(daSemana.length);
        } catch (err) {
          console.error('Erro ao salvar pomodoros:', err);
        }

        if (novoTotal % 4 === 0) {
          iniciarPausaLonga();
        } else {
          iniciarPausaCurta();
        }
      } else {
        iniciarFoco();
      }
    }
  }, [tempo]);

  const iniciarFoco = () => {
    setTempo(1500); // 25min
    setModo('foco');
    setAtivo(false);
  };

  const iniciarPausaCurta = () => {
    setTempo(300); // 5min
    setModo('pausa-curta');
    setAtivo(false);
  };

  const iniciarPausaLonga = () => {
    setTempo(900); // 15min
    setModo('pausa-longa');
    setAtivo(false);
  };

  const formatarTempo = (segundos) => {
    const min = String(Math.floor(segundos / 60)).padStart(2, '0');
    const sec = String(segundos % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <div className="container mt-5">
      <div className="alert alert-info shadow-sm">
        <strong>Como funciona?</strong><br />
        Técnica Pomodoro: <strong>25 min foco</strong> → <strong>5 min pausa</strong>. A cada 4 ciclos, uma pausa longa.
      </div>

      {mensagem && (
        <div className="alert alert-success text-center fs-4 fw-bold">
          🎉 Parabéns! Você concluiu um Pomodoro!
        </div>
      )}

      <div className="p-4 border rounded shadow bg-dark text-white text-center">
        <h2 className="mb-3">⏱️ Pomodoro - <span className="text-info">{modo.toUpperCase()}</span></h2>
        <h1 className="display-1 mb-4">{formatarTempo(tempo)}</h1>

        <div className="d-flex justify-content-center gap-3 mb-3">
          <button className="btn btn-success px-4" onClick={() => setAtivo(true)}>Iniciar</button>
          <button className="btn btn-warning px-4" onClick={() => setAtivo(false)}>Pausar</button>
          <button className="btn btn-secondary px-4" onClick={iniciarFoco}>Resetar</button>
        </div>

        <p className="text-muted">Pomodoros concluídos hoje: <strong>{pomodoros}</strong></p>
        <p className="text-warning">Pomodoros desta semana: <strong>{pomodorosSemana}</strong></p>
      </div>
    </div>
  );
}

export default PomodoroTimer;
