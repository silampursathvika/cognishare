const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow your frontend origin
    methods: ["GET", "POST"],
  },
});

const roomData = {}; // Store code and input for each room

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);

    // Send the current room state to the new user
    if (roomData[roomId]) {
      socket.emit("code-update", roomData[roomId].code || "// Write your code here");
      socket.emit("input-update", roomData[roomId].input || "");
    } else {
      roomData[roomId] = { code: "// Write your code here", input: "" };
    }
  });

  socket.on("code-change", (roomId, code) => {
    if (roomData[roomId]) {
      roomData[roomId].code = code; // Update room code
      socket.to(roomId).emit("code-update", code); // Broadcast to others in the room
    }
  });

  socket.on("input-change", (roomId, input) => {
    if (roomData[roomId]) {
      roomData[roomId].input = input; // Update room input
      socket.to(roomId).emit("input-update", input); // Broadcast to others in the room
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
