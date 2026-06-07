import React, { useRef, useEffect } from 'react';

function MoveHistory({ history }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Group moves into pairs (Red, Black)
  const groupedMoves = [];
  for (let i = 0; i < history.length; i += 2) {
    groupedMoves.push({
      turn: Math.floor(i / 2) + 1,
      red: history[i],
      black: history[i + 1] || null
    });
  }

  return (
    <div className="glass-panel flex flex-col h-48 md:h-80 w-full font-sans">
      <div className="bg-wood/20 border-b border-wood/30 px-4 py-2 font-serif text-wood-light flex justify-between items-center rounded-t-xl">
        <span>Kỳ Phổ</span>
        <span className="material-symbols-outlined text-sm opacity-70">history_edu</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-wood/50 text-sm">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="text-wood-light/50 border-b border-wood/10 text-xs">
              <th className="py-1 w-12 font-normal">Lượt</th>
              <th className="py-1 w-1/2 font-normal text-red-400">Đỏ</th>
              <th className="py-1 w-1/2 font-normal">Đen</th>
            </tr>
          </thead>
          <tbody>
            {groupedMoves.map((group, idx) => (
              <tr key={idx} className="border-b border-wood/5 hover:bg-wood/5 transition-colors">
                <td className="py-1.5 text-wood-light/50 border-r border-wood/10">{group.turn}</td>
                <td className="py-1.5 text-red-300 font-mono tracking-wide border-r border-wood/10">{group.red?.notation || group.red?.move || '-'}</td>
                <td className="py-1.5 font-mono tracking-wide">{group.black?.notation || group.black?.move || '-'}</td>
              </tr>
            ))}
            <tr ref={scrollRef}></tr>
          </tbody>
        </table>
        {history.length === 0 && (
          <div className="text-center text-wood-light/30 mt-8 italic text-xs">Ván đấu chưa bắt đầu</div>
        )}
      </div>
    </div>
  );
}

export default MoveHistory;
