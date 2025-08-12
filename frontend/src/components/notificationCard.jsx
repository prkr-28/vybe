import React from "react";
import { FaCircle } from "react-icons/fa6";

const NotificationCard = ({ noti }) => {
  return (
    <div
      className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all duration-200
        ${
          noti.isRead
            ? "bg-[#1a1a1a] hover:bg-[#2a2a2a]"
            : "bg-[#262626] hover:bg-[#333333] border-l-4 border-blue-500"
        }`}
    >
      {/* Unread Indicator */}
      {!noti.isRead && (
        <FaCircle className="text-blue-500 text-[10px] shrink-0" />
      )}

      {/* Avatar */}
      <img
        src={noti.sender.profileImage}
        alt="Sender"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
      />

      {/* Message */}
      <p className="text-white text-sm sm:text-base leading-snug">
        <span className="font-semibold">{noti.sender.name}</span> {noti.message}
        .
      </p>
    </div>
  );
};

export default NotificationCard;
