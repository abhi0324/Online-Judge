# Online Judge Platform

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

**Frontend**
- React 19, Vite
- React Router
- Axios
- Monaco Editor

---

## 📁 Project Structure

```
Online-judge/
├── backend/
│   ├── models/         # Mongoose schemas (User, Problem, Submission)
│   ├── routes/         # API endpoints (auth, problems, submissions, leaderboard, AI review)
│   ├── middlewares/    # Auth and admin checks
│   ├── utils/          # Code execution, AI integration
│   ├── index.js        # Server entry
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/      # Main pages (Home, Problems, Admin, etc.)
│   │   ├── components/ # Navbar, reusable UI
│   │   ├── styles/     # CSS modules
│   │   └── api.js      # Axios config
│   ├── index.html
│   └── package.json
└── compiler/           # (Reserved for future use)
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

### Data Models

- **User**: username, email, password (hashed), isAdmin, timestamps
- **Problem**: title, description, input/output format, constraints, difficulty, examples, testCases, createdAt
- **Submission**: userId, problemId, code, language, verdict, submittedAt

### Utilities

- **executeCode**: Runs code in a sandboxed environment, supports C++, Python, Java.
- **runGemini**: Integrates with Google Gemini AI for code review.

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

### Components

- **Navbar**: Dynamic links based on auth state
- **ProtectedRoute**: Guards admin routes

### Admin Dashboard

- Add/edit/delete problems, including test cases and examples
- Only accessible to users with `isAdmin: true`

### Styles

- Modular CSS for each page/component
- Global styles for layout and theming

---

## ⚡ Getting Started

### Prerequisites

- Node.js v16+
- MongoDB
- Google Gemini API key (for AI review)

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