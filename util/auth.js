const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const {Sequelize, DataTypes} = require('sequelize');
const initModels = require('../models/init-models');

const sequelize = new Sequelize('mysql://wu9imttjcpvru1yy:ggwi3bmzj8bwk0yy@i54jns50s3z6gbjt.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/mfscf7h3iqsc5qvq'
    , {
      define: {
        // prevent sequelize from pluralizing table names
        freezeTableName: true,
      },
    });
const models = initModels(sequelize);

passport.use(new LocalStrategy({usernameField: 'email'}, async (username, password, done) => {
  try {
    const user = await models.user.findOne({where: {email: username}});
    if (!user) {
      console.log('Invalid username or password');
      return done(null, false, {message: 'Invalid username or password'});
    }

    bcrypt.compare(password, user.password, function(err, result) {
      if (result === false) {
        console.log('Invalid username or password');
        return done(null, false, {message: 'Invalid username or password'});
      } else {
        console.log('logged in');
        return done(null, user);
      }
    });
  } catch (err) {
    return done(err);
  }
}));

const isAdmin = function(req, res, next) {
  try {
    if (req.user.role) {
      next();
    } else {
      res.send('you must be and admin to access this page');
    }
  } catch {
    res.send('you must be and admin to access this page');
  }
};

const loggedIn = function(req, res, next) {
  try {
    if (req.user) {
      next();
    } else {
      res.send('you must be and admin to access this page');
    }
  } catch {
    res.send('you must be and admin to access this page');
  }
};

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await models.user.findOne({where: {id: id}});
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

module.exports = {
  loggedIn: loggedIn,
  isAdmin: isAdmin,
  initialize: passport.initialize(),
  session: passport.session(),
  setUser: (req, res, next) => {
    res.locals.user = req.user;
    return next();
  },
};
