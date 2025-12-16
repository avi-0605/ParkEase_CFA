import { useState } from 'react';
import API from '../services/api';
import { Star, X } from 'lucide-react';

const ReviewModal = ({ booking, onClose, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/reviews', {
                parkingLotId: booking.slotId.lotId._id,
                rating,
                comment
            });
            onSuccess();
            onClose();
            alert('Review submitted successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    if (!booking) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md relative animate-fade-in shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-100 rounded-full transition"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-1 text-slate-800">Rate Your Experience</h2>
                <p className="text-slate-500 mb-6 text-sm">
                    How was your parking at <span className="font-bold text-slate-700">{booking.slotId?.lotId?.name}</span>?
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="transition-transform hover:scale-110 focus:outline-none"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    size={40}
                                    className={`${star <= (hoverRating || rating)
                                            ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
                                            : 'fill-slate-100 text-slate-300'
                                        } transition-colors duration-200`}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Any comments?
                        </label>
                        <textarea
                            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition bg-slate-50 min-h-[120px] resize-none text-slate-700 placeholder-slate-400"
                            placeholder="Share details of your own experience at this place"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3.5 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                    >
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
