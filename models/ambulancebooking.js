const mongoose = require('mongoose');

const ambulanceBookingSchema = new mongoose.Schema({
  PatientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
  },
  AmbulanceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AmbulanceRegistration',
    default: null,
  },
  PatientAddress: {
    type: String,
    default: 'none',
  },
  PatientPhone: {
    type: String,
    default: 'none',
  },
  BookingStatus: {
    type: String,
    default: 'Yet to be confirmed',
  },
  BookingTime: {
    type: String,
    default: null,
  },
  JourneyStatus: {
    type: String,
    default: 'Yet to be started',
  },
});

module.exports = mongoose.model('AmbulanceBooking', ambulanceBookingSchema);
