const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../dataStore');

// GET /api/donations
router.get('/', (req, res) => {
  const db = readDb();
  res.json({ success: true, data: db.donations || [] });
});

// POST /api/donations/claim - NGO claims a bulk donation batch
router.post('/claim', (req, res) => {
  const db = readDb();
  const { itemId, ngoId, destinationHub = 'Zero Lapar Hub - PMTG' } = req.body;

  const item = db.items.find(i => i.id === itemId);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  if (item.remainingQuantity <= 0) return res.status(400).json({ error: 'Batch telah habis diambil' });

  const ngo = db.ngos.find(n => n.id === ngoId) || db.ngos[0];
  const qty = item.remainingQuantity;
  item.remainingQuantity = 0;
  item.status = 'CLAIMED_OUT';

  const newDonation = {
    id: 'don_' + Date.now(),
    itemId: item.id,
    itemTitle: item.title,
    merchantId: item.merchantId,
    merchantName: item.merchantName,
    ngoId: ngo.id,
    ngoName: ngo.name,
    quantity: qty,
    destinationHub,
    status: 'COLLECTED_FOR_DISTRIBUTION',
    claimedAt: new Date().toISOString(),
    qrCode: 'ZL-NGO-' + Math.floor(1000 + Math.random() * 9000),
    rescuedKg: (item.unitWeightKg || 0.5) * qty,
    peopleImpacted: qty
  };

  db.donations.unshift(newDonation);

  // Update ESG stats
  db.statsSummary.totalMealsRescued += qty;
  db.statsSummary.totalFoodWasteKg += newDonation.rescuedKg;
  db.statsSummary.totalCO2eSavedKg += (newDonation.rescuedKg * 2.5);
  db.statsSummary.totalPeopleHelped += qty;

  writeDb(db);

  res.status(201).json({
    success: true,
    message: 'Tuntutan Donasi Berjaya! Batch makanan ditugaskan untuk pengagihan NGO.',
    data: newDonation
  });
});

module.exports = router;