const express = require('express');
const session = require('express-session');
const mongoSessionStore = require('connect-mongo');
const mongoose = require('mongoose');
require('dotenv').config();

const logger = require('./utils/logs');
const mongo = require('./utils/mongo');
const { host, port, sessionSecret } = require('./config');
// const { insertTemplates } = require("./models/emailTemplate");

const dev = process.env.NODE_ENV !== 'production';

// ----------------------------------------
// Server
// ----------------------------------------
const server = express();

// If we're running this file directly, start up the server
if (require.main === module) {
  server.listen.apply(server, [port]);
  logger.info(`> Ready on http://${host}:${port}\n`);
}

// ---------------------------------------
// Mongoose init
// ---------------------------------------
server.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    mongo(req).then(() => next());
  }
});

// ----------------------------------------
// Sessions
// ----------------------------------------
const MongoStore = mongoSessionStore(session);
const sess = {
  name: 'boilerplate.sid',
  secret: sessionSecret,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 14 * 24 * 60 * 60 // save session 14 days
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 14 * 24 * 60 * 60 * 1000 // expires in 14 days
  }
};

if (!dev) {
  server.set('trust proxy', 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

server.use(session(sess));

// insertTemplates();

require('./config/init')(server);

module.exports = server;
