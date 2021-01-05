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
    let date0 = new Date(str);
    date0.setHours(date0.getHours() + 5.5);
    date0.setMinutes(date0.getMinutes() + 30);
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
    let date0 = new Date(str);
    date0.setHours(date0.getHours() + 5);
    date0.setMinutes(date0.getMinutes() + 30);
	mnth = ("0" + (date0.getMonth() + 1)).slice(-2),
	day = ("0" + date0.getDate()).slice(-2);
	//     return [date.getFullYear(), mnth, day].join("-");
	return [day,mnth,date0.getFullYear()].join("-");  
}

// ==================== GET ROUTES ====================

router.get("/patientregistration", function(req,res){
	let data = {};
	data.user =req.user;
	res.render("patientregistration",{data: data});
});

router.get("/patientlogin", function(req,res){
	let data = {};
	data.user =req.user;	
	res.render("patientlogin",{data: data});
});

router.get("/patienthome", isLoggedIn,function(req,res){

	let futureappointment = [];
	let pastappointment = [];
	let data = {};
	let obj1 = {};

	let SortPatientPromise = new Promise(function(resolve,reject){
		// Find all appointments of the patient
		Appointment.find({PatientId: req.user._id}).populate("PrescriptionId").exec(function(err,appointments){		
			if(err) {
				reject('Error occured in compiling patient appointment data');
			}else{
				resolve(appointments);
			}
		});
	});	
	SortPatientPromise
	.then(function(result){		
		result.forEach(function(item){
			let obj = {};

			// date1: Appointment time
			let date1 = new Date(item.AppointmentDate);

			// date2: Current date
			let date2 = new Date();

			obj.PatientId = item.PatientId;
			obj.DoctorId = item.DoctorId;
			obj.PrescriptionId = item.PrescriptionId;
			obj.AppointmentDate = convert(item.AppointmentDate);
            obj.AppointmentTime =  ConvertChosenTime(item.AppointmentDate);
			obj.Disease = item.Disease;
			obj.Status = item.Status;
			obj.SerialNumber = item.SerialNumber;
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

			if(date1.getTime() > date2.getTime())
			{
				futureappointment.push(obj);
			}
			else 
			{
				pastappointment.push(obj);
			}
		});
	})
	.catch(function(error){
		console.log("Error From promise 1 a) " + error);
	})

	let AmbulancePromise = new Promise(function(resolve,reject){
		AmbulanceBooking.find({PatientId: req.user._id}).populate("AmbulanceId").exec(function(err,ambulance){		
			if(err) {
				reject('Error occured in compiling patient ambulance data');
			}else{
				let ambulancedata = [];
				ambulance.forEach(function(item){
					obj1.AmbulanceId = item.AmbulanceId;
					obj1.PatientAddress = item.PatientAddress;
					obj1.PatientPhone = item.PatientPhone;
					obj1.BookingStatus = item.BookingStatus;
					obj1.Date = convert(item.BookingTime);
					obj1.Time = ConvertChosenTime(item.BookingTime);
					obj1.BookingTime = item.BookingTime;
					obj1.JourneyStatus = item.JourneyStatus;
					obj1.PatientId = item.PatientId;

					if(item.AmbulanceId != null) {
						obj1.AmbulanceName = item.AmbulanceId.name;
						obj1.AmbulancePhone = item.AmbulanceId.phone;
						obj1.AmbulanceVehicleNumber = item.AmbulanceId.vehiclenumber;
						obj1.AmbulanceType = item.AmbulanceId.ambulancetype;
						obj1.AmbulanceImg = item.AmbulanceId.img;	
					}									
				})
				ambulancedata.push(obj1);
				resolve(ambulancedata);
			}
		})
	});

	AmbulancePromise
	.then(function(result){
		data.ambulanceappointment = result;
	})
	.catch(function(err){
		console.log("Error From promise 1 b) " + error);
	})

	Promise.all([SortPatientPromise, AmbulancePromise])
	.then(function(result) {
		data.futureappointment = futureappointment;
		data.pastappointment = pastappointment;
		data.user = req.user;
		res.render("patienthome",{data:data});

	})
	.catch(function(error) {
		console.log("Error From promise 1 c) " + error);
	});

});

