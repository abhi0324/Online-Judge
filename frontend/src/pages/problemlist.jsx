import React, { useEffect, useState } from 'react';
import API from '../api';
import '../styles/problemlist.css';

function ProblemList() {
    const [problem, setProblem] = useState([]);
    const [error, setError] = useState('');

    useEffect(()=> {
        const fetchProblems = async () => {
            try{
                const token = localStorage.getItem('token');
                const res = await API.get('/problems', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProblem(res.data);
            }
            catch(err){
                setError(err.response?.data?.error || 'Failed to fetch problems');
            }
        }

        fetchProblems();
    }, []);

    return (
        <div className="problem-list-container">
          <h2>Available Problems</h2>
          {error && <p className="error">{error}</p>}
          <ul className="problem-list">
            {problem.map((prob) => (
              <li key={prob._id} className="problem-card">
                <h3>{prob.title}</h3>
                <p><strong>Difficulty:</strong> {prob.difficulty}</p>
                <a href={`/problems/${prob._id}`} className="view-btn">View</a>
              </li>
            ))}
          </ul>
        </div>
      );
}

export default ProblemList;