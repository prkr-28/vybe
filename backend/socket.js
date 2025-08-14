import http from "http";
import { Server } from "socket.io";
import express from "express";
import User from "./models/user.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://vybe-ten.vercel.app",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};
const onlineUsers = [];

export const getSocketId = (userId) => {
  return userSocketMap[userId] || null;
};
io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;
  if (!userId) {
    return;
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found:", userId);
      return;
    }
    userSocketMap[userId] = socket.id;
    if (!onlineUsers.find((user) => user._id === userId)) {
      onlineUsers.push({
        _id: userId,
        name: user.name,
        userName: user.userName,
        profileImage: user.profileImage,
      });
    }
    io.emit("getOnlineUsers", onlineUsers);

    socket.on("disconnect", () => {
      delete userSocketMap[userId];
      const index = onlineUsers.findIndex((user) => user._id === userId);
      if (index !== -1) {
        onlineUsers.splice(index, 1);
      }
      io.emit("getOnlineUsers", onlineUsers);
    });
  } catch (error) {
    console.error("Error handling socket connection:", error);
  }
});

export { app, io, server };
