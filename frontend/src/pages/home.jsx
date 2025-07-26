import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="highlight">JudgeX</span>
          </h1>
          <p className="hero-subtitle">
            Practice coding, get AI-powered reviews, and climb the leaderboard! 🚀  
            A modern platform for coding enthusiasts to <span>code, conquer,</span> and <span>compete</span>.
          </p>

          {!token ? (
            <div className="hero-buttons">
              <Link to="/register" className="btn primary">
                Get Started
              </Link>
              <Link to="/login" className="btn secondary">
                Login
              </Link>
            </div>
          ) : (
            <Link to="/problems" className="btn primary">
              Go to Problems
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Platform Highlights</h2>
        <div className="features-grid">
          {[
            { title: "⚡ Real-time Code Execution", desc: "Run C++, Python, and Java instantly in a sandboxed environment." },
            { title: "🤖 AI Code Review", desc: "Get instant feedback on your code powered by Google Gemini AI." },
            { title: "🏆 Leaderboard", desc: "Track your global rank and compete with other coders." },
            { title: "📜 Submission History", desc: "Review your past submissions and improve over time." },
            { title: "🚀 Competitive Challenges", desc: "Solve coding problems designed to enhance your skills." },
            { title: "📱 Responsive UI", desc: "Enjoy a smooth experience across all devices." }
          ].map((feature, idx) => (
            <div key={idx} className="feature-card animated-card">
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Are You Ready to Test Your Skills?</h2>
        <p>
          Join now, practice coding problems, and climb the leaderboard to prove yourself!
        </p>
        {!token ? (
          <Link to="/register" className="btn primary large">
            Join Now
          </Link>
        ) : (
          <Link to="/problems" className="btn primary large">
            Start Solving
          </Link>
        )}
      </section>
    </div>
  );
}

export default Home;
