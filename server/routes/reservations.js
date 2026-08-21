const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../dataStore');

// Normalize helper for pickup codes
function normalizeCode(input) {
  if (!input) return '';
  let str = String(input).trim().toUpperCase();
  
  if (str.includes('VERIFY=')) {
    const match = str.match(/VERIFY=([^&]+)/i);
    if (match) str = decodeURIComponent(match[1]).toUpperCase();
  }
  if (str.includes('ZEROLAPAR:')) {
    const parts = str.split(':');
    const lastPart = parts[parts.length - 1];
    if (lastPart) str = lastPart.toUpperCase();
  }

  str = str.replace(/\s+/g, '');

  if (/^\d{4}$/.test(str)) {
    str = 'ZL-' + str;
  }
  if (/^ZL\d{4}$/.test(str)) {
    str = 'ZL-' + str.substring(2);
  }

  return str;
}

// GET /api/reservations
router.get('/', (req, res) => {
  const db = readDb();
  const { customerPhone, merchantId, status } = req.query;
  let list = db.reservations || [];

  if (customerPhone) {
    list = list.filter(r => r.customerPhone === customerPhone);
  }
  if (merchantId) {
    list = list.filter(r => r.merchantId === merchantId);
  }
  if (status) {
    list = list.filter(r => r.status === status);
  }

  res.json({ success: true, count: list.length, data: list });
});

// POST /api/reservations - Reserve a meal
router.post('/', (req, res) => {
  const db = readDb();
  const { itemId, customerName = 'Pelajar Kampus', customerPhone = '+6018-2948192', quantity = 1 } = req.body;

  const item = db.items.find(i => i.id === itemId);
  if (!item) return res.status(404).json({ error: 'Item tidak ditemui' });

  const qty = Number(quantity);
  if (qty <= 0) {
    return res.status(400).json({ error: 'Kuantiti tempahan tidak sah' });
  }

  if (item.remainingQuantity < qty) {
    return res.status(400).json({ 
      error: 'Ralat: Kuantiti tempahan (' + qty + ' pek) melebihi baki stok yang tinggal (' + item.remainingQuantity + ' pek)!' 
    });
  }

  item.remainingQuantity -= qty;
  if (item.remainingQuantity <= 0) {
    item.remainingQuantity = 0;
    item.status = 'CLAIMED_OUT';
  }

  const pickupCode = 'ZL-' + Math.floor(1000 + Math.random() * 9000);
  const resId = 'res_' + Date.now();

  const totalAmount = item.mode === 'DONATE' ? 0 : (item.discountedPrice * qty);
  const savedMoney = item.mode === 'DONATE' ? (item.originalPrice * qty) : ((item.originalPrice - item.discountedPrice) * qty);
  const rescuedKg = (item.unitWeightKg || 0.4) * qty;

  const newReservation = {
    id: resId,
    itemId: item.id,
    itemTitle: item.title,
    merchantId: item.merchantId,
    merchantName: item.merchantName,
    customerName,
    customerPhone,
    quantity: qty,
    totalAmount,
    mode: item.mode,
    reservedAt: new Date().toISOString(),
    status: 'READY_FOR_PICKUP',
    pickupCode,
    qrData: 'ZEROLAPAR:RES:' + resId + ':' + pickupCode,
    savedMoney,
    rescuedKg
  };

  db.reservations.unshift(newReservation);
  writeDb(db);

  res.status(201).json({
    success: true,
    message: 'Tempahan berjaya disahkan!',
    data: newReservation
  });
});

// POST /api/reservations/verify-qr - Verify and complete reservation
router.post('/verify-qr', (req, res) => {
  const db = readDb();
  const { codeOrQr } = req.body;

  if (!codeOrQr) {
    return res.status(400).json({ error: 'Kod QR atau Nombor Kod diperlukan' });
  }

  const normalized = normalizeCode(codeOrQr);

  const reservation = db.reservations.find(r => {
    return (
      r.pickupCode === normalized ||
      r.qrData === codeOrQr ||
      (r.qrData && r.qrData.toUpperCase().includes(normalized)) ||
      (r.id && r.id.toUpperCase() === normalized)
    );
  });

  if (!reservation) {
    return res.status(404).json({ error: 'Kod [' + codeOrQr + '] tidak dijumpai dalam rekod tempahan aktif.' });
  }

  if (reservation.status === 'COMPLETED') {
    return res.status(400).json({ error: 'Kod ini (' + reservation.pickupCode + ') telah pun selesai ditebus sebelum ini.' });
  }

  reservation.status = 'COMPLETED';
  reservation.completedAt = new Date().toISOString();

  const wasteSavedKg = Number((reservation.rescuedKg || 0.4).toFixed(2));
  const co2SavedKg = Number((wasteSavedKg * 2.5).toFixed(2));
  const revenueRecovered = Number((reservation.totalAmount || 0).toFixed(2));

  if (!db.statsSummary) {
    db.statsSummary = { mealsRescued: 0, foodWasteKg: 0, co2SavedKg: 0, totalRevenueRecovered: 0 };
  }
  db.statsSummary.mealsRescued += Number(reservation.quantity || 1);
  db.statsSummary.foodWasteKg = Number((db.statsSummary.foodWasteKg + wasteSavedKg).toFixed(1));
  db.statsSummary.co2SavedKg = Number((db.statsSummary.co2SavedKg + co2SavedKg).toFixed(1));
  db.statsSummary.totalRevenueRecovered = Number((db.statsSummary.totalRevenueRecovered + revenueRecovered).toFixed(2));

  const merchant = db.merchants.find(m => m.id === reservation.merchantId);
  if (merchant) {
    merchant.totalRescuedKg = Number(((merchant.totalRescuedKg || 0) + wasteSavedKg).toFixed(1));
    merchant.totalMeals = (merchant.totalMeals || 0) + (reservation.quantity || 1);
  }

  writeDb(db);

  res.json({
    success: true,
    message: 'Pengesahan penebusan kod ' + reservation.pickupCode + ' berjaya!',
    data: reservation,
    esgImpact: {
      mealsRescued: reservation.quantity,
      wasteSavedKg,
      co2SavedKg,
      revenueRecovered
    }
  });
});

module.exports = router;