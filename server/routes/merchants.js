const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../dataStore');

router.get('/', (req, res) => {
  const db = readDb();
  res.json({ success: true, data: db.merchants || [] });
});

router.get('/:id', (req, res) => {
  const db = readDb();
  const m = db.merchants.find(x => x.id === req.params.id);
  if (!m) return res.status(404).json({ error: 'Merchant not found' });
  res.json({ success: true, data: m });
});

router.post('/upgrade-plan', (req, res) => {
  const db = readDb();
  const { merchantId, plan = 'Premium' } = req.body;
  const m = db.merchants.find(x => x.id === merchantId);
  if (!m) return res.status(404).json({ error: 'Merchant not found' });

  m.plan = plan;
  writeDb(db);
  res.json({ success: true, message: 'Pelan perniagaan dinaik taraf ke ' + plan, data: m });
});

module.exports = router;