const express = require('express');
const passport = require('passport');
const AmbulanceRegistration = require('../models/ambulanceregistration');
const AmbulanceBooking = require('../models/ambulancebooking');
const {
  ConvertChosenTime,
  convert,
  isLoggedIn,
  isAuthorizedAmbulance,
} = require('./helper');

const router = express.Router({ mergeParams: true });

// GET ROUTES

router.get('/ambulancelogin', (req, res) => {
  const data = {};
  data.user = req.user;
  data.NODE_ENV = process.env.NODE_ENV;
  res.render('ambulancelogin', { data });
});

router.get('/ambulanceregistration', (req, res) => {
  const data = {};
  data.user = req.user;
  data.NODE_ENV = process.env.NODE_ENV;
  res.render('ambulanceregistration', { data });
});

router.get('/ambulancehome', isLoggedIn, (req, res) => {
  const futurebooking = [];
  const pastbooking = [];
  const data = {};
  data.NODE_ENV = process.env.NODE_ENV;

  const AmbulancePromise = new Promise((resolve, reject) => {
    AmbulanceBooking.find({})
      .populate('PatientId')
      .exec((err, appointments) => {
        if (err) {
          reject(err);
        } else {
          resolve(appointments);
        }
      });
  });
  AmbulancePromise.then((result) => {
    console.log(result);
    result.forEach((item) => {
      const obj = {};
      console.log(item);
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

      if (item.JourneyStatus === 'Ended') {
        pastbooking.push(obj);
      } else {
        futurebooking.push(obj);
      }
    });
    data.futurebooking = futurebooking;
    data.pastbooking = pastbooking;
    data.user = req.user;
    data.NODE_ENV = process.env.NODE_ENV;
    res.render('ambulancehome', { data });
  }).catch((error) => {
    console.log(`Error From promise ${error}`);
  });
});

router.get(
  '/ambulancehome/:ambulanceid/:bookingid/accept',
  isAuthorizedAmbulance,
  (req, res) => {
    AmbulanceBooking.findByIdAndUpdate(
      req.params.bookingid,
      { AmbulanceId: req.params.ambulanceid, BookingStatus: 'Accepted' },
      { new: true },
      (err) => {
        if (err) {
          console.log(err);
        }
        res.redirect('/ambulancehome');
      }
    );
  }
);

router.get(
  '/ambulancehome/:ambulanceid/:bookingid/startjourney',
  isAuthorizedAmbulance,
  (req, res) => {
    AmbulanceBooking.findByIdAndUpdate(
      req.params.bookingid,
      { JourneyStatus: 'Started' },
      { new: true },
      (err) => {
        if (err) {
          console.log(err);
        }
        res.redirect('/ambulancehome');
      }
    );
  }
);

router.get(
  '/ambulancehome/:ambulanceid/:bookingid/endjourney',
  isAuthorizedAmbulance,
  (req, res) => {
    AmbulanceBooking.findByIdAndUpdate(
      req.params.bookingid,
      { JourneyStatus: 'Ended' },
      { new: true },
      (err) => {
        if (err) {
          console.log(err);
        }
        res.redirect('/ambulancehome');
      }
    );
  }
);

router.get(
  '/ambulancehome/:ambulanceid/edit',
  isAuthorizedAmbulance,
  (req, res) => {
    const ShowAmbulancePromise = new Promise((resolve, reject) => {
      AmbulanceRegistration.findById(req.params.ambulanceid).exec(
        (err, item) => {
          if (err) {
            reject(err);
          } else {
            resolve(item);
          }
        }
      );
    });
    ShowAmbulancePromise.then((result) => {
      const data = {};
      data.user = req.user;
      data.NODE_ENV = process.env.NODE_ENV;
      data.ambulance = result;
      res.render('ambulanceedit', { data });
    }).catch((error) => {
      console.log(`Error From promise ${error}`);
      res.redirect('back');
    });
  }
);

// Update Patient Credentials
router.put(
  '/ambulancehome/:ambulanceid/edit',
  isAuthorizedAmbulance,
  (req, res) => {
    AmbulanceRegistration.findByIdAndUpdate(
      req.params.ambulanceid,
      req.body,
      (err, item) => {
        if (err) {
          console.log(err);
          res.redirect('/ambulancehome');
        } else {
          console.log(item);
          res.redirect('/ambulancehome');
        }
      }
    );
  }
);

// POST ROUTES

// Ambulance Login
router.post(
  '/ambulancelogin',
  passport.authenticate('ambulancereglocal', {
    successRedirect: '/ambulancehome',
    failureRedirect: '/ambulancelogin',
  })
);

router.post('/ambulanceregistration', (req, res) => {
  const newambulance = new AmbulanceRegistration({
    username: req.body.username,
    name: req.body.name,
    usertype: 'AmbulanceProvider',
    phone: req.body.phone,
    address: req.body.address,
    vehiclenumber: req.body.vehiclenumber,
    ambulancetype: req.body.ambulancetype,
    img: req.body.urllist,
  });

  AmbulanceRegistration.register(
    newambulance,
    req.body.password,
    (err, item) => {
      if (err) {
        console.log(err);
        const data = {};
        data.NODE_ENV = process.env.NODE_ENV;
        data.user = req.user;
        res.render('ambulanceregistration', { data });
      }
      passport.authenticate('ambulancereglocal')(req, res, () => {
        console.log(item);
        res.redirect('/ambulancehome');
      });
    }
  );
});

module.exports = router;
