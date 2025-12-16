import React, { useState } from 'react';
import { X, Clock, CreditCard } from 'lucide-react';

const ExtendBookingModal = ({ booking, onConfirm, onClose, loading }) => {
    const [hours, setHours] = useState(1);

    if (!booking) return null;

    const rate = booking.slotId?.lotId?.pricePerHour || 50; // Fallback rate
    const additionalCost = hours * rate;
    const currentEnd = new Date(booking.endTime);
    const newEnd = new Date(currentEnd.getTime() + hours * 60 * 60 * 1000);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-lg text-slate-800">Extend Booking</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                        <Clock className="text-blue-600 mt-1" size={20} />
                        <div>
                            <p className="text-sm font-bold text-blue-900">Current End Time</p>
                            <p className="text-blue-700">{currentEnd.toLocaleString()}</p>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-2 block">Add Hours</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="1"
                                max="24"
                                value={hours}
                                onChange={(e) => setHours(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <span className="font-bold text-2xl text-slate-800 w-12 text-center">{hours}h</span>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 mt-2">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-500">New End Time</span>
                            <span className="font-medium text-slate-800">{newEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span className="text-slate-800">Additional Cost</span>
                            <span className="text-primary">₹{additionalCost}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => onConfirm(booking._id, booking.endTime, hours)}
                        disabled={loading}
                        className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : (
                            <>
                                <CreditCard size={18} /> Confirm Extension
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExtendBookingModal;
