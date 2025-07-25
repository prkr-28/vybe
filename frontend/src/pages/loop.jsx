import React from 'react';
import {IoMdArrowRoundBack} from 'react-icons/io';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import LoopCard from '../components/loopCard';

const Loop = () => {
   const navigate = useNavigate();
   const {loopData} = useSelector((state) => state.loop);

   return (
      <div className="bg-black w-screen h-screen overflow-hidden relative">
         {/* Header */}
         <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <IoMdArrowRoundBack
               onClick={() => navigate('/')}
               className="text-red-500 text-2xl hover:text-blue-400 cursor-pointer"
            />
         </div>

         {/* Content */}
         <div className="w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
            {loopData.length > 0 ? (
               loopData.map((loop, idx) => (
                  <div
                     key={idx}
                     className="h-screen snap-start flex justify-center items-center">
                     <LoopCard loop={loop} />
                  </div>
               ))
            ) : (
               <div className="text-white text-lg flex justify-center items-center h-full">
                  No loops available at the moment.
               </div>
            )}
         </div>
      </div>
   );
};

export default Loop;
