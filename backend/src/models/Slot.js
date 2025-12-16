const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    lotId: {
        type: mongoose.Schema.ObjectId,
        ref: 'ParkingLot',
        required: true,
    },
    slotNumber: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['normal', 'ev'],
        default: 'normal',
    },
    status: {
        type: String,
        enum: ['available', 'reserved', 'occupied'],
        default: 'available',
    }
});

// Compound index to ensure slotNumber is unique per lot
slotSchema.index({ lotId: 1, slotNumber: 1 }, { unique: true });

module.exports = mongoose.model('Slot', slotSchema);
