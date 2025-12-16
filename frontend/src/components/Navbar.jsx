import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, Car, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition">
                                <Car className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                                ParkEase
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-slate-600 hover:text-primary font-medium transition">Home</Link>
                        <Link to="/parking-lots" className="text-slate-600 hover:text-primary font-medium transition">Find Parking</Link>

                        {isAuthenticated ? (
                            <>
                                {user?.role === 'driver' && (
                                    <Link to="/user-dashboard" className="text-slate-600 hover:text-primary font-medium transition">Dashboard</Link>
                                )}
                                {(user?.role === 'owner' || user?.role === 'admin') && (
                                    <Link to="/admin-dashboard" className="text-slate-600 hover:text-primary font-medium transition">Admin Dashboard</Link>
                                )}
                                <div className="flex items-center space-x-4 ml-4">
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-slate-400">Welcome back,</span>
                                        <span className="text-sm font-bold text-slate-700">{user.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition shadow-sm"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-slate-600 hover:text-primary font-medium transition">Login</Link>
                                <Link to="/register" className="btn-primary flex items-center gap-2">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-700 hover:text-primary transition focus:outline-none">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass border-t border-white/20">
                    <div className="px-4 pt-2 pb-6 space-y-2 sm:px-3">
                        <Link to="/" className="block px-3 py-3 rounded-lg text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-primary">Home</Link>
                        <Link to="/parking-lots" className="block px-3 py-3 rounded-lg text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-primary">Find Parking</Link>
                        {isAuthenticated ? (
                            <>
                                {user?.role === 'driver' && (
                                    <Link to="/user-dashboard" className="block px-3 py-3 rounded-lg text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-primary">Dashboard</Link>
                                )}
                                {(user?.role === 'owner' || user?.role === 'admin') && (
                                    <Link to="/admin-dashboard" className="block px-3 py-3 rounded-lg text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-primary">Admin Dashboard</Link>
                                )}
                                <div className="border-t border-gray-100 my-2 pt-2">
                                    <div className="px-3 py-2 text-sm text-slate-500">Logged in as {user.name}</div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-3 rounded-lg text-base font-medium text-red-500 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <LogOut size={18} /> Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 mt-4 px-2">
                                <Link to="/login" className="flex justify-center py-3 rounded-lg text-slate-700 font-medium bg-slate-100 hover:bg-slate-200">Login</Link>
                                <Link to="/register" className="flex justify-center py-3 rounded-lg text-white font-medium bg-primary hover:bg-blue-600">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
