const express = require('express');
const authRoutes = require('./authRoutes');
const eventRoutes = require('./eventRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const ticketRoutes = require('./ticketRoutes');

const router = express.Router();

// Mount modules under unique route prefixes
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/tickets', ticketRoutes);

module.exports = router;
