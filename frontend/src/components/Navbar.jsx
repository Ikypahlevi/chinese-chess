import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="glass-panel rounded-none border-t-0 border-x-0 px-6 py-3 flex justify-between items-center mb-6">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <span className="material-symbols-outlined text-wood text-3xl">sports_esports</span>
        <h1 className="text-xl font-bold font-serif text-wood-light">Kỳ Viện</h1>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img 
              src={user.avatar_url || '/assets/desktop/dashboard.png'} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full border border-wood/50"
            />
            <span className="font-sans font-medium">{user.username}</span>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
            title="Đăng xuất"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
