const attendanceService = require('../services/attendanceService');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Perform Participant Check-in (Admin Only)
 */
async function checkIn(req, res, next) {
  try {
    const { ticketId, emailOrRegNo, eventId } = req.body;

    if (!eventId) {
      return errorResponse(res, 'Validation error: eventId is required', [], 400);
    }
    if (!ticketId && !emailOrRegNo) {
      return errorResponse(res, 'Validation error: ticketId or emailOrRegNo (fallback) is required', [], 400);
    }

    const data = await attendanceService.checkIn(ticketId, emailOrRegNo, eventId);
    return successResponse(res, 'Participant checked in successfully', data);
  } catch (error) {
    return errorResponse(res, error.message, [], 400);
  }
}

/**
 * Perform Participant Check-out (Admin Only)
 */
async function checkOut(req, res, next) {
  try {
    const { ticketId, emailOrRegNo, eventId } = req.body;

    if (!eventId) {
      return errorResponse(res, 'Validation error: eventId is required', [], 400);
    }
    if (!ticketId && !emailOrRegNo) {
      return errorResponse(res, 'Validation error: ticketId or emailOrRegNo (fallback) is required', [], 400);
    }

    const data = await attendanceService.checkOut(ticketId, emailOrRegNo, eventId);
    return successResponse(res, 'Participant checked out successfully', data);
  } catch (error) {
    return errorResponse(res, error.message, [], 400);
  }
}

module.exports = {
  checkIn,
  checkOut,
};
