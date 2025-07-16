import React, {useEffect} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import {serverUrl} from '../App';
import {useDispatch, useSelector} from 'react-redux';
import {setProfileData, setUserData} from '../redux/userSlice';
import {IoIosArrowBack} from 'react-icons/io';

const Profile = () => {
   const {userName} = useParams();
   const dispatch = useDispatch();
   const {profileData, userData} = useSelector((state) => state.user);
   const navigate = useNavigate();

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
   }, [userName, dispatch]);

   return (
      <div className="w-full min-h-screen bg-gradient-to-b from-black to-gray-900">
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
               className="text-xs md:text-sm font-semibold px-2 py-2 md:px-4 bg-white hover:bg-gray-100 rounded-2xl cursor-pointer">
               Log Out
            </button>
         </div>

         {/* Profile Info */}
         <div className="w-full flex flex-col md:flex-row items-center justify-center gap-2 md:gap-10 pt-6 px-4">
            <div
               onClick={() => navigate('/profile/' + profileData.userName)}
               className="w-24 h-24 md:w-36 md:h-36 border-2 border-black rounded-full overflow-hidden cursor-pointer">
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
               <div className="text-base md:text-lg text-gray-300">
                  {profileData?.profession || 'newUser'}
               </div>
               <div className="text-sm md:text-base text-gray-400">
                  {profileData?.bio || 'No bio available'}
               </div>
            </div>
         </div>

         {/* Stats */}
         <div className="w-full h-[90px] flex flex-wrap items-center justify-center gap-16 md:gap-20 px-4 py-8">
            <div className="text-center">
               <div className="text-white text-lg md:text-xl">
                  {profileData?.posts.length}
               </div>
               <div className="text-gray-300 text-sm md:text-base">Posts</div>
            </div>

            <div className="text-center">
               <div className="text-white flex items-center justify-center text-lg md:text-xl">
                  {profileData?.followers?.length}
               </div>
               <div className="text-gray-300 text-sm md:text-base">
                  Followers
               </div>
            </div>

            <div className="text-center">
               <div className="text-white text-lg md:text-xl">
                  {profileData?.following.length}
               </div>
               <div className="text-gray-300 text-sm md:text-base">
                  Following
               </div>
            </div>
         </div>

         <div className="w-full h-[80px] flex justify-center items-center gap-4">
            {profileData?.userName === userData?.userName && (
               <button
                  onClick={() => navigate('/editprofile')}
                  className="text-xs md:text-sm font-semibold px-[10px] py-[6px] min-w-[150px] bg-white hover:bg-gray-100 rounded-2xl cursor-pointer">
                  Edit Profile
               </button>
            )}

            {profileData?.userName !== userData?.userName && (
               <>
                  <button className="text-xs md:text-sm font-semibold px-[10px] py-[6px] min-w-[150px] bg-white hover:bg-gray-100 rounded-2xl cursor-pointer">
                     Follow
                  </button>

                  <button className="text-xs md:text-sm font-semibold px-[10px] py-[6px] min-w-[150px] bg-white hover:bg-gray-100 rounded-2xl cursor-pointer">
                     Message
                  </button>
               </>
            )}
         </div>

         <div className="w-full min-h-[100vh] flex justify-around">
            <div className="w-full max-w-[900px] flex flex-col items-center rounded-t-4xl bg-white relative gap-[20px] pt-[30px]"></div>
         </div>
      </div>
   );
};

export default Profile;
