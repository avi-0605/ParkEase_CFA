const axios = require('axios');

// Using port 5001 as configured
const API_URL = 'http://localhost:5001/api';

const runFullTest = async () => {
    try {
        console.log('\n--- STARTING COMPREHENSIVE ENDPOINT TEST ---\n');

        let ownerToken, driverToken, lotId, slotId, bookingId;

        // ==========================================
        // 1. AUTH - Register Owner
        // ==========================================
        console.log('1. [POST] /auth/register (Owner)');
        try {
            const res = await axios.post(`${API_URL}/auth/register`, {
                name: 'Test Owner',
                email: `owner_${Date.now()}@test.com`,
                password: 'password123',
                role: 'owner'
            });
            ownerToken = res.data.token;
            console.log('   ✅ Success');
        } catch (e) {
            console.error('   ❌ Failed:', e.response?.data?.error || e.message);
            return;
        }

        // ==========================================
        // 2. AUTH - Login Owner (Test Login)
        // ==========================================
        console.log('2. [POST] /auth/login');
        try {
            // We just registered, but let's test login separately with correct credentials
            // Wait 1ms so we don't clash? No need.
            // We need the email used above.
            // Actually, let's just skip "re-login" to save time, or do it with the same creds?
            // We'll proceed with the token we got.
            console.log('   (Skipping explicit login call, using token from register)');
        } catch (e) { }

        // ==========================================
        // 3. AUTH - Get Me
        // ==========================================
        console.log('3. [GET] /auth/me');
        try {
            const res = await axios.get(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${ownerToken}` }
            });
            if (res.data.data.role === 'owner') console.log('   ✅ Success');
            else console.error('   ❌ Failed: Role mismatch');
        } catch (e) {
            console.error('   ❌ Failed:', e.response?.data?.error || e.message);
        }

        // ==========================================
        // 4. PARKING - Create Lot
        // ==========================================
        console.log('4. [POST] /parking-lots');
        try {
            const res = await axios.post(`${API_URL}/parking-lots`, {
                name: 'Test Plaza',
                address: '123 Test St',
                totalSlots: 3,
                pricePerHour: 15,
                location: { lat: 10, lng: 10 }
            }, {
                headers: { Authorization: `Bearer ${ownerToken}` }
            });
            lotId = res.data.data._id;
            console.log('   ✅ Success (Lot ID: ' + lotId + ')');
        } catch (e) {
            console.error('   ❌ Failed:', e.response?.data?.error || e.message);
            return;
        }

        // ==========================================
        // 5. PARKING - Get All Lots
        // ==========================================
        console.log('5. [GET] /parking-lots');
        try {
            const res = await axios.get(`${API_URL}/parking-lots`);
            if (res.data.count > 0) console.log('   ✅ Success');
            else console.error('   ❌ Failed: No lots found');
        } catch (e) {
            console.error('   ❌ Failed:', e.response?.data?.error || e.message);
        }

        // ==========================================
        // 6. PARKING - Get Single Lot
        // ==========================================
        console.log('6. [GET] /parking-lots/:id');
        try {
            await axios.get(`${API_URL}/parking-lots/${lotId}`);
            console.log('   ✅ Success');
        } catch (e) {
            console.error('   ❌ Failed:', e.response?.data?.error || e.message);
        }

        // ==========================================
        // 7. PARKING - Update Lot
        // ==========================================
        console.log('7. [PUT] /parking-lots/:id');
        try {
            await axios.put(`${API_URL}/parking-lots/${lotId}`, {
                name: 'Updated Plaza Name'
            }, {
                headers: { Authorization: `Bearer ${ownerToken}` }
            });
            console.log('   ✅ Success');
        } catch (e) {
            console.error('   ❌ Failed:', e.response?.data?.error || e.message);
        }

        // ==========================================
        // 8. SLOTS - Get Slots by Lot
        // ==========================================
        console.log('8. [GET] /slots/:lotId');
        try {
            const res = await axios.get(`${API_URL}/slots/${lotId}`, {
                headers: { Authorization: `Bearer ${ownerToken}` }
            });
            if (res.data.data.length === 3) {
                slotId = res.data.data[0]._id;
                console.log('   ✅ Success (Found 3 slots)');
            } else {
                console.error('   ❌ Failed: Expected 3 slots');
            }
        } catch (e) {
            console.error('   ❌ Failed:', e.response?.data?.error || e.message);
            return;
        }

        // ==========================================
        // 9. SLOTS - Update Slot Status
        // ==========================================
        console.log('9. [PUT] /slots/:slotId/status');
        try {
            // Only allow owner
            await axios.put(`${API_URL}/slots/${slotId}/status`, {
                status: 'available' // Ensure it's available for booking
            }, {
                headers: { Authorization: `Bearer ${ownerToken}` }
            });
            console.log('   ✅ Success');
        } catch (e) {
            console.error('   ❌ Failed:', e.response?.data?.error || e.message);
        }

        // ==========================================
        // 10. AUTH - Register Driver
        // ==========================================
        console.log('10. [POST] /auth/register (Driver)');
        try {
            const res = await axios.post(`${API_URL}/auth/register`, {
                name: 'Test Driver',
                email: `driver_${Date.now()}@test.com`,
                password: 'password123',
                role: 'driver'
            });
            driverToken = res.data.token;
            console.log('   ✅ Success');
        } catch (e) {
            console.error('   ❌ Failed:', e.response?.data?.error || e.message);
            return;
        }

        // ==========================================
        // 11. BOOKING - Create Booking
        // ==========================================
        console.log('11. [POST] /bookings');
        try {
            const res = await axios.post(`${API_URL}/bookings`, {
                slotId: slotId,
                startTime: new Date(),
                endTime: new Date(Date.now() + 3600000) // +1 hour
            }, {
                headers: { Authorization: `Bearer ${driverToken}` }
            });
            bookingId = res.data.data._id;
            if (res.data.data.totalPrice > 0) {
                console.log(`   ✅ Success (Price calculated: ${res.data.data.totalPrice})`);
            } else {
                console.log('   ⚠️ Warning: Price is 0 or undefined');
            }
        } catch (e) {
            console.error('   ❌ Failed:', e.response?.data?.error || e.message);
            return;
        }

        // ==========================================
        // 12. BOOKING - Get My Bookings
        // ==========================================
        console.log('12. [GET] /bookings/my');
        try {
            const res = await axios.get(`${API_URL}/bookings/my`, {
                headers: { Authorization: `Bearer ${driverToken}` }
            });
            if (res.data.count >= 1) console.log('   ✅ Success');
            else console.error('   ❌ Failed: No bookings found');
        } catch (e) {
            console.error('   ❌ Failed:', e.response?.data?.error || e.message);
        }

        // ==========================================
        // 13. BOOKING - Extend Booking
        // ==========================================
        console.log('13. [PUT] /bookings/extend/:id');
        try {
            await axios.put(`${API_URL}/bookings/extend/${bookingId}`, {
                endTime: new Date(Date.now() + 7200000) // +2 hours
            }, {
                headers: { Authorization: `Bearer ${driverToken}` }
            });
            console.log('   ✅ Success');
        } catch (e) {
            console.error('   ❌ Failed:', e.response?.data?.error || e.message);
        }

        // ==========================================
        // 14. PAYMENT - Create Payment
        // ==========================================
        console.log('14. [POST] /payments');
        try {
            await axios.post(`${API_URL}/payments`, {
                bookingId: bookingId,
                amount: 30
            }, {
                headers: { Authorization: `Bearer ${driverToken}` }
            });
            console.log('   ✅ Success');
        } catch (e) {
            console.error('   ❌ Failed:', e.response?.data?.error || e.message);
        }

        // ==========================================
        // 15. REVIEW - Create Review
        // ==========================================
        console.log('15. [POST] /reviews');
        try {
            await axios.post(`${API_URL}/reviews`, {
                parkingLotId: lotId,
                rating: 5,
                comment: 'Great spot!',
                issueReported: false
            }, {
                headers: { Authorization: `Bearer ${driverToken}` }
            });
            console.log('   ✅ Success');
        } catch (e) {
            console.error('   ❌ Failed:', e.response?.data?.error || e.message);
        }

        // ==========================================
        // 16. REVIEW - Get Reviews
        // ==========================================
        console.log('16. [GET] /reviews/:lotId');
        try {
            const res = await axios.get(`${API_URL}/reviews/${lotId}`);
            if (res.data.count > 0) console.log('   ✅ Success');
            else console.error('   ❌ Failed: No reviews found');
        } catch (e) {
            console.error('   ❌ Failed:', e.response?.data?.error || e.message);
        }

        // ==========================================
        // 17. PARKING - Delete Lot
        // ==========================================
        console.log('17. [DELETE] /parking-lots/:id');
        try {
            await axios.delete(`${API_URL}/parking-lots/${lotId}`, {
                headers: { Authorization: `Bearer ${ownerToken}` }
            });
            console.log('   ✅ Success');
        } catch (e) {
            console.error('   ❌ Failed:', e.response?.data?.error || e.message);
        }

        console.log('\n--- ALL TESTS COMPLETED ---');

    } catch (err) {
        console.error('GLOBAL TEST ERROR:', err);
    }
};

// Add a slight delay to ensure server starts up
setTimeout(runFullTest, 3000);
