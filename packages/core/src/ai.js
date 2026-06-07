import { Xiangqi } from './index.js';

const PIECE_VALUES = {
  k: 10000, // King
  r: 900,   // Chariot (Rook)
  c: 450,   // Cannon
  n: 400,   // Horse
  b: 200,   // Elephant
  a: 200,   // Advisor
  p: 100    // Pawn
};

export class XiangqiAI {
  constructor(depth = 3) {
    this.depth = depth;
    this.nodesEvaluated = 0;
  }

  // Evaluate board from the perspective of a specific color
  evaluateBoard(game, color) {
    let score = 0;
    const board = game.board();

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 9; x++) {
        const piece = board[y][x];
        if (piece) {
          let value = PIECE_VALUES[piece.type];
          
          // Bonus for pawns crossing the river
          if (piece.type === 'p') {
            if (piece.color === 'r' && y <= 4) value += 100; // Red pawn crossed river
            if (piece.color === 'b' && y >= 5) value += 100; // Black pawn crossed river
          }

          if (piece.color === color) {
            score += value;
          } else {
            score -= value;
          }
        }
      }
    }
    return score;
  }

  minimax(game, depth, alpha, beta, isMaximizing, myColor) {
    this.nodesEvaluated++;
    
    if (depth === 0 || game.game_over()) {
      return this.evaluateBoard(game, myColor);
    }

    const moves = game.moves();
    
    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        game.move(moves[i]);
        const ev = this.minimax(game, depth - 1, alpha, beta, false, myColor);
        game.undo();
        maxEval = Math.max(maxEval, ev);
        alpha = Math.max(alpha, ev);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < moves.length; i++) {
        game.move(moves[i]);
        const ev = this.minimax(game, depth - 1, alpha, beta, true, myColor);
        game.undo();
        minEval = Math.min(minEval, ev);
        beta = Math.min(beta, ev);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  getBestMove(fen, aiColor) {
    const game = new Xiangqi();
    game.load(fen);
    
    const moves = game.moves({ verbose: true });
    if (moves.length === 0) return null;

    this.nodesEvaluated = 0;
    let bestMove = null;
    let bestValue = -Infinity;

    // We want to maximize the AI's score
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      game.move(move.iccs);
      
      const boardValue = this.minimax(game, this.depth - 1, -Infinity, Infinity, false, aiColor);
      
      game.undo();

      // Randomize slightly to add variety when scores are identical
      if (boardValue > bestValue || (boardValue === bestValue && Math.random() > 0.5)) {
        bestValue = boardValue;
        bestMove = move;
      }
    }

    console.log(`[AI] Evaluated ${this.nodesEvaluated} nodes. Best move: ${bestMove.iccs} with score ${bestValue}`);
    return bestMove;
  }
}
