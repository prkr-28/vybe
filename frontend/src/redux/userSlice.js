import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    suggestedUsers: null,
    profileData: null,
    following: [],
    searchedUsers: [],
    notifications: [],
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
    setSearchedUsers: (state, action) => {
      state.searchedUsers = action.payload;
    },
    setNotificationData: (state, action) => {
      state.notifications = action.payload || [];
    },
    addNotification: (state, action) => {
      const exists = state.notifications.some(
        (n) => n._id === action.payload._id
      );
      if (!exists) {
        // insert at the front to keep newest first
        state.notifications = [action.payload, ...state.notifications];
      }
    },

    markAllNotificationsRead: (state) => {
      state.notifications = state.notifications.map((n) => ({
        ...n,
        isRead: true,
      }));
    },
    toggleFollow: (state, action) => {
      const userId = action.payload;
      if (state.following.includes(userId)) {
        state.following = state.following.filter((id) => id !== userId);
      } else {
        state.following.push(userId);
      }
    },
  },
});

export const {
  setUserData,
  setSuggestedUsers,
  setProfileData,
  setFollowing,
  setSearchedUsers,
  toggleFollow,
  setNotificationData,
  addNotification,
  markAllNotificationsRead,
} = userSlice.actions;

export default userSlice.reducer;
