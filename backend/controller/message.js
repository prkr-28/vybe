import Conversation from '../models/conversation.js';
import Message from '../models/message.js';
import uploadOnCloudinarty from '../middlewares/cloudinary.js';

export const sendMessage = async (req, res) => {
   const senderId = req.userId;
   const receiverId = req.params.receiverId;
   const {message} = req.body;

   let image;
   if (req.file) {
      image = req.file.path;
      image = await uploadOnCloudinarty(image);
   }

   try {
      const newMessage = new Message({
         sender: senderId,
         receiver: receiverId,
         message,
         image,
      });

      const savedMessage = await newMessage.save();

      // Update the conversation with the new message
      let conversation = await Conversation.findOne({
         participants: {$all: [senderId, receiverId]},
      });

      if (!conversation) {
         conversation = new Conversation({
            participants: [senderId, receiverId],
            messages: [savedMessage._id],
         });
      }

      conversation.messages.push(savedMessage._id);
      await conversation.save();

      return res.status(201).json(savedMessage);
   } catch (error) {
      return res
         .status(500)
         .json({error: 'Failed to send message', err: error.message});
   }
};

export const getMessages = async (req, res) => {
   const senderId = req.userId;
   const receiverId = req.params.receiverId;
   try {
      const conversation = await Conversation.findOne({
         participants: {$all: [senderId, receiverId]},
      }).populate('messages');

      if (!conversation) {
         return res.status(404).json({error: 'Conversation not found'});
      }

      return res.status(200).json(conversation?.messages);
   } catch (error) {
      return res
         .status(500)
         .json({error: 'Failed to retrieve messages', err: error.message});
   }
};

export const getPreviousConversations = async (req, res) => {
   const userId = req.userId;

   try {
      const conversations = await Conversation.find({
         participants: userId,
      })
         .populate('messages') // optionally keep this if you need latest message data
         .populate('participants') // THIS is crucial
         .sort({ updatedAt: -1 });

      if (!conversations || conversations.length === 0) {
         return res.status(404).json({ error: 'No conversations found' });
      }

      // Extract user objects (excluding logged-in user)
      const userMap = {};
      conversations.forEach((conv) => {
         conv.participants.forEach((user) => {
            if (user._id.toString() !== userId) {
               userMap[user._id] = user; // this now contains userName, profileImage, etc.
            }
         });
      });

      const prevUsers = Object.values(userMap);

      return res.status(200).json({ conversations, prevUsers });
   } catch (error) {
      return res.status(500).json({ error: 'Failed to retrieve conversations', err: error.message });
   }
};
