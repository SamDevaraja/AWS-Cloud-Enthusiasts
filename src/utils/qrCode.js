const QRCode = require('qrcode');

/**
 * Generates a base64 Data URI representing the QR Code for a given payload.
 * The payload typically contains: ticketId, eventId, registrationId.
 * @param {Object} payload 
 * @returns {Promise<string>} Base64 Data URL
 */
async function generateQRCodeBase64(payload) {
  try {
    const jsonString = JSON.stringify(payload);
    const base64Url = await QRCode.toDataURL(jsonString, {
      errorCorrectionLevel: 'H', // High error correction to ensure reliable ticket scans
      margin: 2,
      width: 300,
    });
    return base64Url;
  } catch (error) {
    console.error('Error generating QR Code:', error);
    throw new Error('Failed to generate QR Code');
  }
}

module.exports = {
  generateQRCodeBase64,
};
