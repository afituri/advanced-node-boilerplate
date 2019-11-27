const asyncHandler = require('express-async-handler');

const codes = require('../../config/codes');

exports.getUsers = asyncHandler(async (req, res, next) => {
  const { User } = req.models;

  const users = await User.list();

  return res.status(codes.ok.status).json(users);
});
