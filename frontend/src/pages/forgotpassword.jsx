import React, {useState} from 'react';
import axios from 'axios';
import {serverUrl} from '../App';
import {ClipLoader} from 'react-spinners';
import {ToastContainer, toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';

const ForgotPassword = () => {
   const navigate = useNavigate();
   const [step, SetStep] = useState(1);

   const [email, SetEmail] = useState('');
   const [otp, SetOtp] = useState('');
   const [newPassword, SetNewPassword] = useState('');
   const [confirmNewPassword, SetConfirmNewPassword] = useState('');
   const [loading, setLoading] = useState(false);

   const handleStep1 = async () => {
      setLoading(true);
      try {
         await axios.post(
            `${serverUrl}/api/auth/sentOtp`,
            {email},
            {withCredentials: true}
         );
         SetStep(2);
      } catch (error) {
         toast.error(
            error.response?.data?.message ||
               'An error occurred while sending OTP. Please try again.'
         );
      } finally {
         setLoading(false);
      }
   };

   const handleStep2 = async () => {
      setLoading(true);
      try {
         await axios.post(
            `${serverUrl}/api/auth/verifyOtp`,
            {email, otp},
            {withCredentials: true}
         );
         SetStep(3);
      } catch (error) {
         toast.error(
            error.response?.data?.message ||
               'An error occurred while verifying OTP. Please try again.'
         );
      } finally {
         setLoading(false);
      }
   };

   const handleStep3 = async () => {
      setLoading(true);
      try {
         if (newPassword !== confirmNewPassword) {
            alert('Passwords do not match. Please try again.');
            return;
         }

         await axios.post(
            `${serverUrl}/api/auth/resetPassword`,
            {email, newPassword},
            {withCredentials: true}
         );
         // Optional: Redirect or reset form here
         navigate('/signin');
      } catch (error) {
         toast.error(
            error.response?.data?.message ||
               'An error occurred while resetting password. Please try again.'
         );
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="w-full min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center">
         {step === 1 && (
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col gap-5">
               <h2 className="text-2xl text-center font-semibold mb-4">
                  Forgot Password?
               </h2>
               {/* Email */}
               <div className="relative w-full">
                  <label
                     htmlFor="email"
                     className="absolute -top-2 left-4 bg-white px-2 text-xs text-gray-700">
                     Enter Your Email
                  </label>
                  <input
                     value={email}
                     onChange={(e) => SetEmail(e.target.value)}
                     type="text"
                     id="email"
                     required
                     className="w-full border border-gray-400 rounded-xl px-4 py-3 mt-2 focus:outline-none focus:border-purple-500"
                  />
               </div>
               <button
                  onClick={handleStep1}
                  className="w-full bg-black text-white py-2 hover:opacity-90 rounded-2xl transition duration-300">
                  {loading ? (
                     <ClipLoader color="#ffffff" size={20} />
                  ) : (
                     'Send Reset OTP'
                  )}
               </button>
            </div>
         )}

         {step === 2 && (
            //form for otp input
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col gap-5">
               <h2 className="text-2xl text-center font-semibold mb-4">
                  Enter OTP
               </h2>
               {/* OTP Input */}
               <div className="relative w-full">
                  <label
                     htmlFor="otp"
                     className="absolute -top-2 left-4 bg-white px-2 text-xs text-gray-700">
                     Enter Your OTP
                  </label>
                  <input
                     value={otp}
                     onChange={(e) => SetOtp(e.target.value)}
                     type="text"
                     id="otp"
                     required
                     className="w-full border border-gray-400 rounded-xl px-4 py-3 mt-2 focus:outline-none focus:border-purple-500"
                  />
               </div>
               <button
                  onClick={handleStep2}
                  className="w-full bg-black text-white py-2 hover:opacity-90 rounded-2xl transition duration-300">
                  {loading ? (
                     <ClipLoader color="#ffffff" size={20} />
                  ) : (
                     'Verify OTP'
                  )}
               </button>
            </div>
         )}

         {step === 3 && (
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col gap-5">
               <h2 className="text-2xl text-center font-semibold mb-4">
                  Reset Password
               </h2>
               {/* New Password */}
               <div className="relative w-full">
                  <label
                     htmlFor="newPassword"
                     className="absolute -top-2 left-4 bg-white px-2 text-xs text-gray-700">
                     Enter New Password
                  </label>
                  <input
                     value={newPassword}
                     onChange={(e) => SetNewPassword(e.target.value)}
                     type="text"
                     id="newPassword"
                     required
                     className="w-full border border-gray-400 rounded-xl px-4 py-3 mt-2 focus:outline-none focus:border-purple-500"
                  />
               </div>
               {/* Confirm New Password */}
               <div className="relative w-full">
                  <label
                     htmlFor="confirmNewPassword"
                     className="absolute -top-2 left-4 bg-white px-2 text-xs text-gray-700">
                     Confirm New Password
                  </label>
                  <input
                     value={confirmNewPassword}
                     onChange={(e) => SetConfirmNewPassword(e.target.value)}
                     type="text"
                     id="confirmNewPassword"
                     required
                     className="w-full border border-gray-400 rounded-xl px-4 py-3 mt-2 focus:outline-none focus:border-purple-500"
                  />
               </div>
               <button
                  onClick={handleStep3}
                  className="w-full bg-black text-white py-2 hover:opacity-90 rounded-2xl transition duration-300">
                  {loading ? (
                     <ClipLoader color="#ffffff" size={20} />
                  ) : (
                     'Reset Password'
                  )}
               </button>
            </div>
         )}
         <ToastContainer position="top-right" autoClose={3000} />
      </div>
   );
};

export default ForgotPassword;
