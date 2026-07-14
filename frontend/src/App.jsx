import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Solo from './pages/Solo';
import Multiplayer from './pages/Multiplayer';

function Nav() {
  const loc = useLocation();
  const isHome = loc.pathname === '/';
  if (!isHome) return null;
  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <div className="nav-inner">
        <Link to="/" className="nav-logo" id="nav-logo">
          Type<span>Clash</span>
        </Link>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/solo" className="btn btn-ghost btn-sm" id="nav-solo">Solo</Link>
          <Link to="/multi?players=2" className="btn btn-primary btn-sm" id="nav-multi">Race</Link>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/solo" element={<Solo />} />
        <Route path="/multi" element={<Multiplayer />} />
      </Routes>
    </>
  );
}
