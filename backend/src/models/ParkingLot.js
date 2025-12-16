const mongoose = require('mongoose');

const parkingLotSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters'],
    },
    image: {
        type: String,
        default: null
    },
    address: {
        type: String,
        required: [true, 'Please add an address'],
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number], // [lng, lat]
            index: '2dsphere',
        },
        // Adding separate fields for simpler manual entry if needed, but GeoJSON is standard
        lat: Number,
        lng: Number
    },
    totalSlots: {
        type: Number,
        required: true,
    },
    pricePerHour: {
        type: Number,
        required: true,
    },
    ownerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('ParkingLot', parkingLotSchema);
