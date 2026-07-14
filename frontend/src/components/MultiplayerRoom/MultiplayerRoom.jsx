import { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import './MultiplayerRoom.css';

const PLAYER_COLORS = ['#e63946', '#2a9d8f', '#e9c46a', '#6c63ff'];

export default function MultiplayerRoom({ maxPlayers, prefilledCode = '', onRaceStart, onPassageReceived }) {
  const [screen, setScreen] = useState('entry'); // entry | lobby
  const [name, setName] = useState('');
  const [joinCode, setJoinCode] = useState(prefilledCode.toUpperCase());
  const [error, setError] = useState('');
  const [room, setRoom] = useState(null);
  const [myId, setMyId] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (prefilledCode) {
      setJoinCode(prefilledCode.toUpperCase());
    }
  }, [prefilledCode]);

  const { emit, socket } = useSocket({
    'connect': () => {
      setMyId(socket.current?.id || '');
    },
    'room:state': ({ room: r, you }) => {
      setRoom(r);
      if (you) {
        setMyId(you.id);
        setScreen('lobby');
      }
    },
    'room:player_joined': ({ player }) => {
      setRoom(prev => prev ? { ...prev, players: [...prev.players, player] } : prev);
    },
    'room:player_left': ({ room: r }) => {
      setRoom(r);
    },
    'room:error': ({ message }) => {
      setError(message);
    },
    'race:countdown': ({ count }) => {
      onRaceStart?.({ phase: 'countdown', count });
    },
    'race:go': ({ passage, startTime }) => {
      onPassageReceived?.({ passage, startTime });
      onRaceStart?.({ phase: 'go' });
    },
    'room:rematch': () => {
      setIsReady(false);
    },
    'connect_error': (err) => {
      setError(`Multiplayer server connection error: ${err.message || 'Check connection settings.'}`);
    },
  });

  const mySocketId = socket.current?.id;

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) { setError('Please enter your name.'); return; }
    if (!socket.current || !socket.current.connected) {
      setError('Not connected to the multiplayer server. Retrying connection...');
      socket.current?.connect();
      return;
    }
    setError('');
    emit('room:create', { name: trimmed, maxPlayers });
  };

  const handleJoin = () => {
    const trimName = name.trim();
    const trimCode = joinCode.trim().toUpperCase();
    if (!trimName) { setError('Please enter your name.'); return; }
    if (!trimCode || trimCode.length !== 6) { setError('Enter a valid 6-character room code.'); return; }
    if (!socket.current || !socket.current.connected) {
      setError('Not connected to the multiplayer server. Retrying connection...');
      socket.current?.connect();
      return;
    }
    setError('');
    emit('room:join', { name: trimName, code: trimCode });
  };

  const toggleReady = () => {
    if (!room) return;
    const next = !isReady;
    setIsReady(next);
    emit('room:ready', { code: room.code, ready: next });
  };

  const handleForceStart = () => {
    if (!room) return;
    emit('room:start', { code: room.code });
  };

  const copyCode = () => {
    if (room) navigator.clipboard.writeText(room.code).catch(() => {});
  };

  const copyLink = () => {
    const url = `${window.location.origin}/multi?room=${room?.code}`;
    navigator.clipboard.writeText(url).catch(() => {});
  };

  const me = room?.players?.find(p => p.id === (myId || mySocketId));
  const isHost = me?.isHost;

  /* ── ENTRY SCREEN ─────────────────────────────────────────── */
  if (screen === 'entry') {
    return (
      <div className="mp-entry page-enter">
        <div className="mp-entry-card">
          <div className="mp-entry-icon">🏁</div>
          <h2>Race with Friends</h2>
          <p className="mp-entry-sub">{maxPlayers}-player race · Real-time sync</p>

          <div className="mp-form">
            <label htmlFor="mp-name" className="mp-label">Your Name</label>
            <input
              id="mp-name"
              className="mp-input"
              type="text"
              placeholder="Enter your name…"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={20}
              onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
            />

            {error && <p className="mp-error">{error}</p>}

            <div className="mp-actions">
              <button id="btn-create-room" className="btn btn-primary" onClick={handleCreate}>
                + Create Room
              </button>
              <div className="mp-divider"><span>or join with code</span></div>
              <div className="mp-join-row">
                <input
                  id="mp-join-code"
                  className="mp-input mp-input--code"
                  type="text"
                  placeholder="XXXXXX"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  onKeyDown={e => { if (e.key === 'Enter') handleJoin(); }}
                />
                <button id="btn-join-room" className="btn btn-outline-accent" onClick={handleJoin}>
                  Join →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── LOBBY SCREEN ─────────────────────────────────────────── */
  return (
    <div className="mp-lobby page-enter">
      <div className="mp-lobby-header">
        <div className="mp-room-code-wrap">
          <span className="mp-room-code-label">Room Code</span>
          <div className="mp-room-code">{room?.code}</div>
          <div className="mp-room-share">
            <button className="btn btn-ghost btn-sm" onClick={copyCode}>📋 Copy Code</button>
            <button className="btn btn-ghost btn-sm" onClick={copyLink}>🔗 Share Link</button>
          </div>
        </div>
        <div className="mp-player-count">
          {room?.players?.length ?? 0} / {room?.maxPlayers ?? maxPlayers} players
        </div>
      </div>

      <div className="mp-players-grid">
        {room?.players?.map((p, i) => (
          <div key={p.id} className={`mp-player-slot ${p.id === (myId || mySocketId) ? 'mp-player-slot--you' : ''}`}>
            <div className="mp-player-avatar" style={{ background: PLAYER_COLORS[i % PLAYER_COLORS.length] }}>
              {p.name.charAt(0).toUpperCase()}
            </div>
            <div className="mp-player-info">
              <span className="mp-player-name">{p.name}{p.id === (myId || mySocketId) ? ' (You)' : ''}</span>
              <span className="mp-player-badge">{p.isHost ? '👑 Host' : (p.ready ? '✅ Ready' : '⏳ Waiting')}</span>
            </div>
          </div>
        ))}
        {/* Empty slots */}
        {Array.from({ length: Math.max(0, (room?.maxPlayers ?? maxPlayers) - (room?.players?.length ?? 0)) }).map((_, i) => (
          <div key={`empty-${i}`} className="mp-player-slot mp-player-slot--empty">
            <div className="mp-player-avatar mp-player-avatar--empty">?</div>
            <div className="mp-player-info">
              <span className="mp-player-name">Waiting for player…</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mp-lobby-footer">
        <p className="mp-lobby-hint">
          {(room?.players?.length ?? 0) < 2
            ? 'Share the room code — need at least 2 players to start'
            : isHost
              ? 'All players ready? Force start or wait for ready toggles.'
              : 'Toggle ready when you want to start!'}
        </p>
        <div className="mp-lobby-actions">
          <button
            id="btn-toggle-ready"
            className={`btn ${isReady ? 'btn-ghost' : 'btn-primary'}`}
            onClick={toggleReady}
          >
            {isReady ? '✅ Ready!' : 'Ready Up'}
          </button>
          {isHost && (room?.players?.length ?? 0) >= 2 && (
            <button id="btn-force-start" className="btn btn-outline-accent" onClick={handleForceStart}>
              ⚡ Force Start
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
