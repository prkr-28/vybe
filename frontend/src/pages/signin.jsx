import React, {useState} from 'react';
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa6';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {serverUrl} from '../App';
import {ClipLoader} from 'react-spinners';
import {ToastContainer, toast} from 'react-toastify';
import {useDispatch} from 'react-redux';
import {setUserData} from '../redux/userSlice';

const Signin = () => {
   const navigate = useNavigate();
   const [showPassword, setShowPassword] = useState(false);
   const [userName, SetUserName] = useState('');
   const [password, SetPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();

   const handleSignUp = async () => {
      setLoading(true);
      try {
         await axios
            .post(
               `${serverUrl}/api/auth/signin`,
               {
                  userName,
                  password,
               },
               {withCredentials: true}
            )
            .then((response) => {
               dispatch(setUserData(response.data.user));
               navigate('/');
               // alert('Sign up successful! Please sign in.');
               // SetName('');
               // SetUserName('');
               // SetEmail('');
               // SetPassword('');
            })
            .catch((error) => {
               toast.error(
                  error.response?.data?.message ||
                     'An error occurred during sign up. Please try again.'
               );
            })
            .finally(() => {
               setLoading(false);
            });
      } catch (error) {
         console.error('Error during sign up:', error);
         toast.error(
            error.response?.data?.message ||
               'An error occurred. Please try again.'
         );
      }
   };

   return (
      <div className=" w-full min-h-screen bg-gradient-to-b from-black to-gray-900 flex justify-center items-center p-4">
         <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-yellow-500">
            {/* Left Side */}
            <div className="hidden lg:flex w-1/2 bg-black flex-col justify-center items-center p-8 text-white gap-4">
               <img
                  src="https://res.cloudinary.com/dtpwinoe7/image/upload/v1752598435/logo_1_t2k8bf.png"
                  alt="Vybe Logo"
                  className="object-contain rounded-full"
               />
               <p className="text-center text-lg font-bold">
                  Not Just a Platform, It's a{' '}
                  <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text text-xl">
                     Vybe
                  </span>
               </p>
            </div>

            {/* Right Side (form) */}
            <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center items-center gap-5">
               <div className="text-2xl font-semibold text-gray-800">
                  Sign In to{' '}
                  <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text font-bold">
                     VYBE
                  </span>
               </div>

               {/* Username */}
               <div className="relative w-full">
                  <label
                     htmlFor="userName"
                     className="absolute -top-2 left-4 bg-white px-2 text-xs text-gray-700">
                     Enter Your Username
                  </label>
                  <input
                     value={userName}
                     onChange={(e) => SetUserName(e.target.value)}
                     type="text"
                     id="userName"
                     required
                     className="w-full border border-gray-400 rounded-xl px-4 py-3 mt-2 focus:outline-none focus:border-purple-500"
                  />
               </div>

               {/* Password */}
               <div className="relative w-full">
                  <label
                     htmlFor="password"
                     className="absolute -top-2 left-4 bg-white px-2 text-xs text-gray-700">
                     Enter Your Password
                  </label>
                  <input
                     value={password}
                     onChange={(e) => SetPassword(e.target.value)}
                     type={showPassword ? 'text' : 'password'}
                     id="password"
                     required
                     className="w-full border border-gray-400 rounded-xl px-4 py-3 mt-2 pr-10 focus:outline-none focus:border-purple-500"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer">
                     {showPassword ? (
                        <FaRegEye
                           onClick={() => setShowPassword(!showPassword)}
                        />
                     ) : (
                        <FaRegEyeSlash
                           onClick={() => setShowPassword(!showPassword)}
                        />
                     )}
                  </span>
               </div>

               <div
                  onClick={() => {
                     navigate('/forgotpassword');
                  }}
                  className="w-full text-start text-sm text-gray-600 px-2 cursor-pointer hover:underline">
                  Forgot your password?
               </div>

               <button
                  onClick={handleSignUp}
                  className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:opacity-90 transition duration-300">
                  {loading ? (
                     <ClipLoader color="#ffffff" size={20} />
                  ) : (
                     'Sign In'
                  )}
               </button>

               <p className="text-sm text-gray-600">
                  Does not have an account?{' '}
                  <span
                     onClick={() => {
                        navigate('/signup');
                     }}
                     className="text-purple-600 hover:underline cursor-pointer">
                     Sign Up
                  </span>
               </p>
            </div>
         </div>
         <ToastContainer position="top-right" autoClose={3000} />
      </div>
   );
};

export default Signin;
