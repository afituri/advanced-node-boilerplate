const validator = require('validator');
const codes = require('../../config/codes');

exports.validateCreateUser = body => {
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
