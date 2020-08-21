const mongoose 				= require("mongoose"),
	passportLocalMongoose 	= require("passport-local-mongoose");

var doctorSchema = new mongoose.Schema({
	username: String,
	address: String,
	phone: String, 
	name: String,
	specialization: String,
	usertype: {
		type:String,
		default:"doctor",
	},
	password: String,	
	
});

doctorSchema.plugin(passportLocalMongoose); 
module.exports = mongoose.model("Doctor", doctorSchema);
