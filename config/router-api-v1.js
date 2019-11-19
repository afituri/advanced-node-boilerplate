const express = require('express');

const users = require('../api/users/router');
const auth = require('../api/auth/router');

const router = express.Router();

router.use('/users', users);
router.use('/auth', auth);

module.exports = router;
