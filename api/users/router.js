const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.route('/').post(controller.usersCreate);
// router.route('/confirmation').post(controller.usersConfirmation);
// router.route('/resend').post(controller.usersResendToken);

module.exports = router;
