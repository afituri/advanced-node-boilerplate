const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.route('/').post(controller.verify);
router.route('/resend').post(controller.resend);

module.exports = router;
