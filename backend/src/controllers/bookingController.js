const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const ParkingLot = require('../models/ParkingLot');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Driver)
exports.createBooking = async (req, res, next) => {
    try {
        const { slotId, startTime, endTime } = req.body;

        // 1. Basic Validation
        const start = new Date(startTime);
        const end = new Date(endTime);
        const now = new Date();

        if (start >= end) {
            return res.status(400).json({ success: false, error: 'End time must be after start time' });
        }

        if (start < now) {
            // Allow small buffer (e.g., 2 mins) for network latency, else reject
            if ((now - start) > 2 * 60 * 1000) {
                return res.status(400).json({ success: false, error: 'Cannot book in the past' });
            }
        }

        // 7 Days Advance Limit
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 7);
        if (start > maxDate) {
            return res.status(400).json({ success: false, error: 'Advance booking allowed up to 7 days only' });
        }

        // 2. Check Slot Existence
        const slot = await Slot.findById(slotId);
        if (!slot) {
            return res.status(404).json({ success: false, error: 'Slot not found' });
        }

        const parkingLot = await ParkingLot.findById(slot.lotId);
        if (!parkingLot) {
            return res.status(404).json({ success: false, error: 'Parking Lot not found' });
        }

        // 3. OVERLAP CHECK
        // Check if there is any ACTIVE booking for this slot that overlaps with the requested time.
        // Overlap logic: (StartA < EndB) and (EndA > StartB)
        const overlappingBooking = await Booking.findOne({
            slotId: slotId,
            status: 'active',
            $or: [
                { startTime: { $lt: end }, endTime: { $gt: start } }
            ]
        });

        if (overlappingBooking) {
            return res.status(400).json({ success: false, error: 'Slot is already booked for this time period' });
        }

        // 4. Calculate Price
        const durationHours = (end - start) / (1000 * 60 * 60);
        const totalPrice = durationHours * parkingLot.pricePerHour;

        // 5. Create Booking
        const booking = await Booking.create({
            userId: req.user.id,
            slotId,
            startTime,
            endTime,
            totalPrice: parseFloat(totalPrice.toFixed(2)),
            status: 'active'
        });

        // 6. Update Slot Status if booking is CURRENT (starts now or very soon)
        // If booking is future, we don't mark slot as reserved yet. Cron job will handle it?
        // For simplicity in this exam: If it's valid, we mark reserved ONLY if it overlaps with NOW.
        // Actually, if I book for tomorrow, the slot should stay 'available' for now.
        // But if I book for NOW, it becomes 'reserved'.
        // 6. Update Slot Status if booking is CURRENT or STARTING SOON (next 30 mins)
        // This ensures the slot is "held" and the UI updates immediately for the user
        const holdTime = new Date(new Date().getTime() + 30 * 60000); // 30 mins from now

        if (start <= holdTime && end > new Date()) {
            slot.status = 'reserved';
            await slot.save();

            if (req.io) {
                // Real-time update
                req.io.emit('slot_update', {
                    slotId: slot._id,
                    status: 'reserved',
                    lotId: slot.lotId
                });

                // Notify Admin
                req.io.emit('new_booking', {
                    _id: booking._id,
                    user: req.user.name,
                    lot: parkingLot.name,
                    slot: slot.slotNumber,
                    startTime: booking.startTime,
                    totalPrice: booking.totalPrice
                });
            }
        }

        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get my bookings
// @route   GET /api/bookings/my
// @access  Private
exports.getMyBookings = async (req, res, next) => {
    try {
        let bookings = await Booking.find({ userId: req.user.id })
            .sort({ createdAt: -1 }) // Sort by newest first
            .populate('slotId')
            .populate({
                path: 'slotId',
                populate: { path: 'lotId', model: 'ParkingLot' }
            });

        // Auto-update status for expired bookings
        const now = new Date();
        const updates = bookings.map(async (booking) => {
            if (booking.status === 'active' && new Date(booking.endTime) < now) {
                booking.status = 'completed';
                await booking.save();
            }
            return booking;
        });

        bookings = await Promise.all(updates);

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Extend booking
// @route   PUT /api/bookings/extend/:id
// @access  Private
exports.extendBooking = async (req, res, next) => {
    try {
        const { endTime } = req.body;
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        // Check ownership
        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized to extend this booking' });
        }

        if (booking.status !== 'active') {
            return res.status(400).json({ success: false, error: 'Cannot extend inactive booking' });
        }

        const start = new Date(booking.startTime);
        const currentEnd = new Date(booking.endTime);
        const newEnd = new Date(endTime);

        if (newEnd <= currentEnd) {
            return res.status(400).json({ success: false, error: 'New end time must be after current end time' });
        }

        // Overlap Check for Extension
        // We must check if extending this booking will overlap with *another* booking.
        // Exclude current booking from check obviously by logic (userId matches, but ID exclusion is safer)
        const overlappingBooking = await Booking.findOne({
            slotId: booking.slotId,
            _id: { $ne: booking._id }, // Exclude self
            status: 'active',
            $or: [
                { startTime: { $lt: newEnd }, endTime: { $gt: start } } // Basically check if new range overlaps anyone else
                // Actually, since start is fixed, we just check if anyone overlaps with the *newly added* period or the whole period?
                // Simpler: Check if anyone overlaps with [start, newEnd].
            ]
        });

        if (overlappingBooking) {
            return res.status(400).json({ success: false, error: 'Cannot extend: Slot is reserved by another booking right after yours.' });
        }

        const slot = await Slot.findById(booking.slotId);
        const parkingLot = await ParkingLot.findById(slot.lotId);

        const durationHours = (newEnd - start) / (1000 * 60 * 60);
        const newTotalPrice = durationHours * parkingLot.pricePerHour;

        booking.endTime = endTime;
        booking.totalPrice = parseFloat(newTotalPrice.toFixed(2));
        await booking.save();

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (err) {
        next(err);
    }
};

// @desc    End booking early (Exit)
// @route   PUT /api/bookings/end/:id
// @access  Private
exports.endBooking = async (req, res, next) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        // Check ownership
        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        if (booking.status !== 'active') {
            return res.status(400).json({ success: false, error: 'Booking is not active' });
        }

        // Update booking
        booking.status = 'completed';
        // booking.endTime = Date.now(); 
        await booking.save();

        // Free up slot
        const slot = await Slot.findById(booking.slotId);
        if (slot) {
            slot.status = 'available';
            await slot.save();

            // Real-time update to Admin Dashboard
            if (req.io) {
                req.io.emit('slot_update', {
                    slotId: slot._id,
                    status: 'available',
                    lotId: slot.lotId
                });
            }
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (err) {
        next(err);
    }
};
