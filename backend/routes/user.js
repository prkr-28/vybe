import express from 'express';
import {isAuthenticated} from '../middlewares/isauth.js';
import {getCurrentUser, getSuggestedUsers} from '../controller/user.js';

const userRouter = express.Router();
userRouter.get('/current', isAuthenticated, getCurrentUser);
userRouter.get('/suggestedUsers', isAuthenticated, getSuggestedUsers);

export default userRouter;
