import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { setSelectedUser } from "../redux/messageSlice";
import { fetchPreviousConversations } from "../hooks/useGetAllPrevConversations";

const Message = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { previousUsers } = useSelector((state) => state.message);
  const { onlineUsers } = useSelector((state) => state.socket);
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchPreviousConversations());
  }, []);

  const handleUserClick = (user) => {
    dispatch(setSelectedUser(user));
    navigate(`/messageArea`);
  };

  const otherOnlineUsers = onlineUsers.filter(user => user._id !== userData?._id);


  return (
    <div className="w-full min-h-screen flex flex-col bg-black gap-5 p-4">
      {/* Header */}
      <div className="w-full flex items-center gap-2 border-b border-gray-800 pb-4">
        <IoMdArrowRoundBack
          onClick={() => navigate("/")}
          className="lg:hidden text-white text-xl hover:text-blue-400 cursor-pointer"
        />
        <h2 className="text-xl font-semibold text-white">Messages</h2>
      </div>

      {/* Online Users */}
      <div className="w-full overflow-x-auto whitespace-nowrap flex gap-4 px-1 border-b border-gray-800 pb-3">
        {otherOnlineUsers.length > 0 ? otherOnlineUsers.map((user) => (
            <div
              key={user._id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleUserClick(user)}
            >
              <div className="relative w-14 h-14">
                <img
                  src={user.profileImage}
                  alt={user.userName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-600"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></span>
              </div>
              <span className="text-white text-sm mt-1 max-w-[56px] truncate">
                {user.userName}
              </span>
            </div>
          )):
            <div className="flex items-center justify-center w-full">
               <p className="text-white">No users online</p>
            </div>
          }
      </div>

      {/* Previous Chatted Users */}
      <div className="flex flex-col gap-4 overflow-y-auto">
        {previousUsers.length > 0 ? (
          previousUsers.map((user) => (
            <div
              key={user._id}
              className=" flex items-center gap-4 p-3 bg-[#1e1e1e] rounded-2xl cursor-pointer hover:bg-[#2c2c2c]"
              onClick={() => handleUserClick(user)}
            >
               <div className="relative">
              <img
                src={user.profileImage}
                alt={user.userName}
                className="w-10 h-10 rounded-full object-cover border-2 border-black"
              />
              {
               otherOnlineUsers.some((u) => u._id === user._id) && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></span>
                  )
              }
              </div>
              
              <div className="flex flex-col">
                <span className="text-white font-medium">{user.userName}</span>
                <span className="text-gray-400 text-sm">
                  {user.name || "No name"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white">No conversations yet</p>
        )}
      </div>
    </div>
  );
};

export default Message;
