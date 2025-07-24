import React, { useEffect, useState } from 'react';
import API from '../api';
import '../styles/problemlist.css';

function ProblemList() {
    const [problems, setProblems] = useState([]);
    const [filteredProblems, setFilteredProblems] = useState([]);
    const [difficulty, setDifficulty] = useState('All');
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
        if (value === 'All') {
            setFilteredProblems(problems);
        } else {
            setFilteredProblems(problems.filter((p) => p.difficulty === value));
        }
    };

    return (
        <div className="problem-list-container">
            <h2>Available Problems</h2>
            {error && <p className="error">{error}</p>}

            {/* Difficulty Filter */}
            <div className="filter-container">
                <label htmlFor="difficulty-filter">Filter by Difficulty:</label>
                <select
                    id="difficulty-filter"
                    value={difficulty}
                    onChange={handleFilter}
                >
                    <option value="All">All</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>

            {/* Problems List */}
            <ul className="problem-list">
                {filteredProblems.map((prob) => (
                    <li key={prob._id} className="problem-card">
                        <div className="problem-card-row">
                            <h3 className="problem-title">{prob.title}</h3>
                            <span className={`badge ${prob.difficulty.toLowerCase()}`}>{prob.difficulty}</span>
                        </div>
                        <a href={`/problems/${prob._id}`} className="view-btn">View</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProblemList;
