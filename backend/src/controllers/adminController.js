const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const ParkingLot = require('../models/ParkingLot');
const ActivityLog = require('../models/ActivityLog');
const Review = require('../models/Review');

// @desc    Get Peak Parking Hours based on historical bookings
// @route   GET /api/admin/analytics/peak-hours
// @access  Private (Admin)
exports.getPeakHours = async (req, res, next) => {
    try {
        const peakHours = await Booking.aggregate([
            {
                $project: {
                    hour: { $hour: "$startTime" } // Extract hour from startTime
                }
            },
            {
                $group: {
                    _id: "$hour",
                    count: { $sum: 1 } // Count bookings per hour
                }
            },
            {
                $sort: { count: -1 } // Sort by busiest
            }
        ]);

        // Transform for frontend
        const result = peakHours.map(item => {
            let level = 'Low';
            // Simple logic for demo: determine level based on relative count
            // In a real app, this would be based on capacity
            if (item.count > 5) level = 'High';
            else if (item.count > 2) level = 'Medium';

            return {
                hourRange: `${item._id}:00 - ${item._id + 1}:00`,
                count: item.count,
                level
            };
        });

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get System Health Alerts (High Occupancy, Mismatches)
// @route   GET /api/admin/alerts
// @access  Private (Admin)
exports.getSystemAlerts = async (req, res, next) => {
    try {
        const alerts = [];

        // 1. Check for High Occupancy (> 85%)
        const lots = await ParkingLot.find({ isActive: true });

        for (const lot of lots) {
            const occupiedCount = await Slot.countDocuments({ lotId: lot._id, status: 'occupied' });
            const occupancyPercentage = (occupiedCount / lot.totalSlots) * 100;

            if (occupancyPercentage > 85) {
                alerts.push({
                    type: 'HIGH_OCCUPANCY',
                    message: `Parking Lot "${lot.name}" is at ${occupancyPercentage.toFixed(1)}% capacity.`,
                    severity: 'critical',
                    timestamp: new Date()
                });
            } else if (occupancyPercentage > 60) {
                alerts.push({
                    type: 'HIGH_OCCUPANCY',
                    message: `Parking Lot "${lot.name}" is getting full (${occupancyPercentage.toFixed(1)}%).`,
                    severity: 'warning',
                    timestamp: new Date()
                });
            }
        }

        // 2. Check for Slot Mismatches (Occupied but no active booking)
        const occupiedSlots = await Slot.find({ status: 'occupied' });
        const now = new Date();

        for (const slot of occupiedSlots) {
            // Find if there is an active booking for this slot
            const activeBooking = await Booking.findOne({
                slotId: slot._id,
                startTime: { $lte: now },
                endTime: { $gte: now },
                status: 'confirmed'
            });

            if (!activeBooking) {
                alerts.push({
                    type: 'SLOT_MISMATCH',
                    message: `Slot ${slot.slotNumber} is marked OCCUPIED but has no active booking. Possible unauthorized parking.`,
                    severity: 'warning',
                    timestamp: new Date()
                });
            }
        }

        // 3. System Status (Mock)
        alerts.push({
            type: 'SYSTEM',
            message: 'Backend services are running normally.',
            severity: 'info',
            timestamp: new Date()
        });

        res.status(200).json({
            success: true,
            count: alerts.length,
            data: alerts
        });

    } catch (err) {
        next(err);
    }
};

// @desc    Get Admin Dashboard Stats (Cards)
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalLots = await ParkingLot.countDocuments({ isArchived: false });
        const totalSlots = await Slot.countDocuments();
        const activeBookings = await Booking.countDocuments({ status: { $in: ['confirmed', 'active'] } });

        const revenue = 12500;

        res.status(200).json({
            success: true,
            data: {
                totalLots,
                totalSlots,
                activeBookings,
                revenue
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get Recent Activity Logs
// @route   GET /api/admin/logs
// @access  Private (Admin)
exports.getActivityLogs = async (req, res, next) => {
    try {
        const logs = await ActivityLog.find()
            .sort({ timestamp: -1 })
            .limit(10)
            .populate('adminId', 'name email');

        res.status(200).json({
            success: true,
            data: logs
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get Recent Reviews
// @route   GET /api/admin/reviews
// @access  Private (Admin)
exports.getReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'name')
            .populate('parkingLotId', 'name');

        res.status(200).json({
            success: true,
            data: reviews
        });
    } catch (err) {
        next(err);
    }
};
