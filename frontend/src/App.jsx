import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import ForgotPassword from "./pages/forgotpassword";
import Home from "./pages/home";
export const serverUrl = "http://localhost:8000";
import { useDispatch, useSelector } from "react-redux";
import useGetCurrentUser from "./hooks/getCurrentUser";
import useGetSuggestedUsers from "./hooks/getSuggestedUsers";
import Profile from "./pages/profile";
import EditProfilePage from "./pages/editprofile";
import Upload from "./pages/upload";
import useGetAllPosts from "./hooks/useGetAllPosts";
import Loop from "./pages/loop";
import useGetAllLoops from "./hooks/useGetAllLoops";
import Story from "./pages/story";
import { useGetAllStories } from "./hooks/getAllStories";
import { useGetMyStory } from "./hooks/useGetMyStory";
import Message from "./pages/message";
import MessageArea from "./pages/messageArea";
import { io } from "socket.io-client";
import { setOnlineUsers, setSocket } from "./redux/socketSlice";
import Searchpage from "./pages/searchpage";
import useGetAllNotifications from "./hooks/getAllNotifications";
import Notifications from "./pages/notifications";

const App = () => {
  useGetCurrentUser();
  useGetSuggestedUsers();
  useGetAllPosts();
  useGetAllLoops();
  useGetAllStories();
  useGetMyStory();
  useGetAllNotifications();

  const { userData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  const { onlineUsers } = useSelector((state) => state.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      const socketIo = io(serverUrl, {
        query: { userId: userData._id },
      });

      dispatch(setSocket(socketIo));

      socketIo.on("connect", () => {
        console.log("✅ Socket connected:", socketIo.id);
      });

      socketIo.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      return () => {
        socketIo.close();
        dispatch(setSocket(null));
      };
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData]);

  return (
    <Routes>
      <Route
        path="/signup"
        element={!userData ? <Signup /> : <Navigate to="/" />}
      />
      <Route
        path="/signin"
        element={!userData ? <Signin /> : <Navigate to="/" />}
      />
      <Route
        path="/forgotpassword"
        element={!userData ? <ForgotPassword /> : <Navigate to="/" />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/signin" />}
      />
      <Route
        path="/profile/:userName"
        element={userData ? <Profile /> : <Navigate to="/signin" />}
      />
      <Route
        path="/editprofile"
        element={userData ? <EditProfilePage /> : <Navigate to="/signin" />}
      />
      <Route
        path="/upload"
        element={userData ? <Upload /> : <Navigate to="/signin" />}
      />
      <Route
        path="/loop"
        element={userData ? <Loop /> : <Navigate to="/signin" />}
      />
      <Route
        path="/story/:userName"
        element={userData ? <Story /> : <Navigate to="/signin" />}
      />
      <Route
        path="/messages"
        element={userData ? <Message /> : <Navigate to="/signin" />}
      />
      <Route
        path="/messageArea"
        element={userData ? <MessageArea /> : <Navigate to="/signin" />}
      />
      <Route
        path="/search"
        element={userData ? <Searchpage /> : <Navigate to="/signin" />}
      />
      <Route
        path="/notifications"
        element={userData ? <Notifications /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
};

export default App;
