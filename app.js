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
const { MongodbUrl } = require('./config/config');

const app = express();

app.use(compression());

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MongodbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  });
}

app.use(
  express.static(`${__dirname}/public`, {
    maxAge: 86400000,
    setHeaders(res, path) {
      res.setHeader(
        'Expires',
        new Date(Date.now() + 2592000000 * 30).toUTCString()
      );
    },
  })
);
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
    if (err) return done(err, null);
    if (patient) return done(null, patient);
    Doctor.findById(id, (error, doctor) => {
      if (error) return done(error, null);
      if (doctor) return done(null, doctor);
      AmbulanceRegistration.findById(id, (e, ambulanceRegistration) => {
        if (e) return done(e, null);
        if (ambulanceRegistration) return done(null, ambulanceRegistration);
      });
    });
  });
});

app.use(IndexRoutes);
app.use(PatientRoutes);
app.use(DoctorRoutes);
app.use(AmbulanceRoutes);
app.use((req, res) => {
  res.status(404).render('404');
});

module.exports = app;
