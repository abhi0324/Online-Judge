import React, { useState, useEffect } from 'react';
import API from '../api';
import '../styles/leaderboard.css';

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  let currentUsername = '';
  try {
    const rawUser = localStorage.getItem('user');
    if (rawUser) {
      currentUsername = JSON.parse(rawUser)?.username || '';
    }
  } catch (e) {
    currentUsername = '';
  }

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await API.get('/leaderboard', { headers });
        setUsers(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const top1 = users[0];
  const top2 = users[1];
  const top3 = users[2];

  return (
    <div className="leaderboard-wrapper">
      <div className="leaderboard-container">
        {/* Header */}
        <div className="leaderboard-header-section">
          <span className="trophy-badge">🏆 HALL OF FAME</span>
          <h1 className="leaderboard-title">Global Leaderboard</h1>
          <p className="leaderboard-subtitle">Top algorithmic problem solvers ranked by verified submissions.</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        {loading ? (
          <div className="leaderboard-loading">
            <div className="spinner"></div>
            <p>Fetching rankings...</p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium (rendered if at least 1 user exists) */}
            {users.length > 0 && (
              <div className="podium-container">
                {/* 2nd Place (Silver) */}
                {top2 && (
                  <div className="podium-card podium-2">
                    <div className="podium-crown silver"><i className="fas fa-medal"></i> 2nd</div>
                    <div className="podium-avatar silver">
                      {top2.avatar ? (
                        <img src={top2.avatar} alt={top2.username} />
                      ) : (
                        <span>{(top2.username[0] || '2').toUpperCase()}</span>
                      )}
                    </div>
                    <h3 className="podium-username">{top2.username}</h3>
                    <div className="podium-score">
                      <span className="score-num">{top2.solved}</span>
                      <span className="score-label">Solved</span>
                    </div>
                    <div className="podium-pillar pillar-2"></div>
                  </div>
                )}

                {/* 1st Place (Gold - Center) */}
                {top1 && (
                  <div className="podium-card podium-1">
                    <div className="podium-crown gold"><i className="fas fa-crown"></i> 1st</div>
                    <div className="podium-avatar gold">
                      {top1.avatar ? (
                        <img src={top1.avatar} alt={top1.username} />
                      ) : (
                        <span>{(top1.username[0] || '1').toUpperCase()}</span>
                      )}
                    </div>
                    <h3 className="podium-username">{top1.username}</h3>
                    <div className="podium-score gold-score">
                      <span className="score-num">{top1.solved}</span>
                      <span className="score-label">Solved</span>
                    </div>
                    <div className="podium-pillar pillar-1"></div>
                  </div>
                )}

                {/* 3rd Place (Bronze) */}
                {top3 && (
                  <div className="podium-card podium-3">
                    <div className="podium-crown bronze"><i className="fas fa-medal"></i> 3rd</div>
                    <div className="podium-avatar bronze">
                      {top3.avatar ? (
                        <img src={top3.avatar} alt={top3.username} />
                      ) : (
                        <span>{(top3.username[0] || '3').toUpperCase()}</span>
                      )}
                    </div>
                    <h3 className="podium-username">{top3.username}</h3>
                    <div className="podium-score">
                      <span className="score-num">{top3.solved}</span>
                      <span className="score-label">Solved</span>
                    </div>
                    <div className="podium-pillar pillar-3"></div>
                  </div>
                )}
              </div>
            )}

            {/* Leaderboard Table List */}
            <div className="table-card">
              <div className="table-header-row">
                <span className="col-rank">Rank</span>
                <span className="col-user">Coder</span>
                <span className="col-solved">Problems Solved</span>
              </div>

              <div className="table-body">
                {users.map((user, index) => {
                  const isCurrent = user.username === currentUsername;
                  let rankClass = '';
                  if (index === 0) rankClass = 'rank-gold';
                  else if (index === 1) rankClass = 'rank-silver';
                  else if (index === 2) rankClass = 'rank-bronze';

                  return (
                    <div
                      key={user.username + index}
                      className={`table-row ${isCurrent ? 'highlight-current' : ''} ${rankClass}`}
                    >
                      <span className="col-rank">
                        <span className="rank-badge">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && `#${index + 1}`}
                        </span>
                      </span>

                      <span className="col-user">
                        <div className="user-cell">
                          <div className="table-avatar">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.username} />
                            ) : (
                              <span>{(user.username[0] || 'U').toUpperCase()}</span>
                            )}
                          </div>
                          <span className="username-text">{user.username}</span>
                          {isCurrent && <span className="you-badge">You</span>}
                        </div>
                      </span>

                      <span className="col-solved">
                        <span className="solved-count-badge">
                          <i className="fas fa-check"></i> {user.solved}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
