import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import ModeSelect from '../components/ModeSelect/ModeSelect';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const modeRef = useRef(null);

  const handleStart = () => {
    modeRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing">
      <Hero onStart={handleStart} />
      <div ref={modeRef}>
        <ModeSelect
          onSolo={() => navigate('/solo')}
          onMultiplayer={(count) => navigate(`/multi?players=${count}`)}
        />
      </div>
      <footer className="landing-footer">
        <div className="container">
          <span className="nav-logo">Type<span>Clash</span></span>
          <p>Built for speed. Made for competition.</p>
        </div>
      </footer>
    </div>
  );
}
