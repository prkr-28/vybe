import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const uploadOnCloudinary = async (file) => {
   try {
      cloudinary.config({
         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
         api_key: process.env.CLOUDINARY_API_KEY,
         api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      const result = await cloudinary.uploader.upload(file, {
         resource_type: 'auto',
      });
      fs.unlinkSync(file);

      return result.secure_url;
   } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Failed to upload image');
   }
};

export default uploadOnCloudinary;
