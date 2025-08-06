import React from "react";
import { FaCircle } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications } = useSelector((state) => state.user);
  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center px-4 py-6">
      {/* Header */}
      <div className="w-full flex items-center mb-6 gap-2">
        <IoMdArrowRoundBack
          onClick={() => navigate("/")}
          className="text-white text-xl hover:text-blue-400 cursor-pointer"
        />

        <h2 className="text-xl font-semibold text-white">Notifications</h2>
      </div>
      {/* Notifications List */}
      <div className="w-full max-w-2xl space-y-3 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl transition-all duration-200 ${
                notification.read
                  ? "bg-[#1a1a1a] hover:bg-[#2a2a2a]"
                  : "bg-[#262626] hover:bg-[#333333] border-l-4 border-blue-500"
              }`}
            >
              {/* Unread Dot */}
              {!notification.read && (
                <FaCircle className="text-blue-500 text-[10px] mt-1" />
              )}

              {/* Message */}
              <p className="text-white text-sm">{notification.message}</p>
            </div>
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
