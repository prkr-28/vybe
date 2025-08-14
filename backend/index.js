import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/DB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authrouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import postRouter from "./routes/post.js";
import loopRouter from "./routes/loop.js";
import storyRouter from "./routes/story.js";
import messageRouter from "./routes/message.js";
import path from "path";
dotenv.config();
import { app, server } from "./socket.js";

const PORT = process.env.PORT || 4000;

const __dirname = path.resolve();

app.use(
  cors({
    origin: "https://vybe-ten.vercel.app/",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authrouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/loop", loopRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
