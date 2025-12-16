const express = require('express');
const {
    getSlotsByLot,
    updateSlotStatus
} = require('../controllers/slotController');

const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

// GET /api/slots/:lotId
router.get('/:lotId', protect, getSlotsByLot);

// PUT /api/slots/:slotId/status
router.put('/:slotId/status', protect, authorize('owner', 'admin'), updateSlotStatus);

module.exports = router;
