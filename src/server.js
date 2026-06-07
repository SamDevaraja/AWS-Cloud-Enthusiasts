const app = require('./app');
const env = require('./config/env');
const db = require('./config/db');

// Trigger reload

async function startServer() {
  try {
    // Database connection check
    await db.query('SELECT 1');
    console.log('Database connection verification: SUCCESS.');

    const port = env.PORT;
    app.listen(port, () => {
      console.log(`Server is running on port ${port} in ${env.NODE_ENV} mode.`);
      console.log(`API documentation available at http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('Database connection verification: FAILED. Exiting...', error);
    process.exit(1);
  }
}

startServer();
