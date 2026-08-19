# JudgeX - Online Coding Platform 

[Live Demo](https://judgex.vercel.app/)

A full-stack web application for coding practice and programming competitions, featuring real-time code execution, AI-powered code review, user authentication, problem management, and a leaderboard.

---

## 🚀 Features

- **User Authentication**: Secure registration/login with JWT.
- **Problem Management**: Admins can create, edit, and delete problems with test cases and examples.
- **Code Submission & Evaluation**: Users submit code in C++, Python, or Java; code is executed and auto-evaluated against test cases.
- **AI Code Review**: Get instant feedback on your code using Google Gemini AI.
- **Leaderboard**: Track top users by problems solved.
- **Submission History**: View your past submissions and verdicts.
- **Responsive UI**: Modern, mobile-friendly React interface.

---

## 🛠️ Tech Stack

**Backend**
- Node.js, Express.js
- MongoDB (Mongoose)
- JWT, bcrypt
- Google Gemini AI API
- Child process for code execution
- Docker support

**Frontend**
- React 19, Vite
- React Router v7
- Axios
- Monaco Editor
- Modular CSS

---

## 📁 Project Structure

```
Online-judge/
├── backend/
│   ├── models/         # Mongoose schemas (User, Problem, Submission)
│   ├── routes/         # API endpoints (auth, problems, submissions, leaderboard, AI review, protected)
│   ├── middlewares/    # Auth and admin checks
│   ├── utils/          # Code execution, AI integration
│   ├── temp/           # Temporary files for code execution
│   ├── index.js        # Server entry
│   ├── package.json
│   ├── Dockerfile      # Docker support for backend
│   └── .dockerignore
├── frontend/
│   ├── src/
│   │   ├── pages/      # Main pages (Home, Problems, Admin, etc.)
│   │   ├── components/ # Navbar, Footer, reusable UI
│   │   ├── layouts/    # Layout wrapper
│   │   ├── styles/     # CSS modules
│   │   └── api.js      # Axios config
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── compiler/           # (Reserved for future use)
├── keys/               # (Empty, for future use or secrets)
└── README.md           # Project documentation
```

---

## 🧩 Backend Overview

### Main Endpoints

- **Auth**
  - `POST /api/auth/register` — Register new user
  - `POST /api/auth/login` — Login, returns JWT
- **Problems**
  - `GET /api/problems` — List all problems (auth required)
  - `GET /api/problems/:id` — Get problem details (auth required)
  - `POST /api/problems` — Add problem (admin only)
  - `PUT /api/problems/:id` — Edit problem (admin only)
  - `DELETE /api/problems/:id` — Delete problem (admin only)
- **Submissions**
  - `POST /api/submissions` — Submit code for a problem (auth required)
  - `GET /api/submissions` — Get user’s submissions (auth required)
- **Leaderboard**
  - `GET /api/leaderboard` — Get users ranked by problems solved (auth required)
- **Code Execution**
  - `POST /api/run` — Run code with input (open)
- **AI Code Review**
  - `POST /api/gemini-review` — Get AI feedback on code (auth required)
- **Protected**
  - `GET /api/protected` — Example protected route (auth required)

### Data Models

- **User**: username, email, password (hashed), isAdmin, timestamps
- **Problem**: title, description, input/output format, constraints, difficulty, examples, testCases, createdAt
- **Submission**: userId, problemId, code, language, verdict, submittedAt

### Utilities

- **executeCode**: Runs code in a sandboxed environment, supports C++, Python, Java. Handles compilation, execution, and cleanup of temp files.
- **runGemini**: Integrates with Google Gemini AI for code review and feedback.

### Middleware

- **verifyToken**: Checks JWT for protected routes
- **verifyAdmin**: Checks if user is admin for admin-only routes

### Docker Support

- **Build image:**
  ```bash
  cd backend
  docker build -t online-judge-backend .
  ```
- **Run container:**
  ```bash
  docker run --env-file .env -p 8000:8000 online-judge-backend
  ```

---

## 🖥️ Frontend Overview

### Main Pages

- `/` — Home
- `/register` — Register
- `/login` — Login
- `/problems` — Problem list
- `/problems/:id` — Problem details, code editor, run/submit
- `/submissions` — User’s submission history
- `/leaderboard` — Leaderboard
- `/admin-dashboard` — Admin panel (problem management, protected)

### Components & Layout

- **Navbar**: Dynamic links based on auth state
- **Footer**: Persistent footer
- **Layout**: Wraps all main pages for consistent UI
- **ProtectedRoute**: Guards admin routes

### Styles

- Modular CSS for each page/component
- Global styles for layout and theming

---

## ⚡ Getting Started

### Prerequisites

- Node.js v16+
- MongoDB
- Google Gemini API key (for AI review)
- (Optional) Docker for backend

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Online-judge
   ```

2. **Backend setup**
   ```bash
   cd backend
   npm install
   ```
   Create `.env` in `backend/`:
   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=8000
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Frontend setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the App

- **Start backend**
  ```bash
  cd backend
  npm run dev
  # Runs on http://localhost:8000
  ```

- **Start frontend**
  ```bash
  cd frontend
  npm run dev
  # Runs on http://localhost:5173
  ```

- **(Optional) Run backend with Docker**
  ```bash
  cd backend
  docker build -t online-judge-backend .
  docker run --env-file .env -p 8000:8000 online-judge-backend
  ```

---

## 🎯 Usage

- Register/login to access problems
- Browse and solve problems
- Submit code and get instant verdicts
- Get AI-powered code review
- Track your progress and climb the leaderboard
- Admins: Manage problems via dashboard

---

## 📝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit and push your changes
4. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 🤝 Support

For issues or questions, open an issue in the repository.