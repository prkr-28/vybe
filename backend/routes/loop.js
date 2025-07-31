import express from 'express';
import {isAuthenticated} from '../middlewares/isauth.js';
import upload from '../middlewares/multer.js';
import {
   commentLoop,
   getAllLoops,
   likeLoop,
   uploadLoop,
} from '../controller/loop.js';

const loopRouter = express.Router();

loopRouter.post('/upload', isAuthenticated, upload.single('media'), uploadLoop);
loopRouter.post('/like/:loopId', isAuthenticated, likeLoop);
loopRouter.post('/comment/:loopId', isAuthenticated, commentLoop);
loopRouter.get('/', isAuthenticated, getAllLoops);

export default loopRouter;
