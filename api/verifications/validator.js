const mongoose = require('mongoose');
const codes = require('../../config/codes');

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
