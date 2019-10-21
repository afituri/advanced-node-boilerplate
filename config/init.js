const db = require('./db');
const express = require('./express');
const routes = require('./routes');

module.exports = (app) => {
  db(app);
  express(app);
  routes(app);
};
