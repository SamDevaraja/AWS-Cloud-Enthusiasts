const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const env = require('../config/env');

/**
 * Validates admin credentials and generates a JWT.
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<Object>} Object containing token and user profile
 */
async function loginAdmin(username, password) {
  const result = await query('SELECT * FROM admins WHERE username = $1', [username]);
  if (result.rows.length === 0) {
    throw new Error('Invalid username or password');
  }

  const admin = result.rows[0];
  const isMatch = await bcrypt.compare(password, admin.password_hash);
  if (!isMatch) {
    throw new Error('Invalid username or password');
  }

  // Generate JWT payload with identification
  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  return {
    token,
    admin: {
      id: admin.id,
      username: admin.username,
    },
  };
}

/**
 * Changes password of currently authenticated admin.
 * @param {string} adminId 
 * @param {string} oldPassword 
 * @param {string} newPassword 
 * @returns {Promise<boolean>}
 */
async function changeAdminPassword(adminId, oldPassword, newPassword) {
  const result = await query('SELECT * FROM admins WHERE id = $1', [adminId]);
  if (result.rows.length === 0) {
    throw new Error('Admin account not found');
  }

  const admin = result.rows[0];
  const isMatch = await bcrypt.compare(oldPassword, admin.password_hash);
  if (!isMatch) {
    throw new Error('Incorrect current password');
  }

  const saltRounds = 10;
  const newHash = await bcrypt.hash(newPassword, saltRounds);

  await query(
    'UPDATE admins SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [newHash, adminId]
  );
  return true;
}

/**
 * Registers a new user member.
 */
async function registerUser(name, email, password) {
  // Check if user already exists
  const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    throw new Error('A user with this email address already exists');
  }

  // Hash password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Insert user
  const result = await query(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
    [name, email, passwordHash]
  );

  const newUser = result.rows[0];

  // Generate User Token
  const token = jwt.sign(
    { user: { id: newUser.id } },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: newUser,
  };
}

/**
 * Authenticates a user member.
 */
async function loginUser(email, password) {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // Generate User Token
  const token = jwt.sign(
    { user: { id: user.id } },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

/**
 * Handles forgot password flow (sends email).
 */
const { sendEmail } = require('../utils/mailer');
async function forgotPassword(email) {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    throw new Error('No user registered with this email address');
  }

  const user = result.rows[0];

  // Generate reset token
  const resetToken = jwt.sign(
    { userId: user.id },
    env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const cleanUrl = env.FRONTEND_URL.replace(/\/$/, '');
  const resetLink = `${cleanUrl}/reset-password/${resetToken}`;
  const subject = 'Password reset request';
  const text = `Hello ${user.name},\n\n` +
    `You can reset your password using the link below. This link expires in 1 hour:\n\n` +
    `${resetLink}\n\n` +
    `If you did not request a password reset, please ignore this email.`;
  const html = `
    <p>Hello ${user.name},</p>
    <p>You can reset your password using the link below. This link expires in <strong>1 hour</strong>:</p>
    <p><a href="${resetLink}">${resetLink}</a></p>
    <p>If you did not request a password reset, please ignore this email.</p>
  `;

  await sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });

  return { resetLink };
}

/**
 * Resets user password using reset token.
 */
async function resetPassword(token, password) {
  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Reset token has expired. Please request a new password reset.');
    }
    throw new Error('Invalid reset token. Please request a new password reset.');
  }

  const result = await query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
  if (result.rows.length === 0) {
    throw new Error('Invalid password reset token');
  }

  const user = result.rows[0];
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  await query(
    'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [passwordHash, user.id]
  );

  return true;
}

/**
 * Retrieves user profile by user ID.
 */
async function getUserById(id) {
  const result = await query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
}

module.exports = {
  loginAdmin,
  changeAdminPassword,
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserById,
};
