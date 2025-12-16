const express = require('express');
const {
    getParkingLots,
    getParkingLot,
    createParkingLot,
    updateParkingLot,
    deleteParkingLot,
    toggleStatus,
    archiveLot
} = require('../controllers/parkingController');

const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.route('/')
    .get(getParkingLots)
    .post(protect, authorize('owner', 'admin'), createParkingLot);

router.route('/:id')
    .get(getParkingLot)
    .put(protect, authorize('owner', 'admin'), updateParkingLot)
    .delete(protect, authorize('owner', 'admin'), deleteParkingLot);

router.route('/:id/toggle').put(protect, authorize('owner', 'admin'), toggleStatus);
router.route('/:id/archive').put(protect, authorize('owner', 'admin'), archiveLot);

module.exports = router;
