const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    experience: { type: String, required: true },
    rating: { type: Number, default: 0 },
    // 🎯 ADD THIS FIELD:
    availableSlots: [{
        date: String,
        time: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Expert', expertSchema);