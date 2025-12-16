const ParkingLot = require('../models/ParkingLot');
const Slot = require('../models/Slot');
const Review = require('../models/Review');
const ActivityLog = require('../models/ActivityLog');

// Helper to get parking lot stats (availability & rating & pricing)
const getLotStats = async (lotId, basePrice, totalSlots) => {
    const availableSlots = await Slot.countDocuments({ lotId: lotId, status: 'available' });
    const occupationRate = (totalSlots - availableSlots) / totalSlots;

    // Dynamic Pricing Logic: Surge if > 80% occupied
    const isSurge = occupationRate > 0.8;
    const priceMultiplier = isSurge ? 1.5 : 1;
    const currentPrice = basePrice * priceMultiplier;

    // Calculate Average Rating
    const result = await Review.aggregate([
        { $match: { parkingLotId: lotId } },
        {
            $group: {
                _id: '$parkingLotId',
                averageRating: { $avg: '$rating' },
                count: { $sum: 1 }
            }
        }
    ]);

    const stats = result[0] || { averageRating: 0, count: 0 };
    return {
        availableSlots,
        occupationRate,
        isSurge,
        priceMultiplier,
        currentPrice: Math.round(currentPrice), // Round to nearest integer
        averageRating: parseFloat(stats.averageRating.toFixed(1)),
        reviewCount: stats.count
    };
};

// @desc    Get all parking lots (Public - Active only)
// @route   GET /api/parking-lots
// @access  Public
exports.getParkingLots = async (req, res, next) => {
    try {
        const parkingLots = await ParkingLot.find({ isActive: true });

        const lotsWithStats = await Promise.all(parkingLots.map(async (lot) => {
            const stats = await getLotStats(lot._id, lot.pricePerHour, lot.totalSlots);
            return { ...lot.toObject(), ...stats };
        }));

        res.status(200).json({
            success: true,
            count: lotsWithStats.length,
            data: lotsWithStats
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get ALL parking lots (Admin - Include inactive/archived)
// @route   GET /api/admin/parking-lots
// @access  Private (Admin)
exports.getAllParkingLots = async (req, res, next) => {
    try {
        const parkingLots = await ParkingLot.find();

        const lotsWithStats = await Promise.all(parkingLots.map(async (lot) => {
            const stats = await getLotStats(lot._id, lot.pricePerHour, lot.totalSlots);
            return { ...lot.toObject(), ...stats };
        }));

        res.status(200).json({
            success: true,
            count: lotsWithStats.length,
            data: lotsWithStats
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single parking lot
// @route   GET /api/parking-lots/:id
// @access  Public
exports.getParkingLot = async (req, res, next) => {
    try {
        const parkingLot = await ParkingLot.findById(req.params.id);

        if (!parkingLot) {
            return res.status(404).json({ success: false, error: 'Parking lot not found' });
        }

        const stats = await getLotStats(parkingLot._id);

        res.status(200).json({
            success: true,
            data: { ...parkingLot.toObject(), ...stats }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new parking lot
// @route   POST /api/parking-lots
// @access  Private (Owner/Admin)
exports.createParkingLot = async (req, res, next) => {
    try {
        // Add owner to body
        req.body.ownerId = req.user.id;

        const parkingLot = await ParkingLot.create(req.body);

        // Auto-create slots based on totalSlots
        // This is a helper convenience.
        const slots = [];
        for (let i = 1; i <= parkingLot.totalSlots; i++) {
            slots.push({
                lotId: parkingLot._id,
                slotNumber: `A-${i}`, // Simple naming convention
                type: 'normal',
                status: 'available'
            });
        }
        await Slot.insertMany(slots);

        res.status(201).json({
            success: true,
            data: parkingLot,
            message: `Created parking lot with ${slots.length} slots`
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update parking lot
// @route   PUT /api/parking-lots/:id
// @access  Private (Owner/Admin)
exports.updateParkingLot = async (req, res, next) => {
    try {
        let parkingLot = await ParkingLot.findById(req.params.id);

        if (!parkingLot) {
            return res.status(404).json({ success: false, error: 'Parking lot not found' });
        }

        // Make sure user is parking lot owner or admin
        if (parkingLot.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized to update this parking lot' });
        }

        parkingLot = await ParkingLot.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: parkingLot
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete parking lot
// @route   DELETE /api/parking-lots/:id
// @access  Private (Owner/Admin)
exports.deleteParkingLot = async (req, res, next) => {
    try {
        const parkingLot = await ParkingLot.findById(req.params.id);

        if (!parkingLot) {
            return res.status(404).json({ success: false, error: 'Parking lot not found' });
        }

        // Make sure user is parking lot owner or admin
        if (parkingLot.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized to delete this parking lot' });
        }

        // Delete associated slots first
        await Slot.deleteMany({ lotId: req.params.id });

        // Delete lot
        await parkingLot.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Toggle parking lot status (Active/Inactive)
// @route   PUT /api/parking-lots/:id/toggle
// @access  Private (Admin)
exports.toggleStatus = async (req, res, next) => {
    try {
        const parkingLot = await ParkingLot.findById(req.params.id);

        if (!parkingLot) {
            return res.status(404).json({ success: false, error: 'Parking lot not found' });
        }

        parkingLot.isActive = !parkingLot.isActive;
        await parkingLot.save();

        // Log Activity
        await ActivityLog.create({
            adminId: req.user.id,
            action: 'TOGGLE_STATUS',
            details: `Parking Lot "${parkingLot.name}" is now ${parkingLot.isActive ? 'Active' : 'Inactive'}`
        });

        res.status(200).json({
            success: true,
            data: parkingLot
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Archive (Soft Delete) parking lot
// @route   PUT /api/parking-lots/:id/archive
// @access  Private (Admin)
exports.archiveLot = async (req, res, next) => {
    try {
        const parkingLot = await ParkingLot.findById(req.params.id);

        if (!parkingLot) {
            return res.status(404).json({ success: false, error: 'Parking lot not found' });
        }

        parkingLot.isArchived = true;
        parkingLot.isActive = false; // Also deactivates it
        await parkingLot.save();

        // Log Activity
        await ActivityLog.create({
            adminId: req.user.id,
            action: 'ARCHIVE_LOT',
            details: `Parking Lot "${parkingLot.name}" has been archived.`
        });

        res.status(200).json({
            success: true,
            data: parkingLot
        });
    } catch (err) {
        next(err);
    }
};