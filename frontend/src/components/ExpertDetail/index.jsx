import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../../config';
import './index.css';

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', notes: '' });
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/experts/${id}`);
        if (!res.ok) throw new Error("Expert not found");
        const data = await res.json();
        setExpert(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpert();

    const socket = io(API_BASE_URL);
    socket.on('slotBooked', (data) => {
      if (data.expertId === id) {
        setExpert(prev => {
          if (!prev) return null;
          return {
            ...prev,
            availableSlots: prev.availableSlots?.filter(s => !(s.date === data.date && s.time === data.time))
          };
        });
        // Deselect if the booked slot was the one selected
        setSelectedSlot(prev => (prev?.date === data.date && prev?.time === data.time) ? null : prev);
      }
    });

    return () => socket.disconnect();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return alert("Please select a time slot!");

    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            expertId: id, 
            ...formData, 
            date: selectedSlot.date, 
            timeSlot: selectedSlot.time 
        })
      });

      if (response.ok) {
        setStatusMsg({ type: 'success', text: "✅ Booking Successful! Redirecting..." });
        setTimeout(() => navigate('/bookings'), 2000);
      } else {
        const result = await response.json();
        setStatusMsg({ type: 'error', text: result.message || "Failed to book." });
      }
    } catch (error) {
      setStatusMsg({ type: 'error', text: "Network error. Try again." });
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!expert) return <div className="error">Expert not found.</div>;

  return (
    <div className="expert-detail-page">
      <div className="detail-card">
        <h1>{expert.name}</h1>
        <p className="badge">{expert.category}</p>
        
        <div className="slots-section">
          <h3>Available Slots</h3>
          <div className="slots-grid">
            {expert.availableSlots?.map((slot, index) => (
              <button 
                key={index}
                type="button"
                /* 🎯 FIX: Robust selection comparison */
                className={`slot-pill ${selectedSlot?.time === slot.time && selectedSlot?.date === slot.date ? 'active' : ''}`}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot.date} @ {slot.time}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="booking-form-container">
        <form onSubmit={handleBooking} className="booking-form">
          <input type="text" placeholder="Full Name" required onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="email" placeholder="Email" required onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="tel" placeholder="Phone" required onChange={e => setFormData({...formData, phone: e.target.value})} />
          <textarea placeholder="Notes" onChange={e => setFormData({...formData, notes: e.target.value})} />
          
          <button type="submit" className="confirm-btn" disabled={!selectedSlot}>
            {selectedSlot ? `Confirm for ${selectedSlot.time}` : 'Select a Slot to Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpertDetail;