import React, {useEffect, useRef, useState} from 'react';
import {FaRegHeart, FaHeart, FaRegBookmark, FaBookmark} from 'react-icons/fa';
import {MdOutlineComment} from 'react-icons/md';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {serverUrl} from '../App';
import {setPostData} from '../redux/postSlice';
import {setUserData} from '../redux/userSlice';
import FollowUser from './followButton';

const Post = ({post, onProfile}) => {
   const commentsEndRef = useRef(null);

   const navigate = useNavigate();
   const {userData} = useSelector((state) => state.user);
   const {postData} = useSelector((state) => state.post);
   const dispatch = useDispatch();

   const [commentModelOpen, setCommentModelOpen] = useState(false);
   const [comment, setComment] = useState('');
   const videoRef = useRef();
   const {socket} = useSelector((state) => state.socket);

   const scrollToBottom = () => {
      if (commentsEndRef.current) {
         commentsEndRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
         });
      }
   };

   const handleCommentClick = () => {
      if (!onProfile) {
         setCommentModelOpen((prev) => !prev);
      }
   };

   useEffect(() => {
      if (commentModelOpen) {
         setTimeout(scrollToBottom, 100);
      }
   }, [commentModelOpen]);

   const handleLike = async () => {
      try {
         const res = await axios.post(
            `${serverUrl}/api/post/like/${post._id}`,
            {},
            {withCredentials: true}
         );
         const updatedPost = res.data;
         const updatedPosts = postData.map((p) =>
            p._id === updatedPost._id ? updatedPost : p
         );
         dispatch(setPostData(updatedPosts));
      } catch (error) {
         console.error('Error liking post:', error);
         alert('Failed to like post');
      }
   };

   const handleSendComment = async () => {
      try {
         const res = await axios.post(
            `${serverUrl}/api/post/comment/${post._id}`,
            {message: comment},
            {withCredentials: true}
         );
         const updatedPost = res.data;
         const updatedPosts = postData.map((p) =>
            p._id === updatedPost._id ? updatedPost : p
         );
         dispatch(setPostData(updatedPosts));
         setComment('');
         setTimeout(scrollToBottom, 100);
      } catch (error) {
         console.error('Error commenting:', error);
         alert('Failed to comment on post');
      }
   };

   const handleSavePost = async () => {
      try {
         const res = await axios.post(
            `${serverUrl}/api/post/savePost/${post._id}`,
            {},
            {withCredentials: true}
         );
         dispatch(setUserData(res.data));
      } catch (error) {
         console.error('Error saving post:', error);
         alert('Failed to save post');
      }
   };

   // Reset video on re-mount or revisit
   useEffect(() => {
      const video = videoRef.current;
      if (video && post.mediaType === 'video') {
         video.currentTime = 0;
         video.pause();

         const observer = new IntersectionObserver(
            ([entry]) => {
               if (entry.isIntersecting) {
                  video.currentTime = 0;
                  video.play().catch(() => {});
               } else {
                  video.pause();
               }
            },
            {threshold: 0.6}
         );

         observer.observe(video);

         return () => {
            observer.unobserve(video);
         };
      }
   }, [post._id]);

   useEffect(() => {
      socket.on('postLiked', (data) => {
         if (data.postId === post._id) {
            const updatedPost = {...post, likes: data.likes};
            const updatedPosts = postData.map((p) =>
               p._id === updatedPost._id ? updatedPost : p
            );
            dispatch(setPostData(updatedPosts));
         }
      });

      socket.on('commentedPost', (data) => {
         if (data.postId === post._id) {
            const updatedPost = {...post, comments: data.comments};
            const updatedPosts = postData.map((p) =>
               p._id === updatedPost._id ? updatedPost : p
            );
            dispatch(setPostData(updatedPosts));
            setTimeout(scrollToBottom, 100);
         }
      });

      return () => {
         socket?.off('postLiked');
         socket?.off('commentedPost');
      };
   }, [socket, postData, dispatch]);

   return (
      <div className="w-full max-w-2xl mx-auto bg-black rounded-3xl shadow-lg overflow-hidden border border-cyan-200">
         {/* Header */}
         <div className="flex items-center justify-between px-6 py-5 border-b border-cyan-100">
            <div className="flex items-center gap-4">
               <div
                  onClick={() => navigate(`/profile/${post.author.userName}`)}
                  className="w-14 h-14 rounded-full overflow-hidden border-2 border-cyan-400 shadow cursor-pointer transition-transform hover:scale-105">
                  <img
                     className="w-full h-full object-cover"
                     src={
                        post?.author?.profileImage ||
                        'https://i.pinimg.com/474x/e6/e4/df/e6e4df26ba752161b9fc6a17321fa286.jpg'
                     }
                     alt="Profile"
                  />
               </div>
               <div>
                  <span className="font-semibold text-lg text-white block truncate max-w-[160px]">
                     {post?.author?.userName}
                  </span>
                  <span className="text-gray-400 text-xs">
                     {new Date(post?.createdAt).toLocaleString()}
                  </span>
               </div>
            </div>
            {post?.author?.userName !== userData?.userName && (
               <FollowUser
                  targetUserId={post.author._id}
                  tailwind="bg-white hover:opacity-90 text-black font-medium px-3 text-sm md:px-5 py-2 rounded-full shadow transition cursor-pointer"
               />
            )}
         </div>

         {/* Media */}
         <div className="w-full flex justify-center items-center bg-black">
            {post?.mediaType === 'image' ? (
               <img
                  className="w-full max-h-[400px] object-cover transition-shadow shadow-md"
                  src={post?.media}
                  alt="Post"
                  style={{aspectRatio: '16/9'}}
               />
            ) : (
               <video
                  ref={videoRef}
                  className="w-full max-h-[400px] object-cover transition-shadow shadow-md"
                  src={post?.media}
                  muted={false}
                  autoPlay={false}
                  controls={true}
                  style={{aspectRatio: '16/9'}}
               />
            )}
         </div>

         {/* Caption */}
         {post.caption && (
            <div className="px-6 py-4">
               <p className="text-gray-200 text-base leading-relaxed">
                  {post?.caption}
               </p>
            </div>
         )}

         {/* Actions */}
         <div className="flex items-center justify-between px-6 py-4 border-t border-cyan-100 bg-black">
            <div className="flex items-center gap-6">
               <button
                  onClick={handleLike}
                  className="flex items-center justify-center gap-2 text-cyan-700 hover:text-cyan-900 transition cursor-pointer">
                  {post?.likes?.includes(userData?._id) ? (
                     <FaHeart className="text-red-600" />
                  ) : (
                     <FaRegHeart />
                  )}
                  <span className="font-medium">Like</span>
               </button>
               <button
                  onClick={handleCommentClick}
                  className="flex items-center justify-center gap-2 text-cyan-700 hover:text-cyan-900 transition cursor-pointer">
                  <MdOutlineComment />
                  <span className="font-medium">Comment</span>
               </button>
            </div>

            <div>
               <button
                  onClick={handleSavePost}
                  className="flex items-center justify-center gap-2 text-cyan-700 hover:text-cyan-900 transition cursor-pointer">
                  {userData?.saved?.includes(post._id) ? (
                     <FaBookmark className="text-white" />
                  ) : (
                     <FaRegBookmark />
                  )}
                  <span className="font-medium">Save</span>
               </button>
            </div>
         </div>

         {/* Comments */}
         {commentModelOpen && (
            <div className="px-6 py-4 border-t border-cyan-100 bg-black">
               <h3 className="text-cyan-400 font-semibold mb-4">Comments</h3>
               <div className="space-y-4 h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {post?.comments?.length > 0 ? (
                     post.comments.map((comment, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                           <div
                              onClick={() =>
                                 navigate(`/profile/${comment.author?.userName}`)
                              }
                              className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-400 shadow cursor-pointer">
                              <img
                                 className="w-full h-full object-cover"
                                 src={
                                    comment?.author?.profileImage ||
                                    'https://i.pinimg.com/474x/e6/e4/df/e6e4df26ba752161b9fc6a17321fa286.jpg'
                                 }
                                 alt="Profile"
                              />
                           </div>
                           <div>
                              <span className="font-semibold text-sm text-white block">
                                 {comment?.author?.userName}
                              </span>
                              <p className="text-gray-200">{comment?.message}</p>
                           </div>
                        </div>
                     ))
                  ) : (
                     <p className="text-gray-400">No comments yet.</p>
                  )}
                  <div ref={commentsEndRef} />
               </div>

               <div className="mt-4">
                  <textarea
                     value={comment}
                     onChange={(e) => setComment(e.target.value)}
                     className="w-full p-2 bg-transparent text-white rounded-lg border border-cyan-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                     placeholder="Add a comment..."
                     rows="2"></textarea>
                  <button
                     onClick={handleSendComment}
                     className="mt-2 bg-white hover:opacity-90 text-black font-medium px-3 md:px-5 py-2 rounded-full shadow transition">
                     Post Comment
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

export default Post;
