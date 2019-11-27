const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.route('/').get(controller.getUsers);

module.exports = router;
