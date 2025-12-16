const express = require('express');
const {
    createBooking,
    getMyBookings,
    extendBooking,
    endBooking
} = require('../controllers/bookingController');

const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(protect); // All booking routes are protected

router.post('/', authorize('driver'), createBooking);
router.get('/my', getMyBookings);
router.put('/extend/:id', authorize('driver'), extendBooking);

router.route('/end/:id').put(protect, authorize('driver', 'admin'), endBooking);

module.exports = router;
