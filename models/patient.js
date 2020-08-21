var mongoose 				= require("mongoose"),
	passportLocalMongoose 	= require("passport-local-mongoose");

var patientSchema = new mongoose.Schema({
	username: String,
	usertype: {
		type:String,
		default:"patient",
	},
	name: String,
	dob: String,
	phone: String,
	address: String,
	password: String,
	date:String
});

patientSchema.plugin(passportLocalMongoose); 
module.exports = mongoose.model("Patient", patientSchema);
