import { io, Socket } from 'socket.io-client';

const envUrl = (import.meta as any).env?.VITE_SOCKET_URL;
const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// If VITE_SOCKET_URL is set or on localhost, connect. Otherwise, default gracefully.
const targetUrl = envUrl || (isLocalhost ? 'http://localhost:5000' : '');

export const socket: Socket = io(targetUrl || 'http://localhost:5000', {
  autoConnect: Boolean(envUrl || isLocalhost),
  reconnection: Boolean(envUrl || isLocalhost),
  reconnectionDelay: 2000,
  reconnectionAttempts: 8,
  transports: ['websocket', 'polling']
});

