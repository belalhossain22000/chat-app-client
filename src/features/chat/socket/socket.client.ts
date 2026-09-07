import { io, type Socket } from "socket.io-client";
import { env } from "@/lib/env";

let socket: Socket | null = null;

// Single shared connection for the whole app.
export function getSocket(token: string): Socket {
  if (socket) {
    if (socket.auth && (socket.auth as { token?: string }).token !== token) {
      socket.auth = { token };
      socket.disconnect().connect();
    }
    return socket;
  }

  socket = io(env.socketUrl, {
    auth: { token },
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  });

  return socket;
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}
