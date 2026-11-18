import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner = ({ size = 32, text = 'Loading...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        gap: '0.75rem',
        color: 'var(--color-primary)',
      }}
    >
      <Loader2 className="animate-spin" size={size} />
      {text && <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{text}</p>}
    </div>
  );
};

export default Spinner;
