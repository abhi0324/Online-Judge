import React, { useEffect, useState } from 'react';
import API from '../api';

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
        <div>
            <h2>Problems</h2>
            {error && <p>{error}</p>}
            <ul>
                {problem.map((prob) => (
                    <li key={prob._id}>
                        {prob.title} - <strong>{prob.difficulty}</strong>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ProblemList;