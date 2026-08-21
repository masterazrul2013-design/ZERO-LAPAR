const express = require('express');
const router = express.Router();
const { readDb } = require('../dataStore');

router.get('/', (req, res) => {
  const db = readDb();
  res.json({ success: true, data: db.dropoffPoints || [] });
});

module.exports = router;