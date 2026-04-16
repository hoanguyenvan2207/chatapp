const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

io.on('connection', (socket) => {
  const username = socket.handshake.query.username || `User-${socket.id.slice(0, 5)}`;

  socket.broadcast.emit('system-message', {
    text: `${username} joined the chat.`
  });

  socket.on('chat-message', (message) => {
    const text = typeof message === 'string' ? message.trim() : '';
    if (!text) {
      return;
    }

    io.emit('chat-message', {
      username,
      text,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('system-message', {
      text: `${username} left the chat.`
    });
  });
});

server.listen(PORT, () => {
  console.log(`Chat app is running at http://localhost:${PORT}`);
});
