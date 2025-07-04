import React, {useState} from 'react';
import API from '../api';

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
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input name="username" placeholder='Username' onChange={handleChange} required /> <br />
                <input name="email" placeholder="Email" onChange={handleChange} required /><br />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br />
                <button type="submit">Register</button>
            </form>
            <p>{message}</p> 
        </div>
    )
}

export default Register;