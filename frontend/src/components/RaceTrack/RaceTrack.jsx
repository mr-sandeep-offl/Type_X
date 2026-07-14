import { useState, useEffect, useRef, useCallback } from 'react';
import { useTypingEngine } from '../../hooks/useTypingEngine';
import { formatTime } from '../../utils/stats';
import './RaceTrack.css';

const PLAYER_COLORS = ['#e63946', '#2a9d8f', '#e9c46a', '#6c63ff'];

export default function RaceTrack({
  passage,
  players = [],
  myId,
  countdown,
  raceStarted,
  onProgress,
  onFinish,
  roomCode,
}) {
  const {
    typed, cursor, errors, started, finished,
    elapsedMs, wpm, accuracy, progress, reset,
  } = useTypingEngine(raceStarted ? passage : '');

  const [localCountdown, setLocalCountdown] = useState(countdown ?? 3);
  const [showGo, setShowGo] = useState(false);
  const progressThrottle = useRef(null);

  // Update countdown prop
  useEffect(() => {
    if (countdown !== null && countdown !== undefined) {
      setLocalCountdown(countdown);
      if (countdown === 0) {
        setShowGo(true);
        setTimeout(() => setShowGo(false), 800);
      }
    }
  }, [countdown]);

  // Throttle progress updates to ~100ms
  useEffect(() => {
    if (!started || finished) return;
    if (progressThrottle.current) clearTimeout(progressThrottle.current);
    progressThrottle.current = setTimeout(() => {
      onProgress?.({ code: roomCode, progress, wpm, accuracy });
    }, 100);
    return () => clearTimeout(progressThrottle.current);
  }, [cursor, wpm, accuracy]); // eslint-disable-line

  useEffect(() => {
    if (finished) {
      onFinish?.({ code: roomCode, wpm, accuracy });
    }
  }, [finished]); // eslint-disable-line

  // Sorted players for leaderboard (by progress desc)
  const sortedPlayers = [...players].sort((a, b) => b.progress - a.progress);

  const getPlayerColor = useCallback((id) => {
    const idx = players.findIndex(p => p.id === id);
    return PLAYER_COLORS[idx % PLAYER_COLORS.length];
  }, [players]);

  const getPlayerIndex = useCallback((id) => players.findIndex(p => p.id === id), [players]);

  // Build char display
  const chars = raceStarted && passage ? passage.split('').map((ch, i) => {
    let cls = 'char char--untyped';
    if (i < typed.length) cls = errors.has(i) ? 'char char--wrong' : 'char char--correct';
    if (i === cursor) cls += ' char--cursor';
    return <span key={i} className={cls}>{ch === ' ' ? '\u00A0' : ch}</span>;
  }) : null;

  return (
    <div className="race-track page-enter">
      {/* ── Countdown overlay ── */}
      {!raceStarted && (
        <div className="race-countdown-overlay">
          <div className={`race-countdown-num ${showGo ? 'race-countdown-go' : ''}`}>
            {showGo ? 'GO!' : localCountdown}
          </div>
          <p>Get ready…</p>
        </div>
      )}

      {/* ── Live leaderboard ── */}
      <div className="race-leaderboard">
        <h3 className="race-lb-title">Live Race</h3>
        <div className="race-tracks-list">
          {sortedPlayers.map((p, rankIdx) => {
            const color = getPlayerColor(p.id);
            const isMe = p.id === myId;
            return (
              <div key={p.id} className={`race-player-row ${isMe ? 'race-player-row--me' : ''}`}>
                <div className="race-player-left">
                  <span className="race-rank">{rankIdx + 1}</span>
                  <div className="race-avatar" style={{ background: color }}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="race-player-meta">
                    <span className="race-player-name">{p.name}{isMe ? ' (You)' : ''}</span>
                    <span className="race-player-wpm">{p.wpm} WPM</span>
                  </div>
                </div>
                <div className="race-bar-wrap">
                  <div
                    className="race-bar-fill"
                    style={{
                      width: `${p.progress}%`,
                      background: color,
                    }}
                  />
                  {p.finished && (
                    <span className="race-finished-flag">🏁</span>
                  )}
                </div>
                <span className="race-pct">{Math.round(p.progress)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Stats bar ── */}
      {raceStarted && (
        <div className="race-stats-bar">
          <div className="race-stat">
            <span className="race-stat-val">{wpm}</span>
            <span className="race-stat-label">WPM</span>
          </div>
          <div className="race-stat">
            <span className="race-stat-val">{accuracy}%</span>
            <span className="race-stat-label">Accuracy</span>
          </div>
          <div className="race-stat">
            <span className="race-stat-val">{formatTime(elapsedMs)}</span>
            <span className="race-stat-label">Time</span>
          </div>
          <div className="race-stat">
            <span className="race-stat-val">{Math.round(progress)}%</span>
            <span className="race-stat-label">Progress</span>
          </div>
        </div>
      )}

      {/* ── Passage ── */}
      {raceStarted && (
        <div
          className="race-passage-wrap"
          tabIndex={0}
          aria-label="Race typing area"
        >
          <div className="race-passage">{chars}</div>
        </div>
      )}

      {/* ── Finished overlay ── */}
      {finished && (
        <div className="race-finished-overlay">
          <div className="race-finished-badge">
            🏁 You finished!
            <span className="race-finished-wpm">{wpm} WPM</span>
          </div>
        </div>
      )}
    </div>
  );
}
