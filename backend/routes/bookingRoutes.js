const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', bookingController.createBooking);
router.get('/', bookingController.getUserBookings);
router.patch('/:id/status', bookingController.updateBookingStatus);

// 🎯 Use module.exports
module.exports = router;