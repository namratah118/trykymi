export function LoadingFallback() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0A3323',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(247,244,213,0.1)',
            borderTop: '3px solid #D3968C',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
      <p style={{ color: '#F7F4D5', fontSize: '16px', marginBottom: '8px', fontWeight: 500 }}>
        Loading trykymi
      </p>
      <p style={{ color: 'rgba(247,244,213,0.5)', fontSize: '14px' }}>
        Getting everything ready for you...
      </p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
