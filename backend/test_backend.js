const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

const runTest = async () => {
    try {
        console.log('--- Starting System Test ---');

        // 1. Register Owner
        console.log('1. Registering Owner...');
        let ownerRes;
        try {
            ownerRes = await axios.post(`${API_URL}/auth/register`, {
                name: 'John Owner',
                email: `owner_${Date.now()}@test.com`,
                password: 'password123',
                role: 'owner'
            });
            console.log('   Owner Registered:', ownerRes.data.success);
        } catch (e) {
            console.log('   Owner Registration Failed:', e.message);
            if (e.response) console.log(e.response.data);
            return;
        }
        const ownerToken = ownerRes.data.token;

        // 2. Create Parking Lot
        console.log('2. Creating Parking Lot...');
        let lotRes;
        try {
            lotRes = await axios.post(`${API_URL}/parking-lots`, {
                name: 'Downtown Parking',
                address: '123 Main St',
                totalSlots: 5,
                pricePerHour: 10,
                location: {
                    lat: 40.7128,
                    lng: -74.0060
                }
            }, {
                headers: { Authorization: `Bearer ${ownerToken}` }
            });
            console.log('   Parking Lot Created:', lotRes.data.data.name);
            console.log('   Slots Created:', lotRes.data.message);
        } catch (e) {
            console.log('   Create Lot Failed:', e.message);
            if (e.response) console.log(e.response.data);
            return;
        }
        const lotId = lotRes.data.data._id;

        // 3. Get Slots
        console.log('3. Fetching Slots...');
        let slotsRes;
        try {
            slotsRes = await axios.get(`${API_URL}/slots/${lotId}`, {
                headers: { Authorization: `Bearer ${ownerToken}` }
            });
            console.log('   Slots Found:', slotsRes.data.count);
        } catch (e) {
            console.log('   Fetch Slots Failed:', e.message);
            return;
        }
        const firstSlot = slotsRes.data.data[0];

        // 4. Register Driver
        console.log('4. Registering Driver...');
        let driverRes;
        try {
            driverRes = await axios.post(`${API_URL}/auth/register`, {
                name: 'Jane Driver',
                email: `driver_${Date.now()}@test.com`,
                password: 'password123',
                role: 'driver'
            });
            console.log('   Driver Registered:', driverRes.data.success);
        } catch (e) {
            console.log('   Driver Registration Failed:', e.message);
            return;
        }
        const driverToken = driverRes.data.token;

        // 5. Book Slot
        console.log('5. Booking Slot...');
        let bookingRes;
        try {
            bookingRes = await axios.post(`${API_URL}/bookings`, {
                slotId: firstSlot._id,
                startTime: new Date(),
                endTime: new Date(Date.now() + 60 * 60 * 1000) // 1 hour later
            }, {
                headers: { Authorization: `Bearer ${driverToken}` }
            });
            console.log('   Booking Created:', bookingRes.data.success);
        } catch (e) {
            console.log('   Booking Failed:', e.message);
            if (e.response) console.log(e.response.data);
            return;
        }

        // 6. Verify Slot Status
        console.log('6. Verifying Slot Status...');
        const updatedSlots = await axios.get(`${API_URL}/slots/${lotId}`, {
            headers: { Authorization: `Bearer ${driverToken}` }
        });
        const updatedSlot = updatedSlots.data.data.find(s => s._id === firstSlot._id);
        console.log(`   Slot Status is now: ${updatedSlot.status} (Expected: reserved)`);

        console.log('--- Test Completed Successfully ---');

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
};

// Wait for server to start roughly
setTimeout(runTest, 3000);
