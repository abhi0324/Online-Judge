import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto logout on 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login"; // auto-redirect
    }
    return Promise.reject(error);
  }
);

export default API;
