import uploadOnCloudinary from "../middlewares/cloudinary.js";
import Loop from "../models/loop.js";
import Notification from "../models/notification.js";
import User from "../models/user.js";
import { io, getSocketId } from "../socket.js";

export const uploadLoop = async (req, res) => {
  try {
    const { caption } = req.body;
    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const loop = await Loop.create({
      caption,
      media,
      author: req.userId,
    });

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.loops.push(loop._id);

    const populatedLoop = await Loop.findById(loop._id).populate(
      "author",
      "userName name profileImage"
    );
    res.status(201).json(populatedLoop);
  } catch (error) {
    console.log("upload loop error", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const likeLoop = async (req, res) => {
  try {
    const { loopId } = req.params;
    const userId = req.userId;

    const loop = await Loop.findById(loopId).populate(
      "author",
      "userName name profileImage"
    );

    if (!loop) {
      return res.status(404).json({ message: "Loop not found" });
    }

    const alreadyLiked = loop.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      loop.likes.pull(userId);

      // Optional: Remove notification when unliked
      await Notification.findOneAndDelete({
        sender: userId,
        receiver: loop.author._id,
        type: "like",
        loop: loop._id,
      });
    } else {
      loop.likes.push(userId);

      // Send notification only if user is not the loop author
      if (String(loop.author._id) !== String(userId)) {
        // Check if notification already exists
        const existingNotification = await Notification.findOne({
          sender: userId,
          receiver: loop.author._id,
          type: "like",
          loop: loop._id,
        });

        if (!existingNotification) {
          const notification = new Notification({
            sender: userId,
            receiver: loop.author._id,
            type: "like",
            message: `liked your loop`,
            loop: loop._id,
          });

          await notification.save();

          const populatedNotification = await Notification.findById(
            notification._id
          )
            .populate("sender", "userName name profileImage")
            .populate("receiver", "userName name profileImage")
            .populate("loop");

          const receiverSocketId = getSocketId(loop.author._id);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit(
              "newNotification",
              populatedNotification
            );
          }
        }
      }
    }

    await loop.save();

    const populatedLoop = await Loop.findById(loopId).populate(
      "author",
      "userName name profileImage"
    );

    io.emit("loopLiked", {
      loopId: populatedLoop._id,
      likes: populatedLoop.likes,
    });

    res.status(200).json(populatedLoop);
  } catch (error) {
    res.status(500).json({
      message: "Error liking loop",
      error: error.message,
    });
  }
};

export const commentLoop = async (req, res) => {
  try {
    const { loopId } = req.params;
    const { message } = req.body;
    const userId = req.userId;

    const loop = await Loop.findById(loopId).populate(
      "author",
      "userName name profileImage"
    );

    if (!loop) {
      return res.status(404).json({ message: "Loop not found" });
    }

    loop.comments.push({
      author: userId,
      message,
    });

    await loop.save();

    const populatedLoop = await Loop.findById(loopId)
      .populate("author", "userName name profileImage")
      .populate("comments.author", "userName name profileImage");

    io.emit("loopCommented", {
      loopId: populatedLoop._id,
      comments: populatedLoop.comments,
    });

    // Send notification if commenter is not the author
    if (String(loop.author._id) !== String(userId)) {
      const notification = new Notification({
        sender: userId,
        receiver: loop.author._id,
        type: "comment",
        message: `commented on your loop`,
        loop: loop._id,
      });

      await notification.save();

      const populatedNotification = await Notification.findById(
        notification._id
      )
        .populate("sender", "userName name profileImage")
        .populate("receiver", "userName name profileImage")
        .populate("loop");

      const receiverSocketId = getSocketId(loop.author._id);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", populatedNotification);
      }
    }

    res.status(200).json(populatedLoop);
  } catch (error) {
    res.status(500).json({
      message: "Error commenting on loop",
      error: error.message,
    });
  }
};

export const getAllLoops = async (req, res) => {
  try {
    const loops = await Loop.find({})
      .populate("author", "userName name profileImage")
      .populate("comments.author", "userName name profileImage")
      .sort({ createdAt: -1 });
    res.status(200).json(loops);
  } catch (error) {
    res.status(500).json({
      message: "error in fetching loops",
      error: error.message,
    });
  }
};
