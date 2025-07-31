import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyStory } from "../redux/storySlice";

export const useGetMyStory = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { myStory } = useSelector((state) => state.story);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/story/user/${userData?.userName}`,
          { withCredentials: true }
        );
        dispatch(setMyStory(res.data.story));
      } catch (err) {
        console.error("❌ Failed to fetch stories:", err);
      }
    };

    // ✅ Only fetch when userName is available
    if (userData?.userName && myStory === null) {
      fetchStories();
    }
  }, [userData?.stories, myStory, dispatch]);
};
