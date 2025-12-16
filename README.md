# 🚗 ParkEase - Smart Parking Management System

A full-stack MERN application that simplifies parking management in urban areas. ParkEase allows users to find, book, and manage parking slots in real-time, while providing administrators with comprehensive tools for managing parking lots, pricing, and analytics.


## 🎯 Overview

ParkEase addresses the difficulty of finding parking spaces in crowded urban areas. The system provides real-time parking availability, advance booking capabilities, simulated payment processing, and digital booking management. It features three distinct user roles: **Drivers**, **Parking Lot Owners**, and **Administrators**.

### Solution Architecture

- **Node.js**: Server-side runtime for handling HTTP requests, database connections, cron jobs, and Socket.io real-time communication
- **Express**: Web framework providing REST API routes, middleware (JWT auth, role checks, CORS, JSON parsing), and centralized error handling
- **React (SPA)**: Single-page application consuming REST API, managing client-side routing, displaying real-time parking availability, and enabling user interactions
- **REST + MongoDB (Mongoose)**: RESTful JSON API over HTTP with MongoDB storing users, parking lots, slots, bookings, payments, and reviews

## ✨ Features

### For Drivers
- 🔍 Search and filter parking lots by location, price, and availability
- 📍 Real-time availability updates via Socket.io
- 📅 Book parking slots in advance
- ⏰ Extend or cancel bookings
- 💳 Simulated payment processing
- ⭐ Leave reviews and ratings
- 📱 Responsive mobile-friendly interface
- 🗺️ Interactive map view of parking locations

### For Parking Lot Owners
- ➕ Create and manage parking lots
- 🎫 Configure slots (Normal/EV types)
- 💰 Set pricing per hour
- 📊 View booking statistics
- 📈 Monitor occupancy rates
- - 🎯 Peak hours analysis
- 🔄 Toggle lot status (Active/Inactive)
- 🗄️ Archive parking lots


## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose ODM)
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **node-cron** - Scheduled tasks (auto-release expired bookings)
- **dotenv** - Environment variable management

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.io-client** - Real-time updates
- **Tailwind CSS** - Styling
- **GSAP** - Animations
- **Lucide React** - Icons
- **React Leaflet** - Map integration
- **html2canvas** - Ticket generation

## 📁 Project Structure

```
CFA_Project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/           # Business logic
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── bookingController.js
│   │   │   ├── parkingController.js
│   │   │   ├── paymentController.js
│   │   │   ├── reviewController.js
│   │   │   └── slotController.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js  # JWT verification
│   │   │   ├── errorMiddleware.js # Error handling
│   │   │   └── roleMiddleware.js  # Role-based access
│   │   ├── models/                # Mongoose schemas
│   │   │   ├── ActivityLog.js
│   │   │   ├── Booking.js
│   │   │   ├── ParkingLot.js
│   │   │   ├── Payment.js
│   │   │   ├── Review.js
│   │   │   ├── Slot.js
│   │   │   └── User.js
│   │   ├── routes/                # API routes
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   ├── parkingRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   ├── reviewRoutes.js
│   │   │   └── slotRoutes.js
│   │   └── utils/
│   │       └── autoRelease.js     # Cron job for auto-releasing slots
│   ├── scripts/                   # Utility scripts
│   │   ├── downloadImages.js      # Download parking images
│   │   └── seedRealParking.js     # Seed database with parking lots
│   ├── server.js                  # Entry point
│   ├── makeAdmin.js              # Script to promote user to admin
│   ├── package.json
│   └── .env                       # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/            # Reusable components
    │   │   ├── ExtendBookingModal.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Loader.jsx
    │   │   ├── MapModal.jsx
    │   │   ├── MapSearch.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── PaymentForm.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── ReviewModal.jsx
    │   │   └── SlotCard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx    # Authentication context
    │   ├── pages/                 # Page components
    │   │   ├── AdminDashboard.jsx
    │   │   ├── Booking.jsx
    │   │   ├── BookingHistory.jsx
    │   │   ├── BookingTicket.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── NotFound.jsx
    │   │   ├── ParkingLots.jsx
    │   │   ├── Register.jsx
    │   │   ├── Slots.jsx
    │   │   └── UserDashboard.jsx
    │   ├── services/
    │   │   ├── api.js             # Axios configuration
    │   │   └── socket.js          # Socket.io client
    │   ├── animations/
    │   │   └── gsapAnimations.js  # GSAP animation helpers
    │   ├── App.jsx                # Main app component
    │   └── main.jsx               # Entry point
    ├── public/
    │   └── parking_images/       # Parking lot images
    ├── package.json
    └── vite.config.js
```

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (see Environment Variables section)
# Copy .env.example to .env and fill in your values

