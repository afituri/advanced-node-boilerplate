const express = require('express');

const users = require('../api/users/router');
const verifications = require('../api/verifications/router');

const router = express.Router();
router.use('/users', users);
router.use('/verifications', verifications);

module.exports = router;
