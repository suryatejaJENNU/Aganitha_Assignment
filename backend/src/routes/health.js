const express = require('express');
const router = express.Router();

/**
 * GET /healthz
 * ------------
 * Health check endpoint used by load balancers, monitoring tools,
 * or uptime services to check whether the server is running properly.
 *
 * Returns:
 *  - ok: true → service is healthy
 *  - version: service version identifier
 *  - uptime: number of seconds since server started
 *  - timestamp: current server time in ISO format
 */
router.get('/healthz', (req, res) => {
  res.status(200).json({
    ok: true,
    version: '1.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Export router so this endpoint can be mounted in the main server
module.exports = router;
