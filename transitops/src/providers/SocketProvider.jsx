import React, { createContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
    console.log('[Socket.io] Connecting to server at:', wsUrl);

    // Initialize socket connection
    const socket = io(wsUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket.io] Connected successfully. ID:', socket.id);
      setConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.warn('[Socket.io] Disconnected:', reason);
      setConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket.io] Connection error:', error.message);
      setConnected(false);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const value = {
    socket: socketRef.current,
    connected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
export default SocketProvider;
