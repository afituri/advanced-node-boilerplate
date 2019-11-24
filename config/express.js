const compression = require('compression');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const logger = require('../utils/logs');

module.exports = app => {
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(compression());
  app.use((error, req, res, next) => {
    logger.error(error.status);
  });
};
