import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {IoMdArrowRoundBack} from 'react-icons/io';
import {useNavigate} from 'react-router-dom';
import {IoImageOutline} from 'react-icons/io5';
import {IoIosSend} from 'react-icons/io';
import SenderMessage from '../components/senderMessage';
import ReceiverMessage from '../components/receiverMessage';
import axios from 'axios';
import {serverUrl} from '../App';
import {useDispatch} from 'react-redux';
import {setMessages} from '../redux/messageSlice';

const MessageArea = () => {
   const {selectedUser, Messages} = useSelector((state) => state.message);
   const navigate = useNavigate();
   const [inputValue, setInputValue] = useState('');
   const imageInputRef = useRef(null);
   const [frontendImage, setFrontendImage] = useState(null);
   const [backendImage, setBackendImage] = useState(null);
   const dispatch = useDispatch();
   const {userData} = useSelector((state) => state.user);
   const messagesEndRef = useRef(null);


   const handleImage = (e) => {
      const file = e.target.files[0];
      if (file) {
         setBackendImage(file);
         setFrontendImage(URL.createObjectURL(file));
      }
   };

   const handleSendMessage = async (e) => {
      e.preventDefault();
      try {
        const formData = new FormData();
         formData.append('message', inputValue);
         if (backendImage) {
            formData.append('image', backendImage);
         }
         const res = await axios.post(
            `${serverUrl}/api/message/send/${selectedUser._id}`,
            formData,
            {withCredentials: true}
         );
         dispatch(setMessages([...Messages, res.data]));
         setInputValue('');
         setFrontendImage(null);
         setBackendImage(null);
      } catch (error) {
         console.error('Error sending message:', error);
      }
   };

   const getAllMessages = async () => {
      try {
         const res = await axios.get(
            `${serverUrl}/api/message/getAll/${selectedUser._id}`,
            {withCredentials: true}
         );
         dispatch(setMessages(res.data));
      } catch (error) {
         console.error('Error fetching messages:', error);
      }
   };

   useEffect(() => {
      getAllMessages();
   }, [selectedUser, Messages.length]);

   const scrollToBottom = () => {
   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
};
    useEffect(() => {
        scrollToBottom();
    }, [Messages]);

   return (
      <div className="w-full min-h-screen bg-black relative">
         <div className="flex items-center gap-[15px] px-[20px] py-[10px] fixed top-0 z-[100] bg-black w-full">
            <IoMdArrowRoundBack
               className="text-white text-2xl hover:text-blue-800 cursor-pointer"
               onClick={() => navigate(-1)}
            />
            <div className="flex items-center gap-3">
               <img
                  src={selectedUser?.profileImage}
                  className="w-8 h-8 rounded-full"
                  alt=""
               />
               <div className="flex flex-col">
                  <div className="text-white text-lg font-semibold">
                     {selectedUser?.userName || 'Unknown User'}
                  </div>
                  <div className="text-gray-400 text-[14px]">
                     {selectedUser?.name || 'No Name Provided'}
                  </div>
               </div>
            </div>
         </div>

         {/* div for showing messages */}
         <div  className="w-full h-[80%] bg-black pt-[100px] pb-[80px] lg:pb-[100px] gap-[20px] overflow-auto flex flex-col px-[20px]">
            {Messages.length > 0 ? (
               Messages.map((message) =>
                  message.sender === userData._id ? (
                     <SenderMessage
                        key={message._id}
                        message={message.message}
                        image={message.image}
                     />
                  ) : (
                     <ReceiverMessage
                        key={message._id}
                        message={message.message}
                        image={message.image}
                     />
                  )
               )
            ) : (
               <div className="text-white flex items-center justify-center">No messages Yet</div>
            )}
            <div ref={messagesEndRef} />
         </div>

         {/* input form with text and image option ant bottom */}
         <div className="w-full h-[80px] fixed bottom-0 z-[100] bg-black flex items-center justify-center">
            <div className="w-[90%] max-w-[800px] h-[80%] rounded-full flex items-center justify-center gap-[10px] px-[20px] relative bg-[#131616]">
               <form
                  onSubmit={handleSendMessage}
                  className="w-full h-full flex items-center gap-3">
                  {frontendImage && (
                     <div className="w-[70px] h-[70px] rounded-2xl absolute top-[-80px] right-[10px] overflow-hidden">
                        <img
                           src={frontendImage}
                           className="h-full object-cover"
                           alt=""
                        />
                     </div>
                  )}
                  <input
                     type="text"
                     value={inputValue}
                     onChange={(e) => setInputValue(e.target.value)}
                     placeholder="Type a message..."
                     className="w-full h-full bg-transparent text-white outline-none"
                  />
                  <IoImageOutline
                     onClick={() => imageInputRef.current.click()}
                     className="text-white text-2xl cursor-pointer"
                  />
                  {/* input for image */}
                  <input
                     ref={imageInputRef}
                     type="file"
                     accept="image/*"
                     className="hidden"
                     onChange={handleImage}
                  />

                  {(inputValue || frontendImage) && (
                     <button className="w-[60px] h-[40px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white hover:scale-105 transition-transform duration-300 cursor-pointer">
                        <IoIosSend className="w-[20px] h-[20px]" />
                     </button>
                  )}
               </form>
            </div>
         </div>
      </div>
   );
};

export default MessageArea;
