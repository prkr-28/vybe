import express from 'express';
import {isAuthenticated} from '../middlewares/isauth.js';
import {
   uploadStory,
   viewStory,
   getStoryByUserName,
   getAllStories,
} from '../controller/story.js';
import upload from '../middlewares/multer.js';

const storyRouter = express.Router();

storyRouter.post(
   '/upload',
   isAuthenticated,
   upload.single('media'),
   uploadStory
);

storyRouter.get('/:storyId', isAuthenticated, viewStory);
storyRouter.get('/user/:userName', isAuthenticated, getStoryByUserName);
storyRouter.get('/', isAuthenticated, getAllStories);

export default storyRouter;
