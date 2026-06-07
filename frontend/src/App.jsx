import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
// Import other pages later when created
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Game from './pages/Game.jsx';

function App() {
  return (
    <div className="font-sans antialiased text-wood-light">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/game/:roomId" element={<Game />} />
      </Routes>
    </div>
  );
}

export default App;
