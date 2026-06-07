const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Administrative routes for attendance updates
router.post('/checkin', attendanceController.checkIn);
router.post('/checkout', attendanceController.checkOut);

module.exports = router;
