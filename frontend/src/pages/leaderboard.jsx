import React, { useState, useEffect } from 'react';
import API from '../api';
import '../styles/leaderboard.css';

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const currentUsername = localStorage.getItem('username');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get('/leaderboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch leaderboard');
      }
    };

    fetchLeaderboard();
  }, []);

  const getBadge = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
  };

  return (
    <div className="leaderboard-container">
      <h2>🏆 Leaderboard</h2>
      {error && <p className="error">{error}</p>}
      <div className="leaderboard-table">
        <div className="leaderboard-header">
          <span>Rank</span>
          <span>User</span>
          <span>Solved</span>
        </div>
        {users.map((user, index) => (
          <div
            key={user.username + index}
            className={`leaderboard-row ${
              user.username === currentUsername ? 'highlight-user' : ''
            }`}
          >
            <span>#{index + 1} {getBadge(index)}</span>
            <span>{user.username}</span>
            <span>{user.solved}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;
