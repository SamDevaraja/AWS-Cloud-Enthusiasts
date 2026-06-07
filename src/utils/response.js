/**
 * Standard Success Response helper
 * @param {Object} res Express Response Object
 * @param {string} message Description message
 * @param {Object|Array} data Payload
 * @param {number} statusCode HTTP status code (default 200)
 */
function successResponse(res, message, data = {}, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Standard Error Response helper
 * @param {Object} res Express Response Object
 * @param {string} message Error message
 * @param {Array|string} errors Specific field validation or system errors
 * @param {number} statusCode HTTP status code (default 500)
 */
function errorResponse(res, message, errors = [], statusCode = 500) {
  const formattedErrors = Array.isArray(errors) 
    ? errors 
    : typeof errors === 'string' 
      ? [{ msg: errors }] 
      : [errors];

  return res.status(statusCode).json({
    success: false,
    message,
    errors: formattedErrors,
  });
}

module.exports = {
  successResponse,
  errorResponse,
};
