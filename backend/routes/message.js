import express from 'express';
import {isAuthenticated} from '../middlewares/isauth.js';
import upload from '../middlewares/multer.js';
import {
   getMessages,
   getPreviousConversations,
   sendMessage,
} from '../controller/message.js';

const messageRouter = express.Router();
messageRouter.post(
   '/send/:receiverId',
   isAuthenticated,
   upload.single('image'),
   sendMessage
);
messageRouter.get('/getAll/:receiverId', isAuthenticated, getMessages);
messageRouter.get('/prevChats', isAuthenticated, getPreviousConversations);

export default messageRouter;
