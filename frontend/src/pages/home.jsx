import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

function Home() {
  const token = localStorage.getItem('token');

  return (
    <div className="home-container">
      <h1>Welcome to AbhiOJ</h1>
      <p>Your own Online Judge Platform 🧑‍💻</p>
      {!token ? (
        <div className="home-buttons">
          <Link to="/register" className="home-btn">Get Started</Link>
          <Link to="/login" className="home-btn secondary">Login</Link>
        </div>
      ) : (
        <Link to="/problems" className="home-btn">Go to Problems</Link>
      )}
    </div>
  );
}

export default Home;
