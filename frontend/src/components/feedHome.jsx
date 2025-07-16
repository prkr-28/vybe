import React from 'react';
import {FaRegHeart} from 'react-icons/fa6';
import StoryCard from './storyCard';
import Nav from './nav';

const FeedHome = () => {
   return (
      <div className="lg:w-[50%] w-full bg-gradient-to-b from-black to-gray-900 min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto">
         <div className="w-full h-[80px] flex items-center justify-between px-[20px] lg:hidden">
            <div className="logo font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent text-[22px]">
               VYBE
            </div>
            <div>
               <FaRegHeart className="text-white text-2xl" />
            </div>
         </div>

         {/* story section */}
         <div className="flex w-full overflow-auto gap-3 items-center px-4 pb-4 lg:p-4 border-b border-gray-800">
            <StoryCard />
            <StoryCard />
            <StoryCard />
            <StoryCard />
            <StoryCard />
            <StoryCard />
            <StoryCard />
            <StoryCard />
            <StoryCard />
            <StoryCard />
            <StoryCard />
            <StoryCard />
            <StoryCard />
            <StoryCard />
            <StoryCard />
            <StoryCard />
            <StoryCard />
            <StoryCard />
            <StoryCard />
            <StoryCard />
         </div>

         {/* posts section */}
         <div className="w-full min-h-[100vh] flex flex-col items-center gap-4 p-[10px] pt-[40px] bg-white rounded-t-2xl relative pb-[120px]">
            <Nav />
         </div>
      </div>
   );
};

export default FeedHome;
