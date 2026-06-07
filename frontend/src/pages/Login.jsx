import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Đăng nhập thất bại.');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 font-serif">
      <div className="w-full max-w-md p-8 glass-panel animate-[fadeIn_0.5s_ease-out]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-wood mb-2 font-serif" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>CỜ TƯỚNG</h1>
          <p className="text-wood-light/80 italic font-sans text-sm">Trí Tuệ Á Đông</p>
        </div>

        {error && (
          <div className="bg-xiangqi-red/20 border border-xiangqi-red text-red-200 px-4 py-3 rounded mb-4 font-sans text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input 
              type="text" 
              placeholder="Tên đăng nhập" 
              className="input-glass font-sans"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Mật khẩu" 
              className="input-glass font-sans"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full btn-primary font-sans flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? 'Đang vào...' : 'Tiến Vào Kỳ Viện'}
            <span className="material-symbols-outlined text-lg">login</span>
          </button>
        </form>

        <div className="mt-6 text-center text-wood-light/70 font-sans text-sm">
          Chưa có danh phận?{' '}
          <Link to="/register" className="text-wood hover:text-white transition-colors underline decoration-wood/50 underline-offset-4">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
