import uploadOnCloudinary from '../middlewares/cloudinary.js';
import User from '../models/user.js';

export const getCurrentUser = async (req, res) => {
   try {
      const userId = req.userId;

      const user = await User.findById(userId)
         .populate(
            'posts loops saved saved.author',
            'userName name profileImage'
         )
         .populate('followers', 'userName profileImage stories')
         .populate('following', 'userName profileImage stories');

      if (!user) {
         return res.status(404).json({message: 'User not found'});
      }

      res.status(200).json(user);
   } catch (error) {
      res.status(500).json({
         message: 'Error fetching current user',
         error: error.message,
      });
   }
};

export const getSuggestedUsers = async (req, res) => {
   try {
      const userId = req.userId;
      const users = await User.find({
         _id: {$ne: userId},
      })
         .select('-password -email')
         .limit(8);
      if (!users) {
         return res.status(404).json({message: 'No suggested users found'});
      }
      res.status(200).json(users);
   } catch (error) {
      res.status(500).json({
         message: 'Error fetching suggested users',
         error: error.message,
      });
   }
};

export const updateUserProfile = async (req, res) => {
   try {
      const userId = req.userId;
      const {name, userName, bio, profession, gender} = req.body;

      const user = await User.findById(userId).select('-password -email');
      if (!user) {
         return res.status(404).json({message: 'User not found'});
      }
      const sameUserWithUserName = await User.findOne({
         userName,
         _id: {$ne: userId},
      });
      if (sameUserWithUserName) {
         return res.status(400).json({message: 'Username already taken'});
      }

      let profileImage;
      if (req.file) {
         profileImage = await uploadOnCloudinary(req.file.path);
      }

      user.name = name;
      user.userName = userName;
      if (profileImage) {
         user.profileImage = profileImage;
      }
      user.bio = bio;
      user.profession = profession;
      user.gender = gender || undefined;

      await user.save();
      res.status(200).json(user);
   } catch (error) {
      res.status(500).json({
         message: 'Error updating user profile',
         error: error.message,
      });
   }
};

export const getUserProfileById = async (req, res) => {
   try {
      const {userName} = req.params;
      const user = await User.findOne({userName}).populate(
         'posts loops followers following'
      );
      if (!user) {
         return res.status(404).json({message: 'User not found'});
      }
      res.status(200).json(user);
   } catch (error) {
      res.status(500).json({
         message: 'Error fetching user profile',
         error: error.message,
      });
   }
};

export const FollowUser = async (req, res) => {
   try {
      const {userId} = req.params;
      const currentUserId = req.userId;

      if (userId === currentUserId) {
         return res.status(400).json({message: 'Cannot follow yourself'});
      }

      const userToFollow = await User.findById(userId);
      if (!userToFollow) {
         return res.status(404).json({message: 'User not found'});
      }

      const currentUser = await User.findById(currentUserId);
      if (!currentUser) {
         return res.status(404).json({message: 'Current user not found'});
      }

      if (currentUser.following.includes(userId)) {
         // logic to unfollow..
         currentUser.following.pull(userId);
         userToFollow.followers.pull(currentUserId);
         await currentUser.save();
         await userToFollow.save();
         return res.status(200).json({
            message: 'Successfully unfollowed the user',
            following: currentUser.following,
            followers: userToFollow.followers,
         });
      }
      currentUser.following.push(userId);
      userToFollow.followers.push(currentUserId);

      await currentUser.save();
      await userToFollow.save();

      res.status(200).json({
         message: 'Successfully followed the user',
         following: currentUser.following,
         followers: userToFollow.followers,
      });
   } catch (error) {
      res.status(500).json({
         message: 'Error following user',
         error: error.message,
      });
   }
};
