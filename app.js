const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const loginRouter = require('./routes/loginRouter.js');
const mysqlRouter = require('./routes/mysqlRoutes.js');
const mongoRouter = require('./routes/mongoRoutes.js');
const neoRouter = require('./routes/neoRoutes.js');
const mongoose = require('mongoose');
const auth = require('./util/auth');

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://TestUsername:Ut9ggksexDCo74JA@cluster0.ggjoozw.mongodb.net/?retryWrites=true&w=majority');
}

module.exports.app = (config) => {
  const app = express();
  app.use('/', express.static(path.join(__dirname, '../public')));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(cookieParser());

  app.use(session({
    secret: 'very secret 12345',
    resave: true,
    saveUninitialized: false,
  }));

  app.use(auth.initialize);
  app.use(auth.session);
  app.use(auth.setUser);

  app.use('/', loginRouter);
  app.use('/mysql', mysqlRouter);
  app.use('/mongo', mongoRouter);
  app.use('/neo', neoRouter);

  return app;
};
