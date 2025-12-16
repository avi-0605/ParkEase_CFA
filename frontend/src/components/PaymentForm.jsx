import { useState } from 'react';
import { CreditCard, Lock, Check, AlertCircle } from 'lucide-react';

const PaymentForm = ({ amount, onPaymentSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });

    const handleInputChange = (e) => {
        let { name, value } = e.target;

        if (name === 'number') {
            value = value.replace(/\D/g, '').slice(0, 16);
            value = value.replace(/(\d{4})/g, '$1 ').trim();
        } else if (name === 'expiry') {
            value = value.replace(/\D/g, '').slice(0, 4);
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
        } else if (name === 'cvv') {
            value = value.replace(/\D/g, '').slice(0, 3);
        }

        setCardDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate payment processing delay
        setTimeout(() => {
            setLoading(false);
            onPaymentSuccess();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
                <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Lock size={20} className="text-emerald-500" />
                        Secure Payment
                    </h2>
                    <span className="text-lg font-bold text-gray-900">₹{amount}</span>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Card Number</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="number"
                                placeholder="0000 0000 0000 0000"
                                value={cardDetails.number}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                required
                            />
                            <CreditCard className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Cardholder Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="JOHN DOE"
                            value={cardDetails.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition uppercase"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Expiry</label>
                            <input
                                type="text"
                                name="expiry"
                                placeholder="MM/YY"
                                value={cardDetails.expiry}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">CVV</label>
                            <input
                                type="password"
                                name="cvv"
                                placeholder="123"
                                value={cardDetails.cvv}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/30 transition flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                            ) : (
                                'Pay Now'
                            )}
                        </button>
                    </div>

                    <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1 mt-2">
                        <Lock size={12} /> Payments are secure • Simulated Environment
                    </p>
                </form>
            </div>
        </div>
    );
};

export default PaymentForm;
