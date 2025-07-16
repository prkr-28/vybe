import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/DB.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authrouter from './routes/auth.js';
import userRouter from './routes/user.js';
dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 4000;

app.use(
   cors({
      origin: 'http://localhost:5173',
      credentials: true,
   })
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authrouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
   connectDB();
   console.log(`Server is running on http://localhost:${PORT}`);
});
