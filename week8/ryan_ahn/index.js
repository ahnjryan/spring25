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

const messageModel = mongoose.model("message", messageSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  messageModel.find().then(message => {
    console.log("messages: " + message);
  })

  socket.on('join room', async ({ name, room }) => {
    socket.name = name || 'Anonymous';
    socket.room = room || 'lobby';
    socket.join(socket.room);

    try {
      const messages = await messageModel.find({ room: socket.room }).sort({ timestamp: 1 });
      socket.emit('chat history', messages);
    } catch (err) {
      console.error("Error retrieving messages:", err);
    }

    socket.to(socket.room).emit('chat message', {
      name: 'System',
      text: `${socket.name} has joined the room.`,
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
  await mongoose.connect("mongodb+srv://ryanahn:Qh9co7zXGFAumU2W@cluster0.mvzfkf7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
  console.log('listening on *:3000');
});

app.get('/messages', async function(req, res) {
  res.json(await messageModel.find());
});
