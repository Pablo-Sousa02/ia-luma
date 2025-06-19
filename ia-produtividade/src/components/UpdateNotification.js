    import React from 'react';

    export default function UpdateNotification({ onReload }) {
    return (
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
    }
