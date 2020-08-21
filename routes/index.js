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

// ==================== GET ROUTES ====================

router.get("/", function(req,res){
	let data = {};
	data.user =req.user;	
	res.render("home", {data:data});
});

router.get("/about", function(req,res){
	let data = {};
	data.user =req.user;
	res.render("about",{data: data});

});

router.get("/faq", function(req,res){
	let data = {};
	data.user =req.user;
	res.render("faq",{data: data});

});

router.get("/gallery", function(req,res){
	let data = {};
	data.user =req.user;
	res.render("gallery",{data: data});

});

router.get("/news", function(req,res){
	let data = {};
	data.user =req.user;
	res.render("news",{data: data});

});

router.get("/privacypolicy", function(req,res){
	let data = {};
	data.user =req.user;
	res.render("privacypolicy",{data: data});

});

router.get("/services", function(req,res){
	let data = {};
	data.user =req.user;
	res.render("services",{data: data});

});

router.get("/terms", function(req,res){
	let data = {};
	data.user =req.user;
	res.render("terms",{data: data});

});

router.get("/view2", function(req,res){
	let data = {};
	data.user =req.user;
	res.render("view2",{data: data});

});

// ==================== LOGOUT ROUTES ====================
router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

// ========================================

module.exports = router;