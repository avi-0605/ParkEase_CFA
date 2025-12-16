import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import socket from '../services/socket';
import Loader from '../components/Loader';
import { staggerChildren } from '../animations/gsapAnimations';
import { MapPin, Navigation, Car, LocateFixed, Map as MapIcon, List, Star } from 'lucide-react';
import MapSearch from '../components/MapSearch';

const ParkingLots = () => {
    const [lots, setLots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState(null);
    const [sortMode, setSortMode] = useState('default'); // default, distance
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
    const containerRef = useRef(null);

    useEffect(() => {
        fetchLots();

        // Socket Listener
        socket.on('slot_update', (data) => {
            setLots(prevLots => prevLots.map(lot => {
                if (lot._id === data.lotId) {
                    const newAvailable = data.status === 'reserved' || data.status === 'occupied'
                        ? Math.max(0, (lot.availableSlots || 0) - 1)
                        : (lot.availableSlots || 0) + 1;
                    return { ...lot, availableSlots: newAvailable };
                }
                return lot;
            }));
        });

        return () => {
            socket.off('slot_update');
        };
    }, []);

    const fetchLots = () => {
        setLoading(true);
        API.get('/parking-lots')
            .then(res => {
                setLots(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (!loading && lots.length > 0) {
            staggerChildren(containerRef.current, '.lot-card');
        }
    }, [loading, lots]);

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    setSortMode('distance');
                    sortLotsByDistance(latitude, longitude);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    let msg = "Could not get your location.";
                    if (error.code === 1) msg = "Location permission denied.";
                    if (error.code === 2) msg = "Location unavailable. Ensure GPS is on.";
                    if (error.code === 3) msg = "Location request timed out.";
                    alert(msg + " Using default location (Navi Mumbai).");

                    // Fallback to Vashi, Navi Mumbai
                    const defaultLat = 19.0660;
                    const defaultLng = 73.0020;
                    setUserLocation({ lat: defaultLat, lng: defaultLng });
                    setSortMode('distance');
                    sortLotsByDistance(defaultLat, defaultLng);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    const sortLotsByDistance = (lat, lng) => {
        const sortedLots = [...lots].map(lot => {
            const lotLat = lot.location?.lat || (lot.location?.coordinates ? lot.location.coordinates[1] : 0);
            const lotLng = lot.location?.lng || (lot.location?.coordinates ? lot.location.coordinates[0] : 0);
            const distance = calculateDistance(lat, lng, lotLat, lotLng);
            return { ...lot, distance };
        }).sort((a, b) => a.distance - b.distance);

        setLots(sortedLots);
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                        <h1 className="text-4xl font-bold text-slate-900">Find Your Spot</h1>
                        <p className="mt-2 text-slate-500">Premium locations in Navi Mumbai & beyond</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white p-1 rounded-xl border border-slate-200 flex shadow-sm">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg flex items-center gap-2 transition ${viewMode === 'list' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                <List size={20} />
                                <span className="font-bold text-sm hidden sm:inline">List</span>
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`p-2 rounded-lg flex items-center gap-2 transition ${viewMode === 'map' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                <MapIcon size={20} />
                                <span className="font-bold text-sm hidden sm:inline">Map</span>
                            </button>
                        </div>

                        <button
                            onClick={getUserLocation}
                            className="flex items-center px-4 py-3 bg-white text-primary border border-primary rounded-xl hover:bg-blue-50 transition shadow-sm font-bold"
                        >
                            <LocateFixed size={20} className="mr-2" />
                            {userLocation ? 'Update Location' : 'Location'}
                        </button>
                    </div>
                </div>

                {viewMode === 'map' ? (
                    <MapSearch parkingLots={lots} userLocation={userLocation} />
                ) : (
                    <>
                        {lots.length === 0 ? (
                            <div className="text-center text-slate-500 bg-white p-12 rounded-2xl shadow-sm border border-slate-100">
                                <Car className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                                <h3 className="text-lg font-medium">No parking lots found</h3>
                                <p>Check back later for new locations.</p>
                            </div>
                        ) : (
                            <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {lots.map((lot, index) => (
                                    <div key={lot._id} className="lot-card group bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex flex-col">
                                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition truncate pr-2">
                                                        {lot.name}
                                                    </h3>
                                                    <div className="flex items-center text-slate-500 text-sm mt-1">
                                                        <MapPin size={16} className="mr-1 flex-shrink-0" />
                                                        <span className="truncate max-w-[200px]">{lot.address}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <div className={`px-3 py-1 rounded-full text-sm font-bold shadow-sm ${lot.isSurge ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-100 text-primary'}`}>
                                                        ₹{lot.currentPrice || lot.pricePerHour}
                                                        <span className="text-xs font-normal opacity-70">/hr</span>
                                                    </div>
                                                    {lot.distance !== undefined && (
                                                        <div className="bg-black/80 text-white text-[11px] px-2 py-0.5 rounded-full flex items-center">
                                                            <Navigation size={12} className="mr-1 text-emerald-400" />
                                                            {lot.distance.toFixed(1)} km away
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center text-slate-500 text-sm">
                                                    <Star size={16} className="mr-1 fill-amber-500 text-amber-500" />
                                                    <span className="font-bold text-slate-700 mr-1">{lot.averageRating || 'New'}</span>
                                                    {lot.reviewCount > 0 && (
                                                        <span className="text-slate-400 text-xs">({lot.reviewCount})</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Availability</span>
                                                    <span className={`text-lg font-bold ${lot.availableSlots === 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                                        {lot.availableSlots !== undefined ? lot.availableSlots : '-'}/{lot.totalSlots}
                                                    </span>
                                                </div>
                                                <Link
                                                    to={`/slots/${lot._id}`}
                                                    className="px-6 py-2 rounded-lg bg-slate-900 text-white font-medium hover:bg-primary transition-colors flex items-center"
                                                >
                                                    View Slots <Navigation size={16} className="ml-2" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ParkingLots;
