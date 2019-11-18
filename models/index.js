const mongoose = require('mongoose');
const bluebird = require('bluebird');
const User = require('./User');
const Verification = require('./Verification');

mongoose.Promise = bluebird;

module.exports = {
  User,
  Verification
};
