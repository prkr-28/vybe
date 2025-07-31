import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import {serverUrl} from '../App';
import {useDispatch, useSelector} from 'react-redux';
import {setProfileData, setUserData} from '../redux/userSlice';
import {IoIosArrowBack} from 'react-icons/io';
import Nav from '../components/nav';
import FollowUser from '../components/followButton';
import Post from '../components/post';
import {setSelectedUser} from '../redux/messageSlice';

const Profile = () => {
   const {userName} = useParams();
   const dispatch = useDispatch();
   const {profileData, userData} = useSelector((state) => state.user);
   const {postData} = useSelector((state) => state.post);
   const navigate = useNavigate();
   const [AllPosts, setAllPosts] = useState(true);
   const [SavedPosts, setSavedPosts] = useState(false);

   const handleProfile = async () => {
      try {
         const response = await axios.get(
            `${serverUrl}/api/user/getProfile/${userName}`,
            {withCredentials: true}
         );
         dispatch(setProfileData(response.data));
      } catch (error) {
         console.error('Error fetching profile:', error);
      }
   };

   const handleLogOut = async () => {
      try {
         await axios.get(`${serverUrl}/api/auth/signout`, {
            withCredentials: true,
         });
         dispatch(setUserData(null));
         navigate('/');
      } catch (error) {
         console.error('Error logging out:', error);
      }
   };

   useEffect(() => {
      handleProfile();
   }, [userName, dispatch, SavedPosts, AllPosts]);

   return (
      <div className="w-full min-h-screen bg-black">
         {/* Header */}
         <div className="w-full h-14 bg-black flex items-center justify-between px-4 border-b border-gray-800">
            <IoIosArrowBack
               onClick={() => navigate('/')}
               className="text-white text-2xl hover:text-blue-800 cursor-pointer"
            />
            <div className="text-white text-lg md:text-xl font-semibold">
               {profileData?.userName}
            </div>
            <button
               onClick={handleLogOut}
               className="text-xs md:text-sm text-center font-semibold px-[10px] py-[6px] min-w-[60px] bg-white hover:bg-gray-100 rounded-2xl cursor-pointer">
               Log Out
            </button>
         </div>

         {/* Profile Info */}
         <div className="w-full flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 pt-6 px-4">
            <div
               onClick={() => navigate('/profile/' + profileData?.userName)}
               className="w-24 h-24 md:w-36 md:h-36 border-4 border-cyan-400 shadow hover:scale-110 rounded-full overflow-hidden cursor-pointer transition-all duration-500">
               <img
                  className="w-full h-full object-cover"
                  src={
                     profileData?.profileImage ||
                     'https://i.pinimg.com/474x/e6/e4/df/e6e4df26ba752161b9fc6a17321fa286.jpg'
                  }
                  alt="Profile"
               />
            </div>
            <div className="text-center md:text-left">
               <div className="font-semibold text-xl md:text-2xl text-white">
                  {profileData?.name}
               </div>
               <div className="text-sm md:text-base text-gray-400">
                  {profileData?.profession || 'newUser'}
               </div>
               <div className="text-sm md:text-base text-gray-400">
                  {profileData?.bio || 'No bio available'}
               </div>
            </div>
         </div>

         {/* Stats */}
         <div className="w-full h-[90px] flex flex-wrap items-center justify-center gap-16 md:gap-20 px-4 pt-8">
            <div className="text-center">
               <div className="text-white text-lg md:text-xl">
                  {profileData?.posts?.length || 0}
               </div>
               <div className="text-gray-300 text-sm md:text-base">Posts</div>
            </div>

            <div className="text-center">
               <div className="text-white flex items-center justify-center text-lg md:text-xl">
                  {profileData?.followers?.length || 0}
               </div>
               <div className="text-gray-300 text-sm md:text-base">
                  Followers
               </div>
            </div>

            <div className="text-center">
               <div className="text-white text-lg md:text-xl">
                  {profileData?.following?.length || 0}
               </div>
               <div className="text-gray-300 text-sm md:text-base">
                  Following
               </div>
            </div>
         </div>

         <div className="w-full h-[70px] flex justify-center items-center gap-4">
            {profileData?.userName === userData?.userName && (
               <button
                  onClick={() => navigate('/editprofile')}
                  className="text-xs md:text-sm font-semibold px-[10px] py-[6px] min-w-[150px] bg-white hover:bg-gray-100 rounded-2xl cursor-pointer">
                  Edit Profile
               </button>
            )}

            {profileData?.userName !== userData?.userName && (
               <>
                  <FollowUser
                     targetUserId={profileData?._id}
                     tailwind={
                        'text-xs md:text-sm font-semibold px-[10px] py-[6px] min-w-[150px] bg-white hover:bg-gray-100 rounded-2xl cursor-pointer'
                     }
                  />

                  <button
                     onClick={() => {
                        dispatch(setSelectedUser(profileData));
                        navigate('/messageArea');
                     }}
                     className="text-xs md:text-sm font-semibold px-[10px] py-[6px] min-w-[150px] bg-white hover:bg-gray-100 rounded-2xl cursor-pointer">
                     Message
                  </button>
               </>
            )}
         </div>

         <div className="w-full flex flex-col justify-center items-center">
            {profileData?.userName === userData?.userName && (
               <div>
                  {/* two sections one for All posts and other for saved post */}
                  <div className="flex items-center justify-between gap-15 w-full h-[40px] bg-black border-b border-gray-800 mb-3">
                     <div>
                        <button
                           onClick={() => {
                              setAllPosts(true);
                              setSavedPosts(false);
                           }}
                           className={`text-md rounded-full cursor-pointer ${
                              AllPosts ? 'text-white' : 'text-gray-400'
                           }`}>
                           All Posts
                        </button>
                     </div>
                     <div>
                        <button
                           onClick={() => {
                              setAllPosts(false);
                              setSavedPosts(true);
                           }}
                           className={`text-m px-4 py-1 rounded-full cursor-pointer ${
                              SavedPosts ? 'text-white' : 'text-gray-400'
                           }`}>
                           Saved
                        </button>
                     </div>
                  </div>
               </div>
            )}
            <div className="w-full mt-1 mb-28 max-w-[1220px] flex flex-col items-center border border-white rounded-[42px] bg-black gap-[20px] p-6">
               {AllPosts &&
                  (postData.filter((post) => post.author?.userName === userName)
                     .length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full mb-6">
                        {postData
                           .filter((post) => post.author?.userName === userName)
                           .map((post) => (
                              <Post
                                 key={post._id}
                                 post={post}
                                 onProfile={true}
                              />
                           ))}
                     </div>
                  ) : (
                     <div className="text-gray-400 text-lg">
                        No posts available
                     </div>
                  ))}

               {SavedPosts &&
                  (profileData?.saved?.length > 0 && postData?.length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full mb-6">
                        {postData.map(
                           (post) =>
                              profileData?.saved.includes(post._id) && (
                                 <Post
                                    key={post._id}
                                    post={post}
                                    onProfile={true}
                                 />
                              )
                        )}
                     </div>
                  ) : (
                     <div className="text-gray-400 text-lg">
                        No saved posts available
                     </div>
                  ))}
            </div>
            <Nav />
         </div>
      </div>
   );
};

export default Profile;
