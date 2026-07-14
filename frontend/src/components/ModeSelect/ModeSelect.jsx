import { useState } from 'react';
import './ModeSelect.css';

export default function ModeSelect({ onSolo, onMultiplayer }) {
  const [playerCount, setPlayerCount] = useState(2);

  return (
    <section className="mode-select page-enter" id="mode-select">
      <div className="container">
        <div className="mode-select-header">
          <h2 className="mode-select-title">Choose Your Mode</h2>
          <p className="mode-select-sub">Solo practice or live race — your call.</p>
        </div>

        <div className="mode-cards">
          {/* ── SOLO ── */}
          <div className="mode-card mode-card--solo" id="mode-solo">
            <div className="mode-card-icon">⚡</div>
            <h3 className="mode-card-title">Solo Practice</h3>
            <p className="mode-card-desc">
              Type against the clock. Track your WPM, accuracy, and streak combo.
              Beat your ghost, analyse your mistakes, and improve.
            </p>
            <ul className="mode-card-features">
              <li>📊 Live WPM &amp; accuracy stats</li>
              <li>🔥 Streak multiplier</li>
              <li>👻 Ghost replay</li>
              <li>🎹 Mistake heatmap</li>
              <li>📋 Custom text paste</li>
            </ul>
            <button
              className="btn btn-primary btn-lg mode-card-btn"
              id="btn-solo"
              onClick={onSolo}
            >
              Start Solo →
            </button>
          </div>

          {/* ── MULTIPLAYER ── */}
          <div className="mode-card mode-card--multi" id="mode-multi">
            <div className="mode-card-icon">🏁</div>
            <h3 className="mode-card-title">Race Friends</h3>
            <p className="mode-card-desc">
              Create a room, share the code, and race live against up to 4 players.
              Same passage, real-time progress bars, live leaderboard.
            </p>
            <ul className="mode-card-features">
              <li>🔗 Shareable room code</li>
              <li>📡 Real-time race track</li>
              <li>🏆 Live leaderboard</li>
              <li>🔄 Rematch support</li>
              <li>💥 Disconnect handling</li>
            </ul>

            <div className="player-count-picker">
              <span className="player-count-label">Players:</span>
              {[2, 3, 4].map(n => (
                <button
                  key={n}
                  className={`player-count-btn ${playerCount === n ? 'active' : ''}`}
                  id={`player-count-${n}`}
                  onClick={() => setPlayerCount(n)}
                  aria-pressed={playerCount === n}
                >
                  {n}
                </button>
              ))}
            </div>

            <button
              className="btn btn-primary btn-lg mode-card-btn"
              id="btn-multiplayer"
              onClick={() => onMultiplayer(playerCount)}
            >
              Play Online →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
