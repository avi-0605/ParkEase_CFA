import { useState, useEffect, useRef } from 'react';
import API from '../services/api';
import socket from '../services/socket';
import Loader from '../components/Loader';
import {
    BarChart, AlertTriangle, CheckCircle, Activity, Server, Clock,
    Search, Filter, Power, Archive, Edit3, Trash2, XCircle, Info, MessageSquare, Star
} from 'lucide-react';

const AdminDashboard = () => {
    // Data States
    const [lots, setLots] = useState([]);
    const [peakHours, setPeakHours] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [stats, setStats] = useState({ totalLots: 0, totalSlots: 0, activeBookings: 0, revenue: 0 });
    const [activityLogs, setActivityLogs] = useState([]);
    const [reviews, setReviews] = useState([]); // Added reviews state
    const [loading, setLoading] = useState(true);

    // UI States
    const [filter, setFilter] = useState('all'); // all, active, inactive, archived
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');
    const [toast, setToast] = useState(null); // New Toast State

    // Form State
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [totalSlots, setTotalSlots] = useState(10);
    const [pricePerHour, setPricePerHour] = useState(20);

    useEffect(() => {
        fetchDashboardData(); // Renamed from fetchData
    }, []);

    // Refs
    const manageSlotsRef = useRef(null);

    useEffect(() => {
        // Socket Listeners
        socket.on('new_booking', (data) => {
            // Update Stats
            setStats(prev => ({
                ...prev,
                activeBookings: prev.activeBookings + 1,
                revenue: prev.revenue + (data.totalPrice || 0)
            }));

            // trigger toast
            setToast(`${data.user} booked a slot at ${data.lot}`);
            setTimeout(() => setToast(null), 5000);

            // Add to Activity Log
            setActivityLogs(prev => [{
                action: 'New Booking',
                details: `${data.user} booked Slot ${data.slot} at ${data.lot}`,
                timestamp: new Date()
            }, ...prev]);
        });

        socket.on('slot_update', (data) => {
            // Update Parking Lots available count locally
            setLots(prevLots => prevLots.map(lot => {
                if (String(lot._id) === String(data.lotId)) {
                    const newAvailable = data.status === 'reserved' || data.status === 'occupied'
                        ? Math.max(0, (lot.availableSlots || 0) - 1)
                        : (lot.availableSlots || 0) + 1;
                    return { ...lot, availableSlots: newAvailable };
                }
                return lot;
            }));
        });

        return () => {
            socket.off('new_booking');
            socket.off('slot_update');
        };
    }, []);

    const fetchDashboardData = async () => { // Renamed from fetchData
        setLoading(true);
        try {
            // Parallel fetching for performance
            const [lotsRes, peakRes, alertsRes, statsRes, logsRes, reviewsRes] = await Promise.all([ // Added reviewsRes
                API.get('/admin/parking-lots'),
                API.get('/admin/analytics/peak-hours'),
                API.get('/admin/alerts'),
                API.get('/admin/stats'),
                API.get('/admin/logs'),
                API.get('/admin/reviews') // Added API call for reviews
            ]);

            setLots(lotsRes.data.data);
            setPeakHours(peakRes.data.data);
            setAlerts(alertsRes.data.data);
            setStats(statsRes.data.data);
            setActivityLogs(logsRes.data.data);
            setReviews(reviewsRes.data.data); // Set reviews state
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setMessage('Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    // Actions
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');

    const handleCreateLot = async (e) => {
        e.preventDefault();
        try {
            await API.post('/parking-lots', {
                name, address,
                totalSlots: parseInt(totalSlots),
                pricePerHour: parseInt(pricePerHour),
                location: {
                    type: 'Point',
                    // Use provided lat/lng or default to Navi Mumbai center if empty (though inputs are required now)
                    coordinates: [parseFloat(lng) || 73.0297, parseFloat(lat) || 19.0330]
                }
            });
            setMessage('Success: Parking Lot Created!');
            setName(''); setAddress(''); setLat(''); setLng('');
            fetchDashboardData();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Error: Failed to create parking lot.');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await API.put(`/parking-lots/${id}/toggle`);
            fetchDashboardData();
        } catch (err) {
            alert('Failed to toggle status');
        }
    };

    const handleArchive = async (id) => {
        if (window.confirm('Are you sure you want to archive this lot? It will be hidden from users.')) {
            try {
                await API.put(`/parking-lots/${id}/archive`);
                fetchDashboardData();
            } catch (err) {
                alert('Failed to archive');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('PERMANENT DELETE: Are you sure?')) {
            try {
                await API.delete(`/parking-lots/${id}`);
                fetchDashboardData();
            } catch (err) {
                alert('Failed to delete');
            }
        }
    };

    // Filtering Logic
    const filteredLots = lots.filter(lot => {
        const matchesSearch = lot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lot.address.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesFilter = true;
        if (filter === 'active') matchesFilter = lot.isActive && !lot.isArchived;
        if (filter === 'inactive') matchesFilter = !lot.isActive && !lot.isArchived;
        if (filter === 'archived') matchesFilter = lot.isArchived;

        return matchesSearch && matchesFilter;
    });

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'bg-rose-100 text-rose-800 border-rose-200';
            case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 min-h-screen bg-slate-50">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-extrabold text-slate-900 flex items-center">
                    <Activity className="mr-3 text-primary" /> Admin Command Center
                </h1>
                <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded shadow-sm border">
                    Server Status: <span className="text-emerald-500 font-bold">Online</span>
                </div>
            </div>

            {/* 0. Parking Reviews Message Box */}
            <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
                {/* Left: Parking Lot List for Reviews */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <h2 className="font-bold text-slate-800 flex items-center">
                            <MessageSquare className="mr-2 text-indigo-500" /> Reviews
                        </h2>
                        <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold">{reviews.length}</span>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-2">
                        {/* Group reviews by Lot ID manually or just filtered view */}
                        {Object.values(reviews.reduce((acc, review) => {
                            const lotId = review.parkingLotId?._id || 'unknown';
                            if (!acc[lotId]) {
                                acc[lotId] = {
                                    lot: review.parkingLotId,
                                    count: 0,
                                    latest: review.createdAt
                                };
                            }
                            acc[lotId].count++;
                            return acc;
                        }, {})).sort((a, b) => new Date(b.latest) - new Date(a.latest)).map((group, idx) => (
                            <div key={idx} className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer border border-transparent hover:border-slate-200 transition">
                                <div className="font-bold text-slate-800 text-sm truncate">{group.lot?.name || 'Unknown Lot'}</div>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-slate-500">{group.count} Reviews</span>
                                    <span className="text-[10px] text-slate-400">Latest: {new Date(group.latest).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Review Feed (Message Box Style) */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <h2 className="font-bold text-slate-800">Recent Messages</h2>
                    </div>
                    <div className="overflow-y-auto flex-1 p-6 space-y-6">
                        {reviews.length === 0 ? (
                            <div className="text-center text-slate-400 mt-20">
                                <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No reviews yet.</p>
                            </div>
                        ) : (
                            reviews.map((review, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                        {review.userId?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="flex-1 bg-slate-50 rounded-2xl rounded-tl-none p-4 relative group hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="font-bold text-slate-900 text-sm">{review.userId?.name || 'Anonymous User'}</span>
                                                <span className="text-slate-400 text-xs ml-2">via {review.parkingLotId?.name || 'Unknown Lot'}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-medium">{new Date(review.createdAt).toLocaleString()}</span>
                                        </div>

                                        <div className="flex mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className={`${i < review.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
                                            ))}
                                        </div>

                                        <p className="text-slate-700 text-sm leading-relaxed">
                                            {review.comment}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* 1. System Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4"><Server size={24} /></div>
                    <div><p className="text-xs text-slate-500 uppercase font-bold">Total Lots</p><p className="text-2xl font-bold text-slate-800">{stats.totalLots}</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg mr-4"><Edit3 size={24} /></div>
                    <div><p className="text-xs text-slate-500 uppercase font-bold">Total Slots</p><p className="text-2xl font-bold text-slate-800">{stats.totalSlots}</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg mr-4"><CheckCircle size={24} /></div>
                    <div><p className="text-xs text-slate-500 uppercase font-bold">Active Bookings</p><p className="text-2xl font-bold text-slate-800">{stats.activeBookings}</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-lg mr-4"><Activity size={24} /></div>
                    <div><p className="text-xs text-slate-500 uppercase font-bold">Est. Revenue</p><p className="text-2xl font-bold text-slate-800">₹{stats.revenue}</p></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* 2. Peak Hour Insights */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80 overflow-y-auto">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                        <Clock className="mr-2 text-indigo-500" /> Peak Hour Insights
                    </h2>
                    {peakHours.length === 0 ? <p className="text-slate-400 text-sm p-4 text-center">Not enough data yet.</p> : (
                        <div className="space-y-3">
                            {peakHours.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <div className="font-bold text-slate-700">{item.hourRange}</div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${item.level === 'High' ? 'bg-red-100 text-red-700' :
                                        item.level === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                        }`}>{item.level} ({item.count})</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. System Alerts Panel */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80 overflow-y-auto">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                        <AlertTriangle className="mr-2 text-rose-500" /> System Alerts
                    </h2>
                    {alerts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <CheckCircle size={30} className="mb-2 text-emerald-400" />
                            <p className="text-sm">All Clear</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {alerts.map((alert, index) => (
                                <div key={index} className={`p-3 rounded-lg border text-sm ${getSeverityColor(alert.severity)}`}>
                                    <h4 className="font-bold uppercase text-xs">{alert.type}</h4>
                                    <p>{alert.message}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 4. Activity Logs (New) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80 overflow-y-auto relative">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                        <Info className="mr-2 text-blue-500" /> Activity Log
                    </h2>
                    {activityLogs.length === 0 ? <p className="text-slate-400 text-sm text-center">No recent activity.</p> : (
                        <ul className="space-y-3">
                            {activityLogs.map((log, i) => (
                                <li key={i} className="text-sm border-l-2 border-slate-300 pl-3">
                                    <p className="font-medium text-slate-800">{log.action}</p>
                                    <p className="text-slate-500 text-xs">{log.details}</p>
                                    <p className="text-slate-400 text-xs mt-1">{new Date(log.timestamp).toLocaleTimeString()}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Real-time Notification Toast */}
            {toast && (
                <div className="fixed top-24 right-4 z-50 bg-white border-l-4 border-emerald-500 shadow-xl rounded-lg p-4 max-w-sm animate-in fade-in slide-in-from-right duration-300">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-slate-900">New Booking!</p>
                            <p className="text-sm text-slate-500 mt-1">{toast}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-500">
                                <XCircle size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <hr className="my-8 border-slate-200" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Lot Form - Simplified */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                        <h2 className="text-lg font-bold mb-4 text-slate-800">Add Parking Lot</h2>
                        {message && <div className={`p-3 rounded-lg mb-4 text-xs font-bold ${message.includes('Success') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{message}</div>}
                        <form onSubmit={handleCreateLot} className="space-y-4">
                            <input type="text" placeholder="Name" required className="input-field" value={name} onChange={e => setName(e.target.value)} />
                            <input type="text" placeholder="Address" required className="input-field" value={address} onChange={e => setAddress(e.target.value)} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" placeholder="Slots" required className="input-field" value={totalSlots} onChange={e => setTotalSlots(e.target.value)} />
                                <input type="number" placeholder="₹/Hr" required className="input-field" value={pricePerHour} onChange={e => setPricePerHour(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" step="any" placeholder="Latitude (e.g. 19.0330)" className="input-field" value={lat} onChange={e => setLat(e.target.value)} required />
                                <input type="number" step="any" placeholder="Longitude (e.g. 73.0297)" className="input-field" value={lng} onChange={e => setLng(e.target.value)} required />
                            </div>
                            <button type="submit" className="w-full btn-primary py-2 text-sm">Create Lot</button>
                        </form>
                    </div>
                </div>

                {/* Management Section */}
                <div className="lg:col-span-2">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <h2 className="text-lg font-bold text-slate-800">Manage Locations</h2>
                        <div className="flex items-center space-x-2 w-full sm:w-auto">
                            <div className="relative flex-grow sm:flex-grow-0">
                                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary outline-none"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="p-2 border rounded-lg text-sm bg-white"
                                value={filter}
                                onChange={e => setFilter(e.target.value)}
                            >
                                <option value="all">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        {filteredLots.length === 0 ? (
                            <div className="p-10 text-center text-slate-400 flex flex-col items-center">
                                <XCircle size={40} className="mb-2 opacity-50" />
                                <p>No parking lots found matching your criteria.</p>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Information</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Capacity</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Controls</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {filteredLots.map(lot => (
                                        <tr key={lot._id} className={`hover:bg-slate-50/50 transition ${lot.isArchived ? 'opacity-60 bg-slate-50' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{lot.name}</div>
                                                <div className="text-xs text-slate-500 truncate max-w-[150px]">{lot.address}</div>
                                                {lot.isArchived && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded font-bold">ARCHIVED</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggleStatus(lot._id)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${lot.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                                    title="Toggle Active Status"
                                                    disabled={lot.isArchived}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${lot.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                                <div className="text-[10px] mt-1 text-slate-400 font-medium">
                                                    {lot.isActive ? 'Booking Allowed' : 'Disabled'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${(lot.availableSlots !== undefined && lot.availableSlots === 0)
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-emerald-100 text-emerald-600'
                                                        }`}>
                                                        {lot.availableSlots !== undefined ? lot.availableSlots : '-'}/{lot.totalSlots} Available
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                <button
                                                    onClick={() => handleArchive(lot._id)}
                                                    className="text-amber-500 hover:text-amber-700 disabled:opacity-30"
                                                    title="Archive"
                                                    disabled={lot.isArchived}
                                                >
                                                    <Archive size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(lot._id)}
                                                    className="text-rose-500 hover:text-rose-700 disabled:opacity-30"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
