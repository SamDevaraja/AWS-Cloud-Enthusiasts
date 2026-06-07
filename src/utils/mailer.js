const nodemailer = require('nodemailer');
const env = require('../config/env');

const smtpConfigured = Boolean(
  env.SMTP_HOST &&
  env.SMTP_PORT &&
  env.SMTP_USER &&
  env.SMTP_PASS &&
  env.MAIL_FROM
);

if (!smtpConfigured) {
  console.warn('Warning: SMTP email configuration is incomplete. Password reset emails will not be sent.');
}

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT) || 587,
  secure: Number(env.SMTP_PORT) === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, text, html }) => {
  if (!smtpConfigured) {
    throw new Error(
      'SMTP configuration is missing. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM in your server environment.'
    );
  }

  return transporter.sendMail({
    from: env.MAIL_FROM,
    to,
    subject,
    text,
    html,
  });
};

module.exports = {
  sendEmail,
  smtpConfigured,
};
