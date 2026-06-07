const crypto = require('crypto');

/**
 * Calculates SHA-256 checksum of a buffer or string.
 * Used for verifying file integrity before archiving logs.
 * @param {Buffer|string} content
 * @returns {string} sha256 checksum hex
 */
function calculateHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

module.exports = {
  calculateHash,
};
