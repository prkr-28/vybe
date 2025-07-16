import React from 'react';
import {GoHomeFill} from 'react-icons/go';
import {IoSearchSharp} from 'react-icons/io5';
import {RiVideoOnAiLine} from 'react-icons/ri';
import {FiPlusSquare} from 'react-icons/fi';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

const Nav = ({ProfileImage}) => {
   const navigate = useNavigate();
   const {userData} = useSelector((state) => state.user);
   const handleProfileClick = () => {
      navigate('/profile/' + userData.userName);
   };
   return (
      <div className="w-[90%] lg:w-[40%] h-[80px] bg-black flex justify-around items-center fixed bottom-[20px] rounded-full shadow-2xl shadow-[#000000] z-[100] ">
         <div className="cursor-pointer">
            <GoHomeFill className="text-white text-2xl hover:text-blue-600" />
         </div>
         <div className="cursor-pointer">
            <IoSearchSharp className="text-white text-2xl hover:text-blue-600" />
         </div>
         <div className="cursor-pointer">
            <FiPlusSquare className="text-white text-[28px] hover:text-blue-600" />
         </div>
         <div className="cursor-pointer">
            <RiVideoOnAiLine className="text-white text-2xl hover:text-blue-600" />
         </div>

         <div
            onClick={handleProfileClick}
            className="w-[40px] h-[40px] rounded-full border-2 border-black overflow-hidden cursor-pointer">
            <img
               className="w-full h-full object-cover"
               src={
                  ProfileImage ||
                  'https://i.pinimg.com/474x/e6/e4/df/e6e4df26ba752161b9fc6a17321fa286.jpg'
               }
               alt=""
            />
         </div>
      </div>
   );
};
export default Nav;
