const { query } = require('../config/db');

async function fixStatus() {
  try {
    await query(`
      UPDATE events 
      SET event_status = 'ACTIVE' 
      WHERE name = 'ROBOWOLKE - FROM PIXELS TO MOTION!'
    `);
    console.log('Event status updated to ACTIVE');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
fixStatus();
