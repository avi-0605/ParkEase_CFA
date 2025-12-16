const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middlewares/errorMiddleware');
const checkAndReleaseSlots = require('./src/utils/autoRelease');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Pass io to request
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/parking-lots', require('./src/routes/parkingRoutes'));
app.use('/api/slots', require('./src/routes/slotRoutes'));
app.use('/api/bookings', require('./src/routes/bookingRoutes'));
app.use('/api/payments', require('./src/routes/paymentRoutes'));
app.use('/api/reviews', require('./src/routes/reviewRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));

// Basic Route
app.get('/', (req, res) => {
    res.send('ParkEase API is running...');
});

// Error Handler
app.use(errorHandler);

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Cron Job: Run every minute to check for expired bookings
cron.schedule('* * * * *', () => {
    console.log('Running auto-release slot job...');
    checkAndReleaseSlots(io);
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
