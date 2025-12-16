const Slot = require('../models/Slot');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get slots for a specific parking lot
// @route   GET /api/slots/:lotId
// @access  Private (or Public depending on requirements, usually public for searching)
exports.getSlotsByLot = async (req, res, next) => {
    try {
        const slots = await Slot.find({ lotId: req.params.lotId });

        res.status(200).json({
            success: true,
            count: slots.length,
            data: slots
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update slot status
// @route   PUT /api/slots/:slotId/status
// @access  Private (Owner/Admin or System)
exports.updateSlotStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        let slot = await Slot.findById(req.params.slotId);

        if (!slot) {
            return res.status(404).json({ success: false, error: 'Slot not found' });
        }

        slot.status = status;
        await slot.save();

        // Notify via Socket.io
        // Assuming req.io is attached in server.js
        if (req.io) {
            req.io.emit('slot_update', {
                slotId: slot._id,
                status: slot.status,
                lotId: slot.lotId
            });
        }

        res.status(200).json({
            success: true,
            data: slot
        });
    } catch (err) {
        next(err);
    }
    // @desc    Update slot status (Admin Manual Override)
    // @route   PUT /api/slots/:id/status
    // @access  Private (Admin)
    exports.updateSlotStatus = async (req, res, next) => {
        try {
            const { status } = req.body; // available, occupied, maintenance
            const slot = await Slot.findById(req.params.id);

            if (!slot) {
                return res.status(404).json({ success: false, error: 'Slot not found' });
            }

            const oldStatus = slot.status;
            slot.status = status;
            await slot.save();

            // Log if status changed
            if (oldStatus !== status) {
                await ActivityLog.create({
                    adminId: req.user.id,
                    action: 'UPDATE_SLOT',
                    details: `Slot ${slot.slotNumber} changed from ${oldStatus} to ${status}`
                });

                // Emit socket event for real-time update
                if (req.io) {
                    req.io.emit('slot_update', { slotId: slot._id, status: status, lotId: slot.lotId });
                }
            }

            res.status(200).json({
                success: true,
                data: slot
            });
        } catch (err) {
            next(err);
        }
    };
}
