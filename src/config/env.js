const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file at project root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const requiredEnv = ['DATABASE_URL', 'JWT_SECRET'];

for (const env of requiredEnv) {
  if (!process.env[env]) {
    console.error(`Error: Missing required environment variable ${env}`);
    process.exit(1);
  }
}

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  MAIL_FROM: process.env.MAIL_FROM,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};
