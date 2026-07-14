const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const {
  createRoom, joinRoom, getRoomBySocketId, setPlayerReady,
  updateProgress, finishPlayer, removePlayer, getRoomState,
  setRoomStatus, resetRoom, serializeRoom,
} = require('./roomManager');

const app = express();

const allowedOrigins = [
  'https://type-x-two.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

if (process.env.FRONTEND_URL) {
  const customOrigins = process.env.FRONTEND_URL.split(',').map(url => url.trim());
  customOrigins.forEach(origin => {
    if (origin && !allowedOrigins.includes(origin)) {
      allowedOrigins.push(origin);
    }
  });
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  path: '/socket.io',
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.get('/health', (_, res) => res.json({ ok: true }));
app.get('/api/health', (_, res) => res.json({ ok: true }));

io.on('connection', (socket) => {
  console.log('[+] connected:', socket.id);

  // ── CREATE ROOM ──────────────────────────────────────────────────
  socket.on('room:create', ({ name, maxPlayers }) => {
    if (!name) return;
    const parsedMaxPlayers = parseInt(maxPlayers, 10) || 2;
    const { room, player } = createRoom(socket, name.trim().slice(0, 20), parsedMaxPlayers);
    socket.join(room.code);
    socket.emit('room:state', { room: serializeRoom(room), you: player });
    console.log(`[room] created ${room.code} by ${name}`);
  });

  // ── JOIN ROOM ─────────────────────────────────────────────────────
  socket.on('room:join', ({ name, code }) => {
    if (!name || !code) return;
    const result = joinRoom(socket.id, name.trim().slice(0, 20), code.trim().toUpperCase());
    if (result.error) {
      socket.emit('room:error', { message: result.error });
      return;
    }
    const { room, player } = result;
    socket.join(room.code);
    socket.emit('room:state', { room: serializeRoom(room), you: player });
    socket.to(room.code).emit('room:player_joined', { player });
    console.log(`[room] ${name} joined ${room.code}`);
  });

  // ── PLAYER READY ──────────────────────────────────────────────────
  socket.on('room:ready', ({ code, ready }) => {
    const room = setPlayerReady(code, socket.id, ready);
    if (!room) return;
    io.to(code).emit('room:state', { room: serializeRoom(room) });

    // Auto-start if all players ready and min 2 players
    const players = [...room.players.values()];
    if (players.length >= 2 && players.every(p => p.ready) && room.status === 'lobby') {
      startCountdown(code);
    }
  });

  // ── HOST FORCE START ─────────────────────────────────────────────
  socket.on('room:start', ({ code }) => {
    const room = getRoomState(code);
    if (!room) return;
    const rawRoom = getRoomBySocketId(socket.id);
    if (!rawRoom) return;
    const player = rawRoom.room.players.get(socket.id);
    if (!player?.isHost) return;
    if (rawRoom.room.players.size < 2) {
      socket.emit('room:error', { message: 'Need at least 2 players to start.' });
      return;
    }
    startCountdown(code);
  });

  // ── PROGRESS UPDATE ───────────────────────────────────────────────
  socket.on('race:progress', ({ code, progress, wpm, accuracy }) => {
    const room = updateProgress(code, socket.id, progress, wpm, accuracy);
    if (!room) return;
    // Broadcast to everyone in room including sender
    io.to(code).emit('race:update', { players: [...room.players.values()] });
  });

  // ── PLAYER FINISHED ───────────────────────────────────────────────
  socket.on('race:finish', ({ code, wpm, accuracy }) => {
    const result = finishPlayer(code, socket.id, wpm, accuracy);
    if (!result) return;
    const { room, allFinished } = result;
    io.to(code).emit('race:player_finished', {
      playerId: socket.id,
      wpm,
      accuracy,
      rank: room.players.get(socket.id)?.finishRank,
      players: [...room.players.values()],
    });
    if (allFinished) {
      setRoomStatus(code, 'finished');
      const sorted = [...room.players.values()].sort((a, b) => a.finishRank - b.finishRank);
      io.to(code).emit('race:results', { players: sorted });
    }
  });

  // ── REMATCH ───────────────────────────────────────────────────────
  socket.on('race:rematch', ({ code }) => {
    const found = getRoomBySocketId(socket.id);
    if (!found) return;
    const player = found.room.players.get(socket.id);
    if (!player?.isHost) return;
    const room = resetRoom(code);
    if (!room) return;
    io.to(code).emit('room:state', { room: serializeRoom(room) });
    io.to(code).emit('room:rematch');
  });

  // ── DISCONNECT ────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    const result = removePlayer(socket.id);
    if (!result || result.wasLast) return;
    const { code, room } = result;
    io.to(code).emit('room:player_left', { playerId: socket.id, room: serializeRoom(room) });
    console.log(`[-] ${socket.id} left ${code}`);
  });
});

// ── Countdown helper ───────────────────────────────────────────────
function startCountdown(code) {
  setRoomStatus(code, 'countdown');
  io.to(code).emit('race:countdown', { count: 3 });

  let count = 3;
  const iv = setInterval(() => {
    count--;
    if (count > 0) {
      io.to(code).emit('race:countdown', { count });
    } else {
      clearInterval(iv);
      setRoomStatus(code, 'racing');
      const roomState = getRoomState(code);
      io.to(code).emit('race:go', {
        passage: roomState?.passage,
        startTime: Date.now(),
      });
    }
  }, 1000);
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => console.log(`TypeClash server running on :${PORT}`));

module.exports = { app, server };
