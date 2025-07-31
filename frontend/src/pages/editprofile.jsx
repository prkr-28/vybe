import React, {useState} from 'react';
import axios from 'axios';
import {serverUrl} from '../App';
import {useDispatch, useSelector} from 'react-redux';
import {setProfileData, setUserData} from '../redux/userSlice';
import {useNavigate} from 'react-router-dom';
import {IoMdArrowRoundBack} from 'react-icons/io';
import {ClipLoader} from 'react-spinners';

const EditProfilePage = () => {
   const {userData} = useSelector((state) => state.user);
   const [loading, setLoading] = useState(false);
   const [name, setName] = useState(userData.name || '');
   const [userName, setUserName] = useState(userData.userName || '');
   const [profession, setProfession] = useState(userData.profession || '');
   const [bio, setBio] = useState(userData.bio || '');
   const [gender, setGender] = useState(userData.gender || '');
   const [profileImage, setProfileImage] = useState('');
   const [previewImage, setPreviewImage] = useState(
      userData.profileImage ||
         'https://i.pinimg.com/474x/e6/e4/df/e6e4df26ba752161b9fc6a17321fa286.jpg'
   );
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
         setProfileImage(file);
         setPreviewImage(URL.createObjectURL(file));
      } else {
         alert('Please select a JPG or PNG image.');
      }
   };

   const handleSubmit = async (e) => {
      setLoading(true);
      e.preventDefault();
      try {
         const formData = new FormData();
         formData.append('name', name);
         formData.append('userName', userName);
         formData.append('profession', profession);
         formData.append('bio', bio);
         formData.append('gender', gender);
         if (profileImage) {
            formData.append('profileImage', profileImage);
         }

         const response = await axios.post(
            `${serverUrl}/api/user/updateProfile`,
            formData,
            {
               withCredentials: true,
               headers: {
                  'Content-Type': 'multipart/form-data',
               },
            }
         );
         dispatch(setProfileData(response.data));
         dispatch(setUserData(response.data));
         navigate('/profile/' + userName);
      } catch (error) {
         alert('Failed to update profile. Please try again later.');
         console.error(error.response ? error.response.data : error.message);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen w-full bg-black flex flex-col items-center px-4 py-4">
         {/* Header */}
         <div className="w-full flex items-center mb-6 gap-2">
            <IoMdArrowRoundBack
               onClick={() => navigate('/profile/' + userData.userName)}
               className="text-white text-xl hover:text-blue-400 cursor-pointer"
            />

            <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
         </div>

         <div className="w-full max-w-md flex flex-col items-center">
            {/* Profile Image */}
            <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
               <img
                  src={
                     previewImage ||
                     'https://i.pinimg.com/474x/e6/e4/df/e6e4df26ba752161b9fc6a17321fa286.jpg'
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
               />
            </div>

            {/* Change image button */}
            <label className="text-blue-500 text-sm mb-6 cursor-pointer">
               Change Your Profile Picture
               <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
               />
            </label>

            <form
               onSubmit={handleSubmit}
               className="w-full flex flex-col gap-4">
               <input
                  type="text"
                  placeholder="Enter Your Name"
                  className="bg-black text-white placeholder-gray-500 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:right-2 focus:border-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
               />

               <input
                  type="text"
                  placeholder="Enter Your userName"
                  className="bg-black text-white placeholder-gray-500 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:right-2 focus:border-white"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
               />

               <textarea
                  placeholder="Bio"
                  className="bg-black text-white placeholder-gray-500 border border-gray-700 rounded-xl px-4 py-2 resize-none focus:outline-none focus:right-2 focus:border-white"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
               />

               <input
                  type="text"
                  placeholder="Profession"
                  className="bg-black text-white placeholder-gray-500 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:right-2 focus:border-white"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
               />

               <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="bg-black text-white border border-gray-700 rounded-xl px-4 py-2 cursor-pointer focus:outline-none focus:right-2 focus:border-white">
                  <option
                     className="rounded-xl bg-black text-white"
                     value="Male">
                     Male
                  </option>
                  <option
                     className="rounded-xl bg-black text-white"
                     value="Female">
                     Female
                  </option>
               </select>

               <button
                  type="submit"
                  className="bg-white text-black font-semibold py-3 rounded-xl mt-4 cursor-pointer">
                  {loading ? (
                     <ClipLoader color="#000000" size={24} />
                  ) : (
                     'Save Profile'
                  )}
               </button>
            </form>
         </div>
      </div>
   );
};

export default EditProfilePage;
