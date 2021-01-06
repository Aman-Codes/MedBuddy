const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const express = require('express');
const session = require('cookie-session');
const compression = require('compression');
const Patient = require('./models/patient');
const Doctor = require('./models/doctor');
const AmbulanceRegistration = require('./models/ambulanceregistration');
const IndexRoutes = require('./routes/index');
const PatientRoutes = require('./routes/patient');
const DoctorRoutes = require('./routes/doctor');
const AmbulanceRoutes = require('./routes/ambulance');

const app = express();

require('dotenv').config();

app.use(compression());

if (process.env.NODE_ENV === 'production') {
  mongoose.connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  });
} else {
  mongoose.connect('mongodb://localhost/medbuddy', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  });
}

app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true, useNewUrlParser: true }));
app.use(methodOverride('_method'));

//  PASSPORT CONFIGURATION //
app.use(
  session({
    secret: 'Project MedBuddy is Awesome!',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use('doctorlocal', new LocalStrategy(Doctor.authenticate()));
passport.use('patientlocal', new LocalStrategy(Patient.authenticate()));
passport.use(
  'ambulancereglocal',
  new LocalStrategy(AmbulanceRegistration.authenticate())
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Patient.findById(id, (err, patient) => {
    if (err) return done(err);
    if (patient) return done(null, patient);
    Doctor.findById(id, (error, doctor) => {
      if (error) return done(error);
      if (doctor) return done(null, doctor);
      AmbulanceRegistration.findById(id, (e, ambulanceRegistration) => {
        if (e) return done(e);
        if (ambulanceRegistration) return done(null, ambulanceRegistration);
        return done(e);
      });
      return done(error);
    });
    return done(err);
  });
});

app.use(IndexRoutes);
app.use(PatientRoutes);
app.use(DoctorRoutes);
app.use(AmbulanceRoutes);
app.use((req, res) => {
  res.status(404).render('404');
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('Server running');
});

module.exports = app;
