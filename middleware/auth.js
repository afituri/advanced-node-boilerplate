const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');

const isUser = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
};

const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
};

// Protect routes
const protect = asyncHandler(async (req, _, next) => {
  let token;
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith('Bearer')) {
    // Set token from Bearer token in header
    token = authorization.split(' ')[1];
    // Set token from cookie
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // eslint-disable-next-line no-console
    console.log(decoded);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

module.exports = {
  isUser,
  isAdmin,
  protect
};
