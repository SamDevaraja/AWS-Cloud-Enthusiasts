const rateLimit = require('express-rate-limit');
const env = require('../config/env');

/**
 * Global rate limiter to protect endpoints from brute-force scanning.
 */
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, // defaults to 15 minutes (900000 ms)
  max: env.RATE_LIMIT_MAX,            // defaults to 100 requests per IP per windowMs
  standardHeaders: true,              // Return rate limit info in standard headers
  legacyHeaders: false,               // Disable legacy rate limit headers
  message: {
    success: false,
    message: 'Too many requests from this client IP address. Please try again after 15 minutes.',
    errors: [{ msg: 'API Rate limit exceeded' }]
  }
});

module.exports = limiter;
