import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css'; 

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  const handleHamburgerClick = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="nav-logo">JudgeX</Link>
        </div>

        {/* Hamburger Menu */}
        <div
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={handleHamburgerClick}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Links */}
        <div className={`navbar-right ${menuOpen ? 'open' : ''}`}>
          {token && (
            <>
              {isAdmin && <Link to="/admin-dashboard" className="nav-link">Admin</Link>}
              <Link to="/problems" className="nav-link">Problems</Link>
              <Link to="/submissions" className="nav-link">Submissions</Link>
              <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
            </>
          )}
          {!token ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link register-btn">Register</Link>
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
