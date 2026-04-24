export function DigestListSkeleton() {
  return (
    <div style={{ marginTop: 8 }}>
      {[90, 75, 85, 70, 80].map((_, i) => (
        <div key={i} style={{ padding: '28px 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
            <div style={{ minWidth: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 3 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--border)', animation: 'pulse 1.6s ease-in-out infinite' }} />
              <div style={{ width: 24, height: 10, borderRadius: 4, background: 'var(--border)', animation: 'pulse 1.6s ease-in-out infinite' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[80, 100, 60].map((w, j) => (
                  <div key={j} style={{ width: w, height: 12, borderRadius: 4, background: 'var(--border)', animation: 'pulse 1.6s ease-in-out infinite' }} />
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[90, 75, 85, 70, 80].map((w, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 14, height: 11, borderRadius: 4, background: 'var(--border)', animation: 'pulse 1.6s ease-in-out infinite' }} />
                    <div style={{ width: `${w}%`, height: 13, borderRadius: 4, background: 'var(--border)', animation: 'pulse 1.6s ease-in-out infinite' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
