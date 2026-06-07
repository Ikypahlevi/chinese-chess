import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import { initSocket, disconnectSocket } from '../services/socket.js';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [waitingPlayers, setWaitingPlayers] = useState(0);
  const [liveMatches, setLiveMatches] = useState([]);
  const [isFindingMatch, setIsFindingMatch] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const socket = initSocket(user.user_id);

    socket.on('waitingPlayersUpdate', (data) => {
      setWaitingPlayers(data.count);
    });

    socket.on('matchFound', (data) => {
      setIsFindingMatch(false);
      navigate(`/game/${data.roomId}`, { state: { matchData: data } });
    });

    socket.on('roomJoined', (data) => {
      navigate(`/game/${data.roomId}`, { state: { roomData: data } });
    });

    socket.on('error', (err) => {
      alert(err.message);
      setIsFindingMatch(false);
    });

    fetchLiveMatches();

    return () => {
      socket.off('waitingPlayersUpdate');
      socket.off('matchFound');
      socket.off('roomJoined');
      socket.off('error');
      // Do not disconnect completely if we just navigate to Game
    };
  }, [user, navigate]);

  const fetchLiveMatches = async () => {
    try {
      const response = await fetch(`${API_URL}/game/live-matches`);
      const data = await response.json();
      if (data.success) {
        setLiveMatches(data.matches);
      }
    } catch (err) {
      console.error("Failed to fetch matches", err);
    }
  };

  const findMatch = () => {
    const socket = initSocket(user.user_id);
    setIsFindingMatch(true);
    socket.emit('joinQueue', {
      userId: user.user_id,
      username: user.username,
      avatarUrl: user.avatar_url
    });
  };

  const createRoom = () => {
    const socket = initSocket(user.user_id);
    socket.emit('createRoom', { userId: user.user_id });
  };

  const joinRoom = () => {
    if (!roomCode.trim()) {
      alert('Vui lòng nhập mã phòng');
      return;
    }
    const socket = initSocket(user.user_id);
    socket.emit('joinRoomByCode', { userId: user.user_id, roomCode: roomCode.toUpperCase() });
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 pb-8 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* User Profile Column */}
          <div className="glass-panel p-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-4 border-wood overflow-hidden mb-4 shadow-lg shadow-wood/20">
              <img src={user.avatar_url || '/assets/desktop/dashboard.png'} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-serif text-wood-light font-bold mb-1">{user.full_name || user.username}</h2>
            <p className="text-wood mb-4 text-sm tracking-wide">Kỳ thủ Hạng {user.rank || 'Chưa Xếp Hạng'}</p>
            
            <div className="w-full grid grid-cols-2 gap-4 text-center mt-4 border-t border-wood/20 pt-4">
              <div>
                <p className="text-xs text-wood-light/60 uppercase">Elo</p>
                <p className="text-xl font-bold text-wood">{user.rank_points || 500}</p>
              </div>
              <div>
                <p className="text-xs text-wood-light/60 uppercase">Tỉ lệ Thắng</p>
                <p className="text-xl font-bold text-wood">
                  {user.total_matches > 0 ? Math.round((user.wins / user.total_matches) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Action Column */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="glass-panel p-6">
              <h3 className="text-xl font-serif text-wood mb-4">Sảnh Đấu</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button 
                  onClick={() => navigate('/game/ai')}
                  className="btn-primary !bg-gradient-to-b !from-green-600 !to-green-800 flex flex-col items-center justify-center gap-2 h-32"
                >
                  <span className="material-symbols-outlined text-4xl">smart_toy</span>
                  <span className="text-lg">Đánh Với Máy</span>
                  <span className="text-xs font-normal opacity-80">(Offline Mode)</span>
                </button>

                <button 
                  onClick={findMatch}
                  disabled={isFindingMatch}
                  className="btn-primary flex flex-col items-center justify-center gap-2 h-32"
                >
                  <span className="material-symbols-outlined text-4xl">swords</span>
                  <span className="text-lg">{isFindingMatch ? 'Đang tìm...' : 'Tìm Trận'}</span>
                  {waitingPlayers > 0 && (
                    <span className="text-xs font-normal opacity-80">({waitingPlayers} người đợi)</span>
                  )}
                </button>

                <div className="flex flex-col gap-4">
                  <button onClick={createRoom} className="btn-secondary h-14 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">add_circle</span>
                    Tạo Phòng Kín
                  </button>
                  
                  <div className="flex h-14 gap-2">
                    <input 
                      type="text" 
                      placeholder="Nhập mã phòng..." 
                      className="input-glass flex-1 !py-0 h-full rounded-lg uppercase"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value)}
                    />
                    <button onClick={joinRoom} className="btn-secondary px-6">Vào</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Matches */}
            <div className="glass-panel p-6 flex-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-serif text-wood">Trận Đang Diễn Ra</h3>
                <button onClick={fetchLiveMatches} className="text-wood hover:text-white" title="Làm mới">
                  <span className="material-symbols-outlined">refresh</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {liveMatches.length === 0 ? (
                  <p className="text-wood-light/50 text-center py-8 italic">Chưa có trận nào đang diễn ra.</p>
                ) : (
                  liveMatches.map((match) => (
                    <div key={match.roomId} className="flex justify-between items-center p-3 border border-wood/20 rounded-lg hover:bg-wood/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-red-400 font-bold w-24 text-right truncate">{match.redPlayerName}</span>
                        <span className="text-wood-light/30 text-sm">VS</span>
                        <span className="text-gray-300 font-bold w-24 truncate">{match.blackPlayerName}</span>
                      </div>
                      <button 
                        onClick={() => navigate(`/game/${match.roomId}`, { state: { spectate: true } })}
                        className="text-xs bg-wood text-ink px-3 py-1 rounded hover:bg-wood-light transition-colors font-medium flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        Vào Xem
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
