const asyncHandler = require('express-async-handler');
const randomize = require('randomatic');

const codes = require('../../config/codes');
const emailService = require('../../services/email');
const validation = require('./validator');

exports.verify = asyncHandler(async (req, res) => {
  const { User, Verification } = req.models;
  const { userId, pin } = req.body;
  let user = null;

  const notValid = validation.validateVerify(req.body);
  if (notValid) {
    return res.status(notValid.status).json(notValid);
  }

  user = await User.findById(userId);
  const verification = await Verification.findOne({ userId });

  if (!user) {
    return res.status(codes.userNotFound.status).json(codes.userNotFound);
  }
  if (user.isActive) {
    return res.status(codes.alreadyVerified.status).json(codes.alreadyVerified);
  }
  if (!verification) {
    return res.status(codes.expiredPin.status).json(codes.expiredPin);
  }
  if (pin !== verification.pin) {
    return res.status(codes.wrongPin.status).json(codes.wrongPin);
  }

  user.isActive = true;
  await user.save();

  return res
    .status(codes.userVerified.status)
    .json({ user: user.getPublicFields(), info: codes.userVerified });
});

// We need to add pin resend attempts limit
exports.resend = asyncHandler(async (req, res) => {
  const { User, Verification } = req.models;
  const { userId } = req.body;
  let user = null;

  const notValid = validation.validateResend(req.body);
  if (notValid) {
    return res.status(notValid.status).json(notValid);
  }

  user = await User.findById(userId);

  if (!user) {
    return res.status(codes.userNotFound.status).json(codes.userNotFound);
  }
  if (user.isActive) {
    return res.status(codes.alreadyVerified.status).json(codes.alreadyVerified);
  }

  await Verification.findOneAndDelete({ userId });
  const verification = new Verification({
    userId: user.id,
    pin: randomize('0', 6)
  });

  await verification.save();
  await emailService.sendEmail(`verification${user.locale}`, {
    pin: verification.pin,
    email: user.email
  });

  return res.status(codes.pinResent.status).json({ info: codes.pinResent });
});
