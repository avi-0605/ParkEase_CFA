const jwt = require('jsonwebtoken');
// const asyncHandler = require('express-async-handler');
// Wait, I should probably stick to standard try-catch in controllers or use a wrapper.
// Let's implement this referencing the User model.
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id);

            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, error: 'Not authorized, no token' });
    }
};

module.exports = { protect };
