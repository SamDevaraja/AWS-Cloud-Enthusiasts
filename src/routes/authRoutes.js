const express = require('express');
const authController = require('../controllers/authController');
const { protect, protectUser } = require('../middleware/auth');

const router = express.Router();

router.post('/login', authController.login);
router.post('/change-password', protect, authController.changePassword);
router.post('/register', authController.register);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/me', protectUser, authController.getMe);

module.exports = router;
