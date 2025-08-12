import React, { useEffect } from "react";
import { FaRegHeart } from "react-icons/fa6";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

import StoryCard from "./storyCard";
import Nav from "./nav";
import Post from "./post";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FeedHome = ({ postData }) => {
  const { userData } = useSelector((state) => state.user);
  const { storyList } = useSelector((state) => state.story);
  const { myStory } = useSelector((state) => state.story);
  const { notifications } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto">
      <div className="w-full h-[80px] flex items-center justify-between px-[20px] lg:hidden">
        <div className="logo font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent text-[22px]">
          VYBE
        </div>
        <div className="Relative flex items-center gap-3">
          <FaRegHeart
            onClick={() => navigate("/notifications")}
            className="text-white text-2xl cursor-pointer"
          />
          {notifications.length > 0 &&
            notifications.some((noti) => !noti.isRead) && (
              <span className="absolute top-[12px] right-[45px] bg-red-500 text-white text-xs rounded-full px-1">
                {notifications.filter((noti) => !noti.read).length}
              </span>
            )}
          <IoChatboxEllipsesOutline
            onClick={() => navigate("/messages")}
            className="text-white text-2xl"
          />
        </div>
      </div>

      {/* story section */}
      <div className="flex w-full overflow-auto gap-3 items-center px-4 pb-4 lg:p-4 border-b border-gray-800">
        <StoryCard
          userName="Your Story"
          profileImage={userData.profileImage}
          myProfile={true}
          story={myStory}
        />
        {/* a verticle line dividing my story and others story */}
        <div className="w-[2px] h-[40px] bg-gray-800 mx-2" />
        {/* other users stories */}

        {storyList?.map((story) => (
          <StoryCard
            key={story._id}
            userName={story.author.userName}
            profileImage={story.author.profileImage}
            myProfile={false}
            story={story}
          />
        ))}
      </div>

      {/* posts section */}
      <div className="w-full min-h-[100vh] flex flex-col items-center gap-4 p-[10px] pt-[20px] bg-black rounded-t-4xl relative pb-[120px]">
        {postData?.map((post) => (
          <Post key={post._id} post={post} />
        ))}
        <Nav />
      </div>
    </div>
  );
};

export default FeedHome;
