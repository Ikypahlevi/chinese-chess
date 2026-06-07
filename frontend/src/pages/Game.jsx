import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getSocket, initSocket } from '../services/socket.js';
import Navbar from '../components/Navbar.jsx';
import Board from '../components/game/Board.jsx';
import ChatBox from '../components/game/ChatBox.jsx';
import MoveHistory from '../components/game/MoveHistory.jsx';

function Game() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [gameState, setGameState] = useState(null);
  const [messages, setMessages] = useState([]);
  const [myColor, setMyColor] = useState('spectator');
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (!user) return;

    const socket = initSocket(user.user_id);

    // Initial state setup from navigation or reconnect
    const matchData = location.state?.matchData;
    const roomData = location.state?.roomData;
    const isSpectate = location.state?.spectate;

    if (matchData) {
      setMyColor(matchData.redPlayerId === user.user_id ? 'red' : 'black');
    } else if (roomData) {
      // Setup from joining room by code
      // Wait for gameState to determine color
    } else if (isSpectate) {
      setMyColor('spectator');
      socket.emit('spectateGame', { roomId });
    } else {
      // Reconnection logic (page refresh)
      socket.emit('rejoinGame', { userId: user.user_id, roomId });
    }

    // Socket Event Listeners
    socket.on('gameState', (data) => {
      setGameState(data);
      if (data.redPlayerId === user.user_id) setMyColor('red');
      else if (data.blackPlayerId === user.user_id) setMyColor('black');
    });

    socket.on('moveMade', (data) => {
      setGameState(prev => ({
        ...prev,
        fen: data.fen,
        turn: data.turn,
        history: data.history
      }));
    });

    socket.on('chatMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('gameOver', (data) => {
      setIsGameOver(true);
      alert(`Ván đấu kết thúc! Người thắng: ${data.winnerId === user.user_id ? 'Bạn' : 'Đối thủ'}`);
    });

    socket.on('error', (err) => {
      console.error(err);
      if (err.message.includes('not found') || err.message.includes('auth')) {
        navigate('/dashboard');
      }
    });

    return () => {
      socket.off('gameState');
      socket.off('moveMade');
      socket.off('chatMessage');
      socket.off('gameOver');
      socket.off('error');
    };
  }, [user, roomId, navigate, location.state]);

  const handleMove = (from, to) => {
    const socket = getSocket();
    if (socket && gameState && !isGameOver) {
      socket.emit('makeMove', {
        roomId: gameState.roomId,
        from,
        to
      });
    }
  };

  const handleSendMessage = (message) => {
    const socket = getSocket();
    if (socket && gameState) {
      socket.emit('chatMessage', {
        roomId: gameState.roomId,
        message,
        senderName: user.username
      });
    }
  };

  if (!gameState || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wood"></div>
        </div>
      </div>
    );
  }

  const isMyTurn = (gameState.turn === 'r' && myColor === 'red') || (gameState.turn === 'b' && myColor === 'black');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 pb-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Game Info & Board */}
        <div className="flex-[2] flex flex-col gap-4">
          
          {/* Opponent Info */}
          <div className="glass-panel p-3 flex justify-between items-center bg-wood/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-ink overflow-hidden border-2 border-wood/30">
                <img src="/assets/desktop/dashboard.png" alt="Opponent" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold font-sans">{myColor === 'red' ? gameState.blackPlayerName : gameState.redPlayerName || 'Đối thủ'}</p>
                <p className="text-xs text-wood-light/60">Elo: {myColor === 'red' ? gameState.blackPlayerElo : gameState.redPlayerElo || '?'}</p>
              </div>
            </div>
            {!isMyTurn && !isGameOver && myColor !== 'spectator' && (
              <span className="text-xs px-2 py-1 bg-wood/20 text-wood rounded animate-pulse">Đang suy nghĩ...</span>
            )}
          </div>

          {/* Board */}
          <div className="flex-1 flex items-center justify-center p-4">
             <Board 
               fen={gameState.fen} 
               onMove={handleMove} 
               playerColor={myColor === 'spectator' ? 'red' : myColor} 
               isMyTurn={isMyTurn && !isGameOver}
             />
          </div>

          {/* My Info */}
          <div className={`glass-panel p-3 flex justify-between items-center ${isMyTurn && !isGameOver ? 'bg-wood/20 border-wood shadow-lg shadow-wood/10' : 'bg-wood/10'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-ink overflow-hidden border-2 border-wood/30">
                <img src={user.avatar_url || '/assets/desktop/dashboard.png'} alt="Me" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold font-sans">{user.username} (Bạn)</p>
                <p className="text-xs text-wood-light/60">Cầm quân: {myColor === 'red' ? 'Đỏ' : myColor === 'black' ? 'Đen' : 'Khán giả'}</p>
              </div>
            </div>
            {isMyTurn && !isGameOver && (
              <span className="text-xs px-2 py-1 bg-xiangqi-red text-white rounded font-bold">Lượt của bạn</span>
            )}
          </div>

          {/* Actions */}
          {myColor !== 'spectator' && !isGameOver && (
            <div className="flex gap-4 mt-2">
               <button className="flex-1 btn-secondary text-sm !py-2">Cầu Hòa</button>
               <button className="flex-1 btn-secondary text-sm !py-2 !text-red-400 !border-red-400/30 hover:!bg-red-400/10 hover:!text-red-300">Nhận Thua</button>
            </div>
          )}

        </div>

        {/* Right Column: Chat & History */}
        <div className="flex-1 flex flex-col gap-6 lg:max-w-sm">
          <MoveHistory history={gameState.history || []} />
          <ChatBox 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            currentUserId={user.user_id} 
          />
        </div>

      </div>
    </div>
  );
}

export default Game;
