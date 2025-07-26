import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/register.jsx";
import Login from "./pages/login.jsx";
import ProblemList from "./pages/problemlist.jsx";
import ProblemDetails from "./pages/problemdetail.jsx";
import MySubmission from "./pages/mysubmission.jsx";
import Home from "./pages/home.jsx";
import Leaderboard from "./pages/leaderboard.jsx";
import AdminDashboard from "./pages/admindashboard.jsx";
import ProtectedRoute from "./pages/protectedroute.jsx";
import Layout from "./layouts/Layout.jsx"; // New Layout
import "./styles/global.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Wrap all main pages under Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="problems" element={<ProblemList />} />
          <Route path="problems/:id" element={<ProblemDetails />} />
          <Route path="submissions" element={<MySubmission />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route
            path="admin-dashboard"
            element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
