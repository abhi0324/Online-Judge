import react , {useState, useEffect} from 'react';
import API from '../api';
import '../styles/mysubmission.css';

function MySubmission() {
    const [submission, setSubmission] = useState([]);
    const [error, setError] = useState('');

    useEffect(()=>{
        const fetchSubmission = async()=> {
            try{
                const token = localStorage.getItem('token');
                const res = await API.get('/submissions', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setSubmission(res.data);
            }
            catch(err){
                setError(err.response?.data?.error || 'Failed to fetch submission');
            }
        };

        fetchSubmission();
    }, []);

    return (
        <div className="submission-container">
          <h2>My Submissions</h2>
          {error && <p className="error">{error}</p>}
          <ul>
            {submission.map((sub) => (
              <li key={sub._id} className="submission-item">
                <div className="submission-header">
                  <strong>{sub.problemId?.title || 'Untitled Problem'}</strong>
                  <span>{sub.language.toUpperCase()} - {sub.verdict}</span>
                </div>
                <pre className="code-block">{sub.code}</pre>
                <hr />
              </li>
            ))}
          </ul>
        </div>
      );
}

export default MySubmission;
