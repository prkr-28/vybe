import uploadOnCloudinary from '../middlewares/cloudinary.js';
import Post from '../models/post.js';
import User from '../models/user.js';

export const uploadPost = async (req, res) => {
   try {
      const {caption, mediaType} = req.body;
      let media;
      if (req?.file) {
         media = await uploadOnCloudinary(req.file.path);
      } else {
         return res.status(400).json({message: 'No file uploaded'});
      }

      const post = await Post.create({
         caption,
         mediaType,
         media,
         author: req.userId,
      });

      const user = await User.findById(req.userId);
      if (!user) {
         return res.status(404).json({message: 'User not found'});
      }
      user.posts.push(post._id);
      await user.save();

      const populatedPost = await Post.findById(post._id).populate(
         'author',
         'userName name profileImage'
      );
      res.status(201).json(populatedPost);
   } catch (error) {
      res.status(500).json({
         message: 'Internal server error',
         error: error.message,
      });
   }
};

export const getAllPosts = async (req, res) => {
   try {
      const posts = await Post.find({})
         .populate('author', 'userName name profileImage')
         .sort({createdAt: -1})
         .populate('comments.author', 'userName name profileImage');
      if (!posts) {
         return res.status(404).json({message: 'No posts found'});
      }
      res.status(200).json(posts);
   } catch (error) {
      res.status(500).json({message: 'Internal server error'});
   }
};

export const likePost = async (req, res) => {
   try {
      const {postId} = req.params;
      const post = await Post.findById(postId);
      if (!post) {
         return res.status(404).json({message: 'Post not found'});
      }
      const userId = req.userId;
      if (post.likes.includes(userId)) {
         post.likes.pull(userId);
      } else {
         post.likes.push(userId);
      }
      await post.save();
      const populatedPost = await Post.findById(postId).populate(
         'author',
         'userName name profileImage'
      );
      res.status(200).json(populatedPost);
   } catch (error) {
      res.status(500).json({
         message: 'error in liking post',
         error: error.message,
      });
   }
};

export const commentPost = async (req, res) => {
   try {
      const {postId} = req.params;
      const {message} = req.body;
      const post = await Post.findById(postId);
      if (!post) {
         return res.status(404).json({message: 'Post not found'});
      }
      post.comments.push({
         author: req.userId,
         message,
      });
      await post.save();
      const populatedPost = await Post.findById(postId)
         .populate('author', 'userName name profileImage')
         .populate('comments.author', 'userName name profileImage');
      res.status(200).json(populatedPost);
   } catch (error) {
      res.status(500).json({
         message: 'Error commenting on post',
         error: error.message,
      });
   }
};

export const savedPosts = async (req, res) => {
   try {
      const userId = req.userId;
      const {postId} = req.params;
      const post = await Post.findById(postId);
      if (!post) {
         return res.status(404).json({message: 'Post not found'});
      }

      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({message: 'User not found'});
      }
      const alreadySaved = user.saved.includes(postId);
      if (alreadySaved) {
         user.saved.pull(postId);
      } else {
         user.saved.push(postId);
      }
      await user.save();
      await user.populate('saved');
      const userObj = user.toObject();
      userObj.saved = userObj.saved.map((post) => post._id);
      res.status(200).json(userObj);
   } catch (error) {
      res.status(500).json({
         message: 'Error fetching saved posts',
         error: error.message,
      });
   }
};
