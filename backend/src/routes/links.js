const express = require('express');
const router = express.Router();
const pool = require('../db');
const { isValidUrl, isValidCode } = require('../utils/validate');
const { generateCode } = require('../utils/generateCode');

/**
 * Helper Function: generateUniqueCode()
 * --------------------------------------
 * Generates a random 6-character code and ensures that
 * it does NOT already exist in the database.
 * Repeats until a unique code is found.
 */
async function generateUniqueCode() {
  let code;
  let exists = true;

  while (exists) {
    // Generate random 6-character code
    code = generateCode(6);

    // Check if code already exists in DB
    const { rowCount } = await pool.query(
      'SELECT 1 FROM links WHERE code = $1',
      [code]
    );

    exists = rowCount > 0; // If row exists → code is taken → generate again
  }

  return code;
}

/**
 * POST /api/links
 * ----------------
 * Create a new short link.
 *
 * Steps:
 * 1. Validate URL.
 * 2. If custom code provided → validate format + check uniqueness.
 * 3. Else → generate a unique code.
 * 4. Insert into database.
 * 5. Respond with full link data including generated short URL.
 */
router.post('/', async (req, res) => {
  try {
    let { url, code } = req.body;

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid or missing URL' });
    }

    // Custom code provided by user
    if (code) {
      // Validate format
      if (!isValidCode(code)) {
        return res
          .status(400)
          .json({ error: 'Code must match [A-Za-z0-9]{6,8}' });
      }

      // Check for uniqueness
      const { rowCount } = await pool.query(
        'SELECT 1 FROM links WHERE code = $1',
        [code]
      );

      if (rowCount > 0) {
        return res.status(409).json({ error: 'Code already exists' });
      }
    } else {
      // No custom code → generate one
      code = await generateUniqueCode();
    }

    // Insert new short link into DB
    const insertQuery = `
      INSERT INTO links (code, target_url)
      VALUES ($1, $2)
      RETURNING id, code, target_url, total_clicks, last_clicked_at, created_at
    `;

    const { rows } = await pool.query(insertQuery, [code, url]);

    // Base URL from env or fallback for local dev
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`;

    const shortUrl = `${baseUrl}/${rows[0].code}`;

    // Respond with full link info
    res.status(201).json({
      ...rows[0],
      shortUrl
    });

  } catch (err) {
    console.error('Error creating link:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/links
 * --------------
 * Returns a list of all short links with statistics.
 */
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, code, target_url, total_clicks, last_clicked_at, created_at FROM links ORDER BY created_at DESC'
    );

    // Build short URLs for each entry
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`;

    const withShortUrls = rows.map((row) => ({
      ...row,
      shortUrl: `${baseUrl}/${row.code}`
    }));

    res.json(withShortUrls);
  } catch (err) {
    console.error('Error listing links:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/links/:code
 * --------------------
 * Fetch stats for a specific short code.
 */
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const { rows, rowCount } = await pool.query(
      'SELECT id, code, target_url, total_clicks, last_clicked_at, created_at FROM links WHERE code = $1',
      [code]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Code not found' });
    }

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`;

    const link = {
      ...rows[0],
      shortUrl: `${baseUrl}/${rows[0].code}`
    };

    res.json(link);

  } catch (err) {
    console.error('Error fetching link stats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/links/:code
 * -----------------------
 * Deletes a short link from the database.
 */
router.delete('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const { rowCount } = await pool.query(
      'DELETE FROM links WHERE code = $1',
      [code]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Code not found' });
    }

    // 204 No Content → successfully deleted
    res.status(204).send();

  } catch (err) {
    console.error('Error deleting link:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export router for use in main index.js/server.js
module.exports = router;
