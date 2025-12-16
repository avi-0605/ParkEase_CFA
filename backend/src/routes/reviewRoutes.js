const express = require('express');
const { createReview, getReviews } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/', protect, authorize('driver'), createReview);
router.get('/:lotId', getReviews);

module.exports = router;
