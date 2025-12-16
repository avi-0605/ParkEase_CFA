const Booking = require('../models/Booking');
const Slot = require('../models/Slot');

const checkAndReleaseSlots = async (io) => {
    try {
        const now = new Date();

        // Find active bookings that have expired
        const expiredBookings = await Booking.find({
            status: 'active',
            endTime: { $lt: now }
        });

        if (expiredBookings.length > 0) {
            console.log(`Found ${expiredBookings.length} expired bookings. Releasing slots...`);

            for (const booking of expiredBookings) {
                // Mark booking as completed
                booking.status = 'completed';
                await booking.save();

                // Update slot status to available
                const slot = await Slot.findById(booking.slotId);
                if (slot) {
                    slot.status = 'available';
                    await slot.save();

                    console.log(`Slot ${slot.slotNumber} released.`);

                    // Emit real-time update if io instance is provided
                    if (io) {
                        io.emit('slot_update', {
                            slotId: slot._id,
                            status: 'available',
                            lotId: slot.lotId
                        });
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error in auto-release job:', error);
    }
};

module.exports = checkAndReleaseSlots;



