import { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Validate token or just decode user details if we had a decoding library.
            // For now, let's fetch 'me' to be safe and get fresh user data.
            API.get('/auth/me')
                .then(res => {
                    setUser(res.data.data);
                })
                .catch(() => {
                    logout();
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        const res = await API.post('/auth/login', { email, password });
        const { token: newToken } = res.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        // User will be fetched by effect or we can set it here if response has it
        // The backend login response only returns token usually, so effect handles it.
    };

    const register = async (name, email, password, role) => {
        const res = await API.post('/auth/register', { name, email, password, role });
        const { token: newToken } = res.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
