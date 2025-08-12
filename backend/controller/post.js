import uploadOnCloudinary from "../middlewares/cloudinary.js";
import Notification from "../models/notification.js";
import Post from "../models/post.js";
import User from "../models/user.js";
import { getSocketId, io } from "../socket.js";

export const uploadPost = async (req, res) => {
  try {
    const { caption, mediaType } = req.body;
    let media;
    if (req?.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const post = await Post.create({
      caption,
      mediaType,
      media,
      author: req.userId,
    });

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.posts.push(post._id);
    await user.save();

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "userName name profileImage"
    );
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("author", "userName name profileImage")
      .sort({ createdAt: -1 })
      .populate("comments.author", "userName name profileImage");
    if (!posts) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await Post.findById(postId).populate(
      "author",
      "userName name profileImage"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      post.likes.pull(userId);

      // Optional: Remove notification when unliked
      await Notification.findOneAndDelete({
        sender: userId,
        receiver: post.author._id,
        type: "like",
        post: post._id,
      });
    } else {
      post.likes.push(userId);

      // Send notification only if the user liking is not the author
      if (String(post.author._id) !== String(userId)) {
        // Check if notification already exists
        const existingNotification = await Notification.findOne({
          sender: userId,
          receiver: post.author._id,
          type: "like",
          post: post._id,
        });

        if (!existingNotification) {
          const notification = new Notification({
            sender: userId,
            receiver: post.author._id,
            type: "like",
            message: `has liked your post`,
            post: post._id,
          });

          await notification.save();

          const populatedNotification = await Notification.findById(
            notification._id
          )
            .populate("sender", "userName name profileImage")
            .populate("receiver", "userName name profileImage")
            .populate("post");

          const receiverSocketId = getSocketId(post.author._id);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit(
              "newNotification",
              populatedNotification
            );
          }
        }
      }
    }

    await post.save();

    const updatedPost = await Post.findById(postId).populate(
      "author",
      "userName name profileImage"
    );

    io.emit("postLiked", {
      postId: updatedPost._id,
      likes: updatedPost.likes,
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({
      message: "Error in liking post",
      error: error.message,
    });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { message } = req.body;
    const userId = req.userId;

    const post = await Post.findById(postId).populate(
      "author",
      "userName name profileImage"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      author: userId,
      message,
    });

    await post.save();

    const populatedPost = await Post.findById(postId)
      .populate("author", "userName name profileImage")
      .populate("comments.author", "userName name profileImage");

    // Emit the updated post comments to all users
    io.emit("commentedPost", {
      postId: populatedPost._id,
      comments: populatedPost.comments,
    });

    // Only notify if the commenter is not the post author
    if (String(post.author._id) !== String(userId)) {
      const notification = new Notification({
        sender: userId,
        receiver: post.author._id,
        type: "comment",
        message: `commented on your post`,
        post: post._id,
      });

      await notification.save();

      const populatedNotification = await Notification.findById(
        notification._id
      )
        .populate("sender", "userName name profileImage")
        .populate("receiver", "userName name profileImage")
        .populate("post");

      const receiverSocketId = getSocketId(post.author._id);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", populatedNotification);
      }
    }

    res.status(200).json(populatedPost);
  } catch (error) {
    console.error("Error commenting on post:", error);
    res.status(500).json({
      message: "Error commenting on post",
      error: error.message,
    });
  }
};

export const savedPosts = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const alreadySaved = user.saved.includes(postId);
    if (alreadySaved) {
      user.saved.pull(postId);
    } else {
      user.saved.push(postId);
    }
    await user.save();
    await user.populate("saved");
    const userObj = user.toObject();
    userObj.saved = userObj.saved.map((post) => post._id);
    res.status(200).json(userObj);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching saved posts",
      error: error.message,
    });
  }
};
