import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left: Logo */}
        <div className="footer-left">
          <h2 className="footer-logo">JudgeX</h2>
        </div>

        {/* Center: Navigation Links */}
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/problems">Problems</Link>
          <Link to="/leaderboard">Leaderboard</Link>
        </div>

        {/* Right: Social Icons */}
        <div className="footer-right">
          <a href="https://github.com/abhi0324" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://www.linkedin.com/in/abhiswant-chaudhary-a09253277" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="https://x.com/abhiswant" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-x-twitter"></i>
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} JudgeX. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
