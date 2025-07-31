import uploadOnCloudinary from '../middlewares/cloudinary.js';
import Story from '../models/story.js';
import User from '../models/user.js';
import mongoose from 'mongoose';

export const uploadStory = async (req, res) => {
   try {
      const userId = req.userId;
      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({message: 'User not found'});
      }
      if (user.stories) {
         await Story.findByIdAndDelete(user.stories._id);
         user.stories = null;
      }
      const {mediaType} = req.body;
      let media;
      if (req.file) {
         media = await uploadOnCloudinary(req.file.path);
      } else {
         return res.status(400).json({message: 'No file uploaded'});
      }

      const story = await Story.create({
         author: userId,
         mediaType,
         media,
      });
      user.stories = story._id;
      await user.save();

      const populatedStory = await Story.findById(story._id)
         .populate('author', 'name userName profileImage')
         .populate('viewers', 'name userName profileImage');
      res.status(201).json({
         message: 'Story uploaded successfully',
         story: populatedStory,
      });
   } catch (error) {
      console.log('upload story error', error.message);
      res.status(500).json({
         message: 'Internal server error',
         error: error.message,
      });
   }
};

export const viewStory = async (req, res) => {
   try {
      const {storyId} = req.params;

      // Step 1: Find story
      let story = await Story.findById(storyId);

      if (!story) {
         return res.status(404).json({message: 'Story not found'});
      }

      // Step 2: Skip if current user is the author
      if (story.author.toString() !== req.userId.toString()) {
         const alreadyViewed = story.viewers.some(
            (viewerId) => viewerId.toString() === req.userId.toString()
         );

         if (!alreadyViewed) {
            story.viewers.push(new mongoose.Types.ObjectId(req.userId));
            await story.save();
         }
      }

      // Step 3: Populate author & viewers
      story = await Story.findById(storyId)
         .populate('author', 'userName profileImage')
         .populate('viewers', 'userName profileImage');

      res.status(200).json(story);
   } catch (error) {
      console.error('view story error:', error);
      res.status(500).json({message: 'Internal server error'});
   }
};

export const getStoryByUserName = async (req, res) => {
   try {
      const {userName} = req.params;

      const user = await User.findOne({userName});
      if (!user) {
         return res.status(404).json({message: 'User not found'});
      }

      const stories = await Story.find({author: user._id})
         .sort({createdAt: -1})
         .limit(1)
         .populate('author', 'userName profileImage')
         .populate('viewers', 'userName profileImage');

      if (!stories || stories.length === 0) {
         return res.status(404).json({message: 'No stories found for user'});
      }

      return res.status(200).json({
         message: 'Story fetched successfully',
         story: stories[0],
      });
   } catch (error) {
      console.error('getStoryByUserName error:', error);
      return res.status(500).json({message: 'Internal server error'});
   }
};

export const getAllStories = async (req, res) => {
   try {
      const currentUserId = req.userId;

      // Fetch the user to get the list of people they are following
      const currentUser = await User.findById(currentUserId).select(
         'following'
      );

      if (!currentUser) {
         return res.status(404).json({message: 'User not found'});
      }

      const followingIds = currentUser.following.filter(
         (id) => id.toString() !== currentUserId.toString()
      );

      // Fetch stories of all users the current user is following
      const allStories = await Story.find({
         author: {$in: followingIds},
      })
         .sort({createdAt: -1})
         .populate('author viewers');

      const uniqueLatestStories = [];
      const seenAuthors = new Set();

      for (const story of allStories) {
         if (!seenAuthors.has(story.author._id.toString())) {
            uniqueLatestStories.push(story);
            seenAuthors.add(story.author._id.toString());
         }
      }
      return res.status(200).json({
         message: 'All stories fetched successfully',
         stories: uniqueLatestStories,
      });
   } catch (error) {
      console.error('getAllStories error:', error);
      return res.status(500).json({message: 'Internal server error'});
   }
};
