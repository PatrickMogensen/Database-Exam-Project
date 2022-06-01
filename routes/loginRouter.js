const express = require('express');
const passport = require('passport');
const auth = require('./../util/auth.js');
router = express.Router();

router.route('/loginFailed').get( async (req, res) => {
  // const users = await models.user.findAll();

  res.send('login failed');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/loginFailed',
}));

// example showing protected route
router.get('/', auth.loggedIn, (req, res) => {
  res.send(req.user);
} );

// example showing protected route
router.get('/adminPage', auth.isAdmin, (req, res) => {
  res.send('you are logged in as admin: ' + req.user);
} );

router.route('/logout').post( function(req, res) {
  req.logout();
  res.send('logged out');
});

module.exports = router;
