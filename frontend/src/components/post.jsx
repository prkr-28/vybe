import React from 'react';
import {FaRegHeart} from 'react-icons/fa';
import {FaHeart} from 'react-icons/fa6';
import {BiCommentDetail} from 'react-icons/bi';
import {useSelector} from 'react-redux';

const Post = ({postData}) => {
   const {userData} = useSelector((state) => state.user.userData);
   return (
      <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-white via-cyan-50 to-cyan-100 rounded-3xl shadow-lg overflow-hidden border border-cyan-200">
         {/* Header */}
         <div className="flex items-center justify-between px-6 py-5 border-b border-cyan-100">
            <div className="flex items-center gap-4">
               <div
                  onClick={() => {
                     window.location.href =
                        '/profile/' + postData.author.userName;
                  }}
                  className="w-14 h-14 rounded-full overflow-hidden border-2 border-cyan-400 shadow cursor-pointer transition-transform hover:scale-105">
                  <img
                     className="w-full h-full object-cover"
                     src={
                        postData.author?.profileImage ||
                        'https://i.pinimg.com/474x/e6/e4/df/e6e4df26ba752161b9fc6a17321fa286.jpg'
                     }
                     alt="Profile"
                  />
               </div>
               <div>
                  <span className="font-semibold text-lg text-cyan-900 block truncate max-w-[160px]">
                     {postData.author?.userName}
                  </span>
                  <span className="text-gray-400 text-xs">
                     {new Date(postData.createdAt).toLocaleString()}
                  </span>
               </div>
            </div>
            {postData?.author?.userName !== userData?.userName && (
               <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-5 py-2 rounded-full shadow transition">
                  Follow
               </button>
            )}
         </div>

         {/* Media */}
         <div className="w-full flex justify-center items-center bg-cyan-50">
            {postData?.mediaType === 'image' ? (
               <img
                  className="w-full max-h-[400px] object-cover rounded-xl transition-shadow shadow-md"
                  src={postData.media}
                  alt="Post"
                  style={{aspectRatio: '16/9'}}
               />
            ) : (
               <video
                  className="w-full max-h-[400px] object-cover rounded-xl transition-shadow shadow-md"
                  src={postData.media}
                  controls
                  style={{aspectRatio: '16/9'}}
               />
            )}
         </div>

         {/* Caption */}
         {postData.caption && (
            <div className="px-6 py-4">
               <p className="text-gray-800 text-base leading-relaxed">
                  {postData.caption}
               </p>
            </div>
         )}

         {/* Actions */}
         <div className="flex items-center justify-between px-6 py-4 border-t border-cyan-100 bg-white">
            <div className="flex items-center gap-6">
               <button className="flex items-center justify-center gap-2 text-cyan-700 hover:text-cyan-900 transition cursor-pointer">
                  <FaRegHeart />
                  <span className="font-medium">Like</span>
               </button>
               <button className="flex items-center justify-center gap-2 text-cyan-700 hover:text-cyan-900 transition cursor-pointer">
                  <BiCommentDetail />
                  <span className="font-medium">Comment</span>
               </button>
            </div>
         </div>
      </div>
   );
};

export default Post;
