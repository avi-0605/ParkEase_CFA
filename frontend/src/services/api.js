import axios from 'axios';

// Choose backend URL based on where the app is running
const isProd =
  typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1';

const API_BASE_URL = isProd
  ? 'https://parkease-cfa-1.onrender.com/api' // Render backend in production
  : 'http://localhost:5001/api'; // Local backend for dev

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
