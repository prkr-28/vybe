import {createSlice} from '@reduxjs/toolkit';

const storySlice = createSlice({
   name: 'story',
   initialState: {
      storyData: [],
      storyList: [],
      myStory: null,
   },
   reducers: {
      setStoryData: (state, action) => {
         state.storyData = action.payload;
      },
      setStoryList: (state, action) => {
         state.storyList = action.payload;
      },
      setMyStory: (state, action) => {
         state.myStory = action.payload;
      },
   },
});

export const {setStoryData, setStoryList, setMyStory} = storySlice.actions;
export default storySlice.reducer;