router.get("/patienthome/bookappointment/:patientid", isAuthorizedPatient,function(req,res){
	let data = {};
	data.user =req.user;
	data.patientid = req.params.patientid;
	res.render("appointmentbooking1",{data: data});
});

router.post("/patienthome/bookappointment/:patientid",isAuthorizedPatient, function(req,res){
	let data = {};
	data.user=req.user;
	let url = "/patienthome/bookappointment/" + req.params.patientid + "/" + req.body.disease;
	res.redirect(url);
});

router.get("/patienthome/bookappointment/:patientid/:disease",isAuthorizedPatient,function(req,res){
	let ShowDoctorPromise = new Promise(function(resolve,reject){
		Doctor.find({specialization : req.params.disease}).exec(function(err, item){
			if(err) {
				console.log("Oh no Error occured in updating patient data");	
				reject('Error occured in updating patient data');
			}else{
				resolve(item);
			}
		});
	});
	ShowDoctorPromise
	.then(function(result){
		let data = {};
		data.user =req.user;
		data.patientid = req.params.patientid;
		data.patientdisease = req.params.disease;
		data.doctor = result;
		res.render("appointmentbooking2",{data: data});
	})
	.catch(function(error){
		console.log("Error From promise 2 " + error);
	})
})

router.get("/patienthome/bookappointment/:patientid/:disease/:doctorid",isAuthorizedPatient,function(req,res){
	let ShowCalendarPromise = new Promise(function(resolve,reject){
		Appointment.find({DoctorId: req.params.doctorid}).exec(function(err, item){
			if(err) {
				reject('Error occured in updating patient data');
			}else{
				resolve(item);
			}
		});
	});
	let appointmentdata;
	let modifiedappointmentdata = [];
	ShowCalendarPromise
	.then(function(result){
		result.forEach(function(data){
			let obj = {};

			// date1: Appointment time
			let date1 = new Date(data.AppointmentDate);

			// date2: Setting same appointment time to all appointments of same day
			let date2 = new Date(date1.getTime() - date1.getTime()%86400000);
			
			obj.AppointmentDate  = date2;
			modifiedappointmentdata.push(obj);			
		})
	})
	.then(function(result){
		appointmentdata = modifiedappointmentdata.reduce((acc, it) =>{
			acc[it.AppointmentDate] = acc[it.AppointmentDate] + 1 || 1 ;
			return acc;
		},{});
	})
	.then(function(result){
		let data = {};
		let jsondata = JSON.stringify(appointmentdata);
		data.sortedpatient = jsondata;
		let date1 = new Date(req.user.AppointmentDate);
		let date2 = new Date(date1.getTime() - date1.getTime()%86400000);
		let sno = ((date1.getTime() - date2.getTime() - 4.5*60*60*1000)/(15*60*1000) + 1);
		data.user = req.user;
		data.sno = sno;
		data.patientid = req.params.patientid;
		data.disease = req.params.disease;
		data.doctorid = req.params.doctorid;
		res.render("appointmentbooking3",{data:data});		
	})
	.catch(function(error){
		console.log("Error From promise 3 " + error);
	})
})

router.post("/patienthome/bookappointment/:patientid/:disease/:doctorid",isAuthorizedPatient,function(req,res){
	let appointmentdate = new Date(req.body.ChosenDate);
	let time1 = appointmentdate.getTime() % (24*60*60*1000);
	time1 -= (4.5*60*60*1000);

	let PatientId = req.params.patientid;
	let DoctorId = req.params.doctorid;
	let AppointmentDate = req.body.ChosenDate;
	let Disease = req.params.disease;
	let Status = "Yet to be confirmed";
	let SerialNumber = parseInt(time1/(15*60*1000));

	let obj = new Appointment({
		PatientId:PatientId, 
		DoctorId:DoctorId,
		AppointmentDate:AppointmentDate, 
		Disease:Disease, 
		Status:Status,
		SerialNumber:SerialNumber

	});
	Appointment.create(obj, function(err,item){
		if(err) {
			console.log(err);
		}
		res.redirect("/patienthome");
	})	
})

