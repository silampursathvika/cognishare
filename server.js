const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get("/", (req, res) => {
  res.send("Collaborative Editor");
});

// Store rooms and associated users
const rooms = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle room join
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);

    // Broadcast to all users in the room
    socket.to(roomId).emit("user-connected", socket.id);
  });

  // Listen for code changes and broadcast to others in the same room
  socket.on("code-change", (roomId, code) => {
    socket.to(roomId).emit("code-update", code);
  });

  // Listen for input changes and broadcast to others in the same room
  socket.on("input-change", (roomId, input) => {
    socket.to(roomId).emit("input-update", input);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
