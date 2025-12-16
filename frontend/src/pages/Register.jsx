import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fadeIn } from '../animations/gsapAnimations';
import { User, Mail, Lock, Key, ChevronRight } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('driver');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const containerRef = useRef(null);

    useEffect(() => {
        fadeIn(containerRef.current);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, role);
            if (role === 'owner' || role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-hero-pattern bg-cover bg-center bg-fixed pt-16">
            <div className="absolute inset-0 bg-dark/60 backdrop-blur-sm"></div>

            <div ref={containerRef} className="relative z-10 w-full max-w-md p-8">
                <div className="glass-dark rounded-2xl p-8 bg-dark/80 border border-white/10 shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Join ParkEase</h2>
                        <p className="text-slate-400 mt-2">Start your smart parking journey today</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition" />
                            </div>
                            <input
                                type="text"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition" />
                            </div>
                            <input
                                type="email"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition" />
                            </div>
                            <input
                                type="password"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Key className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition" />
                            </div>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition appearance-none"
                            >
                                <option value="driver">Driver (I want to park)</option>
                                <option value="owner">Owner (I have parking spots)</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
                                <ChevronRight className="h-4 w-4 rotate-90" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-glow transition-all transform hover:-translate-y-0.5 mt-2"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-700 text-center">
                        <p className="text-sm text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-accent hover:text-cyan-400 transition inline-flex items-center">
                                Sign in <ChevronRight size={14} className="ml-1" />
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
