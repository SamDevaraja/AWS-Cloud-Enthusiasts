const express = require('express');
const registrationController = require('../controllers/registrationController');
const { validateUUID } = require('../middleware/validate');

const router = express.Router();

// Publicly viewable ticket route
router.get('/:ticketId', validateUUID('ticketId'), registrationController.getTicket);

module.exports = router;
