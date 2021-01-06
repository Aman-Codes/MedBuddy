const express = require('express');

const router = express.Router({ mergeParams: true });

// GET ROUTES

router.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /');
});

router.get('/sitemap.xml', (req, res) => {
  res.sendFile(`${__dirname}/sitemap.xml`);
});

router.get('/', (req, res) => {
  const data = {};
  data.user = req.user;
  res.render('home', { data });
});

router.get('/about', (req, res) => {
  const data = {};
  data.user = req.user;
  res.render('about', { data });
});

router.get('/faq', (req, res) => {
  const data = {};
  data.user = req.user;
  res.render('faq', { data });
});

router.get('/gallery', (req, res) => {
  const data = {};
  data.user = req.user;
  res.render('gallery', { data });
});

router.get('/news', (req, res) => {
  const data = {};
  data.user = req.user;
  res.render('news', { data });
});

router.get('/privacypolicy', (req, res) => {
  const data = {};
  data.user = req.user;
  res.render('privacypolicy', { data });
});

router.get('/services', (req, res) => {
  const data = {};
  data.user = req.user;
  res.render('services', { data });
});

router.get('/terms', (req, res) => {
  const data = {};
  data.user = req.user;
  res.render('terms', { data });
});

router.get('/view2', (req, res) => {
  const data = {};
  data.user = req.user;
  res.render('view2', { data });
});

// LOGOUT ROUTE
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
