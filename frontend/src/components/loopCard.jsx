import React, {useRef} from 'react';
import {FaHeart, FaRegCommentDots} from 'react-icons/fa';

const LoopCard = ({loop}) => {
   const videoRef = useRef();

   return (
      <div className="relative w-full lg:w-[480px] h-[100vh] flex items-center justify-center bg-black overflow-hidden">
         {/* Video */}
         <video
            src={loop.media}
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
         />

         {/* Overlay */}
         <div className="absolute bottom-0 left-0 p-4 w-full flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent">
            <p className="text-white font-semibold text-lg">
               @{loop.author?.userName || 'user'}
            </p>
            {loop.caption && (
               <p className="text-white text-sm mt-1">{loop.caption}</p>
            )}
         </div>

         {/* Actions */}
         <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6">
            <button className="flex flex-col items-center text-white">
               <FaHeart className="text-2xl hover:scale-110 transition-transform" />
               <span className="text-xs mt-1">{loop.likes?.length || 0}</span>
            </button>
            <button className="flex flex-col items-center text-white">
               <FaRegCommentDots className="text-2xl hover:scale-110 transition-transform" />
               <span className="text-xs mt-1">
                  {loop.comments?.length || 0}
               </span>
            </button>
         </div>
      </div>
   );
};

export default LoopCard;
