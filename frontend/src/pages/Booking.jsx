import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, ChevronRight, CreditCard } from 'lucide-react';
import API from '../services/api';
import PaymentForm from '../components/PaymentForm';

const Booking = () => {
    const { slotId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [parkingLot, setParkingLot] = useState(state?.lot || null);
    const [showPayment, setShowPayment] = useState(false);

    const defaultStart = new Date(new Date().getTime() + 5 * 60000);
    const defaultEnd = new Date(defaultStart.getTime() + 60 * 60000);

    const [startTime, setStartTime] = useState(defaultStart.toISOString().slice(0, 16));
    const [endTime, setEndTime] = useState(defaultEnd.toISOString().slice(0, 16));
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        if (parkingLot) {
            calculatePrice();
        }
    }, [startTime, endTime, parkingLot]);

    const calculatePrice = () => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const durationHours = (end - start) / (1000 * 60 * 60);

        if (durationHours > 0 && parkingLot) {
            // Use currentPrice if available (dynamic pricing), else base price
            const rate = parkingLot.currentPrice || parkingLot.pricePerHour;
            setTotalPrice((durationHours * rate).toFixed(2));
        } else {
            setTotalPrice(0);
        }
    };

    const handleBooking = (e) => {
        e.preventDefault();
        if (totalPrice > 0) {
            setShowPayment(true);
        }
    };

    const handlePaymentSuccess = async () => {
        setLoading(true);
        setError('');
        setShowPayment(false); // Close modal

        try {
            await API.post('/bookings', {
                slotId,
                startTime,
                endTime,
                totalPrice // Optionally send total price if backend validates it
            });
            navigate('/user-dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Booking failed');
            setLoading(false);
        }
    };

    if (!parkingLot) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-primary transition mb-6">
                    <ArrowLeft size={16} className="mr-1" /> Back to Slots
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Booking Form */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                <Calendar className="mr-2 text-primary" /> Book Your Spot
                            </h2>

                            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-100">{error}</div>}

                            <form onSubmit={handleBooking} className="space-y-6">
                                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start">
                                    <Calendar className="text-indigo-600 mt-1 mr-3 flex-shrink-0" size={20} />
                                    <div>
                                        <h4 className="font-bold text-indigo-900 text-sm">Advance Booking Enabled</h4>
                                        <p className="text-xs text-indigo-700 mt-1">You can book slots up to 7 days in advance.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Start Time</label>
                                        <input
                                            type="datetime-local"
                                            required
                                            className="input-field"
                                            value={startTime}
                                            min={new Date().toISOString().slice(0, 16)}
                                            max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                                            onChange={(e) => setStartTime(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">End Time</label>
                                        <input
                                            type="datetime-local"
                                            required
                                            className="input-field"
                                            value={endTime}
                                            min={startTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start">
                                    <Clock className="mt-1 text-primary h-5 w-5 mr-3 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">Smart Pricing Active</h4>
                                        <p className="text-xs text-slate-500 mt-1">Rates are calculated based on real-time demand and duration. Extend anytime from your dashboard.</p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowPayment(true);
                                    }}
                                    disabled={loading || totalPrice <= 0}
                                    className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center
                                        ${loading || totalPrice <= 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'}
                                    `}
                                >
                                    Proceed to Payment <ChevronRight className="ml-2" />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="md:col-span-1">
                        <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-6 sticky top-24">
                            <h3 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4">Order Summary</h3>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <div className="text-slate-400 text-xs uppercase tracking-wider font-bold">Location</div>
                                    <div className="font-medium text-lg truncate">{parkingLot.name}</div>
                                    <div className="text-slate-400 text-sm">{parkingLot.address}</div>
                                </div>
                                <div>
                                    <div className="text-slate-400 text-xs uppercase tracking-wider font-bold">Rate</div>
                                    <div className="font-mono">₹{parkingLot.pricePerHour}/hr</div>
                                </div>
                            </div>

                            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                                <div className="flex justify-between items-end">
                                    <span className="text-slate-400 font-medium">Total Price</span>
                                    <span className="text-3xl font-bold text-emerald-400">₹{totalPrice}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-center text-slate-500 text-xs">
                                <CreditCard size={14} className="mr-2" /> Secure SSL Payment
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPayment && (
                <PaymentForm
                    amount={totalPrice}
                    onPaymentSuccess={handlePaymentSuccess}
                    onCancel={() => setShowPayment(false)}
                />
            )}
        </div>
    );
};

export default Booking;
