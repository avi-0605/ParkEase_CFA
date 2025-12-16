const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Booking',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['success', 'failed'],
        default: 'success', // Simulating success
    },
    paymentMode: {
        type: String,
        default: 'simulated',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Payment', paymentSchema);
