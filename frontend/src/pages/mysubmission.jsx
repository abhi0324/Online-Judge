import react , {useState, useEffect} from 'react';
import API from '../api';

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
        <div className='container'>
            <h2>My Submissions</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <ul>
                {submission.map((sub) => (
                    <li key={sub._id}>
                        <strong>{sub.problemId?.title || 'Untitled Problem'}</strong> - {sub.language.toUpperCase()} - {sub.verdict} 
                        <br/>
                        <pre>{sub.code}</pre>
                        <hr/>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MySubmission;
