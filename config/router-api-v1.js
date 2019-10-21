const express = require('express');

const users = require('../api/users/router');

const router = express.Router();
router.use('/users', users);

module.exports = router;
