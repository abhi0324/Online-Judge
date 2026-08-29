import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import '../styles/mysubmission.css';

function MySubmission() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await API.get('/submissions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSubmissions(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch submissions');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const toggleCode = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getVerdictClass = (verdict = '') => {
    const v = verdict.toLowerCase();
    if (v.includes('accepted')) return 'verdict-accepted';
    if (v.includes('wrong') || v.includes('wa')) return 'verdict-wrong';
    if (v.includes('time') || v.includes('tle')) return 'verdict-tle';
    return 'verdict-default';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="submission-wrapper">
      <div className="submission-container">
        <div className="submission-header-section">
          <h1 className="submission-title">My Submissions</h1>
          <p className="submission-subtitle">Review your past code submissions, verdicts, and implementation history.</p>
        </div>

        {error && <div className="error-alert"><i className="fas fa-exclamation-circle"></i> {error}</div>}

        {loading ? (
          <div className="submission-loading">
            <div className="spinner"></div>
            <p>Loading your submission history...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="empty-submissions">
            <div className="empty-icon"><i className="fas fa-code"></i></div>
            <h3>No Submissions Found</h3>
            <p>You haven't submitted any solutions yet. Dive into the problem repository and test your skills!</p>
            <Link to="/problems" className="explore-btn">
              <i className="fas fa-terminal"></i> Solve Problems
            </Link>
          </div>
        ) : (
          <div className="submission-list">
            {submissions.map((sub, index) => {
              const verdictClass = getVerdictClass(sub.verdict);
              const isOpen = openIndex === index;
              return (
                <div key={sub._id || index} className="submission-card">
                  <div className="sub-card-top">
                    <div className="sub-title-group">
                      <h3 className="problem-name">{sub.problemId?.title || 'Algorithmic Problem'}</h3>
                      <div className="sub-badges">
                        <span className="lang-badge">
                          <i className="fas fa-code"></i> {sub.language?.toUpperCase() || 'C++'}
                        </span>
                        <span className={`verdict-pill ${verdictClass}`}>
                          {sub.verdict || 'Evaluated'}
                        </span>
                        <span className="date-badge">
                          <i className="far fa-clock"></i> {formatDate(sub.submittedAt || sub.createdAt)}
                        </span>
                      </div>
                    </div>

                    <button
                      className="toggle-code-btn"
                      onClick={() => toggleCode(index)}
                    >
                      {isOpen ? (
                        <><i className="fas fa-chevron-up"></i> Hide Code</>
                      ) : (
                        <><i className="fas fa-code"></i> View Code</>
                      )}
                    </button>
                  </div>

                  {isOpen && (
                    <div className="code-viewer">
                      <div className="code-header">
                        <span>Submitted Code</span>
                        <button 
                          className="copy-code-btn"
                          onClick={() => navigator.clipboard.writeText(sub.code)}
                        >
                          📋 Copy
                        </button>
                      </div>
                      <pre className="code-block">
                        <code>{sub.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MySubmission;
