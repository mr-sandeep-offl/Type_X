import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MultiplayerRoom from '../components/MultiplayerRoom/MultiplayerRoom';
import RaceTrack from '../components/RaceTrack/RaceTrack';
import ResultsScreen from '../components/ResultsScreen/ResultsScreen';
import { useSocket } from '../hooks/useSocket';
import { disconnectSocket } from '../socket';
import './Multiplayer.css';

export default function Multiplayer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const maxPlayers = parseInt(searchParams.get('players') || '2', 10);
  const prefilledRoom = searchParams.get('room') || '';

  const [phase, setPhase] = useState('lobby'); // lobby | countdown | racing | results
  const [countdown, setCountdown] = useState(3);
  const [passage, setPassage] = useState('');
  const [players, setPlayers] = useState([]);
  const [myId, setMyId] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [results, setResults] = useState(null);
  const [disconnectMsg, setDisconnectMsg] = useState('');

  const { emit, socket } = useSocket({
    'connect': () => {
      setMyId(socket.current?.id || '');
    },
    'room:state': ({ room, you }) => {
      if (room) setPlayers(room.players || []);
      if (room) setRoomCode(room.code);
      if (you) {
        setMyId(you.id);
        setIsHost(you.isHost);
      }
    },
    'room:player_joined': ({ player }) => {
      setPlayers(prev => {
        if (prev.find(p => p.id === player.id)) return prev;
        return [...prev, player];
      });
    },
    'room:player_left': ({ playerId, room }) => {
      setPlayers(room?.players || []);
      setDisconnectMsg('A player disconnected.');
      setTimeout(() => setDisconnectMsg(''), 3000);
    },
    'race:countdown': ({ count }) => {
      setPhase('countdown');
      setCountdown(count);
    },
    'race:go': ({ passage: p }) => {
      setPassage(p);
      setPhase('racing');
    },
    'race:update': ({ players: ps }) => {
      setPlayers(ps);
    },
    'race:player_finished': ({ players: ps }) => {
      setPlayers(ps);
    },
    'race:results': ({ players: ps }) => {
      setResults(ps);
      setPhase('results');
    },
    'room:rematch': () => {
      setPhase('lobby');
      setResults(null);
      setPassage('');
      setCountdown(3);
      setPlayers(prev => prev.map(p => ({
        ...p, progress: 0, wpm: 0, accuracy: 100, finished: false, finishRank: null
      })));
    },
  });

  // Keep myId synced to socket id
  useEffect(() => {
    const s = socket.current;
    if (s) {
      setMyId(s.id || '');
      const handleConnect = () => setMyId(s.id || '');
      s.on('connect', handleConnect);
      return () => {
        s.off('connect', handleConnect);
      };
    }
  }, [socket]);

  // Sync isHost from players list
  useEffect(() => {
    const me = players.find(p => p.id === myId);
    if (me) setIsHost(me.isHost);
  }, [players, myId]);

  const handleProgress = useCallback(({ code, progress, wpm, accuracy }) => {
    emit('race:progress', { code, progress, wpm, accuracy });
  }, [emit]);

  const handleFinish = useCallback(({ code, wpm, accuracy }) => {
    emit('race:finish', { code, wpm, accuracy });
  }, [emit]);

  const handleRematch = useCallback(() => {
    emit('race:rematch', { code: roomCode });
  }, [emit, roomCode]);

  const handleLeave = useCallback(() => {
    disconnectSocket();
    navigate('/');
  }, [navigate]);

  return (
    <div className="multi-page">
      <div className="multi-page-nav">
        <button className="btn btn-ghost btn-sm" id="btn-back-multi" onClick={handleLeave}>
          ← Leave
        </button>
        <h1 className="multi-page-title">
          {phase === 'lobby' && 'Multiplayer Lobby'}
          {phase === 'countdown' && 'Get Ready!'}
          {phase === 'racing' && '🏁 Race In Progress'}
          {phase === 'results' && 'Race Results'}
        </h1>
        <div />
      </div>

      {disconnectMsg && (
        <div className="multi-disconnect-banner">{disconnectMsg}</div>
      )}

      {phase === 'lobby' && (
        <MultiplayerRoom
          maxPlayers={maxPlayers}
          prefilledCode={prefilledRoom}
          onRaceStart={({ phase: p, count }) => {
            if (p === 'countdown') { setPhase('countdown'); setCountdown(count); }
          }}
          onPassageReceived={({ passage: p }) => setPassage(p)}
        />
      )}

      {(phase === 'countdown' || phase === 'racing') && (
        <RaceTrack
          passage={passage}
          players={players}
          myId={myId}
          countdown={phase === 'countdown' ? countdown : null}
          raceStarted={phase === 'racing'}
          onProgress={handleProgress}
          onFinish={handleFinish}
          roomCode={roomCode}
        />
      )}

      {phase === 'results' && (
        <ResultsScreen
          players={results || players}
          myId={myId}
          isHost={isHost}
          onRematch={handleRematch}
          onLeave={handleLeave}
        />
      )}
    </div>
  );
}
