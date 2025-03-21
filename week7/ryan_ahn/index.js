const { timeStamp } = require('console');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  room: { type: String, default: 'lobby' },
  name: { type: String, default: 'Anonymous' },
  text: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const messageModel = mongoose.model("Message", messageSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  messageModel.find().then(message => {
    console.log("messages: " + message);
  })

  socket.on('join room', ({ name, room }) => {
    socket.name = name || 'Anonymous';
    socket.room = room || 'lobby';
    socket.join(socket.room);

    socket.to(socket.room).emit('chat message', {
      name: 'System',
      text: socket.name + ' has joined the room.',
      timestamp: new Date().toLocaleDateString()
    });
  });

  socket.on('chat message', (msg) => {
    const timestamp = new Date();
    const message = new messageModel({
      room: socket.room || 'lobby',
      name: socket.name || 'Anonymous',
      text: msg,
      timestamp: timestamp
    });

    message.save().catch(err => console.error("Error saving message:", err));

    const messageObj = {
      name: socket.name || 'Anonymous',
      text: msg,
      timestamp: timestamp.toLocaleTimeString()
    };

    io.to(socket.room || 'lobby').emit('chat message', messageObj);
  });
});

server.listen(3000, async function () {
  await mongoose.connect("mongodb+srv://ryanahn:v2ctHxdkStA1AoyA@cluster0.fb1cx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
  console.log('listening on *:3000');
});
