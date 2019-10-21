const validator = require('validator');
const validation = require('./validator');
const codes = require('../../config/codes');
const logger = require('../../utils/logs');

exports.usersCreate = async (req, res, next) => {
  const { User } = req.models;
  let { email } = req.body;
  const { name, password, locale, picture, phone } = req.body;
  const notValid = validation.validateCreateUser(req.body);

  if (notValid) {
    return res.status(notValid.status).json(notValid);
  }

  email = validator.normalizeEmail(email);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(codes.emailExists.status).json(codes.emailExists);
    }
  } catch (err) {
    logger.error(err);
    return next(err);
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
    return next(err);
  }
  return res
    .status(codes.userCreated.status)
    .json({ user: user.getPublicFields(), info: codes.userCreated });
};
