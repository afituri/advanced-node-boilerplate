const mongoose = require('mongoose');
const bluebird = require('bluebird');
const User = require('./user');
const Verification = require('./verification');

mongoose.Promise = bluebird;

module.exports = {
  User,
  Verification
};
