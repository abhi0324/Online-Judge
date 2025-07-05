import React, {useState} from 'react';
import API from '../api';
import '../styles/form.css';

function Register(){
    const [form, setForm] = useState({username: '', email: '', password: ''});
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent browser from refreshing the page when form is submitted.
        try{
            const res = await API.post('/auth/register', form);
            setMessage(res.data.msg);
        }
        catch(err) {
            setMessage(err.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="form-box">
                <input name="username" type="text" placeholder="Username" onChange={handleChange} required />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default Register;