const asyncHandler = require('express-async-handler');
const randomize = require('randomatic');
const validator = require('validator');

const codes = require('../../config/codes');
const emailService = require('../../services/email');
const validation = require('./validator');

exports.usersCreate = asyncHandler(async (req, res, next) => {
  const { User, Verification } = req.models;
  let { email } = req.body;
  const { name, password, locale, picture, phone } = req.body;

  const notValid = validation.validateCreateUser(req.body);
  if (notValid) {
    return res.status(notValid.status).json(notValid);
  }

  email = validator.normalizeEmail(email, { gmail_remove_dots: false });

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(codes.emailExists.status).json(codes.emailExists);
  }

  const user = new User({
    name,
    email,
    locale,
    password,
    phone,
    picture
  });

  await user.save();

  const verification = new Verification({
    userId: user.id,
    pin: randomize('0', 6)
  });

  await verification.save();
  await emailService.sendEmail(`verification${user.locale}`, {
    pin: verification.pin,
    email: user.email
  });

  return res
    .status(codes.userCreated.status)
    .json({ user: user.getPublicFields(), info: codes.userCreated });
});
