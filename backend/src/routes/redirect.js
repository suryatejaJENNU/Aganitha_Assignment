const express = require("express");
const router = express.Router();
const pool = require("../db");

// Regular expression to validate short link codes (6–8 alphanumeric characters)
const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

/**
 * Route: GET /:code
 * Purpose: Redirect the user to the original URL for a given short code.
 *
 * Steps:
 * 1. Validate the code format.
 * 2. Look up the target URL in the database.
 * 3. If found, increment click count + update last clicked time.
 * 4. Emit a realtime event to connected clients (for dashboard updates).
 * 5. Redirect to the target URL.
 */
router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;

    // If the code format is invalid, return 404 immediately
    if (!CODE_REGEX.test(code)) {
      return res.status(404).send("Not found");
    }

    // Fetch target URL based on the short code
    const { rows, rowCount } = await pool.query(
      "SELECT id, target_url FROM links WHERE code = $1 LIMIT 1",
      [code]
    );

    // If code does not exist in DB, return 404
    if (rowCount === 0) {
      return res.status(404).send("Not found");
    }

    const link = rows[0];

    // Update total clicks + last clicked timestamp
    await pool.query(
      "UPDATE links SET total_clicks = total_clicks + 1, last_clicked_at = NOW() WHERE id = $1",
      [link.id]
    );

    // Emit real-time update event using Socket.io (for analytics dashboard)
    const io = req.app.get("io");
    io.emit("click_updated", { code });

    // Redirect user to the actual target URL
    return res.redirect(302, link.target_url);
  } catch (err) {
    console.error("Redirect error:", err);
    return res.status(500).send("Internal server error");
  }
});

// Export router so it can be used by the main server file
module.exports = router;
