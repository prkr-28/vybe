import React, {useEffect, useState, useRef} from 'react';
import {useSelector} from 'react-redux';
import {IoArrowBack} from 'react-icons/io5';
import {useNavigate} from 'react-router-dom';
import {FaRegEye} from 'react-icons/fa';
import {IoClose} from 'react-icons/io5';

const UserStoryViewCard = ({story}) => {
   const navigate = useNavigate();
   const isVideo = story.mediaType === 'video';
   const {userData} = useSelector((state) => state.user);

   const [progress, setProgress] = useState(0);
   const [duration, setDuration] = useState(15); // default 15s for image
   const [paused, setPaused] = useState(false);
   const [showViewers, setShowViewers] = useState(false);
   const videoRef = useRef(null);

   // 📊 Control progress timer
   useEffect(() => {
      if (!duration || paused) return;

      const interval = setInterval(() => {
         setProgress((prev) => {
            const next = prev + 100 / (duration * 10);
            if (next >= 100) {
               clearInterval(interval);
               navigate('/');
               return 100;
            }
            return next;
         });
      }, 100);

      return () => clearInterval(interval);
   }, [duration, paused, navigate]);

   // 🎥 On video metadata load, get its duration
   const handleVideoLoaded = () => {
      const video = videoRef.current;
      if (video && video.duration) {
         setDuration(video.duration);
      }
   };

   // 🖼️ Reset duration for image
   useEffect(() => {
      if (!isVideo) {
         setDuration(15);
      }
   }, [story, isVideo]);

   // 🛑 Pause/resume on modal open/close
   useEffect(() => {
      setPaused(showViewers);
   }, [showViewers]);

   // 🎬 Pause/resume video on modal open/close
   useEffect(() => {
      const video = videoRef.current;
      if (video) {
         if (showViewers) video.pause();
         else video.play().catch(() => {});
      }
   }, [showViewers]);

   return (
      <div className="min-w-[100vw] max-w-[500px] h-screen border-x-2 border-gray-800 relative flex flex-col items-center justify-center bg-black">
         {/* Progress Bar */}
         <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
            <div
               className="h-full bg-white transition-all duration-300 ease-linear"
               style={{width: `${progress}%`}}
            />
         </div>

         {/* Viewers icon (only for author) */}
         {userData.userName === story?.author?.userName && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white py-1 px-3 rounded bg-black/60">
               <FaRegEye
                  onClick={() => setShowViewers(true)}
                  className="w-5 h-5 text-white cursor-pointer"
               />
               <span>{story.viewers.length} views</span>
            </div>
         )}

         {/* Back & Author Info */}
         <button
            className="flex items-center justify-center gap-2 cursor-pointer absolute top-4 left-2 z-10 bg-black/60 rounded-full p-2 hover:bg-black/80 transition"
            onClick={() => navigate(-1)}
            type="button">
            <IoArrowBack className="text-white text-2xl hover:text-gray-300" />
            <div className="flex items-center gap-2">
               <img
                  src={story.author?.profileImage}
                  className="w-10 h-10 rounded-full"
                  alt=""
               />
               <div className="flex flex-col text-start">
                  <p className="text-white text-lg font-semibold tracking-wide drop-shadow-md">
                     {story.author?.userName}
                  </p>
                  <span className="text-gray-400 text-[11px]">
                     {new Date(story?.createdAt).toLocaleDateString()}
                  </span>
               </div>
            </div>
         </button>

         {/* Story Media */}
         <div className="w-full flex-1 flex justify-center items-center pt-12 pb-20">
            {isVideo ? (
               <video
                  ref={videoRef}
                  src={story.media}
                  autoPlay
                  loop
                  muted={false}
                  onLoadedMetadata={handleVideoLoaded}
                  className="w-full max-h-[70vh] object-contain"
               />
            ) : (
               <img
                  src={story.media}
                  alt="Story"
                  className="w-full max-h-[70vh] object-contain"
               />
            )}
         </div>

         {/* Viewers Modal (Only for Author) */}
         {userData.userName === story?.author?.userName && (
            <div
               className={`absolute bottom-0 left-0 w-full bg-black bg-opacity-90 rounded-t-4xl p-4 max-h-[60%] flex flex-col transition-transform duration-500 ease-in-out ${
                  showViewers ? 'translate-y-0' : 'translate-y-full'
               }`}>
               <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-2">
                  <h3 className="text-white text-xl font-semibold mb-2">
                     Viewers
                  </h3>
                  <IoClose
                     className="text-white text-[28px] cursor-pointer hover:scale-120 transition-transform"
                     onClick={() => setShowViewers(false)}
                  />
               </div>

               {/* Viewers List */}
               <div className="flex-1 overflow-y-auto mb-3 px-4 gap-4 scrollbar-hide">
                  {story.viewers.length > 0 ? (
                     story.viewers.map((viewer) => (
                        <div
                           key={viewer._id}
                           className="flex items-center gap-2 mb-2">
                           <img
                              src={viewer.profileImage}
                              className="w-8 h-8 rounded-full"
                              alt=""
                           />
                           <p
                              onClick={() =>
                                 navigate(`/profile/${viewer.userName}`)
                              }
                              className="text-white text-sm hover:text-blue-800 cursor-pointer">
                              {viewer.userName}
                           </p>
                        </div>
                     ))
                  ) : (
                     <p className="text-gray-400 text-sm">No viewers yet.</p>
                  )}
               </div>
            </div>
         )}
      </div>
   );
};

export default UserStoryViewCard;
