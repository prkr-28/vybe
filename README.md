# VYBE - Full-Stack Social Media Platform

A modern, feature-rich social media platform built with the MERN stack, featuring real-time messaging, multimedia content sharing, and interactive social features.

## 🚀 Features

### Core Features

- **User Authentication**: Secure signup/signin with JWT tokens and bcrypt password hashing
- **Password Recovery**: OTP-based password reset via email using Nodemailer
- **Real-time Messaging**: Instant chat with Socket.io integration
- **Live Notifications**: Real-time push notifications for likes, comments, and follows
- **Multimedia Sharing**: Upload and share images/videos for posts, stories, and loops
- **User Profiles**: Customizable profiles with bio, profession, and profile pictures
- **Social Features**: Follow/unfollow users, like posts, comment on content

### Content Types

- **Posts**: Share images and videos with captions
- **Stories**: Temporary content that expires after 24 hours
- **Loops**: Short video content similar to reels/TikTok

### Additional Features

- **Online Status**: See which users are currently online
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Search Functionality**: Find users by name or username
- **Media Preview**: View media before uploading
- **Auto-scroll Messaging**: Smooth chat experience with automatic scrolling

## 🛠️ Tech Stack

### Frontend

- **React.js 19.1.0** - UI library
- **Vite 7.0.4** - Build tool and dev server
- **Redux Toolkit** - State management
- **TailwindCSS** - Styling framework
- **Socket.io-client** - Real-time communication
- **React Router Dom** - Navigation
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Toastify** - Toast notifications
- **React Spinners** - Loading indicators

### Backend

- **Node.js** - Runtime environment
- **Express.js 5.1.0** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication
- **JWT** - Authentication tokens
- **Bcrypt.js** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud media storage
- **Nodemailer** - Email service
- **CORS** - Cross-origin resource sharing
- **Cookie-parser** - Cookie handling
- **Dotenv** - Environment variables

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/prkr-28/vybe.git
cd vybe
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend root directory:

```env
# Database
MONGODB_URL=mongodb://localhost:27017/vybe
# or for MongoDB Atlas:
# MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/vybe

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Server Port
PORT=8000

# Email Configuration (for OTP)
EMAIL=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

### 4. Environment Configuration

#### Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in the `EMAIL_PASS` field

#### Cloudinary Setup

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard to find your credentials
3. Add the credentials to your `.env` file

#### MongoDB Setup

**Option 1: Local MongoDB**

1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGODB_URL=mongodb://localhost:27017/vybe`

**Option 2: MongoDB Atlas (Cloud)**

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get the connection string
4. Replace `<username>` and `<password>` with your credentials

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:8000`

### Start Frontend Development Server

Open a new terminal and run:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📱 Usage

1. **Sign Up**: Create a new account with name, username, email, and password
2. **Sign In**: Log in with your username and password
3. **Profile Setup**: Update your profile with bio, profession, and profile picture
4. **Create Content**: Upload posts, stories, or loops with images/videos
5. **Social Interaction**: Follow users, like posts, and comment on content
6. **Messaging**: Send real-time messages to other users
7. **Notifications**: Receive instant notifications for social activities

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/signout` - User logout
- `POST /api/auth/sentOtp` - Send OTP for password reset
- `POST /api/auth/verifyOtp` - Verify OTP
- `POST /api/auth/resetPassword` - Reset password

### User Management

- `GET /api/user/current` - Get current user data
- `GET /api/user/suggestedUsers` - Get suggested users
- `POST /api/user/updateProfile` - Update user profile
- `GET /api/user/getProfile/:userName` - Get user profile by username
- `POST /api/user/follow/:userId` - Follow/unfollow user

### Posts

- `POST /api/post/upload` - Upload new post
- `GET /api/post/getAllPosts` - Get all posts
- `POST /api/post/like/:postId` - Like/unlike post
- `POST /api/post/comment/:postId` - Comment on post

### Stories

- `POST /api/story/upload` - Upload new story
- `GET /api/story/` - Get all stories
- `GET /api/story/:storyId` - View specific story

### Loops

- `POST /api/loop/upload` - Upload new loop
- `GET /api/loop/getAllLoops` - Get all loops

### Messages

- `POST /api/message/send/:receiverId` - Send message
- `GET /api/message/getAll/:receiverId` - Get conversation messages
- `GET /api/message/prevChats` - Get previous conversations

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Prkr-28**

- GitHub: [@prkr-28](https://github.com/prkr-28)

## 🙏 Acknowledgments

- Thanks to all the open-source libraries that made this project possible
- Special thanks to the React and Node.js communities
- Cloudinary for providing excellent media management services

---

## 📞 Support

If you encounter any issues or have questions, please feel free to:

- Open an issue on GitHub
- Contact me through my GitHub profile

**Happy coding! 🚀**
