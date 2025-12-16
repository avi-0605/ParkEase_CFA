const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// @desc    Process payment
// @route   POST /api/payments
// @access  Private
exports.createPayment = async (req, res, next) => {
    try {
        const { bookingId, amount } = req.body;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        // Verify booking belongs to user
        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        // Simulate payment success
        const payment = await Payment.create({
            bookingId,
            amount,
            paymentStatus: 'success',
            paymentMode: 'simulated'
        });

        res.status(201).json({
            success: true,
            data: payment
        });
    } catch (err) {
        next(err);
    }
};
