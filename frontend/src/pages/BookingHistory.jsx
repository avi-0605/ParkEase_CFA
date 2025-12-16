import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import Loader from '../components/Loader';
import MapModal from '../components/MapModal';
import ExtendBookingModal from '../components/ExtendBookingModal';
import ReviewModal from '../components/ReviewModal';
import { Filter, MapPin, Star } from 'lucide-react';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const filterParam = searchParams.get('filter') || 'all';

    // Map State
    const [selectedMapLot, setSelectedMapLot] = useState(null);

    // Extend State
    const [extendBooking, setExtendBooking] = useState(null);
    const [extendLoading, setExtendLoading] = useState(false);

    // Review State
    const [reviewBooking, setReviewBooking] = useState(null);

    useEffect(() => {
        API.get('/bookings/my')
            .then(res => {
                setBookings(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const now = new Date();
        let result = bookings;

        if (filterParam === 'active') {
            result = bookings.filter(b => b.status === 'active' && new Date(b.startTime) <= now && new Date(b.endTime) > now);
        } else if (filterParam === 'upcoming') {
            result = bookings.filter(b => b.status === 'active' && new Date(b.startTime) > now);
        } else if (filterParam === 'history') {
            // Basic interpretation of 'history' as completed or cancelled
            result = bookings.filter(b => b.status !== 'active');
        }

        setFilteredBookings(result);
    }, [bookings, filterParam]);

    const handleConfirmExtend = async (bookingId, currentEndTime, hoursToAdd) => {
        const currentEnd = new Date(currentEndTime);
        const newEnd = new Date(currentEnd.getTime() + parseFloat(hoursToAdd) * 60 * 60 * 1000);

        try {
            setExtendLoading(true);
            await API.put(`/bookings/extend/${bookingId}`, {
                endTime: newEnd.toISOString()
            });
            alert('Booking extended successfully!');
            setExtendBooking(null); // Close modal

            // Refresh list
            const res = await API.get('/bookings/my');
            setBookings(res.data.data);
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to extend booking');
        } finally {
            setExtendLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">My Bookings</h1>
                <div className="flex items-center space-x-2 bg-white border px-3 py-1 rounded-lg">
                    <Filter size={16} className="text-gray-500" />
                    <select
                        value={filterParam}
                        onChange={(e) => setSearchParams({ filter: e.target.value })}
                        className="text-sm border-none focus:ring-0 text-gray-700 font-medium"
                    >
                        <option value="all">All</option>
                        <option value="active">Active Now</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="history">History</option>
                    </select>
                </div>
            </div>

            {filteredBookings.length === 0 ? (
                <div className="text-center text-gray-500 py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                    <p className="text-lg">No bookings found for this filter.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredBookings.map(booking => (
                        <div key={booking._id} className="bg-white shadow rounded-lg p-6 border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                    <MapPin size={18} className="mr-2 text-primary" />
                                    {booking.slotId?.lotId?.name || 'Unknown Lot'}
                                    <span className="text-gray-500 text-sm ml-2 font-normal">Slot: {booking.slotId?.slotNumber}</span>
                                </h3>
                                <p className="text-gray-500 text-sm ml-6 mb-2">{booking.slotId?.lotId?.address}</p>
                                <div className="mt-2 text-sm text-gray-700 ml-6">
                                    <span className="font-medium">From:</span> {new Date(booking.startTime).toLocaleString()} <br />
                                    <span className="font-medium">To:</span> {new Date(booking.endTime).toLocaleString()}
                                </div>
                                <div className="mt-2 font-bold text-primary ml-6">
                                    Total: ₹{booking.totalPrice}
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex flex-col items-end space-y-2 w-full md:w-auto">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                                    ${booking.status === 'active' ? 'bg-green-100 text-green-800' :
                                        booking.status === 'completed' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'}
                                `}>
                                    {booking.status}
                                </span>
                                <div className="flex gap-3 mt-2">
                                    <button
                                        onClick={() => window.open(`/ticket/${booking._id}`, '_self')}
                                        className="text-sm font-medium px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                                    >
                                        Ticket
                                    </button>
                                    <button
                                        onClick={() => booking.slotId?.lotId && setSelectedMapLot(booking.slotId?.lotId)}
                                        disabled={!booking.slotId?.lotId}
                                        className={`text-sm font-medium px-3 py-1 rounded-lg transition
                                            ${booking.slotId?.lotId
                                                ? 'text-blue-500 hover:bg-blue-50 cursor-pointer'
                                                : 'text-gray-400 cursor-not-allowed bg-gray-50'
                                            }
                                        `}
                                    >
                                        View Map
                                    </button>
                                    {booking.status === 'active' && (
                                        <button
                                            onClick={() => setExtendBooking(booking)}
                                            className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg font-medium transition"
                                        >
                                            Extend
                                        </button>
                                    )}
                                    {booking.status === 'active' && (
                                        <button
                                            onClick={async () => {
                                                if (window.confirm("End parking session now? This will free up the slot.")) {
                                                    try {
                                                        await API.put(`/bookings/end/${booking._id}`);
                                                        setBookings(prev => prev.map(b => b._id === booking._id ? { ...b, status: 'completed' } : b));
                                                        // Automatically open review for this booking
                                                        setTimeout(() => setReviewBooking(booking), 500);
                                                    } catch (err) {
                                                        alert("Failed to end session");
                                                    }
                                                }
                                            }}
                                            className="text-sm text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1 rounded-lg font-medium transition"
                                        >
                                            End Session
                                        </button>
                                    )}
                                    {booking.status === 'completed' && (
                                        <button
                                            onClick={() => setReviewBooking(booking)}
                                            className="text-sm text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1 rounded-lg font-medium transition flex items-center"
                                        >
                                            <Star size={14} className="mr-1" /> Rate
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Map Modal */}
            <MapModal lot={selectedMapLot} onClose={() => setSelectedMapLot(null)} />

            {/* Extend Booking Modal */}
            <ExtendBookingModal
                booking={extendBooking}
                onClose={() => setExtendBooking(null)}
                onConfirm={handleConfirmExtend}
                loading={extendLoading}
            />

            {/* Review Modal */}
            <ReviewModal
                booking={reviewBooking}
                onClose={() => setReviewBooking(null)}
                onSuccess={() => {
                    // Optional: Mark booking as reviewed locally or refresh
                    setReviewBooking(null);
                }}
            />
        </div>
    );
};

export default BookingHistory;
