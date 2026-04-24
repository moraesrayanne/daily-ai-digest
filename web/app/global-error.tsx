'use client';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: 'system-ui, sans-serif', background: '#F9F8F5', margin: 0 }}>
        <div style={{ padding: '60px 24px', textAlign: 'center' }}>
          <p style={{ color: '#9C9189', fontSize: 14, marginBottom: 16 }}>Erro crítico na aplicação.</p>
          <button
            onClick={reset}
            style={{
              background: 'oklch(63% 0.16 40)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Recarregar
          </button>
        </div>
      </body>
    </html>
  );
}
