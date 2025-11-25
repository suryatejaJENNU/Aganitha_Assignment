// Import the PostgreSQL Pool class to manage database connections
const { Pool } = require('pg');

// Load environment variables from .env file (e.g., DATABASE_URL)
require('dotenv').config();

// Create a new connection pool using the DATABASE_URL from .env
// This pool allows multiple queries without reconnecting each time
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // SSL configuration (required for many cloud Postgres providers like Neon, Render, Railway)
  ssl: {
    rejectUnauthorized: false // Allows SSL connection without certificate validation
  }
});

// Handle unexpected errors on idle clients in the pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle Postgres client', err);
  process.exit(-1); // Stop the server if a serious DB error occurs
});

// Export the pool so other files/modules can use it for queries
module.exports = pool;
