import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
   name: 'user',
   initialState: {
      userData: null,
      suggestedUsers: null,
      profileData: null,
      following: [],
   },
   reducers: {
      setUserData: (state, action) => {
         state.userData = action.payload;
      },
      setSuggestedUsers: (state, action) => {
         state.suggestedUsers = action.payload;
      },
      setProfileData: (state, action) => {
         state.profileData = action.payload;
      },
      setFollowing: (state, action) => {
         state.following = action.payload;
      },
      toggleFollow: (state, action) => {
         const userId = action.payload;
         if (state.following.includes(userId)) {
            state.following = state.following.filter(id => id !== userId);
         } else {
            state.following.push(userId);
         }
      }
   },
});

export const {setUserData, setSuggestedUsers, setProfileData, setFollowing, toggleFollow} =
   userSlice.actions;
export default userSlice.reducer;
