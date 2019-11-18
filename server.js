const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const logger = require('./utils/logs');
const mongo = require('./utils/mongo');
const { host, port } = require('./config');

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

require('./config/init')(server);

module.exports = server;
