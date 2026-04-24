'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ padding: '60px 24px', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <p style={{ color: '#9C9189', fontSize: 14, marginBottom: 16 }}>Algo deu errado ao carregar a página.</p>
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
        Tentar novamente
      </button>
    </div>
  );
}
