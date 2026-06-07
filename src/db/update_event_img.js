const { query } = require('../config/db');

async function updateEvent() {
  try {
    await query(`
      UPDATE events 
      SET event_banner_url = '/assets/robowolke.png' 
      WHERE name = 'ROBOWOLKE - FROM PIXELS TO MOTION!'
    `);
    console.log('Event banner URL updated to .png');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
updateEvent();
