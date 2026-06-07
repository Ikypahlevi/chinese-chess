import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        navigate('/', { state: { message: 'Đăng ký thành công! Hãy đăng nhập.' } });
      } else {
        setError(data.message || 'Đăng ký thất bại.');
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
          <h1 className="text-3xl font-bold text-wood mb-2 font-serif">Ghi Danh Tỷ Thí</h1>
          <p className="text-wood-light/80 italic font-sans text-sm">Trở thành kỳ thủ lưu danh thiên cổ</p>
        </div>

        {error && (
          <div className="bg-xiangqi-red/20 border border-xiangqi-red text-red-200 px-4 py-3 rounded mb-4 font-sans text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input 
              type="text" 
              name="username"
              placeholder="Tên đăng nhập (Kỳ hiệu)" 
              className="input-glass font-sans"
              value={formData.username}
              onChange={handleChange}
              required 
            />
          </div>
          <div>
            <input 
              type="text" 
              name="fullName"
              placeholder="Họ và tên thật" 
              className="input-glass font-sans"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div>
            <input 
              type="email" 
              name="email"
              placeholder="Email liên lạc" 
              className="input-glass font-sans"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div>
            <input 
              type="password" 
              name="password"
              placeholder="Mật khẩu" 
              className="input-glass font-sans"
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          <div>
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu" 
              className="input-glass font-sans"
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full btn-primary font-sans mt-4"
            disabled={loading}
          >
            {loading ? 'Đang khắc ấn...' : 'Đăng Ký Khai Cục'}
          </button>
        </form>

        <div className="mt-6 text-center text-wood-light/70 font-sans text-sm">
          Đã có danh phận?{' '}
          <Link to="/" className="text-wood hover:text-white transition-colors underline decoration-wood/50 underline-offset-4">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
