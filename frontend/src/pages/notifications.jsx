import React, { useEffect } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { markAllNotificationsRead } from "../redux/userSlice";
import NotificationCard from "../components/notificationCard";

const Notifications = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.user);

  // API function to mark as read
  const markAllRead = async () => {
    try {
      await axios.put(
        `${serverUrl}/api/user/mark-all-read`,
        {},
        { withCredentials: true }
      );
      dispatch(markAllNotificationsRead()); // update Redux immediately
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Cleanup: mark all read when leaving page
  useEffect(() => {
    return () => {
      if (notifications.some((n) => !n.isRead)) {
        markAllRead();
      }
    };
  }, [notifications]);

  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col items-center px-4 py-6">
      {/* Header */}
      <div
        className="fixed top-0 left-0 w-full flex items-center gap-2 px-5 py-4 
                backdrop-blur-md bg-black/40 z-50"
      >
        <IoMdArrowRoundBack
          onClick={() => navigate("/")}
          className="text-white text-xl hover:text-blue-400 cursor-pointer"
        />
        <h2 className="text-xl font-semibold text-white">Notifications</h2>
      </div>

      {/* Notifications List */}
      <div className="w-full max-w-2xl space-y-3 overflow-y-auto pt-16 px-4 pb-6">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationCard key={notification._id} noti={notification} />
          ))
        ) : (
          <p className="text-gray-400 text-center py-8">
            No notifications found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
