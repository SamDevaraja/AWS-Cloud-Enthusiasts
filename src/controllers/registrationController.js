const registrationService = require('../services/registrationService');
const ticketService = require('../services/ticketService');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Register student for event.
 * Parses root fields or extracts key credentials (Email, Register Number) from the responses container.
 */
async function register(req, res, next) {
  try {
    const { eventId } = req.params;
    const { responses } = req.body;

    if (!responses) {
      return errorResponse(res, 'Registration form response inputs are required', [], 400);
    }

    // Support email and register number parsed directly or extracted from standard form keys
    const email = req.body.email || responses.Email || responses.email;
    const registerNumber = req.body.registerNumber || 
                           responses['Register Number'] || 
                           responses.registerNumber || 
                           responses.register_number;

    if (!email) {
      return errorResponse(res, 'Validation error: Email is a required default field', [], 400);
    }
    if (!String(email).toLowerCase().endsWith('@rajalakshmi.edu.in')) {
      return errorResponse(res, 'Validation error: Email must be a valid @rajalakshmi.edu.in address', [], 400);
    }
    if (!registerNumber) {
      return errorResponse(res, 'Validation error: Register Number is a required default field', [], 400);
    }

    // Execute transaction-safe registration & QR ticketing
    const data = await registrationService.registerParticipant(
      eventId, 
      String(email).trim(), 
      String(registerNumber).trim(), 
      responses
    );

    return successResponse(res, 'Registration completed successfully', data, 201);
  } catch (error) {
    // 400 Bad Request for validation errors, duplicates, or full capacity
    return errorResponse(res, error.message, [], 400);
  }
}

/**
 * Get ticket details by ticket ID
 */
async function getTicket(req, res, next) {
  try {
    const { ticketId } = req.params;
    const data = await ticketService.getTicketDetails(ticketId);
    return successResponse(res, 'Ticket details retrieved successfully', data);
  } catch (error) {
    const status = error.message.includes('not found') ? 404 : 500;
    return errorResponse(res, error.message, [], status);
  }
}

module.exports = {
  register,
  getTicket,
};
