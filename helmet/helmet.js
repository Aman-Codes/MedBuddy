// const helmet = require('helmet');

// const trusted = [
//   "'self'",
//   'https://www.youtube.com/*',
// ];

// if (process.env.NODE_ENV !== 'production') {
//   trusted.push('http://localhost:*', 'ws://localhost:*');
// }

// function contentSecurityPolicy(nonce) {
//   return helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: trusted,
//       scriptSrc: [
//         "'unsafe-eval'",
//         "'unsafe-inline'",
//         `nonce-${nonce}`,
//         'https://www.googletagmanager.com',
//         '*.googletagmanager.com',
//         'https://www.youtube.com/*',
//         'https://www.google-analytics.com/*'
//       ].concat(trusted),
//       styleSrc: [
//         "'unsafe-inline'",
//         '*.gstatic.com',
//         '*.googleapis.com',
//         'https://*.typography.com',
//       ].concat(trusted),
//       frameSrc: [
//         '*.stripe.com',
//         'https://www.youtube.com/*',
//       ].concat(trusted),
//       fontSrc: [
//         '*.cloudflare.com',
//         'https://*.cloudflare.com',
//         '*.bootstrapcdn.com',
//         '*.googleapis.com',
//         '*.gstatic.com',
//         'data',
//       ].concat(trusted),
//       imgSrc: [
//         'www.googletagmanager.com',
//       ].concat(trusted),
//     },
//     // set to true if you only want to report errors
//     reportOnly: false,
//     // set to true if you want to force buggy CSP in Safari 5
//     safari5: false,
//   });
// }

// module.exports = {
//   contentSecurityPolicy,
// };
