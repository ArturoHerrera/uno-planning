import { io } from 'socket.io-client';

// En desarrollo se conecta al proxy o localhost:3000
// En producción se conecta al mismo host relativo
const URL = import.meta.env.PROD ? undefined : 'http://localhost:3000';

export const socket = io(URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000
});
