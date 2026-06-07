const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/response');
const { isRajalakshmiEmail } = require('../utils/validation');

/**
 * Handles Login (Admin or User Member)
 */
async function login(req, res, next) {
  try {
    const { username, email, password } = req.body;

    if (!password || (!username && !email)) {
      return errorResponse(res, 'Password and either username or email are required', [], 400);
    }

    if (username) {
      const result = await authService.loginAdmin(username, password);
      return successResponse(res, 'Admin authentication successful', result);
    } else {
      if (!isRajalakshmiEmail(email)) {
        return errorResponse(res, 'Please sign in with your @rajalakshmi.edu.in email address', [], 400);
      }
      const result = await authService.loginUser(email, password);
      return successResponse(res, 'Login successful', result);
    }
  } catch (error) {
    return errorResponse(res, error.message, [], 401);
  }
}

/**
 * Handles Password Change for currently logged-in Admin
 */
async function changePassword(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;
    const adminId = req.user.id;

    if (!oldPassword || !newPassword) {
      return errorResponse(res, 'Current password and new password are required', [], 400);
    }

    if (newPassword.length < 6) {
      return errorResponse(res, 'New password must be at least 6 characters long', [], 400);
    }

    await authService.changeAdminPassword(adminId, oldPassword, newPassword);
    return successResponse(res, 'Password updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, [], 400);
  }
}

/**
 * Handles User Registration
 */
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 'Please enter all fields', [], 400);
    }

    if (!isRajalakshmiEmail(email)) {
      return errorResponse(res, 'Please use your @rajalakshmi.edu.in email address', [], 400);
    }

    const result = await authService.registerUser(name, email, password);
    return successResponse(res, 'Registration successful', result, 201);
  } catch (error) {
    return errorResponse(res, error.message, [], 400);
  }
}

/**
 * Handles Forgot Password request
 */
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, 'Please provide a valid email address', [], 400);
    }

    if (!isRajalakshmiEmail(email)) {
      return errorResponse(res, 'Please use your @rajalakshmi.edu.in email address', [], 400);
    }

    const result = await authService.forgotPassword(email);
    return successResponse(res, `A password reset link has been sent to ${email}. Please check your inbox.`, result);
  } catch (error) {
    return errorResponse(res, error.message, [], 400);
  }
}

/**
 * Handles Reset Password request
 */
async function resetPassword(req, res, next) {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return errorResponse(res, 'Token and both password fields are required', [], 400);
    }

    if (password.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters long', [], 400);
    }

    if (password !== confirmPassword) {
      return errorResponse(res, 'Passwords do not match', [], 400);
    }

    await authService.resetPassword(token, password);
    return successResponse(res, 'Password has been reset successfully. You can now sign in.');
  } catch (error) {
    return errorResponse(res, error.message, [], 400);
  }
}

/**
 * Handles user profile query for the currently logged-in user
 */
async function getMe(req, res, next) {
  try {
    const user = await authService.getUserById(req.user.id);
    if (!user) {
      return errorResponse(res, 'User session not found', [], 404);
    }
    return successResponse(res, 'User profile retrieved successfully', user);
  } catch (error) {
    return errorResponse(res, error.message, [], 500);
  }
}

module.exports = {
  login,
  changePassword,
  register,
  forgotPassword,
  resetPassword,
  getMe,
};
