const express = require('express');
const eventController = require('../controllers/eventController');
const registrationController = require('../controllers/registrationController');
const exportController = require('../controllers/exportController');
const { protect } = require('../middleware/auth');
const { validateUUID } = require('../middleware/validate');

const router = express.Router();

router.get('/live', eventController.getLiveEvents);
router.get('/archive/logs', eventController.getArchiveLogs);
router.get('/:eventId', validateUUID('eventId'), eventController.getEventById);
router.get('/:eventId/form', validateUUID('eventId'), eventController.getEventForm);
router.post('/:eventId/register', validateUUID('eventId'), registrationController.register);
router.get('/:eventId/stats', validateUUID('eventId'), eventController.getEventStats);
router.get('/:eventId/registrations', validateUUID('eventId'), eventController.getEventRegistrations);

// Administrative Export & Archive Routes
router.get('/:eventId/export/registrations/csv', validateUUID('eventId'), exportController.exportRegistrationsCSV);
router.get('/:eventId/export/registrations/excel', validateUUID('eventId'), exportController.exportRegistrationsExcel);
router.get('/:eventId/export/attendance/csv', validateUUID('eventId'), exportController.exportAttendanceCSV);
router.get('/:eventId/export/attendance/excel', validateUUID('eventId'), exportController.exportAttendanceExcel);
router.post('/:eventId/export/confirm', validateUUID('eventId'), exportController.confirmExport);
router.post('/:eventId/archive/rollback', validateUUID('eventId'), exportController.rollbackExport);

module.exports = router;
