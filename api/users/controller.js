const randomize = require('randomatic');
const validator = require('validator');

const codes = require('../../config/codes');
const logger = require('../../utils/logs');
const validation = require('./validator');
const { apiUrl } = require('../../config');
const emailService = require('../../services/email');

exports.usersCreate = async (req, res) => {
  const { User, Verification } = req.models;
  let { email } = req.body;
  const { name, password, locale, picture, phone } = req.body;

  const notValid = validation.validateCreateUser(req.body);
  if (notValid) {
    return res.status(notValid.status).json(notValid);
  }

  email = validator.normalizeEmail(email, { gmail_remove_dots: false });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(codes.emailExists.status).json(codes.emailExists);
    }
  } catch (err) {
    logger.error(err);
    return res.status(codes.serverError.status).json(codes.serverError);
  }

  const user = new User({
    name,
    email,
    locale,
    password,
    phone,
    picture
  });

  try {
    await user.save();
  } catch (err) {
    logger.error(err);
    return res.status(codes.serverError.status).json(codes.serverError);
  }

  const verification = new Verification({
    userId: user.id,
    pin: randomize('0', 6)
  });

  try {
    await verification.save();
    await emailService.sendEmail(`verification${user.locale}`, {
      pin: verification.pin,
      url: apiUrl,
      email: user.email
    });
  } catch (err) {
    logger.error(err);
    return res.status(codes.serverError.status).json(codes.serverError);
  }

  return res
    .status(codes.userCreated.status)
    .json({ user: user.getPublicFields(), info: codes.userCreated });
};
