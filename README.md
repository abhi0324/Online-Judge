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
- **Monaco Editor** - Code editor component

## 📁 Project Structure

```
Online-judge/
├── backend/
│   ├── middlewares/     # Authentication middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── utils/           # Code execution utility
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

## 🧩 Backend Details

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user (username, email, password)
- `POST /api/auth/login` - Login with email and password, returns JWT token

#### Problems
- `POST /api/problems` - Add a new problem (protected)
- `GET /api/problems` - Get all problems (protected)
- `GET /api/problems/:id` - Get a specific problem by ID (protected)

#### Submissions
- `POST /api/submissions` - Submit a solution to a problem (protected)
- `GET /api/submissions` - Get all submissions for the logged-in user (protected)

#### Code Execution
- `POST /api/run` - Run code with given language and input (open)

#### Protected
- `GET /api/protected/secret` - Example protected route, returns user info

### Data Models

#### User
- `username`: String, required, unique
- `email`: String, required, unique
- `password`: String, required (hashed)
- `timestamps`: Created/updated at

#### Problem
- `title`: String, required
- `description`: String, required
- `inputFormat`: String
- `outputFormat`: String
- `difficulty`: String (Easy, Medium, Hard)
- `testCases`: Array of `{ input, expectedOutput }`
- `createdAt`: Date

#### Submission
- `userId`: ObjectId (User), required
- `problemId`: ObjectId (Problem), required
- `code`: String, required
- `language`: String, required
- `verdict`: String (Accepted, Wrong Answer, Runtime Error, etc.)
- `submittedAt`: Date

### Middleware
- **verifyToken**: Checks for JWT in Authorization header, verifies and attaches user info to request. Used to protect routes.

### Utilities
- **executeCode**: Runs submitted code in C++, Python, or Java using child processes, supports input redirection, and cleans up temp files. Used for both code running and submission evaluation.

### Server Entry (index.js)
- Sets up Express app, connects to MongoDB, configures CORS and JSON parsing, mounts all routes, and starts the server.

## 🖥️ Frontend Details

### Main Routing (App.jsx)
- `/` - Home page
- `/register` - Registration page
- `/login` - Login page
- `/problems` - List of all problems (protected)
- `/problems/:id` - Problem details, code editor, run/submit (protected)
- `/submissions` - User's submission history (protected)

### Components
- **Navbar**: Top navigation bar, shows links based on login state (Home, Problems, Submissions, Login/Register, Logout)

### Pages
- **Home**: Welcome page, shows call-to-action for register/login or link to problems if logged in
- **Register**: Registration form, posts to `/auth/register`
- **Login**: Login form, posts to `/auth/login`, saves JWT to localStorage
- **ProblemList**: Fetches and displays all problems, links to details
- **ProblemDetails**: Fetches problem by ID, shows description, Monaco code editor, language selector, input box, run and submit buttons, displays output and verdict
- **MySubmission**: Fetches and displays user's submissions, shows code, verdict, and problem title

### API Configuration
- **api.js**: Axios instance with baseURL set to backend API, attaches JWT token for protected requests

### Styles
- **global.css**: Global styles for layout, forms, buttons, etc.
- **navbar.css**: Styles for navigation bar
- **form.css, home.css, problemlist.css, problemdetail.css, mysubmission.css**: Page/component-specific styles

### Key Dependencies
- React, React Router, Axios, Monaco Editor (frontend)
- Express, Mongoose, JWT, bcrypt, dotenv, nodemon (backend)

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