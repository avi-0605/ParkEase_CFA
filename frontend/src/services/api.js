import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001/api', // Ensure this matches backend port
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
