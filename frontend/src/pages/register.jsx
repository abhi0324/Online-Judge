import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/form.css';
import { GoogleLogin } from '@react-oauth/google';

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

  const handleGoogleSucess = async (credentailResponse) => {
    try{
      const res = await API.post('/auth/google', {
        token: credentailResponse.credential,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('isAdmin', res.data.user.isAdmin);
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
          <div className="flex items-center my-5">
            <div className="flex-grow border-0 border-t border-solid border-gray-300"></div>
            <span className="mx-3 text-sm text-gray-500 lowercase">or</span>
            <div className="flex-grow border-0 border-t border-solid border-gray-300"></div>
          </div>
          <div className="flex justify-center my-[15px]">
              <GoogleLogin
                onSuccess={handleGoogleSucess}
                onError={handleGoogleError}
                text="signup_with"
                theme="filled_blue"
                shape="pill"
              />
          </div>
        </form>
        {message && <p className="message success">{message}</p>}
      </div>
    </div>
  );
}

export default Register;
