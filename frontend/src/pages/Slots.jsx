import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import socket from '../services/socket';
import Loader from '../components/Loader';
import SlotCard from '../components/SlotCard';
import { staggerChildren } from '../animations/gsapAnimations';
import { ArrowLeft } from 'lucide-react';

const Slots = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [slots, setSlots] = useState([]);
    const [lot, setLot] = useState(null);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        // Fetch Lot Details
        API.get(`/parking-lots/${id}`)
            .then(res => setLot(res.data.data))
            .catch(err => console.error(err));

        // Fetch Slots
        API.get(`/slots/${id}`)
            .then(res => {
                setSlots(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });

        // Socket Listeners
        socket.on('connect', () => {
            console.log('Connected to socket');
        });

        socket.on('slot_update', (data) => {
            if (data.lotId === id) {
                setSlots(prevSlots => prevSlots.map(slot =>
                    slot._id === data.slotId ? { ...slot, status: data.status } : slot
                ));
            }
        });

        return () => {
            socket.off('slot_update');
            socket.off('connect');
        };
    }, [id]);

    useEffect(() => {
        if (!loading && slots.length > 0) {
            staggerChildren(containerRef.current, '.slot-card');
        }
    }, [loading, slots]);

    const handleSlotClick = (slotId) => {
        navigate(`/booking/${slotId}`, { state: { lot } });
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-primary transition mb-2">
                            <ArrowLeft size={16} className="mr-1" /> Back to locations
                        </button>
                        <h1 className="text-3xl font-bold text-slate-900">{lot?.name}</h1>
                        <p className="text-slate-500">{lot?.address}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Hourly Rate</div>
                        <div className="text-2xl font-bold text-primary">₹{lot?.pricePerHour}</div>
                    </div>
                </div>

                {/* Legend */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-8 flex flex-wrap gap-6 justify-center sm:justify-start">
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-glow-green mr-2"></div>
                        <span className="text-sm font-medium text-slate-600">Available</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-sm font-medium text-slate-600">Occupied</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm font-medium text-slate-600">Reserved</span>
                    </div>
                    <div className="flex items-center ml-auto border-l pl-6 border-slate-200">
                        <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded border border-blue-100">⚡ EV Charging Supported</span>
                    </div>
                </div>

                {/* Grid */}
                <div className="bg-slate-200/50 p-8 rounded-3xl border-2 border-dashed border-slate-300">
                    <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {slots.map(slot => (
                            <div key={slot._id} className="slot-card">
                                <SlotCard slot={slot} onClick={() => handleSlotClick(slot._id)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Slots;
