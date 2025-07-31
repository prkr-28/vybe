import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {LuDiamondPlus} from 'react-icons/lu';
import {useSelector} from 'react-redux';
import {serverUrl} from '../App';
import axios from 'axios';

const StoryCard = ({profileImage, userName, story, myProfile}) => {
   const navigate = useNavigate();
   const {userData, storyData, storyList} = useSelector((state) => state.user);
   const [isViewed, setIsViewed] = useState(false);

   const handleViewers = async () => {
      try {
         await axios.get(`${serverUrl}/api/story/${story._id}`, {
            withCredentials: true,
         });
      } catch (error) {
         console.error('Error fetching viewers:', error);
         alert('Failed to fetch viewers');
      }
   };

   const handleClick = () => {
      if (!story && myProfile) {
         navigate('/upload');
      } else if (story && userName === 'Your Story') {
         handleViewers();
         navigate(`/story/${userData.userName}`);
      } else {
         handleViewers();
         navigate(`/story/${userName}`);
      }
   };

   useEffect(() => {
      if (story?.viewers?.some((viewer) => viewer._id === userData?._id)) {
         setIsViewed(true);
      } else {
         setIsViewed(false);
      }
   }, [story, userData, storyData, storyList]);

   return (
      <div className="flex flex-col cursor-pointer" onClick={handleClick}>
         <div
            className={`relative w-[56px] h-[56px] ${
               !story?.media
                  ? ''
                  : !isViewed
                  ? 'bg-gradient-to-l from-blue-800 to-pink-600 via-red-700'
                  : 'bg-gray-800'
            } rounded-full flex items-center justify-center`}>
            <div className="w-[50px] h-[50px] rounded-full border-2 border-black overflow-hidden cursor-pointer">
               <img
                  className="w-full h-full object-cover"
                  src={profileImage}
                  alt=""
               />
            </div>
            {myProfile && !story?.media ? (
               <div className="absolute top-4 left-5 w-full h-full flex items-center justify-center">
                  <LuDiamondPlus className="text-white text-2xl" />
               </div>
            ) : null}
         </div>

         <div className="text-[14px] text-center  w-full text-white">
            {userName}
         </div>
      </div>
   );
};

export default StoryCard;
