import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import '../styles/problemlist.css';

function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [difficulty, setDifficulty] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await API.get('/problems', { headers });
        setProblems(res.data);
        setFilteredProblems(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch problems');
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const handleDifficultyFilter = (diff) => {
    setDifficulty(diff);
    applyFilters(searchTerm, diff, statusFilter);
  };

  const handleStatusFilter = (st) => {
    setStatusFilter(st);
    applyFilters(searchTerm, difficulty, st);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(value, difficulty, statusFilter);
  };

  const applyFilters = (search, diff, st) => {
    let filtered = problems;
    if (diff !== 'All') {
      filtered = filtered.filter((p) => p.difficulty?.toLowerCase() === diff.toLowerCase());
    }
    if (st !== 'All') {
      filtered = filtered.filter((p) => (p.status || 'unsolved').toLowerCase() === st.toLowerCase());
    }
    if (search.trim()) {
      filtered = filtered.filter((p) => 
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredProblems(filtered);
  };

  // Count by difficulty
  const counts = {
    All: problems.length,
    Easy: problems.filter((p) => p.difficulty?.toLowerCase() === 'easy').length,
    Medium: problems.filter((p) => p.difficulty?.toLowerCase() === 'medium').length,
    Hard: problems.filter((p) => p.difficulty?.toLowerCase() === 'hard').length,
  };

  // Solved Stats
  const solvedCount = problems.filter((p) => p.status === 'solved').length;

  return (
    <div className="problem-list-wrapper">
      <div className="problem-list-container">
        {/* Header Title & Progress Stats */}
        <div className="pl-header">
          <div>
            <h1 className="pl-title">Problem Repository</h1>
            <p className="pl-subtitle">Master algorithms, data structures, and prepare for technical interviews.</p>
          </div>

          {token && problems.length > 0 && (
            <div className="pl-progress-card">
              <div className="progress-info">
                <span className="progress-label">Your Progress</span>
                <span className="progress-val">{solvedCount} / {problems.length} Solved</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${(solvedCount / problems.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {error && <div className="error-alert"><i className="fas fa-exclamation-circle"></i> {error}</div>}

        {/* Toolbar: Search + Filter Chips */}
        <div className="toolbar">
          <div className="search-bar-wrap">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search problems by title..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search-btn"
                onClick={() => {
                  setSearchTerm('');
                  applyFilters('', difficulty, statusFilter);
                }}
                aria-label="Clear search"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>

          <div className="filter-group-wrap">
            <div className="filter-chips">
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  className={`filter-chip ${difficulty === diff ? 'active' : ''} chip-${diff.toLowerCase()}`}
                  onClick={() => handleDifficultyFilter(diff)}
                >
                  <span>{diff}</span>
                  <span className="chip-count">{counts[diff] || 0}</span>
                </button>
              ))}
            </div>

            {token && (
              <div className="status-chips">
                {[
                  { key: 'All', label: 'All Status' },
                  { key: 'solved', label: '✓ Solved' },
                  { key: 'attempted', label: '⚡ Attempted' },
                  { key: 'unsolved', label: '○ Unsolved' }
                ].map((st) => (
                  <button
                    key={st.key}
                    className={`status-chip ${statusFilter === st.key ? 'active' : ''}`}
                    onClick={() => handleStatusFilter(st.key)}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Problem List Display */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading problems...</p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><i className="fas fa-folder-open"></i></div>
            <h3>No problems found</h3>
            <p>Try clearing your search query or adjusting your filters.</p>
            <button 
              className="reset-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setDifficulty('All');
                setStatusFilter('All');
                setFilteredProblems(problems);
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="problems-grid">
            {filteredProblems.map((prob, idx) => {
              const status = prob.status || 'unsolved';
              return (
                <div key={prob._id} className="problem-card">
                  <div className="problem-card-main">
                    <div className="problem-header-row">
                      <div className="left-header-items">
                        <span className="problem-index">#{idx + 1}</span>
                        {token && (
                          <span className={`status-pill status-${status}`}>
                            {status === 'solved' && <><i className="fas fa-check-circle"></i> Solved</>}
                            {status === 'attempted' && <><i className="fas fa-bolt"></i> Attempted</>}
                            {status === 'unsolved' && <><i className="far fa-circle"></i> Todo</>}
                          </span>
                        )}
                      </div>

                      <span className={`badge badge-${prob.difficulty.toLowerCase()}`}>
                        {prob.difficulty}
                      </span>
                    </div>

                    <h3 className="problem-title">{prob.title}</h3>
                    <div className="problem-tags">
                      <span className="tag"><i className="fas fa-code-branch"></i> Algorithm</span>
                      <span className="tag"><i className="fas fa-cube"></i> Data Structures</span>
                    </div>
                  </div>

                  <div className="problem-card-footer">
                    <Link to={`/problems/${prob._id}`} className="view-btn">
                      <span>{status === 'solved' ? 'Practice Again' : 'Solve Challenge'}</span>
                      <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemList;
