import React, { useState, useEffect } from 'react';
import API from '../api';
import '../styles/mysubmission.css';

function MySubmission() {
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState([]);
  const [openIndex, setOpenIndex] = useState(null); // track which submission's code is open

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get('/submissions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSubmissions(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch submissions');
      }
    };
    fetchSubmissions();
  }, []);

  const toggleCode = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="submission-container">
      <h2 className="submission-title">My Submissions</h2>
      {error && <p className="error">{error}</p>}

      {submissions.length === 0 && !error ? (
        <p className="no-submissions">No submissions yet. Start solving problems! 🚀</p>
      ) : (
        <div className="submission-list">
          {submissions.map((sub, index) => (
            <div key={sub._id} className="submission-card">
              <div className="submission-header">
                <h3 className="problem-title">{sub.problemId?.title || 'Untitled Problem'}</h3>
                <span className={`verdict ${sub.verdict.toLowerCase()}`}>
                  {sub.language.toUpperCase()} - {sub.verdict}
                </span>
              </div>
              <button
                className="toggle-btn"
                onClick={() => toggleCode(index)}
              >
                {openIndex === index ? 'Hide Code' : 'View Code'}
              </button>
              {openIndex === index && (
                <pre className="code-block">
                  <code>{sub.code}</code>
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MySubmission;
