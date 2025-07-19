import mongoose from 'mongoose';

const loopSchema = new mongoose.Schema(
   {
      author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      media: {
         type: String,
         required: true,
      },
      caption: {
         type: String,
         default: '',
      },
      likes: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
         },
      ],
      comments: [
         {
            author: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'User',
            },
            message: {
               type: String,
               required: true,
            },
         },
      ],
   },
   {
      timestamps: true,
   }
);

const Loop = mongoose.model('Loop', loopSchema);
export default Loop;
