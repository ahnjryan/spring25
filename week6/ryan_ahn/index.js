const { timeStamp } = require('console');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('join room', ({ name, room}) => {
      socket.name = name || 'Anonymous';
      socket.room = room || 'lobby';
      socket.join(socket.room);
      socket.to(socket.room).emit('chat message', {
        name: 'System',
        text: socket.name + ' has joined the room.',
        timestampe: new Date().toLocaleTimeString()
      });
  });

  socket.on('chat message', (msg) => {
    const timestamp = new Date().toLocaleDateString();
    const messageObj = {
      name: socket.name || 'Anonymous',
      text: msg,
      timestamp: timestamp
    };
    io.to(socket.room || 'lobby').emit('chat message', messageObj);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});