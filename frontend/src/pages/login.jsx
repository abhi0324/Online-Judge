import React, {useState} from 'react';
import API from '../api';
import {useNavigate} from 'react-router-dom';


function Login() {
    const [form, setForm] = useState({email: '', password: ''});
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e)  => {
        e.preventDefault();

        try {
            const res = await API.post('/auth/login', form);

            // save token to local storage
            localStorage.setItem('token', res.data.token);

            setMessage(res.data.msg);
            navigate('/problems');

        }
        catch (err){
            setMessage(err.response?.data?.error || 'Something went wrong');
        }
    }
    return (
        <div className='container'>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input name='email' placeholder='Email' onChange={handleChange} required /> <br/>
                <input name='password' type='password' placeholder='Password' onChange={handleChange} required /> <br/>
                <button type='submit'>Login</button>
            </form>
            <p>{message}</p>
        </div>
    );
};



export default Login;