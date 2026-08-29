import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api';
import './navbar.css';

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=Felix',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Midnight',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Cyber',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Shadow',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Sam',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Coder',
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState('');
  const dropdownRef = useRef(null);
  
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const navigate = useNavigate();
  const location = useLocation();

  let user = null;
  try {
    const rawUser = localStorage.getItem('user');
    if (rawUser) user = JSON.parse(rawUser);
  } catch (e) {
    user = null;
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on page navigation
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSaveAvatar = async () => {
    const avatarToSave = customAvatarUrl.trim() || selectedAvatar;
    if (!avatarToSave) {
      setAvatarMsg('Please select an avatar or enter an image URL');
      return;
    }

    try {
      setUpdatingAvatar(true);
      setAvatarMsg('');
      const res = await API.put(
        '/auth/avatar',
        { avatar: avatarToSave },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const updatedUser = { ...user, avatar: res.data.user.avatar };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setAvatarModalOpen(false);
      setCustomAvatarUrl('');
      setSelectedAvatar('');
    } catch (err) {
      setAvatarMsg(err.response?.data?.error || 'Failed to update avatar');
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const username = user?.username || 'Coder';
  const avatarUrl = user?.avatar;
  const initial = (username[0] || 'C').toUpperCase();

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Brand Logo */}
          <div className="navbar-left">
            <Link to="/" className="nav-logo">
              <span className="logo-icon"><i className="fas fa-terminal"></i></span>
              <span className="logo-text">Judge<span className="logo-accent">X</span></span>
            </Link>
          </div>

          {/* Hamburger Menu for Mobile */}
          <div
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Navigation Links */}
          <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/problems" 
              className={`nav-link ${location.pathname.startsWith('/problems') ? 'active' : ''}`}
            >
              Problems
            </Link>
            <Link 
              to="/leaderboard" 
              className={`nav-link ${location.pathname === '/leaderboard' ? 'active' : ''}`}
            >
              Leaderboard
            </Link>
            
            {token && (
              <Link 
                to="/submissions" 
                className={`nav-link ${location.pathname === '/submissions' ? 'active' : ''}`}
              >
                Submissions
              </Link>
            )}

            {token && isAdmin && (
              <Link 
                to="/admin-dashboard" 
                className={`nav-link admin-nav-link ${location.pathname === '/admin-dashboard' ? 'active' : ''}`}
              >
                <i className="fas fa-shield-alt"></i> Admin
              </Link>
            )}

            {/* Auth section for mobile inside menu */}
            <div className="mobile-auth-section">
              {!token ? (
                <>
                  <Link to="/login" className="nav-link">Login</Link>
                  <Link to="/register" className="register-btn">Register</Link>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => { setMenuOpen(false); setAvatarModalOpen(true); }}
                    className="mobile-avatar-btn"
                  >
                    <i className="fas fa-user-circle"></i> Change Avatar
                  </button>
                  <button onClick={handleLogout} className="mobile-logout-btn">
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Desktop Auth / Profile Dropdown */}
          <div className="navbar-right">
            {!token ? (
              <div className="auth-buttons">
                <Link to="/login" className="login-link">Login</Link>
                <Link to="/register" className="register-btn">Get Started</Link>
              </div>
            ) : (
              <div className="profile-container" ref={dropdownRef}>
                <button 
                  className="profile-btn" 
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-label="User Profile Menu"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={username} className="user-avatar-img" />
                  ) : (
                    <div className="user-avatar-placeholder">
                      {initial}
                    </div>
                  )}
                  <span className="profile-username">{username}</span>
                  <i className={`fas fa-chevron-down dropdown-arrow ${dropdownOpen ? 'rotate' : ''}`}></i>
                </button>

                {dropdownOpen && (
                  <div className="profile-dropdown">
                    <div className="dropdown-user-header">
                      <div className="dropdown-avatar-wrap">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt={username} className="dropdown-avatar-img" />
                        ) : (
                          <div className="user-avatar-placeholder large">{initial}</div>
                        )}
                      </div>
                      <div className="dropdown-user-info">
                        <p className="dropdown-name">{username}</p>
                        <p className="dropdown-email">{user?.email || 'Authenticated User'}</p>
                        {isAdmin && <span className="admin-badge">Admin</span>}
                      </div>
                    </div>

                    <div className="dropdown-divider"></div>

                    <button 
                      onClick={() => { setDropdownOpen(false); setAvatarModalOpen(true); }}
                      className="dropdown-item"
                    >
                      <i className="fas fa-user-circle"></i> Change Avatar
                    </button>
                    <Link to="/submissions" className="dropdown-item">
                      <i className="fas fa-code"></i> My Submissions
                    </Link>
                    <Link to="/leaderboard" className="dropdown-item">
                      <i className="fas fa-trophy"></i> Leaderboard
                    </Link>
                    {isAdmin && (
                      <Link to="/admin-dashboard" className="dropdown-item">
                        <i className="fas fa-cogs"></i> Admin Dashboard
                      </Link>
                    )}

                    <div className="dropdown-divider"></div>

                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Avatar Selection Modal */}
      {avatarModalOpen && (
        <div className="modal-overlay" onClick={() => setAvatarModalOpen(false)}>
          <div className="avatar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-user-astronaut"></i> Choose Your Avatar</h3>
              <button 
                className="close-modal-btn" 
                onClick={() => setAvatarModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-subtitle">Pick from our developer presets or paste an image URL:</p>
              
              <div className="preset-grid">
                {PRESET_AVATARS.map((url, idx) => (
                  <div 
                    key={idx}
                    className={`avatar-option ${selectedAvatar === url ? 'selected' : ''}`}
                    onClick={() => { setSelectedAvatar(url); setCustomAvatarUrl(''); }}
                  >
                    <img src={url} alt={`Preset ${idx + 1}`} />
                  </div>
                ))}
              </div>

              <div className="custom-avatar-section">
                <label>Or enter custom Image URL:</label>
                <input
                  type="url"
                  placeholder="https://example.com/my-avatar.png"
                  value={customAvatarUrl}
                  onChange={(e) => { setCustomAvatarUrl(e.target.value); setSelectedAvatar(''); }}
                  className="avatar-input"
                />
              </div>

              {avatarMsg && <p className="avatar-error-msg">{avatarMsg}</p>}
            </div>

            <div className="modal-footer">
              <button 
                className="modal-cancel-btn" 
                onClick={() => setAvatarModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-save-btn" 
                onClick={handleSaveAvatar}
                disabled={updatingAvatar}
              >
                {updatingAvatar ? 'Saving...' : 'Save Avatar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
