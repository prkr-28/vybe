import uploadOnCloudinary from '../middlewares/cloudinary.js';
import Story from '../models/story.js';
import User from '../models/user.js';

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
      const story = await Story.findById(storyId);

      if (!story) {
         return res.status(404).json({message: 'Story not found'});
      }
      const viewersIds = story.viewers.map((viewer) => ({
         id: viewer._id,
      }));
      if (
         !viewersIds.some(
            (viewer) => viewer.id.toString() === req.user._id.toString()
         )
      ) {
         story.viewers.push(req.userId);
         await story.save();
      }
      const populatedStory = await Story.findById(storyId)
         .populate('author', 'name userName profileImage')
         .populate('viewers', 'name userName profileImage');
      res.status(200).json(populatedStory);
   } catch (error) {
      console.log('view story error', error);
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
      const story = await Story.findOne({
         author: user._id,
      }).populate('viewers', 'author');
      if (!story) {
         return res.status(404).json({message: 'Story not found'});
      }
      return res.status(200).json({
         message: 'Story fetched successfully',
         story,
      });
   } catch (error) {
      console.log('get story by userName error', error);
      res.status(500).json({message: 'Internal server error'});
   }
};
