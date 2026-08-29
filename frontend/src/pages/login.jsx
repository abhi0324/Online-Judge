import React, { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/form.css';
import { GoogleLogin } from '@react-oauth/google';

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
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMessage(res.data.msg);
      navigate(res.data.user.isAdmin ? '/admin-dashboard' : '/problems');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleGoogleSucess = async (credentailResponse) => {
    try{
      const res = await API.post('/auth/google', {
        token: credentailResponse.credential,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('isAdmin', res.data.user.isAdmin);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMessage('Login Succesful!');
      navigate(res.data.user.isAdmin ? '/admin-dashboard' : '/problems');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Google login failed');
    }
  }
  const handleGoogleError = () => {
    setMessage('Google sign-in was unsucessful');
  }

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
          <div className="flex items-center my-5">
            <div className="flex-grow border-0 border-t border-solid border-gray-300"></div>
            <span className="mx-3 text-sm text-gray-500 lowercase">or</span>
            <div className="flex-grow border-0 border-t border-solid border-gray-300"></div>
          </div>
          <div className="flex justify-center my-[15px]">
              <GoogleLogin
                onSuccess={handleGoogleSucess}
                onError={handleGoogleError}
                theme="filled_blue"
                shape="pill"
              />
          </div>
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
