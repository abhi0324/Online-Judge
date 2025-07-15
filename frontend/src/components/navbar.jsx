import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css'; 

function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="nav-logo">JudgeX</Link>
        </div>
        <div className="navbar-right">
          {token && (
            <>
              <Link to="/problems" className="nav-link">Problems</Link>
              <Link to="/submissions" className="nav-link">Submissions</Link>
              <Link to="/leaderboard" className="nav-link">Leaderboard</Link>

            </>
          )}
          {!token ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
