import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import '../styles/problemdetail.css';

function ProblemDetails(){
    const { id } = useParams();
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('cpp');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProblems = async() => {
            try{
                const token = localStorage.getItem('token');
                const res = await API.get(`/problems/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setProblem(res.data);
            }
            catch(err){
                setMessage(err.response?.data?.error || 'Problem not found');
            }
        };

        fetchProblems();
    }, [id]);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await API.post('/submissions', {
                code, 
                language,
                problemId: id,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage(res.data.msg);
        }
        catch(err){
            setMessage(err.response?.data?.error || 'Submission failed');
        }
    };

    if(!problem) return <p>{message || 'Loading....'}</p>;

    return (
        <div className="problem-details">
            <h2>{problem.title}</h2>
            <p>{problem.description}</p>
            <p><strong>Input Format:</strong> {problem.inputFormat}</p>
            <p><strong>Output Format:</strong> {problem.outputFormat}</p>
            <p><strong>Difficulty:</strong> <span className={`diff-tag ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span></p>

            <h3>Submit Your Code</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    rows="12"
                    cols="60"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Write your code here..."
                    required
                ></textarea>
                <br />
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="cpp">C++</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                </select>
                <br />
                <button type="submit">Submit</button>
            </form>
            {message && <p className="feedback">{message}</p>}
        </div>
    );
}

export default ProblemDetails;