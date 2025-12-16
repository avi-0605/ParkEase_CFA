import { io } from 'socket.io-client';

// Choose socket URL based on where the app is running
const isProd =
  typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1';

const SOCKET_URL = isProd
  ? 'https://parkease-cfa-1.onrender.com' // Render backend in production
  : 'http://localhost:5001'; // Local backend for dev

const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
