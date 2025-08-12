import express from "express";
import { isAuthenticated } from "../middlewares/isauth.js";
import {
  FollowUser,
  getCurrentUser,
  getSuggestedUsers,
  getUserProfileById,
  searchUsers,
  updateUserProfile,
  getAllNotifications,
  markAllNotificationsAsRead,
} from "../controller/user.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();
userRouter.get("/current", isAuthenticated, getCurrentUser);
userRouter.get("/suggestedUsers", isAuthenticated, getSuggestedUsers);
userRouter.post(
  "/updateProfile",
  isAuthenticated,
  upload.single("profileImage"),
  updateUserProfile
);
userRouter.get("/getProfile/:userName", isAuthenticated, getUserProfileById);
userRouter.post("/follow/:userId", isAuthenticated, FollowUser);
userRouter.get("/getSearchedUsers", isAuthenticated, searchUsers);
userRouter.get("/getAllNotifications", isAuthenticated, getAllNotifications);
userRouter.put("/mark-all-read", isAuthenticated, markAllNotificationsAsRead);

export default userRouter;
