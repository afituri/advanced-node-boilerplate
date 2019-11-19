const express = require('express');

const router = express.Router();

const controller = require('./controller');
const { protect } = require('../../middleware/auth');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/logout', controller.logout);
router.get('/me', protect, controller.getMe);
router.put('/updatedetails', protect, controller.updateDetails);
router.put('/updatepassword', protect, controller.updatePassword);

module.exports = router;
