import { useState } from 'react';
import { API_BASE_URL } from '../../config';
import './index.css';

const MyBookings = () => {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 🎯 Ensure your backend route is exactly /bookings?email=
      const response = await fetch(`${API_BASE_URL}/bookings?email=${email}`);
      const data = await response.json();
      
      // Backend returns the array directly: res.status(200).json(bookings)
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
    setLoading(false);
  };

  return (
    <div className="bookings-container">
      <div className="search-header">
        <h2>My Appointments</h2>
        <form onSubmit={fetchBookings} className="email-form">
          <input 
            type="email" 
            placeholder="Enter the email used for booking" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="fetch-btn">View History</button>
        </form>
      </div>

      {loading && <div className="loader">Searching records...</div>}

      <div className="bookings-list">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking._id} className="booking-item">
              <div className="booking-info">
                {/* 🎯 FIX: Data comes from the populated expertId object */}
                <h4>{booking.expertId?.name || 'Expert'}</h4>
                <p className="booking-meta">
                  {booking.expertId?.category} | {booking.date} at {booking.timeSlot}
                </p>
              </div>
              <span className={`status-badge ${booking.status?.toLowerCase()}`}>
                {booking.status}
              </span>
            </div>
          ))
        ) : (
          !loading && <p className="empty-state">No bookings found for this email.</p>
        )}
      </div>
    </div>
  );
};

export default MyBookings;