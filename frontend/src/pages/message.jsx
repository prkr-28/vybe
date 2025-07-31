import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {IoMdArrowRoundBack} from 'react-icons/io';
import {setSelectedUser} from '../redux/messageSlice';
import { fetchPreviousConversations } from '../hooks/useGetAllPrevConversations';

const Message = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const {previousUsers} = useSelector((state) => state.message);

   useEffect(() => {
      dispatch(fetchPreviousConversations());
   }, []);

   const handleUserClick = (user) => {
      dispatch(setSelectedUser(user));
      navigate(`/messageArea`);
   };

   return (
      <div className="w-full min-h-[100vh] flex flex-col bg-black gap-[20px] p-[20px]">
         {/* Header */}
         <div className="w-full flex items-center  gap-2 border-b border-gray-800 pb-4">
            <IoMdArrowRoundBack
               onClick={() => navigate('/')}
               className="lg:hidden text-white text-xl hover:text-blue-400 cursor-pointer"
            />
            <h2 className="text-xl font-semibold text-white">Messages</h2>
         </div>

         {/* Previous Users */}
         <div className="flex flex-col gap-4 overflow-auto">
            {previousUsers.length > 0 ? (
               previousUsers.map((user) => (
                  <div
                     key={user._id}
                     className="flex items-center gap-4 p-3 bg-[#1e1e1e] rounded-4xl cursor-pointer hover:bg-[#2c2c2c]"
                     onClick={() => handleUserClick(user)}>
                     <img
                        src={user.profileImage}
                        alt={user.userName}
                        className="w-10 h-10 rounded-full object-cover"
                     />
                     <div className="flex flex-col">
                        <span className="text-white font-medium">
                           {user.userName}
                        </span>
                        <span className="text-gray-400 text-sm">
                           {user.name || 'No name'}
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
