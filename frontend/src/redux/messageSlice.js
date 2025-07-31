import {createSlice} from '@reduxjs/toolkit';

const messageSlice = createSlice({
   name: 'message',
   initialState: {
      selectedUser: null,
      Messages: [],
      previousConversations: [],
      previousUsers: [],
   },
   reducers: {
      setSelectedUser: (state, action) => {
         state.selectedUser = action.payload;
      },
      setMessages: (state, action) => {
         state.Messages = action.payload;
      },
      setPreviousConversations: (state, action) => {
         state.previousConversations = action.payload;
      },
      setPreviousUsers: (state, action) => {
         state.previousUsers = action.payload;
      },
   },
});

export const {
   setSelectedUser,
   setMessages,
   setPreviousConversations,
   setPreviousUsers,
} = messageSlice.actions;

export default messageSlice.reducer;
