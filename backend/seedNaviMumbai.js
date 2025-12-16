const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ParkingLot = require('./src/models/ParkingLot');
const Slot = require('./src/models/Slot');
const User = require('./src/models/User');

const connectDB = require('./src/config/db');

// Explicitly load .env
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

connectDB();

const lots = [
    {
        name: "Inorbit Mall Parking (Vashi)",
        address: "Palm Beach Rd, Sector 30A, Vashi, Navi Mumbai",
        lat: 19.0660,
        lng: 73.0020,
        totalSlots: 50,
        pricePerHour: 120, // Prime location
    },
    {
        name: "Raghuleela Mall Parking (Vashi)",
        address: "Sector 30A, Vashi, Navi Mumbai",
        lat: 19.0645,
        lng: 72.9985,
        totalSlots: 40,
        pricePerHour: 100,
    },
    {
        name: "Seawoods Grand Central (Nerul)",
        address: "Sector 40, Nerul, Navi Mumbai",
        lat: 19.0195,
        lng: 73.0175,
        totalSlots: 100,
        pricePerHour: 80,
    },
    {
        name: "Nerul Railway Station Parking",
        address: "Nerul East, Sector 20, Nerul, Navi Mumbai",
        lat: 19.0330,
        lng: 73.0297,
        totalSlots: 30,
        pricePerHour: 40, // Public transport hub, cheaper
    },
    {
        name: "CBD Belapur Tech Park",
        address: "Sector 11, CBD Belapur, Navi Mumbai",
        lat: 19.0188,
        lng: 73.0388,
        totalSlots: 60,
        pricePerHour: 50,
    },
    {
        name: "Kharghar Central Park",
        address: "Sector 23, Kharghar, Navi Mumbai",
        lat: 19.0380,
        lng: 73.0700,
        totalSlots: 80,
        pricePerHour: 30, // Farther out
    },
    {
        name: "Little World Mall (Kharghar)",
        address: "Pravesh Marg, Sector 2, Kharghar, Navi Mumbai",
        lat: 19.0237,
        lng: 73.0658,
        totalSlots: 45,
        pricePerHour: 50,
    },
    {
        name: "Mindspace Airoli",
        address: "Thane - Belapur Rd, Airoli, Navi Mumbai",
        lat: 19.1590,
        lng: 72.9986,
        totalSlots: 150,
        pricePerHour: 60,
    },
    {
        name: "IKEA Navi Mumbai",
        address: "Turbhe, Navi Mumbai",
        lat: 19.0886,
        lng: 73.0295,
        totalSlots: 200,
        pricePerHour: 50,
    },
    {
        name: "DY Patil Stadium",
        address: "Sector 7, Nerul, Navi Mumbai",
        lat: 19.0438,
        lng: 73.0229,
        totalSlots: 300,
        pricePerHour: 100,
    },
    {
        name: "Vashi Railway Station",
        address: "Sector 30, Vashi, Navi Mumbai",
        lat: 19.0645,
        lng: 72.9975,
        totalSlots: 100,
        pricePerHour: 40,
    },
    {
        name: "Kharghar Valley Golf Course",
        address: "Sector 22, Kharghar",
        lat: 19.0450,
        lng: 73.0600,
        totalSlots: 60,
        pricePerHour: 80,
    },
    {
        name: "Reliance Corporate Park",
        address: "Ghansoli, Navi Mumbai",
        lat: 19.1245,
        lng: 73.0110,
        totalSlots: 120,
        pricePerHour: 40,
    }
];

const seedLots = async () => {
    try {
        // 1. Get an owner user (or admin)
        let owner = await User.findOne({ role: 'owner' });
        if (!owner) {
            owner = await User.findOne({ role: 'admin' });
        }

        if (!owner) {
            console.log('No owner/admin found. Creating one...');
            owner = await User.create({
                name: "System Admin",
                email: "admin@parkease.com",
                password: "password123",
                role: "admin"
            });
        }

        console.log(`Using owner: ${owner.email}`);

        // 2. Clear existing lots and slots
        await ParkingLot.deleteMany({});
        await Slot.deleteMany({});
        console.log('Cleared existing data...');

        // 3. Insert new lots
        for (const lotData of lots) {
            const lot = await ParkingLot.create({
                name: lotData.name,
                address: lotData.address,
                totalSlots: lotData.totalSlots,
                pricePerHour: lotData.pricePerHour,
                ownerId: owner._id,
                location: {
                    type: 'Point',
                    coordinates: [lotData.lng, lotData.lat], // GeoJSON is [lng, lat]
                    lat: lotData.lat,
                    lng: lotData.lng
                }
            });
            // Create slots for this lot
            const slots = [];
            for (let i = 1; i <= lotData.totalSlots; i++) {
                slots.push({
                    lotId: lot._id,
                    slotNumber: `${lot.name.substring(0, 3).toUpperCase()}-${i}`,
                    type: Math.random() > 0.8 ? 'ev' : 'normal', // 20% EV slots
                    status: Math.random() > 0.7 ? 'occupied' : 'available' // Random initial status
                });
            }
            await Slot.insertMany(slots);
            console.log(`Created ${lot.name} with ${slots.length} slots.`);
        }

        console.log('Seeding Complete!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedLots();
