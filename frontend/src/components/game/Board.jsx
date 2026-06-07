import React, { useState, useEffect, useRef } from 'react';
import Piece from './Piece.jsx';
import { Xiangqi } from '@cotuong/core';

function Board({ fen, onMove, playerColor, isMyTurn, lastMove }) {
  const [game, setGame] = useState(new Xiangqi());
  const [board, setBoard] = useState([]);
  const [selectedPos, setSelectedPos] = useState(null);
  const [validMoves, setValidMoves] = useState([]);

  // Parse FEN into grid array whenever it changes
  useEffect(() => {
    const newGame = new Xiangqi();
    newGame.load(fen || 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1');
    setGame(newGame);
    
    // Convert game board to our render array
    const boardArray = [];
    const internalBoard = newGame.board(); // 10x9 array
    
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 9; x++) {
        const piece = internalBoard[y][x];
        if (piece) {
          boardArray.push({
            id: `${x}-${y}-${piece.type}-${piece.color}`,
            type: piece.type,
            color: piece.color === 'r' ? 'red' : 'black',
            x: x,
            y: y,
            posStr: algebraic(x, y)
          });
        }
      }
    }
    setBoard(boardArray);
    setSelectedPos(null);
    setValidMoves([]);
  }, [fen]);

  const algebraic = (x, y) => {
    const cols = 'abcdefghi';
    const rows = '9876543210';
    return cols[x] + rows[y];
  };

  const handleSquareClick = (x, y) => {
    if (!isMyTurn) return;
    const clickedAlgebraic = algebraic(x, y);

    // If clicking on a valid move highlight
    if (selectedPos && validMoves.includes(clickedAlgebraic)) {
      onMove(selectedPos, clickedAlgebraic);
      setSelectedPos(null);
      setValidMoves([]);
      return;
    }

    // If clicking on a piece
    const piece = board.find(p => p.x === x && p.y === y);
    if (piece && piece.color === playerColor) {
      setSelectedPos(clickedAlgebraic);
      // Calculate valid moves from game engine
      const moves = game.moves({ square: clickedAlgebraic, verbose: true });
      setValidMoves(moves.map(m => m.to));
    } else {
      setSelectedPos(null);
      setValidMoves([]);
    }
  };

  // Flip board if player is black
  const isFlipped = playerColor === 'black';

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-[9/10] bg-board-pattern bg-cover bg-center rounded border-[12px] border-[#5C3A21] shadow-2xl overflow-hidden">
      
      {/* Interaction Grid Overlay */}
      <div 
        className={`absolute inset-0 z-0 transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`}
      >
        {/* Render Pieces */}
        {board.map((piece) => (
          <Piece 
            key={piece.id}
            type={piece.type}
            color={piece.color}
            x={piece.x}
            y={piece.y}
            isSelected={selectedPos === piece.posStr}
            onClick={() => handleSquareClick(piece.x, piece.y)}
          />
        ))}

        {/* Valid Move Highlights */}
        {validMoves.map(pos => {
          const file = pos.charCodeAt(0) - 97; // a=0, i=8
          const rank = 9 - parseInt(pos[1]); // 9=0, 0=9
          
          return (
            <div 
              key={`highlight-${pos}`}
              className="absolute w-[8.5%] h-[8.5%] flex items-center justify-center cursor-pointer z-20"
              style={{
                left: `${(file * 100) / 8}%`, 
                top: `${(rank * 100) / 9}%`,
                transform: `translate(-50%, -50%)`
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleSquareClick(file, rank);
              }}
            >
              <div className="w-3 h-3 rounded-full bg-green-500/70 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
            </div>
          );
        })}

        {/* Clickable transparent grid squares for empty spaces */}
        {Array.from({ length: 10 }).map((_, y) => 
          Array.from({ length: 9 }).map((_, x) => (
            <div 
              key={`grid-${x}-${y}`}
              className="absolute w-[11.11%] h-[10%] cursor-pointer z-0"
              style={{
                left: `${(x * 100) / 8}%`, 
                top: `${(y * 100) / 9}%`,
                transform: `translate(-50%, -50%)`
              }}
              onClick={() => handleSquareClick(x, y)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Board;
