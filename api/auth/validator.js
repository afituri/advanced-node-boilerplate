const mongoose = require('mongoose');
const validator = require('validator');
const codes = require('../../config/codes');

exports.validateLogin = body => {
  const { email, password } = body;
  if (!email) {
    return codes.missingEmail;
  }
  if (!validator.isEmail(email)) {
    return codes.invalidEmail;
  }
  if (!password) {
    return codes.missingPassword;
  }

  return false;
};

exports.validateRegister = body => {
  const { email, password } = body;
  if (!email) {
    return codes.missingEmail;
  }
  if (!validator.isEmail(email)) {
    return codes.invalidEmail;
  }
  if (!password) {
    return codes.missingPassword;
  }

  return false;
};

exports.validateRegister = body => {
  const { email, password, locale } = body;
  if (!email) {
    return codes.missingEmail;
  }
  if (!validator.isEmail(email)) {
    return codes.invalidEmail;
  }
  if (!password) {
    return codes.missingPassword;
  }
  if (!validator.isLength(password, { min: 8, max: 128 })) {
    return codes.invalidPassword;
  }
  if (locale && locale !== 'EN' && locale !== 'AR') {
    return codes.invalidLocale;
  }
  return false;
};

exports.validateVerify = body => {
  const { pin, userId } = body;
  if (!pin) {
    return codes.missingPin;
  }
  if (!userId) {
    return codes.missingUserId;
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return codes.invalidId;
  }

  return false;
};

exports.validateResend = body => {
  const { userId } = body;

  if (!userId) {
    return codes.missingUserId;
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return codes.invalidId;
  }

  return false;
};
