import React from 'react';
import {useSelector} from 'react-redux';

const ReceiverMessage = ({message, image}) => {
   const {selectedUser} = useSelector((state) => state.message);

   return (
      <div className="flex items-end justify-start gap-2 mb-3">
         <img
            src={selectedUser?.profileImage}
            alt="receiver"
            className="w-8 h-8 rounded-full object-cover"
         />
         <div className="w-fit max-w-[60%] bg-[#2f2f2f] rounded-t-2xl rounded-br-2xl rounded-bl-0 px-[10px] py-[10px] flex flex-col gap-[10px] text-white">
            {image && (
               <img
                  src={image}
                  alt="message"
                  className="w-32 h-32 object-cover rounded-lg"
               />
            )}
            <p>{message}</p>
         </div>
      </div>
   );
};

export default ReceiverMessage;
