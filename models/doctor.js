const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const doctorSchema = new mongoose.Schema({
  username: String,
  address: String,
  phone: String,
  name: String,
  specialization: String,
  usertype: {
    type: String,
    default: 'doctor',
  },
  password: String,
});

doctorSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Doctor', doctorSchema);
