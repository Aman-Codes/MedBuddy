var mongoose = require("mongoose"),
    passportLocalMongoose 	= require("passport-local-mongoose");

var ambulanceRegistrationSchema = new mongoose.Schema({
    username:String,
    name: String,
    usertype: String,
	phone: String,
    address: String,    
    password:String,
    vehiclenumber:String,
    ambulancetype:String,
    img:String

});

ambulanceRegistrationSchema.plugin(passportLocalMongoose); 
module.exports = mongoose.model("AmbulanceRegistration", ambulanceRegistrationSchema);
