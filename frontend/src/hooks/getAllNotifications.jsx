import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationData } from "../redux/userSlice";

const useGetAllNotifications = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { notifications } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/user/getAllNotifications`,
          {
            withCredentials: true,
          }
        );
        dispatch(setNotificationData(response.data));
      } catch (error) {
        console.error("Error fetching all notifications:", error);
      }
    };

    fetchAllNotifications();
  }, [dispatch, userData]);
};
export default useGetAllNotifications;
