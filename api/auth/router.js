const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.route('/login').post(controller.login);
router.route('/register').post(controller.register);
router.route('/resend').post(controller.resend);
router.route('/verify').post(controller.verify);

module.exports = router;
