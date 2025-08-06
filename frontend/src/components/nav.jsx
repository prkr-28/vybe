import React from "react";
import { GoHomeFill } from "react-icons/go";
import { IoSearchSharp } from "react-icons/io5";
import { RiVideoOnAiLine } from "react-icons/ri";
import { FiPlusSquare } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Nav = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { profileData } = useSelector((state) => state.user);
  const handleProfileClick = () => {
    navigate("/profile/" + userData.userName);
  };
  return (
    <div className="w-[90%] lg:w-[40%] h-[80px] bg-black flex justify-around border border-white items-center fixed bottom-[20px] rounded-full shadow-2xl shadow-[#000000] z-[100] ">
      <div onClick={() => navigate("/")} className="cursor-pointer">
        <GoHomeFill
          className={`text-2xl hover:text-blue-600 ${
            location.pathname === "/" ? "text-blue-600" : "text-white"
          }`}
        />
      </div>
      <div onClick={() => navigate("/search")} className="cursor-pointer">
        <IoSearchSharp
          className={`text-2xl hover:text-blue-600 ${
            location.pathname === "/search" ? "text-blue-600" : "text-white"
          }`}
        />
      </div>
      <div onClick={() => navigate("/upload")} className="cursor-pointer">
        <FiPlusSquare
          className={`text-[28px] hover:text-blue-600 ${
            location.pathname === "/create" ? "text-blue-600" : "text-white"
          }`}
        />
      </div>
      <div onClick={() => navigate("/loop")} className="cursor-pointer">
        <RiVideoOnAiLine
          className={`text-2xl hover:text-blue-600 ${
            location.pathname === "/video" ? "text-blue-600" : "text-white"
          }`}
        />
      </div>

      <div
        onClick={handleProfileClick}
        className="w-[40px] h-[40px] rounded-full border-3 border-black overflow-hidden cursor-pointer flex flex-col items-center justify-center relative"
      >
        <img
          className="w-full h-full object-cover"
          src={
            userData.profileImage ||
            "https://i.pinimg.com/474x/e6/e4/df/e6e4df26ba752161b9fc6a17321fa286.jpg"
          }
          alt=""
        />
      </div>
      {location.pathname.includes("/profile") &&
        userData?.userName === profileData?.userName && (
          <div className="absolute bottom-[6px] right-[9%] translate-x-[-50%] bg-blue-600 w-[10px] h-[10px] rounded-full"></div>
        )}
    </div>
  );
};
export default Nav;
