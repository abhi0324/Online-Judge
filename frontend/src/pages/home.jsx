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
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            <span>⚡ Next-Gen Online Judge • Powered by Gemini AI</span>
          </div>

          <h1 className="hero-title">
            Level Up Your Coding with <span className="highlight">JudgeX</span>
          </h1>

          <p className="hero-subtitle">
            Execute code in sandboxed Docker containers, receive deep AI feedback, and conquer algorithmic challenges in <strong>C++</strong>, <strong>Python</strong>, and <strong>Java</strong>.
          </p>

          <div className="hero-buttons">
            {!token ? (
              <>
                <Link to="/register" className="btn primary">
                  <i className="fas fa-bolt"></i> Start Coding Free
                </Link>
                <Link to="/login" className="btn secondary">
                  <i className="fas fa-sign-in-alt"></i> Sign In
                </Link>
              </>
            ) : (
              <Link to="/problems" className="btn primary large-btn">
                <i className="fas fa-terminal"></i> Explore Problem Set
              </Link>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-code"></i></div>
            <div className="stat-info">
              <span className="stat-number">Multi-Lang</span>
              <span className="stat-label">C++, Python & Java</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon ai"><i className="fas fa-robot"></i></div>
            <div className="stat-info">
              <span className="stat-number">Gemini AI</span>
              <span className="stat-label">Instant Code Review</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon speed"><i className="fas fa-tachometer-alt"></i></div>
            <div className="stat-info">
              <span className="stat-number">&lt; 1s</span>
              <span className="stat-label">Judge Execution</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon rank"><i className="fas fa-trophy"></i></div>
            <div className="stat-info">
              <span className="stat-number">Global</span>
              <span className="stat-label">Live Leaderboard</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <span className="sub-heading">ENGINEERED FOR CODERS</span>
          <h2 className="section-title">Everything You Need to Master Algorithms</h2>
        </div>

        <div className="features-grid">
          {[
            {
              icon: "fas fa-shield-alt",
              title: "Sandboxed Execution",
              desc: "Run untrusted user code safely inside isolated, resource-constrained compiler sandboxes.",
              color: "blue",
            },
            {
              icon: "fas fa-brain",
              title: "AI Code Analysis",
              desc: "Get intelligent feedback on time complexity, edge cases, and code style powered by Google Gemini.",
              color: "indigo",
            },
            {
              icon: "fas fa-trophy",
              title: "Real-time Leaderboard",
              desc: "Climb the global ranks by solving problems across Easy, Medium, and Hard tiers.",
              color: "amber",
            },
            {
              icon: "fas fa-history",
              title: "Submission Timeline",
              desc: "Inspect your historical submissions, execution runtime, and verdict breakdowns anytime.",
              color: "emerald",
            },
            {
              icon: "fas fa-laptop-code",
              title: "Monaco Code Editor",
              desc: "Industry-standard VS Code powered editor with syntax highlighting, shortcuts, and boilerplate templates.",
              color: "cyan",
            },
            {
              icon: "fab fa-google",
              title: "Google One-Tap Auth",
              desc: "Seamless single sign-on experience for quick access from any device or workstation.",
              color: "purple",
            },
          ].map((feature, idx) => (
            <div key={idx} className={`feature-card card-${feature.color}`}>
              <div className="feature-icon-wrap">
                <i className={feature.icon}></i>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Ready to Ace Your Next Coding Interview?</h2>
          <p>
            Join JudgeX today and start solving curated algorithmic problems with real-time feedback.
          </p>
          {!token ? (
            <Link to="/register" className="btn primary cta-btn">
              Create Free Account <i className="fas fa-arrow-right"></i>
            </Link>
          ) : (
            <Link to="/problems" className="btn primary cta-btn">
              Browse Problems <i className="fas fa-arrow-right"></i>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
