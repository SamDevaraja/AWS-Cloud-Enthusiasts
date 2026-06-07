const env = require('../config/env');
const { errorResponse } = require('../utils/response');

/**
 * Centred Express error handling middleware.
 * Formats errors and logs the stack trace.
 */
function errorHandler(err, req, res, next) {
  console.error('Error Captured: ', err.stack || err.message || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected server error occurred';
  
  // Expose stack trace details ONLY in development mode
  const debugInfo = env.NODE_ENV === 'development' 
    ? { stack: err.stack, originalError: err.message } 
    : [];

  return errorResponse(res, message, debugInfo, statusCode);
}

module.exports = errorHandler;