# Start the server
npm start
# Server runs on http://localhost:5000 (or PORT from .env)
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# App runs on http://localhost:5173
```

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ParkEaseDB?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET="your_super_secret_jwt_key_here"
PORT=5000
```

**Important Notes:**
- Replace `<username>` and `<password>` with your MongoDB Atlas credentials
- Remove any `< >` brackets from the connection string
- Use a strong, random string for `JWT_SECRET`
- Ensure MongoDB Atlas Network Access allows your IP (or `0.0.0.0/0` for testing)

### Frontend (Vercel Environment Variables)

For production deployment on Vercel:

```
VITE_API_BASE_URL=https://your-backend.onrender.com/api
VITE_SOCKET_URL=https://your-backend.onrender.com
```

## 📚 API Documentation

Base URL:
- **Development**: `http://localhost:5001/api`
- **Production**: `https://your-backend.onrender.com/api`

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "driver"  // Optional: "driver" | "owner" | "admin"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "driver"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /api/auth/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "vehicle": {
    "number": "ABC123",
    "type": "Car",
    "fuelType": "Petrol"
  }
}
```

### Parking Lots Endpoints

#### Get All Parking Lots (Public)
```http
GET /api/parking-lots
```

Returns only active parking lots with availability stats.

#### Get Single Parking Lot (Public)
```http
GET /api/parking-lots/:id
```

#### Create Parking Lot (Owner/Admin)
```http
POST /api/parking-lots
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Downtown Plaza",
  "address": "123 Main St, City",
  "location": {
    "lat": 19.0665,
    "lng": 73.0025,
    "coordinates": [73.0025, 19.0665]
  },
  "totalSlots": 50,
  "pricePerHour": 100,
  "image": "/parking_images/plaza.jpg"
}
```

#### Update Parking Lot (Owner/Admin)
```http
PUT /api/parking-lots/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "pricePerHour": 120,
  "totalSlots": 60
}
```

#### Delete Parking Lot (Owner/Admin)
```http
DELETE /api/parking-lots/:id
Authorization: Bearer <token>
```

#### Toggle Parking Lot Status (Owner/Admin)
```http
PUT /api/parking-lots/:id/toggle
Authorization: Bearer <token>
```

#### Archive Parking Lot (Admin)
```http
PUT /api/parking-lots/:id/archive
Authorization: Bearer <token>
```

### Slots Endpoints

#### Get Slots by Parking Lot
```http
GET /api/slots?lotId=<parking_lot_id>
```

#### Create Slot (Owner/Admin)
```http
POST /api/slots
Authorization: Bearer <token>
Content-Type: application/json

{
  "lotId": "...",
  "slotNumber": "A1",
  "type": "normal"  // "normal" | "EV"
}
```

#### Update Slot Status (Owner/Admin)
```http
PUT /api/slots/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "isAvailable": false,
  "type": "EV"
}
```

### Booking Endpoints

#### Create Booking (Driver)
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "lotId": "...",
  "slotId": "...",
  "startTime": "2025-12-17T10:00:00Z",
  "endTime": "2025-12-17T12:00:00Z",
  "vehicleDetails": {
    "number": "ABC123",
    "type": "Car"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "user": "...",
    "parkingLot": {...},
    "slot": {...},
    "startTime": "2025-12-17T10:00:00Z",
    "endTime": "2025-12-17T12:00:00Z",
    "totalPrice": 200,
    "status": "active"
  }
}
```

#### Extend Booking (Driver)
```http
PUT /api/bookings/:id/extend
Authorization: Bearer <token>
Content-Type: application/json

{
  "newEndTime": "2025-12-17T14:00:00Z"
}
```

#### End Booking (Driver)
```http
PUT /api/bookings/:id/end
Authorization: Bearer <token>
```

#### Get User Bookings (Driver)
```http
GET /api/bookings/my
Authorization: Bearer <token>
```

### Payment Endpoints

#### Create Payment (Driver)
```http
POST /api/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": "...",
  "amount": 200,
  "method": "card"  // "card" | "upi" | "wallet"
}
```

### Review Endpoints

#### Create Review (Driver)
```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "lotId": "...",
  "rating": 5,
  "comment": "Great parking facility!"
}
```

