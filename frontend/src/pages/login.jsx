import React, { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/form.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('isAdmin', res.data.user.isAdmin);
      setMessage(res.data.msg);
      navigate(res.data.user.isAdmin ? '/admin-dashboard' : '/problems');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Welcome Back</h2>
        <p className="form-subtitle">Login to your account</p>
        <form onSubmit={handleSubmit} className="form-box">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        {message && <p className="message">{message}</p>}
        <p className="switch-text">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
