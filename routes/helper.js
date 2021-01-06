exports.ConvertChosenTime = (str) => {
  const date0 = new Date(str);
  date0.setHours(date0.getHours() + 5.5);
  date0.setMinutes(date0.getMinutes() + 30);
  let hour = date0.getHours();
  const minutes = date0.getMinutes();
  let end = 'AM';
  if (hour >= 12) {
    hour -= 12;
    end = 'PM';
  }
  const JoinedTime = [hour, minutes].join(':');
  return `${JoinedTime} ${end}`;
};

exports.convert = (str) => {
  const date0 = new Date(str);
  date0.setHours(date0.getHours() + 5);
  date0.setMinutes(date0.getMinutes() + 30);
  const mnth = `0${date0.getMonth() + 1}`.slice(-2);
  const day = `0${date0.getDate()}`.slice(-2);
  return [day, mnth, date0.getFullYear()].join('-');
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('back');
};

exports.isAuthorizedAmbulance = (req, res, next) => {
  if (
    req.isAuthenticated() &&
    req.params.ambulanceid.toString() === req.user._id.toString()
  ) {
    return next();
  }

  return res.redirect('back');
};

exports.isAuthorizedDoctor = (req, res, next) => {
  if (
    req.isAuthenticated() &&
    req.params.doctorid.toString() === req.user._id.toString()
  ) {
    return next();
  }

  return res.redirect('back');
};

exports.isAuthorizedPatient = (req, res, next) => {
  if (
    req.isAuthenticated() &&
    req.params.patientid.toString() === req.user._id.toString()
  ) {
    return next();
  }

  return res.redirect('back');
};
