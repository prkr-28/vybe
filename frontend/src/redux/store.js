import {configureStore} from '@reduxjs/toolkit';
import userSlice from './userSlice.js';
import postSlice from './postSlice.js';
import storySlice from './storySlice.js';
import loopSlice from './loopSlice.js';
import messageSlice from './messageSlice.js';
import socketSlice from './socketSlice.js';
export const store = configureStore({
   reducer: {
      user: userSlice,
      post: postSlice,
      story: storySlice,
      message: messageSlice,
      loop: loopSlice,
      socket: socketSlice,
   },
});
