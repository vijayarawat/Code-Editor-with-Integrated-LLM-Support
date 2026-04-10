# Frontend Project

A full-stack web application consisting of a React frontend and Node.js backend, designed for coding practice and online programming challenges.

## 🏗️ Project Structure

```
frontEnd/
├── frontend/          # React + Vite frontend application
├── leetcode/          # Node.js + Express backend API
└── README.md          # This file
```

## 🚀 Tech Stack

### Frontend (`/frontend`)
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS + DaisyUI components
- **State Management**: Redux Toolkit
- **Forms**: React Hook Form with Zod validation
- **Code Editor**: Monaco Editor (VS Code editor for web)
- **HTTP Client**: Axios
- **Routing**: React Router v7
- **Dev Tools**: ESLint, Hot Module Replacement

### Backend (`/leetcode`)
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Caching**: Redis
- **File Storage**: Cloudinary
- **Security**: bcrypt for password hashing
- **API Client**: Axios
- **AI Integration**: Google GenAI
- **Validation**: Validator.js

## 🛠️ Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB instance
- Redis instance
- Cloudinary account (for file uploads)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd leetcode
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
# Generate JWT secret key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. Create `.env` file with required variables:
```env
JWT_KEY=your_generated_jwt_key
MONGODB_URI=mongodb://localhost:27017/your_database
REDIS_URL=redis://localhost:6379
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

5. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 🔧 Available Scripts

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend Scripts
- `npm start` - Start the server
- `npm test` - Run tests (currently not configured)

## 🔐 Authentication

The application uses JWT-based authentication with the following flow:

**Token Generation:**
```javascript
const token = jwt.sign(
  { _id: user._id, emailId: emailId, role: 'user' },
  process.env.JWT_KEY,
  { expiresIn: 3600 }
);
```

**Cookie Management:**
```javascript
// Set cookie
res.cookie('token', token, { maxAge: 10*60*1000 });

// Logout
const { token } = req.cookies;
const payload = jwt.decode(token);
```

##  Features

- **User Authentication**: Secure JWT-based authentication system 
- **Real-time Updates**: State management with Redux Toolkit 
- **Responsive Design**: Tailwind CSS with DaisyUI components - Mobile-first design with pre-built UI components
- **Form Validation**: Robust form handling with Zod schema validation - Type-safe form validation with real-time error feedback
- **File Management**: Cloudinary integration for asset management - Upload, store, and optimize images and media files
- **Caching**: Redis integration for improved performance
- **AI Integration**:AI-powered features for code assistance and problem solving


## 🔗 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)