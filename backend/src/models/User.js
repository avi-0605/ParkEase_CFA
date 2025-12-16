const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false, // Don't return password by default
    },
    role: {
        type: String,
        enum: ['driver', 'owner', 'admin'],
        default: 'driver',
    },
    vehicle: {
        number: { type: String, trim: true },
        type: { type: String, enum: ['Car', 'Bike', 'EV', 'Truck'], default: 'Car' },
        fuelType: {
            type: String,
            enum: ['Petrol', 'Diesel', 'EV'],
            default: 'Petrol'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Encrypt password using bcrypt
// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
