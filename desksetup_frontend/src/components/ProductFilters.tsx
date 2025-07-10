import React from 'react';

interface Props {
  filter: string;
  setFilter: (f: string) => void;
}

const RAREZAS = ['todos', 'común', 'raro', 'épico'];

const ProductFilters: React.FC<Props> = ({ filter, setFilter }) => (
  <div style={{marginBottom: 32, display: 'flex', gap: 18, justifyContent: 'center'}}>
    {RAREZAS.map(r => (
      <button
        key={r}
        onClick={() => setFilter(r)}
        style={{
          background: filter === r ? 'linear-gradient(90deg, #6C63FF 0%, #8AFF00 100%)' : 'rgba(30,40,60,0.7)',
          color: filter === r ? '#fff' : '#8AFF00',
          border: '1.5px solid #6C63FF',
          borderRadius: 10,
          fontWeight: 700,
          fontSize: '1.1rem',
          padding: '10px 24px',
          cursor: 'pointer',
          boxShadow: filter === r ? '0 0 16px #8aff00cc' : '0 0 8px #6c63ff33',
          transition: 'all 0.2s',
        }}
      >
        {r.charAt(0).toUpperCase() + r.slice(1)}
      </button>
    ))}
  </div>
);
export default ProductFilters;
