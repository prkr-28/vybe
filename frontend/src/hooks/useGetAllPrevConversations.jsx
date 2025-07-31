import axios from "axios";
import { serverUrl } from "../App";
import {
  setPreviousConversations,
  setPreviousUsers,
} from "../redux/messageSlice";

export const fetchPreviousConversations = () => async (dispatch) => {
  try {
    const res = await axios.get(`${serverUrl}/api/message/prevChats`, {
      withCredentials: true,
    });

    dispatch(setPreviousConversations(res.data.conversations));
    dispatch(setPreviousUsers(res.data.prevUsers));
  } catch (error) {
    console.error("Failed to fetch previous conversations", error);
  }
};
