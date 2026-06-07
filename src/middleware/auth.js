const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { errorResponse } = require('../utils/response');

/**
 * Middleware to protect administrative routes.
 * Verifies JWT token from 'Authorization: Bearer <token>' header.
 */
function protect(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 'Access denied. Authorization token is missing.', [], 401);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    // Attach admin info (id, username) to request
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 'Access denied. Token is invalid or expired.', [], 401);
  }
}

/**
 * Middleware to protect user/member routes.
 * Verifies JWT token and checks for decoded.user payload structure.
 */
function protectUser(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 'Access denied. Authorization token is missing.', [], 401);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    // User token has payload: { user: { id } }
    if (decoded && decoded.user && decoded.user.id) {
      req.user = decoded.user;
      next();
    } else {
      return errorResponse(res, 'Access denied. Not authorized as user.', [], 401);
    }
  } catch (error) {
    return errorResponse(res, 'Access denied. Token is invalid or expired.', [], 401);
  }
}

module.exports = {
  protect,
  protectUser,
};
