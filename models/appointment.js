const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  PatientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
  },
  DoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  PrescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription',
    default: null,
  },
  AppointmentDate: {
    type: String,
    default: 'none',
  },
  Disease: {
    type: String,
    default: 'none',
  },
  Status: {
    type: String,
    default: 'none',
  },
  SerialNumber: {
    type: Number,
    default: null,
  },
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
