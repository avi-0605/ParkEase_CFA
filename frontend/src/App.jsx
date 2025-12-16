import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ParkingLots from './pages/ParkingLots';
import Slots from './pages/Slots';
import Booking from './pages/Booking';
import BookingHistory from './pages/BookingHistory';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import BookingTicket from './pages/BookingTicket';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900 bg-gray-50">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/parking-lots" element={<ParkingLots />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/slots/:id" element={<Slots />} />
          </Route>

          <Route element={<ProtectedRoute roles={['driver']} />}>
            <Route path="/booking/:slotId" element={<Booking />} />
            <Route path="/my-bookings" element={<BookingHistory />} />
          </Route>

          <Route element={<ProtectedRoute roles={['admin', 'owner']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRoute roles={['driver']} />}>
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/ticket/:bookingId" element={<BookingTicket />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;



