import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import {generateToken} from '../config/token.js';
import sendMail from '../config/mail.js';

export const signUp = async (req, res) => {
   try {
      const {name, userName, email, password} = req.body;
      if (!name || !userName || !email || !password) {
         return res.status(400).json({message: 'All fields are required'});
      }
      // Check if user already exists
      const existingUser = await User.findOne({$or: [{userName}, {email}]});
      if (existingUser) {
         return res
            .status(400)
            .json({message: 'Username or email already exists'});
      }
      //password must be at least 6 characters
      if (password.length < 6) {
         return res
            .status(400)
            .json({message: 'Password must be at least 6 characters long'});
      }
      //hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create new user
      const newUser = new User({
         name,
         userName,
         email,
         password: hashedPassword,
      });

      const token = generateToken(newUser._id);
      res.cookie('token', token, {
         httpOnly: true,
         maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
         secure: false,
         sameSite: 'Strict',
      });
      await newUser.save();
      return res.status(201).json({
         message: 'User created successfully',
         user: newUser,
         token: token,
      });
   } catch (error) {
      console.error('Error during sign up:', error);
      res.status(500).json({message: 'Internal server error'});
   }
};

export const signIn = async (req, res) => {
   try {
      const {userName, password} = req.body;
      if (!userName || !password) {
         return res
            .status(400)
            .json({message: 'Username and password are required'});
      }
      // Find user by username
      const user = await User.findOne({userName});
      if (!user) {
         return res.status(404).json({message: 'User not found'});
      }
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(400).json({message: 'Invalid credentials'});
      }
      // Generate token
      const token = generateToken(user._id);
      res.cookie('token', token, {
         httpOnly: true,
         maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
         secure: false,
         sameSite: 'Strict',
      });
      return res.status(200).json({
         message: 'Login successful',
         user,
         token,
      });
   } catch (error) {
      console.error('Error during sign in:', error);
      res.status(500).json({message: 'Internal server error'});
   }
};

export const signOut = async (req, res) => {
   try {
      res.clearCookie('token');
      return res.status(200).json({message: 'Logout successful'});
   } catch (error) {
      console.error('Error during sign out:', error);
      res.status(500).json({message: 'Internal server error'});
   }
};

export const sendOtp = async (req, res) => {
   try {
      const {email} = req.body;
      if (!email) {
         return res.status(400).json({message: 'Email is required'});
      }
      const user = await User.findOne({email});
      if (!user) {
         return res.status(404).json({message: 'User not found'});
      }
      // Generate OTP
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      user.resetOtp = otp;
      user.resetOtpExpires = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
      user.isOtpVerified = false;
      // Save user with OTP
      await user.save();
      // Send OTP via email
      await sendMail(email, otp);
      return res.status(200).json({message: 'OTP sent successfully', otp});
   } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({message: 'Internal server error'});
   }
};

export const verifyOtp = async (req, res) => {
   try {
      const {email, otp} = req.body;
      if (!email || !otp) {
         return res.status(400).json({message: 'Email and OTP are required'});
      }
      const user = await User.findOne({email});
      if (!user) {
         return res.status(404).json({message: 'User not found'});
      }
      // Check if OTP is valid and not expired
      if (user.resetOtp !== otp || Date.now() > user.resetOtpExpires) {
         return res.status(400).json({message: 'Invalid or expired OTP'});
      }
      // Mark OTP as verified
      user.isOtpVerified = true;
      user.resetOtp = '';
      user.resetOtpExpires = null;
      await user.save();
      return res
         .status(200)
         .json({user: user, message: 'OTP verified successfully'});
   } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({message: 'Internal server error'});
   }
};

export const resetPassword = async (req, res) => {
   try {
      const {email, newPassword} = req.body;
      if (!email || !newPassword) {
         return res
            .status(400)
            .json({message: 'Email and new password are required'});
      }
      const user = await User.findOne({email});
      if (!user) {
         return res.status(404).json({message: 'User not found'});
      }
      // Check if OTP is verified
      if (!user.isOtpVerified) {
         return res.status(400).json({message: 'OTP not verified'});
      }
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      // Update user's password
      user.password = hashedPassword;
      user.isOtpVerified = false; // Reset OTP verification status
      user.resetOtp = '';
      user.resetOtpExpires = null; // Clear OTP expiration
      await user.save();
      return res.status(200).json({message: 'Password reset successfully'});
   } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({message: 'Internal server error'});
   }
};
