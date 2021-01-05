const localStrategy         = require('passport-local'),
    methodOverride          = require('method-override'),
    bodyParser              = require('body-parser'),
    passport                = require('passport'),
    mongoose                = require('mongoose'),
    express                 = require('express'), 
    app                     = express(),
    Patient                 = require("./models/patient"),
    Doctor                  = require("./models/doctor"),
    AmbulanceRegistration   = require("./models/ambulanceregistration"),    
    IndexRoutes             = require("./routes/index"),
    PatientRoutes           = require("./routes/patient"),
    DoctorRoutes            = require("./routes/doctor"),
    AmbulanceRoutes         = require("./routes/ambulance"),      
    compression             = require('compression'),
    mongourl                = require('./config/keys').mongourl;

app.use(compression());

mongoose.connect( (mongourl ?? "mongodb://localhost/medbuddy") ,{
    useUnifiedTopology: true,useNewUrlParser:true , 
    useFindAndModify: false
});

app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true, useNewUrlParser:true}));
app.use(methodOverride('_method'));

//  PASSPORT CONFIGURATION //
app.use(require("express-session")({
    secret: "Project StartUp is Awesome!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use('doctorlocal', new localStrategy(Doctor.authenticate()));
passport.use('patientlocal', new localStrategy(Patient.authenticate()));
passport.use('ambulancereglocal', new localStrategy(AmbulanceRegistration.authenticate()));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    Patient.findById(id, function(err, Patient) {
        if (err) return done(err);
        if (Patient) return done(null, Patient);
        Doctor.findById(id, function(err, Doctor) {
            if (err) return done(err);
            if (Doctor) return done(null, Doctor);
            AmbulanceRegistration.findById(id, function(err, AmbulanceRegistration) {
                if (err) return done(err);
                if (AmbulanceRegistration) return done(null, AmbulanceRegistration);
            });
        });
    });
});

app.use(IndexRoutes);
app.use(PatientRoutes);
app.use(DoctorRoutes);
app.use(AmbulanceRoutes);
app.use(function(req,res){
  res.status(404).render("404");
});

var port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log('Server running');
});

module.exports = app;
