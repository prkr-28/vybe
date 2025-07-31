import React from "react";
import { FaRegHeart } from "react-icons/fa6";
import "../components/leftHome.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import FollowUser from "./followButton";

const LeftHome = () => {
  const { userData } = useSelector((state) => state.user);
  const { suggestedUsers } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="w-[25%] hidden lg:block min-h-[100vh] bg-black border-r-1 border-gray-800 ">
      <div className="w-full h-[80px] flex items-center justify-between px-3">
        <div className="logo font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent text-2xl">
          VYBE
        </div>
        <div>
          <FaRegHeart className="text-white text-2xl cursor-pointer" />
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between px-3 border-b-1 border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <div
            onClick={() => {
              navigate("/profile/" + userData.userName);
            }}
            className="w-[50px] h-[50px] border-2 border-black rounded-full overflow-hidden cursor-pointer"
          >
            <img
              className="w-full h-full object-cover"
              src={
                userData?.profileImage ||
                "https://i.pinimg.com/474x/e6/e4/df/e6e4df26ba752161b9fc6a17321fa286.jpg"
              }
              alt=""
            />
          </div>
          <div>
            <div className="text-[18px] text-white">
              {userData?.userName || "Unknown User"}
            </div>
            <div className="text-gray-400 text-xs">{userData?.name}</div>
          </div>
        </div>
        <div
          onClick={handleLogOut}
          className="text-sm text-blue-800 cursor-pointer hover:underline font-semibold"
        >
          Log Out
        </div>
      </div>

      <div className="w-full flex flex-col gap-4 px-3 pt-3">
        <h1 className="text-white text-[18px]">Suggested Users</h1>
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
          {suggestedUsers?.length > 0 ? (
            suggestedUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between gap-4 p-3 bg-[#1e1e1e] rounded-2xl cursor-pointer hover:bg-[#2c2c2c]"
              >
                <div className="flex items-center gap-2">
                  <div
                    onClick={() => {
                      navigate("/profile/" + user.userName);
                    }}
                    className="w-[45px] h-[45px] border-2 border-black rounded-full overflow-hidden cursor-pointer"
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={
                        user.profileImage ||
                        "https://i.pinimg.com/474x/e6/e4/df/e6e4df26ba752161b9fc6a17321fa286.jpg"
                      }
                      alt=""
                    />
                  </div>
                  <div>
                    <div className="text-white text-[18px]">
                      {user.userName}
                    </div>
                    <div className="text-gray-400 text-xs">{user.name}</div>
                  </div>
                </div>

                <FollowUser
                  tailwind={
                    "text-xs md:text-sm font-semibold px-[10px] py-[6px] min-w-[100px] bg-white hover:bg-gray-100 rounded-2xl cursor-pointer"
                  }
                  targetUserId={user._id}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400">No suggested users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftHome;
