const mongoose = require('mongoose');
const bluebird = require('bluebird');
const User = require('./user');

mongoose.Promise = bluebird;

module.exports = {
  User
};
