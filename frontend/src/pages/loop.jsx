import React from 'react';
import {IoMdArrowRoundBack} from 'react-icons/io';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import LoopCard from '../components/loopCard';

const Loop = () => {
   const navigate = useNavigate();
   const {userData} = useSelector((state) => state.user);
   return (
      <div className="bg-black w-screen min-h-screen overflow-hidden flex justify-center items-center p-4">
         {/* Header */}
         <div className="w-full flex items-center mb-6 gap-2 fixed top-6 left-5">
            <IoMdArrowRoundBack
               onClick={() => navigate('/')}
               className="text-white text-xl hover:text-blue-400 cursor-pointer"
            />
         </div>

         <LoopCard
            loop={{
               title: 'Loop Title',
               caption: 'This is a sample caption for the loop.',
               audioUrl: '',
               liked: false,
            }}
            onLike={(liked) => console.log('Liked:', liked)}
            onMute={(muted) => console.log('Muted:', muted)}
            onPlayPause={(playing) => console.log('Playing:', playing)}
         />
      </div>
   );
};

export default Loop;
