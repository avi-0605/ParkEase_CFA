const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    parkingLotId: {
        type: mongoose.Schema.ObjectId,
        ref: 'ParkingLot',
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please add a rating between 1 and 5'],
    },
    comment: {
        type: String,
        required: [true, 'Please add a comment'],
    },
    issueReported: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Review', reviewSchema);
