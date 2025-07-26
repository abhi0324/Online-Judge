import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/form.css';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', form);
      setMessage(res.data.msg || 'Registered successfully!');
      setTimeout(() => navigate('/login'), 1500); // Redirect after 1.5 seconds
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Create Account</h2>
        <p className="form-subtitle">Register to get started</p>
        <form onSubmit={handleSubmit} className="form-box">
          <input
            name="username"
            type="text"
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>
        {message && <p className="message success">{message}</p>}
      </div>
    </div>
  );
}

export default Register;
