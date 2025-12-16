const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ParkingLot = require('../src/models/ParkingLot');
const User = require('../src/models/User');

// Load env vars
dotenv.config({ path: './backend/.env' });
// If running from root, path might be ./backend/.env. Adjust if needed.
// Try to accommodate structure: root/backend/.env

const seedData = async () => {
    try {
        // Connect to DB
        // Assuming MONGO_URI is in process.env. If not, we might need to hardcode or ensure .env is loaded correctly.
        // For safety, let's try to load from standard location
        if (!process.env.MONGO_URI) {
            const path = require('path');
            dotenv.config({ path: path.join(__dirname, '../.env') });
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Get a user to be the owner (admin or first user found)
        const owner = await User.findOne();
        if (!owner) {
            console.log('No user found to assign ownership. Please create a user first.');
            process.exit(1);
        }

        const realSpots = [
            {
                name: "Inorbit Mall Parking (Vashi)",
                address: "Palm Beach Rd, Seconds 30A, Vashi, Navi Mumbai, Maharashtra 400703",
                location: {
                    type: "Point",
                    coordinates: [73.0025, 19.0665], // Longitude, Latitude
                    lat: 19.0665,
                    lng: 73.0025
                },
                totalSlots: 50,
                pricePerHour: 120,
                ownerId: owner._id,
                image: "/parking_images/inorbit_mall.jpg"
            },
            {
                name: "Raghuleela Mall Parking (Vashi)",
                address: "Sector 30A, Vashi, Navi Mumbai, Maharashtra 400703",
                location: {
                    type: "Point",
                    coordinates: [72.9972, 19.0645],
                    lat: 19.0645,
                    lng: 72.9972
                },
                totalSlots: 40,
                pricePerHour: 100,
                ownerId: owner._id,
                image: "/parking_images/raghuleela_mall.jpg"
            },
            {
                name: "Seawoods Grand Central (Nerul)",
                address: "Sector 40, Nerul Node, Seawoods, Navi Mumbai, Maharashtra 400706",
                location: {
                    type: "Point",
                    coordinates: [73.0185, 19.0210],
                    lat: 19.0210,
                    lng: 73.0185
                },
                totalSlots: 100,
                pricePerHour: 80,
                ownerId: owner._id,
                image: "/parking_images/seawoods_mall.jpg"
            },
            {
                name: "Nerul Railway Station Parking",
                address: "Nerul East, Sector 20, Nerul, Navi Mumbai",
                location: {
                    type: "Point",
                    coordinates: [73.0150, 19.0330],
                    lat: 19.0330,
                    lng: 73.0150
                },
                totalSlots: 30,
                pricePerHour: 40,
                ownerId: owner._id,
                image: "/parking_images/nerul_station.jpg"
            },
            {
                name: "CBD Belapur Tech Park",
                address: "Sector 11, CBD Belapur, Navi Mumbai",
                location: {
                    type: "Point",
                    coordinates: [73.0350, 19.0150],
                    lat: 19.0150,
                    lng: 73.0350
                },
                totalSlots: 60,
                pricePerHour: 50,
                ownerId: owner._id,
                image: "/parking_images/cbd_belapur.jpg"
            }
        ];

        console.log('Inserting spots...');
        await ParkingLot.insertMany(realSpots);
        console.log('Real parking spots added!');
        process.exit();

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
