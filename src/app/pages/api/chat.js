// File: pages/api/chat.js

import { Server } from 'socket.io';

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io server...');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      // Handle incoming message
      socket.on('new-message', (message) => {
        // Emit the message to all connected clients
        io.emit('receive-message', { id: socket.id, message });
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
      });
    });
  }
  res.end();
}
