const bcrypt = require('bcrypt');
const { query } = require('../config/db');

async function seed() {
  console.log('Clearing database tables for fresh seed...');
  try {
    // 0. Truncate all tables CASCADE to ensure clean slate
    await query(`
      TRUNCATE TABLE 
        archived_attendance, archived_registrations, archive_logs, 
        export_logs, attendance, tickets, registration_field_values, 
        registrations, form_fields, events, admins 
      CASCADE
    `);
    console.log('Tables truncated successfully.');

    // 1. Create Default Admin User
    const adminUsername = 'admin';
    const adminPassword = 'CloudEnthusiasts2026!';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

    const adminRes = await query(
      'INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING id',
      [adminUsername, passwordHash]
    );
    const adminId = adminRes.rows[0].id;
    console.log(`Admin user created (ID: ${adminId})`);

    // 2. Creating Sample Events
    console.log('Creating sample events...');
    
    // Investiture Ceremony (Event 1)
    const investitureEvent = await query(`
      INSERT INTO events (
        name, description, venue, date, start_time, end_time, 
        registration_open, registration_close, event_banner_url, max_participants, event_status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      ) RETURNING id
    `, [
      'Investiture Ceremony',
      'Join us as we step into a new chapter of innovation, collaboration and leadership. Where ideas meet the cloud, and leadership shapes the future.',
      'ANEW201',
      '2026-02-21',
      '09:30:00',
      '12:00:00',
      '2026-01-01 00:00:00',
      '2026-02-20 23:59:59',
      '/assets/investiture.jpg',
      150,
      'ACTIVE'
    ]);
    const awsId = investitureEvent.rows[0].id;

    // CLOUD MATRIX Event (Event 2)
    const cloudMatrixEvent = await query(`
      INSERT INTO events (
        name, description, venue, date, start_time, end_time, 
        registration_open, registration_close, event_banner_url, max_participants, event_status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      ) RETURNING id
    `, [
      'CLOUD MATRIX',
      'Cloud Computing - From Basics to Careers & Certifications. Learn core concepts, career paths, and certification maps in this comprehensive session hosted by AWS Cloud Club REC.',
      'ANEW104',
      '2026-04-18',
      '08:00:00',
      '10:00:00',
      '2026-03-01 00:00:00',
      '2026-04-17 23:59:59',
      '/assets/cloud_matrix.jpg',
      120,
      'ACTIVE'
    ]);
    const cloudMatrixId = cloudMatrixEvent.rows[0].id;

    // AWS Community Day (Event 3)
    const communityDayEvent = await query(`
      INSERT INTO events (
        name, description, venue, date, start_time, end_time, 
        registration_open, registration_close, event_banner_url, max_participants, event_status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      ) RETURNING id
    `, [
      'AWS Community Day',
      'Experience a day of Cloud, Code, Community and Innovation! Join developers, cloud enthusiasts, and tech leaders from across the region. Let\'s Build Together!',
      'Rajalakshmi Engineering College',
      '2026-09-12',
      '09:30:00',
      '17:00:00',
      '2026-06-01 00:00:00',
      '2026-09-11 23:59:59',
      '/assets/community_day.jpg',
      300,
      'ACTIVE'
    ]);
    const communityDayId = communityDayEvent.rows[0].id;

    // ROBOWOLKE Event (Event 4)
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
      '/assets/robowolke.png',
      200,
      'ACTIVE'
    ]);
    const robowolkeId = robowolkeEvent.rows[0].id;

    console.log('Events created. Inserting form fields...');

    // Default fields required for every event
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
      `, [awsId, f.name, f.label, f.type, f.req, f.def, f.sort]);

      await query(`
        INSERT INTO form_fields (event_id, field_name, field_label, field_type, is_required, is_default, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [cloudMatrixId, f.name, f.label, f.type, f.req, f.def, f.sort]);

      await query(`
        INSERT INTO form_fields (event_id, field_name, field_label, field_type, is_required, is_default, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [communityDayId, f.name, f.label, f.type, f.req, f.def, f.sort]);

      await query(`
        INSERT INTO form_fields (event_id, field_name, field_label, field_type, is_required, is_default, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [robowolkeId, f.name, f.label, f.type, f.req, f.def, f.sort]);
    }

    // Custom fields for AWS
    await query(`
      INSERT INTO form_fields (event_id, field_name, field_label, field_type, is_required, is_default, sort_order, select_options)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      awsId, 
      'Year', 
      'Year of Study', 
      'select', 
      true, 
      false, 
      5, 
      JSON.stringify(['1st Year', '2nd Year', '3rd Year', '4th Year'])
    ]);

    await query(`
      INSERT INTO form_fields (event_id, field_name, field_label, field_type, is_required, is_default, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [awsId, 'Phone Number', 'Phone Number', 'tel', true, false, 6]);

    // Custom fields for CLOUD MATRIX
    await query(`
      INSERT INTO form_fields (event_id, field_name, field_label, field_type, is_required, is_default, sort_order, select_options)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      cloudMatrixId, 
      'Year', 
      'Year of Study', 
      'select', 
      true, 
      false, 
      5, 
      JSON.stringify(['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'])
    ]);

    await query(`
      INSERT INTO form_fields (event_id, field_name, field_label, field_type, is_required, is_default, sort_order, select_options)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      cloudMatrixId, 
      'Prior Experience', 
      'Do you have prior cloud experience?', 
      'select', 
      true, 
      false, 
      6, 
      JSON.stringify(['Yes', 'No', 'Basic Theoretical Knowledge'])
    ]);

    // Custom fields for AWS Community Day
    await query(`
      INSERT INTO form_fields (event_id, field_name, field_label, field_type, is_required, is_default, sort_order, select_options)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      communityDayId, 
      'T-Shirt Size', 
      'T-Shirt Size', 
      'select', 
      true, 
      false, 
      5, 
      JSON.stringify(['S', 'M', 'L', 'XL', 'XXL'])
    ]);

    await query(`
      INSERT INTO form_fields (event_id, field_name, field_label, field_type, is_required, is_default, sort_order, select_options)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      communityDayId, 
      'Food Preference', 
      'Food Preference', 
      'select', 
      true, 
      false, 
      6, 
      JSON.stringify(['Veg', 'Non-Veg'])
    ]);

    console.log('Form fields created successfully!');
    console.log('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
