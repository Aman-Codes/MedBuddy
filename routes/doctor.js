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

router.get("/doctorregistration", function(req,res){
	let data = {};
	data.user =req.user;
	res.render("doctorregistration",{data: data});

});

router.get("/doctorlogin", function(req,res){
	let data = {};
	data.user =req.user;
	res.render("doctorlogin",{data: data});

});

router.get("/doctorhome",isLoggedIn, function(req,res){
	let futureappointment = [];
	let pastappointment = [];
	let data = {};

	let SearchAppointmentPromise = new Promise(function(resolve,reject){
		Appointment.find({DoctorId: req.user._id}).populate("PatientId").populate("PrescriptionId").exec(function(err,appointment){		
			if(err) {
				reject('Error occured in finding appointment data');
			}else{
				resolve(appointment);
			}
		});	
	});	
	SearchAppointmentPromise
	.then(function (result){
		result.forEach(function(item){
			let obj = {};

			// date1: Appointment time
			let date1 = new Date(item.AppointmentDate);

			// date2: Current date
			let date2 = new Date();

			obj.PatientId = item.PatientId._id;
			obj.DoctorId = item.DoctorId;
			obj.AppointmentId= item._id;
			obj.PrescriptionId = item.PrescriptionId;
			obj.AppointmentDate = convert(item.AppointmentDate);
			obj.AppointmentTime = ConvertChosenTime(item.AppointmentDate);
			obj.Disease = item.Disease;
			obj.Status = item.Status;
			obj.SerialNumber = item.SerialNumber;
			obj.PatientName = item.PatientId.name;
			obj.PatientPhone = item.PatientId.phone;
			if(item.PrescriptionId == null){
				obj.Symptoms = null;
				obj.Tests = null;
				obj.Medicines = null;
				obj.Remarks = null;
				obj.DoctorSignature = null;				
			}
			else{
				obj.Symptoms = item.PrescriptionId.Symptoms;
				obj.Tests = item.PrescriptionId.Tests;
				obj.Medicines = item.PrescriptionId.Medicines;
				obj.Remarks = item.PrescriptionId.Remarks;
				obj.DoctorSignature = item.PrescriptionId.DoctorSignature;				
			}
			if(date1.getTime() > date2.getTime()){
				futureappointment.push(obj);
			}
			else{
				pastappointment.push(obj);
			}
		});
	})
	.catch(function(error){
		console.log("Error From promise " + error);			
	});

	Promise.all([SearchAppointmentPromise])
	.then(function(result) {
		data.user = req.user;
		data.futureappointment = futureappointment;
		data.pastappointment = pastappointment;
		res.render("doctorhome", {data:data});
	})
	.catch(function(error) {
		console.log("Error From promise " + error);
	});
});

router.get("/doctorhome/:appointmentid/accept",isLoggedIn,function(req,res){
	Appointment.findByIdAndUpdate(req.params.appointmentid,{Status: "accepted" }, { new: true },function(err){
		if(err){
			console.log(err);
		}
		res.redirect("/doctorhome");
	})
})

router.get("/doctorhome/:appointmentid/reject",isLoggedIn,function(req,res){
	Appointment.findByIdAndUpdate(req.params.appointmentid,{Status: "rejected" }, { new: true },function(err){
		if(err){
			console.log(err);
		}
		res.redirect("/doctorhome");
	})
})


router.get("/doctorhome/:patientid/:appointmentid/addprescription",isLoggedIn,function(req, res){
	let data = {};
	data.user = req.user;
	data.PatientId = req.params.patientid;
	data.AppointmentId = req.params.appointmentid;
	res.render("addprescription",{data:data});	
});

router.post("/doctorhome/:patientid/:appointmentid/addprescription",isLoggedIn,function(req, res){
	let PatientId = req.params.id;
	let DoctorId = req.user._id;
	let AppointmentId = req.params.appointmentid;
	let Symptoms = req.body.Symptoms;
	let Tests = req.body.Tests;
	let Medicines = req.body.Medicines;
	let Remarks = req.body.Remarks;
	let DoctorSignature = req.body.urllist;

	let obj = new Prescription({
		PatientId:PatientId,
		DoctorId:DoctorId,
		AppointmentId:AppointmentId,
		Symptoms:Symptoms,
		Tests:Tests,
		Medicines:Medicines,
		Remarks:Remarks,
		DoctorSignature:DoctorSignature,
	})
	Prescription.create(obj, function(err,item){
		if(err)console.log(err);
		else{
			Appointment.findByIdAndUpdate(req.params.appointmentid,{PrescriptionId: item._id }, { new: true },function(err){
				if(err){
					console.log(err);
				}
				res.redirect("/doctorhome");
			})
		}
	});
});

router.get("/doctorhome/:id/edit",isLoggedIn,function(req, res){
	let ShowDoctorPromise = new Promise(function(resolve,reject){
		Doctor.findById(req.params.id).exec(function(err, item){
			if(err) {
				reject('Error occured in updating doctor data');
			}else{
				resolve(item);
			}
		});
	});
	ShowDoctorPromise
	.then(function(result){		
		let data = {};
		data.user = req.user;
		data.doctor = result; 
		res.render("doctoredit",{data:data});
	})
	.catch(function(error){
		console.log("Error From promise " + error);
		res.redirect("back");
	});
});



// ==================== POST ROUTES ====================

// Doctor Login
router.post("/doctorlogin",passport.authenticate("doctorlocal", {
	successRedirect: "/doctorhome",
	failureRedirect: "/doctorlogin",
}));

router.post("/doctorregistration", function(req, res){
	let nux = new Doctor({
		username: req.body.username,
		usertype: req.body.usertype,
		name: req.body.name,
		phone: req.body.phone,
		specialization: req.body.specialization,
		address: req.body.address,
		
	});

	Doctor.register(nux, req.body.password, function(err, item){
		if(err)
		{
			console.log(err);
			let data = {};
			data.user =req.user;
			return res.render("doctorregistration",{data: data});
		}
		passport.authenticate('doctorlocal')(req, res, function(){
			res.redirect("/doctorhome");
		});
	});
});

// ==================== UPDATE ROUTES ====================

// Update Doctor Credentials
router.put("/doctorhome/:id/edit",isLoggedIn,function(req, res){
	Doctor.findByIdAndUpdate(req.params.id, req.body, function(err, item){
		if(err){
			console.log(err);
			res.redirect("/doctorhome");
		}		
		else{
			res.redirect("/doctorhome");
		} 
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
function isAuthorizedDoctor(req,res,next) {
	if(req.isAuthenticated() && req.params.doctorid.toString() === req.user._id.toString() ) {
		return next();
	}
	else {
		return res.redirect("back");
	}
}

// ========================================
module.exports = router;

