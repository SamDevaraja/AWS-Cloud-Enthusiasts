const eventService = require('../services/eventService');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Get all active, unarchived events with optional pagination.
 */
async function getLiveEvents(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const data = await eventService.getLiveEvents(page, limit);
    return successResponse(res, 'Active events retrieved successfully', data);
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve active events', error.message, 500);
  }
}

/**
 * Get single event details by UUID.
 */
async function getEventById(req, res, next) {
  try {
    const { eventId } = req.params;
    const data = await eventService.getEventById(eventId);
    return successResponse(res, 'Event details retrieved successfully', data);
  } catch (error) {
    const status = error.message.includes('not found') ? 404 : 500;
    return errorResponse(res, error.message, [], status);
  }
}

/**
 * Get dynamic registration form configuration for an event.
 */
async function getEventForm(req, res, next) {
  try {
    const { eventId } = req.params;
    const fields = await eventService.getEventFormFields(eventId);
    return successResponse(res, 'Event registration form configuration retrieved successfully', { fields });
  } catch (error) {
    const status = error.message.includes('not found') ? 404 : 500;
    return errorResponse(res, error.message, [], status);
  }
}

/**
 * Get statistics (registrations, check-ins, remaining capacity) for an event (Admin Only)
 */
async function getEventStats(req, res, next) {
  try {
    const { eventId } = req.params;
    const stats = await eventService.getEventStats(eventId);
    return successResponse(res, 'Event statistics retrieved successfully', stats);
  } catch (error) {
    const status = error.message.includes('not found') ? 404 : 500;
    return errorResponse(res, error.message, [], status);
  }
}

/**
 * Get all registrations for an event (Admin Only)
 */
async function getEventRegistrations(req, res, next) {
  try {
    const { eventId } = req.params;
    const registrations = await eventService.getEventRegistrations(eventId);
    return successResponse(res, 'Event registrations retrieved successfully', { registrations });
  } catch (error) {
    const status = error.message.includes('not found') ? 404 : 500;
    return errorResponse(res, error.message, [], status);
  }
}

/**
 * Get all archive logs (Admin Only)
 */
async function getArchiveLogs(req, res, next) {
  try {
    const logs = await eventService.getArchiveLogs();
    return successResponse(res, 'Archive logs retrieved successfully', { logs });
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve archive logs', error.message, 500);
  }
}

module.exports = {
  getLiveEvents,
  getEventById,
  getEventForm,
  getEventStats,
  getEventRegistrations,
  getArchiveLogs,
};
