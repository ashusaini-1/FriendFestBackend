const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    latitude: Number,
    longitude: Number,
    timestamp: Date,
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;