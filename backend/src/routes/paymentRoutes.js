const express = require('express');
const { createPayment } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/', protect, authorize('driver'), createPayment);

module.exports = router;
