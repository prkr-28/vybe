import express from 'express';
import {isAuthenticated} from '../middlewares/isauth.js';
import upload from '../middlewares/multer.js';
import {
   commentPost,
   getAllPosts,
   likePost,
   savedPosts,
   uploadPost,
} from '../controller/post.js';

const postRouter = express.Router();

postRouter.post('/upload', isAuthenticated, upload.single('media'), uploadPost);
postRouter.get('/getAll', isAuthenticated, getAllPosts);
postRouter.post('/like/:postId', isAuthenticated, likePost);
postRouter.post('/comment/:postId', isAuthenticated, commentPost);
postRouter.post('/savePost/:postId', isAuthenticated, savedPosts);

export default postRouter;
