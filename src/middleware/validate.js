const { errorResponse } = require('../utils/response');

/**
 * Validates that a path parameter is a valid UUID before letting requests hit the database.
 * Prevents unnecessary database queries and format errors.
 * @param {string} paramName Name of the parameter to check (e.g. 'eventId')
 */
function validateUUID(paramName) {
  return (req, res, next) => {
    const value = req.params[paramName];
    // Regular expression for validating UUID standard formats
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

    if (!value || !uuidRegex.test(value)) {
      return errorResponse(
        res, 
        `Validation error: The URL parameter '${paramName}' must be a valid UUID v4 format.`,
        [], 
        400
      );
    }
    next();
  };
}

module.exports = {
  validateUUID,
};
