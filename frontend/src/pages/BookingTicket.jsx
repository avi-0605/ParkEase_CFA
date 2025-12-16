import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Loader from '../components/Loader';
import { ArrowLeft, Download, MapPin, Calendar, Clock, CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';
import html2canvas from 'html2canvas';

const BookingTicket = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const ticketRef = useRef(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                // Determine if we are fetching by booking ID directly or need to filter from list
                // For simplicity assuming we can get single booking or filter from list
                // Since there is no direct public/driver getBookingById documented yet, 
                // we will fetch all my bookings and find it, or use a new endpoint if available.
                // Re-using /bookings/my for safety.
                const res = await API.get('/bookings/my');
                const found = res.data.data.find(b => b._id === bookingId);

                if (found) {
                    setBooking(found);
                } else {
                    // Fallback attempt to get specific booking (if backend supports)
                    // const singleRes = await API.get(/bookings/${bookingId});
                }
            } catch (err) {
                console.error("Failed to fetch booking", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId]);

    const handleDownload = async () => {
        if (!ticketRef.current) return;
        const canvas = await html2canvas(ticketRef.current);
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `parkease-ticket-${bookingId.slice(-6)}.png`;
        link.click();
    };

    if (loading) return <Loader />;
    if (!booking) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Ticket Not Found</h2>
            <button onClick={() => navigate(-1)} className="text-primary hover:underline">Go Back</button>
        </div>
    );

    const isExpired = new Date(booking.endTime) < new Date();
    const isActive = new Date(booking.startTime) <= new Date() && !isExpired;

    return (
        <div className="min-h-screen bg-slate-100 py-12 px-4 flex flex-col items-center justify-center">

            <div className="w-full max-w-md mb-6 flex justify-between items-center">
                <button onClick={() => navigate(-1)} className="flex items-center text-slate-600 hover:text-slate-900 transition">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </button>
                <button onClick={handleDownload} className="flex items-center text-primary font-bold hover:text-blue-700 transition">
                    <Download size={20} className="mr-2" /> Save Ticket
                </button>
            </div>

            <div ref={ticketRef} className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-slate-200">
                {/* Header Pattern */}
                <div className="h-4 bg-gradient-to-r from-primary to-blue-600"></div>

                <div className="p-8 text-center border-b border-dashed border-slate-200 relative">
                    {/* Punch Hole decorations */}
                    <div className="absolute -left-3 bottom-[-12px] w-6 h-6 bg-slate-100 rounded-full"></div>
                    <div className="absolute -right-3 bottom-[-12px] w-6 h-6 bg-slate-100 rounded-full"></div>

                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl shadow-inner">
                        <CheckCircle size={32} />
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Parking Receipt</h1>
                    <p className="text-slate-500 text-sm font-mono uppercase tracking-widest">ID: {booking._id.slice(-8)}</p>

                    <div className={`mt-4 inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                        ${isActive ? 'bg-green-100 text-green-700' : isExpired ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-700'}
                    `}>
                        {isActive ? 'Active Now' : isExpired ? 'Completed' : 'Upcoming'}
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    {/* Location */}
                    <div className="flex items-start">
                        <div className="bg-slate-100 p-3 rounded-xl mr-4 text-slate-500">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                            <h3 className="text-lg font-bold text-slate-900 leading-tight">{booking.slotId?.lotId?.name || 'Parking Lot'}</h3>
                            <p className="text-sm text-slate-500 mt-1">{booking.slotId?.lotId?.address}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Slot */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Slot No.</p>
                            <p className="text-3xl font-extrabold text-slate-800">{booking.slotId?.slotNumber}</p>
                        </div>
                        {/* Price */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Amt Paid</p>
                            <p className="text-3xl font-extrabold text-green-600">₹{booking.totalPrice}</p>
                        </div>
                    </div>

                    {/* Time */}
                    <div className="space-y-4 pt-2">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center text-slate-600">
                                <Calendar size={18} className="mr-3 text-slate-400" />
                                <span className="text-sm font-medium">Date</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900">{new Date(booking.startTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center text-slate-600">
                                <Clock size={18} className="mr-3 text-slate-400" />
                                <span className="text-sm font-medium">Duration</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900">
                                {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer QR Placeholder */}
                <div className="bg-slate-50 px-8 py-6 border-t border-slate-100 flex flex-col items-center text-center">
                    {/* Using a simple QR API for visual effect */}
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking._id}`}
                        alt="Booking QR"
                        className="w-32 h-32 mb-4 p-2 bg-white border border-slate-200 rounded-xl"
                    />
                    <p className="text-xs text-slate-400">Scan this code at the parking terminal for entry/exit.</p>
                </div>
            </div>
        </div>
    );
};

export default BookingTicket;
