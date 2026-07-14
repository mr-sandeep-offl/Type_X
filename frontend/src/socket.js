import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:3001');

if (import.meta.env.PROD && !import.meta.env.VITE_BACKEND_URL) {
  console.warn(
    '[TypeClash Warning]: VITE_BACKEND_URL is not set in your production build. ' +
    'The client will default to connecting to the same origin, which may fail on serverless hosts like Vercel. ' +
    'Please set VITE_BACKEND_URL in your hosting provider configuration to your persistent backend URL.'
  );
}

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(BACKEND_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

export function connectSocket() {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
}

export function disconnectSocket() {
  if (socket && socket.connected) {
    socket.disconnect();
  }
}
