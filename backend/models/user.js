import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
      },
      userName: {
         type: String,
         required: true,
         unique: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
      },
      profileImage: {
         type: String,
         default:
            'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
      },
      bio: {
         type: String,
         default: '',
      },
      profession: {
         type: String,
         default: '',
      },
      gender: {
         type: String,
         enum: ['Male', 'Female'],
      },
      followers: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
         },
      ],
      following: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
         },
      ],
      posts: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
         },
      ],
      saved: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
         },
      ],
      loops: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Loop',
         },
      ],
      stories: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Story',
         },
      ],
      resetOtp: {
         type: String,
         default: '',
      },
      resetOtpExpires: {
         type: Date,
         default: null,
      },
      isOtpVerified: {
         type: Boolean,
         default: false,
      },
   },
   {
      timestamps: true,
   }
);

const User = mongoose.model('User', userSchema);
export default User;