router.get("/patienthome/:patientid/edit",isAuthorizedPatient,function(req, res){
	let ShowPatientPromise = new Promise(function(resolve,reject){
		Patient.findById(req.params.patientid).exec(function(err, item){
			if(err) {
				reject('Error occured in getting patient data');
			}else{
				resolve(item);
			}
		});
	});
	ShowPatientPromise
	.then(function(result){		
		let data = {};
		data.user = req.user;
		data.patient = result;
		res.render("patientedit",{data:data});
	})
	.catch(function(error){
		console.log("Error From promise 4 " + error);
		res.redirect("back");
	});
});

// ==================== POST ROUTES ====================

// Patient Login
router.post("/patientlogin",passport.authenticate("patientlocal", {
	successRedirect: "/patienthome",
	failureRedirect: "/patientlogin",
	})
);

router.post("/patientregistration", function(req, res){	
	let newpatient = new Patient({
		username: req.body.username,
		usertype: "patient",
		name: req.body.name,
		dob: req.body.dob,
		phone: req.body.phone,
		address: req.body.address,
	});

	Patient.register(newpatient, req.body.password, function(err, item){
		if(err)
		{
			console.log(err);
			let data = {};
			data.user =req.user;
			res.render("patientregistration",{data:data});
		}
		passport.authenticate('patientlocal')(req, res, function(){
			res.redirect("/patienthome");
		});
	});

});

// ==================== UPDATE ROUTES ====================

// Update Patient Credentials
router.put("/patienthome/:patientid/edit",isAuthorizedPatient,function(req, res){
	Patient.findByIdAndUpdate(req.params.patientid, req.body, function(err, item){
		if(err){
			console.log(err);
			res.redirect("/patienthome");
		}		
		else{
			console.log("Successfully Updated Patient")
			res.redirect("/patienthome");
		} 
	});
	
});

// Booking Ambulance
router.post("/patienthome/:patientid/bookambulance",isAuthorizedPatient,function(req, res){
	let currDate = new Date();
	let currDatestr = currDate.toString();

	let PatientId = req.user._id;
	let PatientAddress = req.body.address;
	let PatientPhone = req.body.phone;
	let BookingStatus = "Yet to be confirmed";
	let BookingTime = currDatestr;
	let JourneyStatus = "Yet to be started";

	let obj = new AmbulanceBooking ({
		PatientId:PatientId,
		PatientAddress:PatientAddress,
		PatientPhone:PatientPhone,
		BookingStatus:BookingStatus,
		BookingTime:BookingTime,
		JourneyStatus:JourneyStatus
	})

	AmbulanceBooking.create(obj,function(err,item){
		if(err) {
			console.log(err);
		}		
	})
	let AmbulanceEmail = [];
	let FindAmbulancePromise = new Promise(function(resolve,reject){
		AmbulanceRegistration.find({}).exec(function(err, item){
			if(err) {
				reject('Error occured in getting ambulance data');
			}else{
				resolve(item);
			}
		});
	});
	FindAmbulancePromise
	.then(function(result){		
		result.forEach(function(item){
			AmbulanceEmail.push(item.username);
		})
	})
	.catch(function(error){
		console.log("Error From promise " + error);
		res.redirect("back");
	});

	Promise.all([FindAmbulancePromise])
	.then(function(result){
		const email = process.env.SENDOR_EMAIL;
		const password = process.env.SENDOR_PASSWORD;
		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
			  user: email,
			  pass: password
			}
	  	});

		let emailmessage = "HI you have a new ambulance request from " + req.user.name + 
							  ".\nPatient Details: \nName: " + req.user.name + 
							  "\nAddress: " + PatientAddress+ 
							  "\nPhone Number: " + PatientPhone +
							  "\nBooking Date: " + convert(currDatestr) + 
							  "\nBooking Time: " + ConvertChosenTime(currDatestr)  ;
	  
		var mailOptions = {
			from: email,
			to: AmbulanceEmail,
			subject: 'New Ambulance Request',
			text: emailmessage,
		};
	  
		transporter.sendMail(mailOptions, function(error, info){
			if (error) {
			  console.log(error);
			} else {
			  console.log('Email sent' );
			}
		});

	  	res.redirect("/patienthome");
	})
	.catch(function(err){
		console.log("Error From Promise " + err)
	})
	
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

function isAuthorizedPatient(req,res,next) {
	if(req.isAuthenticated() && req.params.patientid.toString() === req.user._id.toString() ) {
		return next();
	}
	else {
		return res.redirect("back");
	}
}

// ========================================
module.exports = router;
