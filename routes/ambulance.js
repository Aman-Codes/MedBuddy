const express 		      = require("express"),
	bodyParser 		      = require("body-parser"),
	mongoose 		      = require("mongoose"),
	passport 		      = require("passport"),
	localStrategy 	      = require("passport-local"),
	nodemailer            = require("nodemailer"),
	Patient			      = require("../models/patient"),
	Appointment			  = require("../models/appointment"),
	Prescription		  = require("../models/prescription"),
	Doctor 			      = require("../models/doctor"),
	AmbulanceRegistration = require("../models/ambulanceregistration"),
	AmbulanceBooking      = require("../models/ambulancebooking");

var router = express.Router({mergeParams: true});

//==================== USEFULL FUNCTIONS ====================

function ConvertChosenTime(str) {
	let date0 = new Date(str),
	hour = date0.getHours(),
	minutes = date0.getMinutes(),
	end = "AM";
	if(hour>=12) {
		hour -= 12;
		end = "PM";
	}
	let JoinedTime = [hour,minutes].join(":");
	return (JoinedTime + " " + end);
}
function convert(str) {
	var date = new Date(str),
	mnth = ("0" + (date.getMonth() + 1)).slice(-2),
	day = ("0" + date.getDate()).slice(-2);
	//     return [date.getFullYear(), mnth, day].join("-");
	return [day,mnth,date.getFullYear()].join("-");  
}

// ==================== GET ROUTES ====================

router.get("/ambulancelogin",function(req,res){
	let data = {};
	data.user =req.user;	
	res.render("ambulancelogin",{data: data});
})

router.get("/ambulanceregistration", function(req,res){
	let data = {};
	data.user =req.user;
	res.render("ambulanceregistration",{data: data});

});

router.get("/ambulancehome",isLoggedIn,function(req,res){
	let futurebooking = [];
	let pastbooking = [];
	let data = {};

	let AmbulancePromise = new Promise(function(resolve,reject){
		AmbulanceBooking.find({}).populate("PatientId").exec(function(err,appointments){		
			if(err) {
				reject('Error occured in compiling patient ambulance data');
			}else{
				resolve(appointments);
			}
		});
	});	
	AmbulancePromise
	.then(function(result){		
		result.forEach(function(item){
			let obj = {};

			obj.PatientId = item.PatientId._id;
			obj.PatientName = item.PatientId.name;
			obj.AmbulanceId = item.AmbulanceId;
			obj.BookingId = item._id;
			obj.Date = convert(item.BookingTime);
			obj.Time = ConvertChosenTime(item.BookingTime);
			obj.PatientAddress = item.PatientAddress;
			obj.PatientPhone = item.PatientPhone;
			obj.BookingStatus = item.BookingStatus;
			obj.JourneyStatus = item.JourneyStatus;

			if(item.JourneyStatus == "Ended"){
				pastbooking.push(obj);
				
			}else{
				futurebooking.push(obj);
			}
		});
		data.futurebooking = futurebooking;
		data.pastbooking = pastbooking;
		data.user = req.user;
		res.render("ambulancehome",{data:data});
	})
	.catch(function(error){
		console.log("Error From promise " + error);
	})		
})

router.get("/ambulancehome/:ambulanceid/:bookingid/accept",isAuthorizedAmbulance,function(req,res){
	AmbulanceBooking.findByIdAndUpdate(req.params.bookingid,{AmbulanceId: req.params.ambulanceid,BookingStatus: "Accepted" }, { new: true },function(err){
		if(err){
			console.log(err);
		}
		res.redirect("/ambulancehome");
	})
})

router.get("/ambulancehome/:ambulanceid/:bookingid/startjourney",isAuthorizedAmbulance,function(req,res){
	AmbulanceBooking.findByIdAndUpdate(req.params.bookingid,{JourneyStatus: "Started"}, { new: true },function(err){
		if(err){
			console.log(err);
		}
		res.redirect("/ambulancehome");
	})
})

router.get("/ambulancehome/:ambulanceid/:bookingid/endjourney",isAuthorizedAmbulance,function(req,res){
	AmbulanceBooking.findByIdAndUpdate(req.params.bookingid,{JourneyStatus: "Ended"}, { new: true },function(err){
		if(err){
			console.log(err);
		}
		res.redirect("/ambulancehome");
	})
})

router.get("/ambulancehome/:ambulanceid/edit",isAuthorizedAmbulance,function(req, res){
	let ShowAmbulancePromise = new Promise(function(resolve,reject){
		AmbulanceRegistration.findById(req.params.ambulanceid).exec(function(err, item){
			if(err) {
				reject('Error occured in getting ambulance data');
			}else{
				resolve(item);
			}
		});
	});
	ShowAmbulancePromise
	.then(function(result){		
		let data = {};
		data.user = req.user;
		data.ambulance = result;
		res.render("ambulanceedit",{data:data});
	})
	.catch(function(error){
		console.log("Error From promise " + error);
		res.redirect("back");
	});
});

// Update Patient Credentials
router.put("/ambulancehome/:ambulanceid/edit",isAuthorizedAmbulance,function(req, res){
	AmbulanceRegistration.findByIdAndUpdate(req.params.ambulanceid, req.body, function(err, item){
		if(err){
			console.log(err);
			res.redirect("/ambulancehome");
		}		
		else{
			res.redirect("/ambulancehome");
		} 
	});
	
});

// ==================== POST ROUTES ====================

// Ambulance Login
router.post("/ambulancelogin",passport.authenticate("ambulancereglocal", {
	successRedirect: "/ambulancehome",
	failureRedirect: "/ambulancelogin",
}));

router.post("/ambulanceregistration", function(req, res){	
	let newambulance = new AmbulanceRegistration({
		username: req.body.username,
		name: req.body.name,
		usertype: "AmbulanceProvider",
		phone: req.body.phone,
		address: req.body.address,		
		vehiclenumber: req.body.vehiclenumber,
		ambulancetype: req.body.ambulancetype,
		img: req.body.urllist
	});

	AmbulanceRegistration.register(newambulance, req.body.password, function(err, item){
		if(err)
		{
			console.log(err);
			let data = {};
			data.user =req.user;
			res.render("ambulanceregistration",{data:data});
		}
		passport.authenticate('ambulancereglocal')(req, res, function(){
			res.redirect("/ambulancehome");
		});
	});

});

// ==================== MIDDLEWARE FUNCTIONS ====================
function isLoggedIn(req, res, next)
{
	if(req.isAuthenticated()) {
		return next();
	}
	else {
		return res.redirect("back");
	}
}

function isAuthorizedAmbulance(req,res,next) {
	if(req.isAuthenticated() && req.params.ambulanceid.toString() == (req.user._id.toString())) {
		return next();
	}
	else {
		return res.redirect("back");
	}
}

// ========================================
module.exports = router;

