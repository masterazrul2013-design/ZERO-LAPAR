const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../dataStore');

// GET /api/items
router.get('/', (req, res) => {
  const db = readDb();
  const { mode, category, search, merchantId } = req.query;
  let items = db.items || [];

  if (mode) items = items.filter(i => i.mode === mode);
  if (category && category !== 'ALL') items = items.filter(i => i.category === category);
  if (merchantId) items = items.filter(i => i.merchantId === merchantId);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(i => 
      i.title.toLowerCase().includes(q) || 
      i.merchantName.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: items.length, data: items });
});

// POST /api/items - Add food item
router.post('/', (req, res) => {
  const db = readDb();
  const {
    title,
    category = 'Rice Meal',
    mode = 'DISCOUNT',
    originalPrice = 15,
    discountedPrice = 5,
    quantity = 10,
    unitWeightKg = 0.45,
    pickupWindow = '12:00 PM - 4:00 PM',
    dietaryTags = ['Halal'],
    description = '',
    image = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    merchantId = 'm_1',
    merchantName = 'Restoran Selera Kampus'
  } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Nama sajian / menu diperlukan' });
  }

  const newItem = {
    id: 'item_' + Date.now(),
    title,
    category,
    mode,
    originalPrice: Number(originalPrice),
    discountedPrice: mode === 'DONATE' ? 0 : Number(discountedPrice),
    quantity: Number(quantity),
    remainingQuantity: Number(quantity),
    unitWeightKg: Number(unitWeightKg),
    pickupWindow,
    dietaryTags,
    description,
    image,
    status: 'ACTIVE',
    merchantId,
    merchantName,
    createdAt: new Date().toISOString()
  };

  db.items.unshift(newItem);
  writeDb(db);

  res.status(201).json({
    success: true,
    message: 'Makanan lebihan berjaya disenaraikan!',
    data: newItem
  });
});

// PUT /api/items/:id - Edit / Update food item (Admin & Merchant)
router.put('/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const item = db.items.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ error: 'Makanan tidak ditemui' });
  }

  const {
    title,
    category,
    mode,
    originalPrice,
    discountedPrice,
    quantity,
    remainingQuantity,
    unitWeightKg,
    pickupWindow,
    dietaryTags,
    description,
    image,
    status
  } = req.body;

  if (title !== undefined) item.title = title;
  if (category !== undefined) item.category = category;
  if (mode !== undefined) item.mode = mode;
  if (originalPrice !== undefined) item.originalPrice = Number(originalPrice);
  if (discountedPrice !== undefined) item.discountedPrice = mode === 'DONATE' ? 0 : Number(discountedPrice);
  if (unitWeightKg !== undefined) item.unitWeightKg = Number(unitWeightKg);
  if (pickupWindow !== undefined) item.pickupWindow = pickupWindow;
  if (dietaryTags !== undefined) item.dietaryTags = dietaryTags;
  if (description !== undefined) item.description = description;
  if (image !== undefined) item.image = image;

  if (remainingQuantity !== undefined) {
    const rem = Number(remainingQuantity);
    item.remainingQuantity = rem;
    if (rem > item.quantity) {
      item.quantity = rem;
    }
    item.status = rem > 0 ? 'ACTIVE' : 'CLAIMED_OUT';
  }

  if (quantity !== undefined) {
    item.quantity = Number(quantity);
  }

  if (status !== undefined) {
    item.status = status;
  }

  writeDb(db);

  res.json({
    success: true,
    message: 'Maklumat makanan berjaya dikemaskini!',
    data: item
  });
});

// DELETE /api/items/:id - Delete food item
router.delete('/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;

  db.items = db.items.filter(i => i.id !== id);
  writeDb(db);

  res.json({
    success: true,
    message: 'Makanan berjaya dipadam daripada senarai.'
  });
});

module.exports = router;