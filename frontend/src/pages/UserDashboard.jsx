import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Loader, MapPin, Calendar, Clock, Car, History, Navigation, ArrowRight, Save, X, Zap } from 'lucide-react';
import MapModal from '../components/MapModal';
import gsap from 'gsap';

const UserDashboard = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalBookings: 0, activeBookings: 0, upcomingBookings: 0 });
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Vehicle Edit State
    const [isEditingVehicle, setIsEditingVehicle] = useState(false);
    const [vehicleForm, setVehicleForm] = useState({ number: '', type: 'Car', fuelType: 'Petrol' });
    const [vehicleLoading, setVehicleLoading] = useState(false);

    // Map State
    const [selectedMapLot, setSelectedMapLot] = useState(null);

    const containerRef = useRef(null);

    useEffect(() => {
        if (!isAuthenticated) return;
        if (user?.role !== 'driver') {
            navigate('/admin-dashboard');
            return;
        }
        fetchDashboardData();
        if (user?.vehicle) {
            setVehicleForm({
                number: user.vehicle.number || '',
                type: user.vehicle.type || 'Car',
                fuelType: user.vehicle.fuelType || 'Petrol'
            });
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        if (!loading && containerRef.current) {
            gsap.fromTo(containerRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
        }
    }, [loading]);

    const fetchDashboardData = async () => {
        try {
            const res = await API.get('/bookings/my');
            const bookings = res.data.data || [];

            const now = new Date();
            const active = bookings.filter(b => b.status === 'active' && new Date(b.startTime) <= now && new Date(b.endTime) > now).length;
            const upcoming = bookings.filter(b => b.status === 'active' && new Date(b.startTime) > now).length;

            setStats({
                totalBookings: bookings.length,
                activeBookings: active,
                upcomingBookings: upcoming
            });
            setRecentBookings(bookings.slice(0, 5));
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateVehicle = async (e) => {
        e.preventDefault();
        setVehicleLoading(true);
        try {
            await API.put('/auth/updatedetails', {
                vehicle: vehicleForm
            });
            setIsEditingVehicle(false);
            alert('Vehicle updated successfully.');
        } catch (err) {
            alert('Failed to update vehicle');
        } finally {
            setVehicleLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin text-primary" size={48} /></div>;

    return (
        <div className="min-h-screen bg-slate-50 pt-24 px-4 sm:px-6 lg:px-8 pb-12">
            <div ref={containerRef} className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Driver Dashboard</h1>
                        <p className="text-slate-600 mt-1">Welcome back, {user?.name}</p>
                    </div>
                    <div className="hidden md:block">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium border border-blue-100">
                            <Zap size={14} className="mr-1 fill-current" /> Premium Member
                        </span>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                        onClick={() => navigate('/my-bookings?filter=active')}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md transition hover:-translate-y-1"
                    >
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Active Sessions</p>
                            <p className="text-4xl font-bold text-primary">{stats.activeBookings}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl text-primary">
                            <Clock size={28} />
                        </div>
                    </div>
                    <div
                        onClick={() => navigate('/my-bookings?filter=upcoming')}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md transition hover:-translate-y-1"
                    >
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Upcoming Bookings</p>
                            <p className="text-4xl font-bold text-emerald-600">{stats.upcomingBookings}</p>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-xl text-emerald-600">
                            <Calendar size={28} />
                        </div>
                    </div>
                    <div
                        onClick={() => navigate('/my-bookings?filter=all')}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md transition hover:-translate-y-1"
                    >
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Total History</p>
                            <p className="text-4xl font-bold text-slate-800">{stats.totalBookings}</p>
                        </div>
                        <div className="bg-slate-100 p-4 rounded-xl text-slate-600">
                            <History size={28} />
                        </div>
                    </div>
                </div>

                {/* Main Actions Area */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Find Parking CTA - Takes up 3 cols */}
                    <div className="lg:col-span-3 bg-gradient-to-br from-primary to-blue-700 rounded-3xl p-8 text-white relative overflow-hidden group shadow-lg">
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div>
                                <h2 className="text-3xl font-bold mb-4">Find Your Spot</h2>
                                <p className="text-blue-100 text-lg mb-8 max-w-md leading-relaxed">
                                    Locate nearby parking, check real-time availability, and book your slot in seconds.
                                </p>
                            </div>
                            <div>
                                <button
                                    onClick={() => navigate('/parking-lots')}
                                    className="bg-white text-primary px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-blue-50 transition shadow-xl transform hover:scale-105"
                                >
                                    <Navigation size={22} />
                                    Open Map Search
                                </button>
                            </div>
                        </div>
                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition duration-700"></div>
                        <div className="absolute bottom-0 right-0 -mb-16 -mr-4 w-48 h-48 bg-blue-500/20 rounded-full blur-xl"></div>
                    </div>

                    {/* Vehicle Details - Takes up 2 cols */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-xl font-bold text-slate-900">My Vehicle</h2>
                            {!isEditingVehicle && (
                                <button
                                    onClick={() => setIsEditingVehicle(true)}
                                    className="text-sm text-primary font-bold hover:bg-blue-50 px-3 py-1 rounded-lg transition"
                                >
                                    Edit
                                </button>
                            )}
                        </div>

                        {isEditingVehicle ? (
                            <form onSubmit={handleUpdateVehicle} className="space-y-4 flex-grow">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Number Plate</label>
                                    <input
                                        type="text"
                                        placeholder="MH04 AB 1234"
                                        className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                        value={vehicleForm.number}
                                        onChange={e => setVehicleForm({ ...vehicleForm, number: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Type</label>
                                        <select
                                            className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white"
                                            value={vehicleForm.type}
                                            onChange={e => setVehicleForm({ ...vehicleForm, type: e.target.value })}
                                        >
                                            <option value="Car">Car</option>
                                            <option value="Bike">Bike</option>
                                            <option value="EV">EV</option>
                                            <option value="Truck">Truck</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fuel</label>
                                        <select
                                            className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white"
                                            value={vehicleForm.fuelType}
                                            onChange={e => setVehicleForm({ ...vehicleForm, fuelType: e.target.value })}
                                        >
                                            <option value="Petrol">Petrol</option>
                                            <option value="Diesel">Diesel</option>
                                            <option value="EV">EV</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-slate-50">
                                    <button type="button" onClick={() => setIsEditingVehicle(false)} className="px-4 py-2 text-slate-500 font-medium hover:bg-slate-50 rounded-lg transition">Cancel</button>
                                    <button type="submit" disabled={vehicleLoading} className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-blue-600 transition shadow-md flex items-center">
                                        <Save size={18} className="mr-2" /> Save
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex-grow flex flex-col justify-center">
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                        <Car size={36} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-2xl text-slate-900 tracking-tight">{vehicleForm.number || "No Vehicle"}</p>
                                        <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                                            {vehicleForm.type} <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span> {vehicleForm.fuelType}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                                    <div className="min-w-[4px] h-full bg-amber-300 rounded-full"></div>
                                    <p className="text-sm text-amber-800 font-medium leading-relaxed">
                                        Tip: EV owners get priority parking in selected automated parking lots.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
                        <button onClick={() => navigate('/my-bookings')} className="text-primary font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition flex items-center gap-2">
                            View All <ArrowRight size={18} />
                        </button>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {recentBookings.length > 0 ? (
                            recentBookings.map((booking) => (
                                <div
                                    key={booking._id}
                                    onClick={() => navigate(`/ticket/${booking._id}`)}
                                    className="p-6 hover:bg-slate-50 transition duration-200 flex flex-col md:flex-row items-center justify-between group gap-4 cursor-pointer"
                                >
                                    <div className="flex items-center gap-5 w-full md:w-auto">
                                        <div className={`p-4 rounded-2xl ${booking.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-slate-900 group-hover:text-primary transition">{booking.slotId?.lotId?.name || "Parking Lot"}</p>
                                            <p className="text-slate-500 font-medium flex items-center gap-2">
                                                {new Date(booking.startTime).toLocaleDateString()}
                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                        <button
                                            onClick={() => setSelectedMapLot(booking.slotId?.lotId)}
                                            className="text-blue-500 font-bold hover:text-blue-600 hover:underline transition"
                                        >
                                            View Map
                                        </button>
                                        <div className="text-right min-w-[100px]">
                                            <p className="text-lg font-bold text-slate-900">₹{booking.totalPrice}</p>
                                            <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${booking.status === 'active' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'completed' ? 'bg-slate-100 text-slate-500' : 'bg-red-50 text-red-600'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-16 text-center">
                                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <History size={32} className="text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">No activity yet</h3>
                                <p className="text-slate-500">Your recent parking sessions will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Map Modal */}
            <MapModal lot={selectedMapLot} onClose={() => setSelectedMapLot(null)} />
        </div>
    );
};
export default UserDashboard;
