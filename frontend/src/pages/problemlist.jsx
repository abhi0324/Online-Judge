import React, { useEffect, useState } from 'react';
import API from '../api';
import '../styles/problemlist.css';

function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [difficulty, setDifficulty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get('/problems', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProblems(res.data);
        setFilteredProblems(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch problems');
      }
    };
    fetchProblems();
  }, []);

  const handleFilter = (e) => {
    const value = e.target.value;
    setDifficulty(value);
    filterProblems(searchTerm, value);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterProblems(value, difficulty);
  };

  const filterProblems = (search, diff) => {
    let filtered = problems;
    if (diff !== 'All') filtered = filtered.filter((p) => p.difficulty === diff);
    if (search) filtered = filtered.filter((p) => p.title.toLowerCase().includes(search));
    setFilteredProblems(filtered);
  };

  return (
    <div className="problem-list-container">
      <h2 className="pl-title">Available Problems</h2>
      {error && <p className="error">{error}</p>}

      {/* Search & Filter */}
      <div className="toolbar">
        <input
          type="text"
          placeholder="Search problems..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <select value={difficulty} onChange={handleFilter} className="filter-select">
          <option value="All">All</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Problems */}
      <ul className="problem-list">
        {filteredProblems.map((prob) => (
          <li key={prob._id} className="problem-card">
            <div className="problem-card-row">
              <div className="problem-info">
                <h3 className="problem-title">{prob.title}</h3>
                <span className={`badge ${prob.difficulty.toLowerCase()}`}>{prob.difficulty}</span>
              </div>
              <a href={`/problems/${prob._id}`} className="view-btn">View</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProblemList;
