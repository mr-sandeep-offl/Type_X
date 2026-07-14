import './ResultsScreen.css';

const PLAYER_COLORS = ['#e63946', '#2a9d8f', '#e9c46a', '#6c63ff'];
const MEDALS = ['🥇', '🥈', '🥉'];

export default function ResultsScreen({ players = [], myId, onRematch, onLeave, isHost }) {
  const sorted = [...players].sort((a, b) => {
    if (a.finishRank && b.finishRank) return a.finishRank - b.finishRank;
    if (a.finishRank) return -1;
    if (b.finishRank) return 1;
    return b.wpm - a.wpm;
  });

  const getColor = (id) => {
    const idx = players.findIndex(p => p.id === id);
    return PLAYER_COLORS[idx % PLAYER_COLORS.length];
  };

  const winner = sorted[0];

  return (
    <div className="results page-enter">
      <div className="results-inner">
        <div className="results-header">
          <div className="results-trophy">🏆</div>
          <h2 className="results-title">Race Complete!</h2>
          {winner && (
            <p className="results-winner-label">
              <span style={{ color: getColor(winner.id) }}>{winner.name}</span> wins with{' '}
              <strong>{winner.wpm} WPM</strong>
            </p>
          )}
        </div>

        <div className="results-podium">
          {sorted.map((p, i) => {
            const isMe = p.id === myId;
            const color = getColor(p.id);
            return (
              <div
                key={p.id}
                className={`results-row ${isMe ? 'results-row--me' : ''}`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="results-rank">
                  {i < 3 ? MEDALS[i] : <span className="results-rank-num">{i + 1}</span>}
                </div>
                <div className="results-avatar" style={{ background: color }}>
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <div className="results-player-info">
                  <span className="results-player-name">{p.name}{isMe ? ' (You)' : ''}</span>
                  <span className="results-player-acc">{p.accuracy}% accuracy</span>
                </div>
                <div className="results-wpm-badge" style={{ color }}>
                  {p.wpm}
                  <span>WPM</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="results-actions">
          {isHost && (
            <button id="btn-rematch" className="btn btn-primary" onClick={onRematch}>
              🔄 Rematch
            </button>
          )}
          {!isHost && (
            <p className="results-waiting">Waiting for host to start rematch…</p>
          )}
          <button id="btn-leave-room" className="btn btn-ghost" onClick={onLeave}>
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
}
