const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the "public" directory
app.use(express.static(__dirname + '/public'));

// Store connected users
const users = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', (username) => {
    users[socket.id] = username;
    io.emit('userJoined', `${username} joined the chat`);
  });

  socket.on('message', (message) => {
    const username = users[socket.id];
    io.emit('message', `${username}: ${message}`);
  });

  socket.on('disconnect', () => {
    const username = users[socket.id];
    io.emit('userLeft', `${username} left the chat`);
    delete users[socket.id];
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
