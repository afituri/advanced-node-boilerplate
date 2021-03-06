const express = require('express');
const passport = require('passport');

const users = require('../api/users/router');
const auth = require('../api/auth/router');

const router = express.Router();
router.use('/users', passport.authenticate('jwt', { session: false }), users);
router.use('/auth', auth);

module.exports = router;
