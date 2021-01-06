const express = require('express');
const path = require('path');

const router = express.Router({ mergeParams: true });

// GET ROUTES

router.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'robots.txt'));
});

router.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'sitemap.xml'));
});

router.get('/', (req, res) => {
  const data = {};
  data.user = req.user;
  data.NODE_ENV = process.env.NODE_ENV;
  res.render('home', { data });
});

router.get('/about', (req, res) => {
  const data = {};
  data.user = req.user;
  data.NODE_ENV = process.env.NODE_ENV;
  res.render('about', { data });
});

router.get('/faq', (req, res) => {
  const data = {};
  data.user = req.user;
  data.NODE_ENV = process.env.NODE_ENV;
  res.render('faq', { data });
});

router.get('/gallery', (req, res) => {
  const data = {};
  data.user = req.user;
  data.NODE_ENV = process.env.NODE_ENV;
  res.render('gallery', { data });
});

router.get('/news', (req, res) => {
  const data = {};
  data.user = req.user;
  data.NODE_ENV = process.env.NODE_ENV;
  res.render('news', { data });
});

router.get('/privacypolicy', (req, res) => {
  const data = {};
  data.user = req.user;
  data.NODE_ENV = process.env.NODE_ENV;
  res.render('privacypolicy', { data });
});

router.get('/services', (req, res) => {
  const data = {};
  data.user = req.user;
  data.NODE_ENV = process.env.NODE_ENV;
  res.render('services', { data });
});

router.get('/terms', (req, res) => {
  const data = {};
  data.user = req.user;
  data.NODE_ENV = process.env.NODE_ENV;
  res.render('terms', { data });
});

router.get('/view2', (req, res) => {
  const data = {};
  data.user = req.user;
  data.NODE_ENV = process.env.NODE_ENV;
  res.render('view2', { data });
});

// LOGOUT ROUTE
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
