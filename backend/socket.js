import http from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const useSocketMap = {};
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    useSocketMap[userId] = socket;
  }
  io.emit("getOnlineUsers", Object.keys(useSocketMap));
  socket.on("disconnect", () => {
    delete useSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(useSocketMap));
  });
});

export { app, io, server };
