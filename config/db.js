/* eslint no-param-reassign: ["error", { "props": false }] */
const mongoose = require('../models');

module.exports = (app) => {
  app.locals.models = mongoose;
};
