# Online Judge

A full-stack web application for programming competitions and practice, built with React frontend and Node.js backend.

## 🚀 Features

- **User Authentication**: Secure registration and login system with JWT tokens
- **Problem Management**: Browse and view programming problems
- **Code Submission**: Submit solutions and track submission history
- **User Dashboard**: View personal submissions and progress
- **Responsive Design**: Modern UI that works on desktop and mobile

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **ESLint** - Code linting

## 📁 Project Structure

```
Online-judge/
├── backend/
│   ├── middlewares/     # Authentication middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── index.js         # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── styles/      # CSS files
│   │   ├── App.jsx      # Main app component
│   │   └── api.js       # API configuration
│   ├── index.html
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Online-judge
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=8000
   ```

4. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The server will run on `http://localhost:8000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Problems
- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get specific problem

### Submissions
- `POST /api/submissions` - Submit solution
- `GET /api/submissions` - Get user submissions

### Protected Routes
- `GET /api/protected/profile` - Get user profile

## 🎯 Usage

1. **Register/Login**: Create an account or login to access the platform
2. **Browse Problems**: View available programming problems
3. **Submit Solutions**: Write and submit your code solutions
4. **Track Progress**: Monitor your submission history and performance

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Start Vite dev server
npm run build  # Build for production
npm run lint  # Run ESLint
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🤝 Support

If you encounter any issues or have questions, please open an issue on the repository.