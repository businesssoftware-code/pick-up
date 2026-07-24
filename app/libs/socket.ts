import { io, Socket } from 'socket.io-client';
import { authStorage } from './auth-storage';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3000', {
      autoConnect: true,
      transports: ['polling'],
      auth: { token: authStorage.getAccessToken() },
    });
  }
  return socket;
}

// Call after login, since the socket may have been created (and connected)
// before a token existed.
export function reconnectSocketWithAuth() {
  if (socket) {
    socket.auth = { token: authStorage.getAccessToken() };
    socket.disconnect().connect();
  }
}
