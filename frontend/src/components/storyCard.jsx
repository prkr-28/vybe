import React from 'react';

const StoryCard = ({ProfileImage, userName}) => {
   return (
      <div className="w-[56px] flex flex-col">
         <div className="w-[56px] h-[56px] bg-gradient-to-l from-blue-800 to-pink-600 via-red-700 rounded-full flex items-center justify-center">
            <div className="w-[50px] h-[50px] rounded-full border-2 border-black overflow-hidden cursor-pointer">
               <img
                  className="w-full h-full object-cover"
                  src={
                     ProfileImage ||
                     'https://i.pinimg.com/474x/e6/e4/df/e6e4df26ba752161b9fc6a17321fa286.jpg'
                  }
                  alt=""
               />
            </div>
         </div>

         <div className="text-[14px] text-center truncate w-full text-white">
            {userName || 'priya12'}
         </div>
      </div>
   );
};

export default StoryCard;
