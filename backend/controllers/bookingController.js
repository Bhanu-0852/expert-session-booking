const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
    try {
        const { expertId, date, timeSlot } = req.body;

        const existing = await Booking.findOne({ expertId, date, timeSlot });
        if (existing) return res.status(400).json({ message: 'Slot already booked.' });

        const newBooking = new Booking(req.body);
        await newBooking.save();

        const io = req.app.get('socketio');
        if (io) io.emit('slotBooked', { expertId, date, timeSlot });

        res.status(201).json({ message: 'Booking successful', booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const { email } = req.query;
        const bookings = await Booking.find({ email }).populate('expertId');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const updated = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};