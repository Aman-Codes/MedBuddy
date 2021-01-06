const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const patientSchema = new mongoose.Schema({
  username: String,
  usertype: {
    type: String,
    default: 'patient',
  },
  name: String,
  dob: String,
  phone: String,
  address: String,
  password: String,
  date: String,
});

patientSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Patient', patientSchema);
