import { useEffect, useRef } from 'react';
import './Hero.css';

const KEYS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M'],
];

// sequence of keys to animate
const SEQUENCE = 'TYPECLASH'.split('');

export default function Hero({ onStart }) {
  const keyRefs = useRef({});

  useEffect(() => {
    let i = 0;
    let loopTimeout;
    const animate = () => {
      const key = SEQUENCE[i % SEQUENCE.length];
      const el = keyRefs.current[key];
      if (el) {
        el.classList.add('hero-key--active');
        setTimeout(() => el.classList.remove('hero-key--active'), 300);
      }
      i++;
      loopTimeout = setTimeout(animate, 180);
    };
    loopTimeout = setTimeout(animate, 600);
    return () => clearTimeout(loopTimeout);
  }, []);

  return (
    <section className="hero" aria-label="TypeClash hero">
      <div className="hero-content">
        <div className="hero-badge">🏆 Real-Time Typing Races</div>
        <h1 className="hero-title">
          Type.<br />
          <span className="hero-title-accent">Race.</span><br />
          Win.
        </h1>
        <p className="hero-sub">
          Challenge friends to live typing races or sharpen your solo WPM.<br />
          Track accuracy, beat your ghost, and climb the leaderboard.
        </p>
        <div className="hero-actions">
          <button
            id="hero-get-started"
            className="btn btn-primary btn-lg"
            onClick={onStart}
          >
            Get Started →
          </button>
          <div className="hero-stat-row">
            <span className="hero-stat"><b>WPM</b> Tracking</span>
            <span className="hero-stat-dot" />
            <span className="hero-stat"><b>2–4</b> Player Races</span>
            <span className="hero-stat-dot" />
            <span className="hero-stat"><b>Ghost</b> Replay</span>
          </div>
        </div>
      </div>

      <div className="hero-keyboard-wrap" aria-hidden="true">
        <div className="hero-keyboard">
          {KEYS.map((row, ri) => (
            <div key={ri} className={`hero-row hero-row--${ri}`}>
              {row.map((k) => (
                <div
                  key={k}
                  className="hero-key"
                  ref={el => keyRefs.current[k] = el}
                >
                  <span>{k}</span>
                </div>
              ))}
            </div>
          ))}
          {/* Space bar */}
          <div className="hero-row">
            <div className="hero-key hero-key--space" ref={el => keyRefs.current[' '] = el}>
              <span>SPACE</span>
            </div>
          </div>
        </div>
        <div className="hero-keyboard-shadow" />
      </div>
    </section>
  );
}
