const { query } = require('../config/db');

async function addEvent() {
  try {
    const robowolkeEvent = await query(`
      INSERT INTO events (
        name, description, venue, date, start_time, end_time, 
        registration_open, registration_close, event_banner_url, max_participants, event_status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      ) RETURNING id
    `, [
      'ROBOWOLKE - FROM PIXELS TO MOTION!',
      'Workshop about DOBOT + Computer Vision Integration with AWS. Open to all UG Departments. Free Registrations. Certificates will be provided.',
      'ANEW104',
      '2026-04-29',
      '09:00:00',
      '14:00:00',
      '2026-04-01 00:00:00',
      '2026-04-28 23:59:59',
      'https://github.com/shadcn.png', // Temporary placeholder until image is saved
      200,
      'COMPLETED'
    ]);
    const eventId = robowolkeEvent.rows[0].id;
    console.log(`Event added with ID: ${eventId}`);

    const defaultFields = [
      { name: 'Name', label: 'Full Name', type: 'text', req: true, def: true, sort: 1 },
      { name: 'Register Number', label: 'Registration / Roll Number', type: 'text', req: true, def: true, sort: 2 },
      { name: 'Email', label: 'Email Address', type: 'email', req: true, def: true, sort: 3 },
      { name: 'Department', label: 'Department', type: 'text', req: true, def: true, sort: 4 }
    ];

    for (const f of defaultFields) {
      await query(`
        INSERT INTO form_fields (event_id, field_name, field_label, field_type, is_required, is_default, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [eventId, f.name, f.label, f.type, f.req, f.def, f.sort]);
    }
    console.log('Fields added.');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
addEvent();
