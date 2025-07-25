import uploadOnCloudinary from '../middlewares/cloudinary.js';
import Loop from '../models/loop.js';
import User from '../models/user.js';

export const uploadLoop = async (req, res) => {
   try {
      const {caption} = req.body;
      let media;
      if (req.file) {
         media = await uploadOnCloudinary(req.file.path);
      } else {
         return res.status(400).json({message: 'No file uploaded'});
      }

      const loop = await Loop.create({
         caption,
         media,
         author: req.userId,
      });

      const user = await User.findById(req.userId);
      if (!user) {
         return res.status(404).json({message: 'User not found'});
      }
      user.loops.push(loop._id);

      const populatedLoop = await Loop.findById(loop._id).populate(
         'author',
         'userName name profileImage'
      );
      res.status(201).json(populatedLoop);
   } catch (error) {
      console.log('upload loop error', error.message);
      res.status(500).json({
         message: 'Internal server error',
         error: error.message,
      });
   }
};

export const likeLoop = async (req, res) => {
   try {
      const {loopId} = req.params;
      const loop = await Loop.findById(loopId);
      if (!loop) {
         return res.status(404).json({message: 'loop not found'});
      }
      const userId = req.userId;
      if (loop.likes.includes(userId)) {
         loop.likes.pull(userId);
      } else {
         loop.likes.push(userId);
      }
      await loop.save();
      const populatedLoop = await Loop.findById(loopId).populate(
         'author',
         'userName name profileImage'
      );
      res.status(200).json(populatedLoop);
   } catch (error) {
      res.status(500).json({
         message: 'Error liking loop',
         error: error.message,
      });
   }
};

export const commentLoop = async (req, res) => {
   try {
      const {loopId} = req.params;
      const {message} = req.body;
      const loop = await Loop.findById(loopId);
      if (!loop) {
         return res.status(404).json({message: 'loop not found'});
      }
      loop.comments.push({
         author: req.userId,
         message,
      });
      await loop.save();
      const populatedLoop = await Loop.findById(loopId)
         .populate('author', 'userName name profileImage')
         .populate('comments.author', 'userName name profileImage');
      res.status(200).json(populatedLoop);
   } catch (error) {
      res.status(500).json({
         message: 'Error commenting on loop',
         error: error.message,
      });
   }
};

export const getAllLoops = async (req, res) => {
   try {
      const loops = await Loop.find({})
         .populate('author', 'userName name profileImage')
         .populate('comments.author', 'userName name profileImage')
         .sort({createdAt: -1});
      res.status(200).json(loops);
   } catch (error) {
      res.status(500).json({
         message: 'error in fetching loops',
         error: error.message,
      });
   }
};
