import express from 'express';
import {
   signUp,
   signIn,
   signOut,
   sendOtp,
   verifyOtp,
   resetPassword,
} from '../controller/auth.js';

const authrouter = express.Router();
authrouter.post('/signup', signUp);
authrouter.post('/signin', signIn);
authrouter.get('/signout', signOut);
authrouter.post('/sentOtp', sendOtp);
authrouter.post('/verifyOtp', verifyOtp);
authrouter.post('/resetPassword', resetPassword);

export default authrouter;
