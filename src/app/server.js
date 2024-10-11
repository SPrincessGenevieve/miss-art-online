const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let clients = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Save client info for managing multiple chats
  socket.on('client-info', (clientName) => {
    clients[socket.id] = { id: socket.id, name: clientName };
  });

  // Handle new message
  socket.on('new-message', (message) => {
    io.emit('receive-message', { id: socket.id, message });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    delete clients[socket.id];
    io.emit('client-disconnected', socket.id);
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});
