import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
   service: 'Gmail',
   port: 465,
   secure: true, // true for 465, false for other ports
   auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
   },
});

const sendMail = async (to, otp) => {
   await transporter.sendMail(
      {
         from: process.env.EMAIL,
         to,
         subject: 'Password Reset Request',
         html: `<p>Your OTP for password reset request is <b>${otp}</b></p>`,
      },
      (error, info) => {
         if (error) {
            console.error('Error sending email:', error);
         } else {
            console.log('Email sent:', info.response);
         }
      }
   );
};

export default sendMail;
