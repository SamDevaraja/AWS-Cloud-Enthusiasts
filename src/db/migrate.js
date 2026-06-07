const fs = require('fs');
const path = require('path');
const { query } = require('../config/db');

async function migrate() {
  console.log('Starting database migrations...');
  try {
    const migrationFile = path.join(__dirname, 'migrations', '001_initial_schema.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');
    
    await query(sql);
    console.log('Database migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

migrate();
