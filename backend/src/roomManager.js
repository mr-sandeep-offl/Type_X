const { getPassage, getRandomPassageIndex } = require('./passageGenerator');

// rooms: Map<code, RoomState>
const rooms = new Map();

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return rooms.has(code) ? generateCode() : code;
}

function createRoom(hostSocket, hostName, maxPlayers) {
  const code = generateCode();
  const passageIndex = getRandomPassageIndex();
  const passage = getPassage(passageIndex);

  const room = {
    code,
    maxPlayers,
    passage,
    passageIndex,
    status: 'lobby', // lobby | countdown | racing | finished
    players: new Map(),
    createdAt: Date.now(),
  };

  const player = {
    id: hostSocket.id,
    name: hostName,
    progress: 0,
    wpm: 0,
    accuracy: 100,
    finished: false,
    finishRank: null,
    isHost: true,
    ready: false,
  };

  room.players.set(hostSocket.id, player);
  rooms.set(code, room);

  return { room, player };
}

function joinRoom(socketId, playerName, code) {
  const room = rooms.get(code.toUpperCase());
  if (!room) return { error: 'Room not found. Check the code and try again.' };
  if (room.status !== 'lobby') return { error: 'Race already in progress.' };
  if (room.players.size >= room.maxPlayers) return { error: 'Room is full.' };

  const player = {
    id: socketId,
    name: playerName,
    progress: 0,
    wpm: 0,
    accuracy: 100,
    finished: false,
    finishRank: null,
    isHost: false,
    ready: false,
  };

  room.players.set(socketId, player);
  return { room, player };
}

function getRoomBySocketId(socketId) {
  for (const [code, room] of rooms) {
    if (room.players.has(socketId)) return { code, room };
  }
  return null;
}

function setPlayerReady(code, socketId, ready) {
  const room = rooms.get(code);
  if (!room) return null;
  const player = room.players.get(socketId);
  if (player) player.ready = ready;
  return room;
}

function updateProgress(code, socketId, progress, wpm, accuracy) {
  const room = rooms.get(code);
  if (!room) return null;
  const player = room.players.get(socketId);
  if (player) {
    player.progress = progress;
    player.wpm = wpm;
    player.accuracy = accuracy;
  }
  return room;
}

function finishPlayer(code, socketId, wpm, accuracy) {
  const room = rooms.get(code);
  if (!room) return null;

  const player = room.players.get(socketId);
  if (player && !player.finished) {
    player.finished = true;
    player.wpm = wpm;
    player.accuracy = accuracy;
    player.progress = 100;
    const finishedCount = [...room.players.values()].filter(p => p.finished).length;
    player.finishRank = finishedCount;
  }

  const allFinished = [...room.players.values()].every(p => p.finished);
  return { room, allFinished };
}

function removePlayer(socketId) {
  const found = getRoomBySocketId(socketId);
  if (!found) return null;
  const { code, room } = found;
  room.players.delete(socketId);

  if (room.players.size === 0) {
    rooms.delete(code);
    return { code, room: null, wasLast: true };
  }

  // If host left, promote next player
  const anyHost = [...room.players.values()].some(p => p.isHost);
  if (!anyHost) {
    const first = room.players.values().next().value;
    if (first) first.isHost = true;
  }

  return { code, room, wasLast: false };
}

function getRoomState(code) {
  const room = rooms.get(code);
  if (!room) return null;
  return serializeRoom(room);
}

function serializeRoom(room) {
  return {
    code: room.code,
    maxPlayers: room.maxPlayers,
    passage: room.passage,
    status: room.status,
    players: [...room.players.values()].map(p => ({ ...p })),
  };
}

function setRoomStatus(code, status) {
  const room = rooms.get(code);
  if (room) room.status = status;
}

function resetRoom(code) {
  const room = rooms.get(code);
  if (!room) return null;
  const passageIndex = getRandomPassageIndex();
  room.passage = getPassage(passageIndex);
  room.status = 'lobby';
  room.players.forEach(p => {
    p.progress = 0;
    p.wpm = 0;
    p.accuracy = 100;
    p.finished = false;
    p.finishRank = null;
    p.ready = false;
  });
  return room;
}

// Auto-cleanup stale empty rooms every 10 min
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms) {
    if (room.players.size === 0 && now - room.createdAt > 10 * 60 * 1000) {
      rooms.delete(code);
    }
  }
}, 5 * 60 * 1000);

module.exports = {
  createRoom, joinRoom, getRoomBySocketId, setPlayerReady,
  updateProgress, finishPlayer, removePlayer, getRoomState,
  setRoomStatus, resetRoom, serializeRoom,
};
