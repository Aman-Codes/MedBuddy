const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  PatientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
  },
  DoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  AppointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  Symptoms: {
    type: String,
    default: 'Not Specified',
  },
  Tests: {
    type: String,
    default: 'Not Specified',
  },
  Medicines: {
    type: String,
    default: 'Not Specified',
  },
  Remarks: {
    type: String,
    default: 'Not Specified',
  },
  DoctorSignature: {
    type: String,
    default: 'Not Specified',
  },
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
