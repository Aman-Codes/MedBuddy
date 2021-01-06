const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const ambulanceRegistrationSchema = new mongoose.Schema({
  username: String,
  name: String,
  usertype: String,
  phone: String,
  address: String,
  password: String,
  vehiclenumber: String,
  ambulancetype: String,
  img: String,
});

ambulanceRegistrationSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model(
  'AmbulanceRegistration',
  ambulanceRegistrationSchema
);
