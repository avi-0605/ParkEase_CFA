const Review = require('../models/Review');
const ParkingLot = require('../models/ParkingLot');

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
    try {
        const { parkingLotId, rating, comment, issueReported } = req.body;

        // Check if parking lot exists
        const parkingLot = await ParkingLot.findById(parkingLotId);
        if (!parkingLot) {
            return res.status(404).json({ success: false, error: 'Parking lot not found' });
        }

        const review = await Review.create({
            userId: req.user.id,
            parkingLotId,
            rating,
            comment,
            issueReported
        });

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get reviews for a parking lot
// @route   GET /api/reviews/:lotId
// @access  Public
exports.getReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ parkingLotId: req.params.lotId })
            .populate('userId', 'name');

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (err) {
        next(err);
    }
};
