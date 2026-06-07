import React from 'react';

// Character mapping for Xiangqi pieces
const pieceChars = {
  r: { red: '車', black: '車' },
  n: { red: '馬', black: '馬' },
  b: { red: '相', black: '象' },
  a: { red: '仕', black: '士' },
  k: { red: '帥', black: '將' },
  c: { red: '炮', black: '砲' },
  p: { red: '兵', black: '卒' },
};

function Piece({ type, color, x, y, isSelected, onClick }) {
  if (!type) return null;

  const char = pieceChars[type]?.[color] || '';
  
  // Calculate absolute position based on grid (each square is let's say 10% of width/height roughly)
  // We will handle positioning via absolute coordinates in the parent Board, 
  // so here we just return the piece element.

  return (
    <div 
      className={`
        absolute flex items-center justify-center rounded-full cursor-pointer
        w-[8.5%] h-[8.5%] shadow-md border-2 
        ${color === 'red' ? 'text-red-700 border-red-700' : 'text-slate-900 border-slate-900'}
        ${isSelected ? 'bg-yellow-100 border-yellow-500 z-20 shadow-yellow-500/50 scale-110' : 'bg-[#e5c08b] hover:scale-105 z-10'}
        transition-transform duration-200 ease-in-out
      `}
      style={{
        left: `${(x * 100) / 8}%`, 
        top: `${(y * 100) / 9}%`,
        transform: `translate(-50%, -50%) ${isSelected ? 'scale(1.1)' : 'scale(1)'}`,
        fontFamily: "'Noto Serif', serif",
        fontSize: 'clamp(1rem, 3vw, 2rem)',
        fontWeight: 'bold',
        textShadow: '1px 1px 0 rgba(255,255,255,0.5)'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Inner ring for classical aesthetic */}
      <div className={`
        absolute inset-1 rounded-full border border-opacity-50
        ${color === 'red' ? 'border-red-700' : 'border-slate-900'}
      `}></div>
      <span className="relative z-10">{char}</span>
    </div>
  );
}

export default Piece;
