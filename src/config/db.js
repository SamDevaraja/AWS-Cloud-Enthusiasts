const { Pool } = require('pg');
const env = require('./env');

const isProduction = env.NODE_ENV === 'production';

// Automatically configure SSL for production or cloud instances like NeonDB
const useSSL = env.DATABASE_URL.includes('sslmode=require') || 
               env.DATABASE_URL.includes('neon.tech') || 
               isProduction;

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
  max: 30, // Optimized pool size for concurrent requests
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool,
};
