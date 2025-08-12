import React, { useRef, useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MdOutlineComment } from "react-icons/md";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setLoopData } from "../redux/loopSlice";
import { useNavigate } from "react-router-dom";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import "./loopcard.css";

const LoopCard = ({ loop }) => {
  const navigate = useNavigate();
  const videoRef = useRef();
  const commentBoxRef = useRef();
  const dispatch = useDispatch();
  const { loopData } = useSelector((state) => state.loop);
  const { userData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);

  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [progress, setProgress] = useState(0);
  const [showHeart, setShowHeart] = useState(false);

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
      setShowComments(false);
    } else {
      video.pause();
      setIsPlaying(false);
      setShowComments(false);
    }
  };

  const handleLike = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/loop/like/${loop?._id}`,
        {},
        { withCredentials: true }
      );
      const updatedLoop = res.data;
      const updatedLoops = loopData.map((l) =>
        l._id === updatedLoop._id ? updatedLoop : l
      );
      dispatch(setLoopData(updatedLoops));
    } catch (error) {
      console.error(error);
      alert("Failed to like loop");
    }
  };

  const handleDoubleClick = () => {
    if (
      !loopData.find((l) => l._id === loop._id)?.likes.includes(userData._id)
    ) {
      handleLike();
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1500);
  };

  const handleSendComment = async () => {
    if (!comment.trim()) return;
    try {
      const res = await axios.post(
        `${serverUrl}/api/loop/comment/${loop?._id}`,
        { message: comment },
        { withCredentials: true }
      );
      const updatedLoop = res.data;
      const updatedLoops = loopData.map((l) =>
        l._id === updatedLoop._id ? updatedLoop : l
      );
      dispatch(setLoopData(updatedLoops));
      setComment("");
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error(error);
      alert("Failed to comment on loop");
    }
  };

  const scrollToBottom = () => {
    if (commentBoxRef.current) {
      commentBoxRef.current.scrollTop = commentBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (showComments) {
      document.body.style.overflow = "hidden";
      setTimeout(scrollToBottom, 100);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showComments]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current;
          if (!video) return;
          if (entry.isIntersecting) {
            video.currentTime = 0;
            video.play();
            setIsPlaying(true);
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.6 }
    );
    const currentVideo = videoRef.current;
    if (currentVideo) observer.observe(currentVideo);
    return () => {
      if (currentVideo) observer.unobserve(currentVideo);
    };
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const currentTime = video.currentTime;
    const duration = video.duration;
    if (duration > 0) {
      setProgress((currentTime / duration) * 100);
    }
  };

  useEffect(() => {
    socket.on("loopLiked", (data) => {
      if (data.loopId === loop._id) {
        const updatedLoop = { ...loop, likes: data.likes };
        const updatedLoops = loopData.map((l) =>
          l._id === updatedLoop._id ? updatedLoop : l
        );
        dispatch(setLoopData(updatedLoops));
      }
    });

    socket.on("loopCommented", (data) => {
      if (data.loopId === loop._id) {
        const updatedLoop = { ...loop, comments: data.comments };
        const updatedLoops = loopData.map((l) =>
          l._id === updatedLoop._id ? updatedLoop : l
        );
        dispatch(setLoopData(updatedLoops));
        setTimeout(scrollToBottom, 100);
      }
    });

    return () => {
      socket?.off("loopLiked");
      socket?.off("loopCommented");
    };
  }, [socket, loopData, dispatch]);

  return (
    <div className="relative w-full lg:w-[480px] h-[100vh] flex items-center justify-center bg-black overflow-hidden">
      {/* Video */}
      <video
        src={loop.media}
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted={!isPlaying}
        onClick={handleVideoClick}
        onDoubleClick={handleDoubleClick}
        onTimeUpdate={handleTimeUpdate}
      />

      {showHeart && (
        <FaHeart className="heart-animation text-8xl text-red-600" />
      )}

      {/* Overlay */}
      <div className="absolute bottom-0 left-0 p-4 w-full flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent">
        <p
          onClick={() => navigate(`/profile/${loop.author?.userName}`)}
          className="text-white font-semibold text-lg cursor-pointer"
        >
          @{loop.author?.userName || "user"}
        </p>
        {loop.caption && (
          <p className="text-white text-md mt-1">{loop.caption}</p>
        )}
      </div>

      {/* Actions */}
      <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6">
        <button
          onClick={handleLike}
          className="flex flex-col items-center text-white cursor-pointer"
        >
          {loop.likes?.includes(userData?._id) ? (
            <FaHeart className="text-2xl text-red-500 hover:scale-110 transition-transform" />
          ) : (
            <FaRegHeart className="text-2xl hover:scale-110 transition-transform" />
          )}
          <span className="text-xs mt-1">{loop.likes?.length || 0}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex flex-col items-center text-white cursor-pointer"
        >
          <MdOutlineComment className="text-2xl hover:scale-110 transition-transform" />
          <span className="text-xs mt-1">{loop.comments?.length || 0}</span>
        </button>

        <button className="flex flex-col items-center cursor-pointer">
          <PiDotsThreeOutlineVerticalFill className="text-2xl text-white hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
        <div
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Comments Modal */}
      <div
        className={`absolute bottom-0 left-0 w-full bg-black bg-opacity-90 rounded-t-4xl p-4 max-h-[60%] flex flex-col transition-transform duration-500 ease-in-out ${
          showComments ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-2">
          <h3 className="text-white text-xl font-semibold mb-2">Comments</h3>
          <IoClose
            className="text-white text-[28px] cursor-pointer hover:scale-120 transition-transform"
            onClick={() => setShowComments(false)}
          />
        </div>

        {/* Comment List */}
        <div
          className="flex-1 overflow-y-auto mb-3 px-4 gap-4 scrollbar-hide"
          ref={commentBoxRef}
        >
          {loop.comments?.length > 0 ? (
            loop.comments.map((comment, idx) => (
              <div key={idx} className="mb-2">
                <p
                  onClick={() =>
                    navigate(`/profile/${comment.author?.userName}`)
                  }
                  className="text-white text-sm cursor-pointer"
                >
                  <span className="font-semibold">
                    {comment.author?.userName || "user"}:
                  </span>{" "}
                  {comment.message}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No comments yet.</p>
          )}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 mt-auto">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 p-2 rounded-full bg-transparent text-white border border-gray-600 focus:outline-none focus:border-blue-500 px-4"
          />
          {comment && (
            <button
              onClick={handleSendComment}
              className="px-4 py-2 bg-white text-black rounded-full font-semibold hover:opacity-80 transition"
            >
              Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoopCard;
