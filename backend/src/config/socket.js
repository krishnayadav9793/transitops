import { Server } from 'socket.io';

let io = null;

export const initWebSocket = (server) => {
  console.log('[Socket.io Server] Initializing with CORS enabled...');

  io = new Server(server, {
    cors: {
      origin: '*', 
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('[Socket.io Server] New client connected. Socket ID:', socket.id);

    
    socket.emit('connection-status', {
      status: 'connected',
      time: new Date().toISOString()
    });

    socket.on('ping', () => {
      socket.emit('pong', { time: new Date().toISOString() });
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket.io Server] Client disconnected. Reason:', reason);
    });
  });

  // Automated Mock Telemetry loop (broadcasting every 10 seconds)
  setInterval(() => {
    if (io && io.engine.clientsCount > 0) {
      const mockTelemetry = {
        driverId: 'TR-8842',
        name: 'Elena Rodriguez',
        speed: Math.round(55 + Math.random() * 15),
        fuelEfficiency: parseFloat((7.0 + Math.random() * 1.5).toFixed(1)),
        safetyScore: Math.round(95 + Math.random() * 5),
        odometer: parseFloat((12050 + Math.random() * 5).toFixed(1)),
        location: 'Route I-94 Corridor',
        timestamp: new Date().toISOString()
      };
      
      io.emit('telemetry-update', mockTelemetry);
    }
  }, 10000);
};

/**
 * Broadcasts an event to all connected sockets
 * @param {string} event - Event name
 * @param {object} data - Event payload
 */
export const broadcast = (event, data) => {
  if (io) {
    io.emit(event, data);
  } else {
    console.warn('[Socket.io Server] Cannot broadcast. Server is not initialized.');
  }
};
