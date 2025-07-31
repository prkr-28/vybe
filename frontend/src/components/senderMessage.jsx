import React from 'react';
import {useSelector} from 'react-redux';

const SenderMessage = ({message, image}) => {
   const {userData} = useSelector((state) => state.user);

   return (
      <div className="flex items-end justify-end gap-2 mb-3">
         <div className="w-fit max-w-[60%] bg-gradient-to-br from-[#9500ff] to-[#ff0095] rounded-t-2xl rounded-bl-2xl rounded-br-0 px-[10px] py-[10px] flex flex-col gap-[10px] text-white">
            {image && (
               <img
                  src={image}
                  alt="message"
                  className="w-32 h-32 object-cover rounded-lg"
               />
            )}
            <p>{message}</p>
         </div>
         <img
            src={userData?.profileImage}
            alt="sender"
            className="w-8 h-8 rounded-full object-cover"
         />
      </div>
   );
};

export default SenderMessage;
