import User from '../models/user.js';

export const getCurrentUser = async (req, res) => {
   try {
      const userId = req.userId;
      const user = await User.findById(userId);
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
      const { name, userName, bio, profession, gender } = req.body;

      const user = await User.findByIdAndUpdate(
         userId,
         {
            name,
            userName,
            email,
            bio,
            profession,
            gender,
         },
         { new: true }
      );

      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
   } catch (error) {
      res.status(500).json({
         message: 'Error updating user profile',
         error: error.message,
      });
      
   }
}