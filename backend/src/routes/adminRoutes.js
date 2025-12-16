const express = require('express');
const { getPeakHours, getSystemAlerts, getDashboardStats, getActivityLogs, getReviews } = require('../controllers/adminController');
const { getAllParkingLots } = require('../controllers/parkingController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'owner'));

router.get('/analytics/peak-hours', getPeakHours);
router.get('/alerts', getSystemAlerts);
router.get('/stats', getDashboardStats);
router.get('/logs', getActivityLogs);
router.get('/reviews', getReviews);
router.get('/parking-lots', getAllParkingLots);

module.exports = router;
