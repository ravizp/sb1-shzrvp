const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const rooms = new Map();

io.on('connection', (socket) => {
  const { roomId, username } = socket.handshake.query;
  
  socket.join(roomId);
  
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  rooms.get(roomId).add(username);

  socket.on('message', (message) => {
    io.to(roomId).emit('message', message);
  });

  socket.on('disconnect', () => {
    const room = rooms.get(roomId);
    if (room) {
      room.delete(username);
      if (room.size === 0) {
        rooms.delete(roomId);
      }
    }
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});