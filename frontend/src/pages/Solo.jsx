import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SoloTest from '../components/SoloTest/SoloTest';
import { getRandomPassage, getRandomWords } from '../utils/wordBank';
import './Solo.css';

function newPassage() {
  return Math.random() > 0.4 ? getRandomPassage() : getRandomWords(45);
}

function passageId(text) {
  // stable ID based on first 20 chars
  return 'p_' + text.slice(0, 20).replace(/\s/g, '_');
}

export default function Solo() {
  const navigate = useNavigate();
  const [passage, setPassage] = useState(() => newPassage());
  const [pid, setPid] = useState(() => passageId(passage));
  const [key, setKey] = useState(0);

  const handleRestart = useCallback((action, customText) => {
    if (action === 'custom' && customText) {
      setPassage(customText);
      setPid(passageId(customText));
    } else if (action === 'new') {
      const p = newPassage();
      setPassage(p);
      setPid(passageId(p));
    }
    // 'ghost' or undefined: same passage, same id → ghost loads automatically
    setKey(k => k + 1);
  }, []);

  return (
    <div className="solo-page">
      <div className="solo-page-nav">
        <button className="btn btn-ghost btn-sm" id="btn-back-solo" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1 className="solo-page-title">Solo Practice</h1>
        <div />
      </div>
      <SoloTest
        key={key}
        passage={passage}
        passageId={pid}
        onRestart={handleRestart}
      />
    </div>
  );
}