#### Get Reviews
```http
GET /api/reviews?lotId=<parking_lot_id>
```

### Admin Endpoints

All admin routes require `Authorization: Bearer <token>` and user role must be `admin` or `owner`.

#### Get Dashboard Stats
```http
GET /api/admin/stats
```

Returns aggregated statistics: total users, bookings, revenue, occupancy, etc.

#### Get System Alerts
```http
GET /api/admin/alerts
```

Returns system alerts (low availability, bad ratings, etc.)

#### Get Activity Logs
```http
GET /api/admin/logs?page=1&limit=20
```

Returns paginated activity logs.

#### Get All Reviews (Admin)
```http
GET /api/admin/reviews
```

#### Get All Parking Lots (Admin)
```http
GET /api/admin/parking-lots
```

Returns all lots including inactive/archived.

#### Get Peak Hours Analytics
```http
GET /api/admin/analytics/peak-hours
```

## 🎨 Frontend Documentation

### Routing

**Public Routes:**
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/parking-lots` - Browse parking lots

**Protected Routes (Driver):**
- `/slots/:id` - View slots for a parking lot
- `/booking/:slotId` - Create booking
- `/my-bookings` - Booking history
- `/ticket/:bookingId` - View booking ticket
- `/user-dashboard` - User dashboard

**Protected Routes (Admin/Owner):**
- `/admin-dashboard` - Admin dashboard

### Key Components

#### API Service (`src/services/api.js`)
- Automatically detects production vs development
- Uses Render URL in production, localhost in development
- Automatically attaches JWT token to requests

#### Socket Service (`src/services/socket.js`)
- Real-time updates for slot availability
- Automatically connects to correct server (Render/localhost)

#### ProtectedRoute (`src/components/ProtectedRoute.jsx`)
- Wraps protected routes
- Redirects to login if not authenticated
- Optional role-based access control

### State Management

- **AuthContext**: Global authentication state
- **Local Storage**: Stores JWT token
- **React Hooks**: useState, useEffect for component state

## 🚢 Deployment

### Backend (Render)

1. **Create Web Service** on Render
2. **Connect GitHub Repository**
3. **Configure:**
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `MONGO_URI` - Your MongoDB Atlas connection string
     - `JWT_SECRET` - Your JWT secret key
     - `PORT` - (Optional, Render provides this)

4. **MongoDB Atlas Setup:**
   - Go to **Network Access** → Add IP Address
   - For testing: Allow `0.0.0.0/0` (all IPs)
   - Ensure database user has correct permissions

### Frontend (Vercel)

1. **Import Project** from GitHub
2. **Configure:**
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_BASE_URL` - Your Render backend URL + `/api`
     - `VITE_SOCKET_URL` - Your Render backend URL

3. **Deploy**

### MongoDB Atlas

1. Create a free cluster
2. Create database user
3. Whitelist IP addresses (or `0.0.0.0/0` for testing)
4. Get connection string from **Connect → Drivers**

## 💻 Usage

### Seeding Database

To populate the database with sample parking lots:

```bash
cd backend
node scripts/seedRealParking.js
```

To download parking images:

```bash
cd backend
node scripts/downloadImages.js
```

### Making a User Admin

```bash
cd backend
# Edit makeAdmin.js to set the email
node makeAdmin.js
```

### Testing API Endpoints

Use tools like:
- Postman
- Thunder Client (VS Code extension)
- curl
- Browser DevTools Network tab

Example with curl:

```bash
# Register
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get parking lots (with token)
curl -X GET http://localhost:5001/api/parking-lots \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔧 Troubleshooting

### "bad auth : authentication failed"
- Check MongoDB Atlas username/password
- Ensure no `< >` brackets in connection string
- Verify database user exists and has correct permissions

### "ERR_CONNECTION_REFUSED" in Production
- Verify environment variables are set in Vercel
- Check that backend is deployed and running on Render
- Ensure frontend code uses production URLs (not localhost)

### "Root directory does not exist" on Render
- Set Root Directory to `backend` (not `/backend` or `./backend`)
- Ensure `backend` folder exists in your GitHub repo

### MongoDB Connection Timeout
- Check Network Access in MongoDB Atlas
- Whitelist Render's IP or use `0.0.0.0/0` for testing
- Verify connection string format

## 📝 License

ISC


## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built by Aavani Rajesh Perumbessi 
with ❤️ using the MERN stack**
