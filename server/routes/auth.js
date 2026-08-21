const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../dataStore');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const db = readDb();
  const { username, password, email, userId, role } = req.body;
  const adminCreds = db.adminCredentials || { username: 'admin', password: 'admin123', name: 'MUHAMMAD FAIZ IKHWAN BIN ISMAIL' };

  // 1. Check if Admin Login
  if (role === 'admin' || username === 'admin' || email === 'admin' || email === 'faiz@pmtg.edu.my') {
    if ((username === adminCreds.username || email === adminCreds.username || email === 'faiz@pmtg.edu.my') && password === adminCreds.password) {
      const adminUser = {
        id: 'u_admin',
        username: adminCreds.username,
        name: adminCreds.name || 'MUHAMMAD FAIZ IKHWAN BIN ISMAIL',
        role: 'admin',
        roleLabel: 'Pentadbir Utama & Penyelaras PYIC PMTG',
        email: adminCreds.email || 'faiz@pmtg.edu.my',
        phone: adminCreds.phone || '+6011-22334455',
        avatar: adminCreds.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        institution: 'Politeknik METrO Tasek Gelugor'
      };
      return res.json({
        success: true,
        message: 'Log masuk Pentadbir berjaya!',
        user: adminUser
      });
    } else {
      return res.status(401).json({
        error: 'ID Pengguna atau Kata Laluan Pentadbir salah!'
      });
    }
  }

  // 2. Regular User Login
  let user = null;
  if (userId) {
    user = db.users.find(u => u.id === userId);
  } else if (email) {
    user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  } else if (role) {
    user = db.users.find(u => u.role === role);
  }

  if (!user) {
    return res.status(404).json({ 
      error: 'Pengguna tidak ditemui. Sila daftar akaun baharu.' 
    });
  }

  res.json({
    success: true,
    message: 'Selamat kembali, ' + user.name + '!',
    user
  });
});

// GET /api/auth/users - Public list for reference
router.get('/users', (req, res) => {
  const db = readDb();
  res.json({ success: true, users: db.users || [] });
});

// GET /api/auth/all-users - Full Admin user list
router.get('/all-users', (req, res) => {
  const db = readDb();
  res.json({ 
    success: true, 
    users: db.users || [],
    adminCredentials: {
      username: db.adminCredentials?.username || 'admin',
      name: db.adminCredentials?.name || 'MUHAMMAD FAIZ IKHWAN BIN ISMAIL'
    }
  });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const db = readDb();
  const { name, email, role = 'consumer', phone, institution = 'PMTG', merchantName, password } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Nama dan Email diperlukan' });
  }

  if (role === 'admin') {
    return res.status(403).json({ error: 'Akaun Pentadbir tidak boleh didaftar secara terbuka.' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existing) {
    return res.status(400).json({ error: 'Akaun dengan email ini telah wujud. Sila log masuk.' });
  }

  let merchantId = undefined;
  if (role === 'merchant') {
    merchantId = 'm_' + Date.now();
    const newMerchant = {
      id: merchantId,
      name: merchantName || name,
      category: 'Restaurant',
      address: 'Tasek Gelugor, Pulau Pinang',
      lat: 5.483,
      lng: 100.496,
      phone: phone || '+6012-3456789',
      rating: 5.0,
      plan: 'Freemium',
      isHalal: true,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      totalRescuedKg: 0,
      totalMeals: 0
    };
    db.merchants.push(newMerchant);
  }

  const newUser = {
    id: 'u_' + Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role,
    roleLabel: role === 'consumer' ? 'Pelajar / Pengguna' : role === 'merchant' ? 'Peniaga Makanan' : 'NGO / Sukarelawan',
    merchantId,
    merchantName: merchantName || (role === 'merchant' ? name : undefined),
    phone: phone || '+6012-3456789',
    password: password || '123456',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    institution
  };

  db.users.push(newUser);
  writeDb(db);

  res.status(201).json({
    success: true,
    message: 'Pendaftaran akaun baharu berjaya!',
    user: newUser
  });
});

// PUT /api/auth/profile - Update own profile (All users & Admin)
router.put('/profile', (req, res) => {
  const db = readDb();
  const { id, name, phone, avatar, institution, currentPassword, newPassword } = req.body;

  if (id === 'u_admin' || req.body.role === 'admin') {
    if (!db.adminCredentials) {
      db.adminCredentials = { username: 'admin', password: 'admin123' };
    }
    if (name) db.adminCredentials.name = name.trim();
    if (phone) db.adminCredentials.phone = phone.trim();
    if (avatar) db.adminCredentials.avatar = avatar;
    if (newPassword) {
      db.adminCredentials.password = newPassword.trim();
    }
    
    // Also update in users array
    const adminInUsers = db.users.find(u => u.id === 'u_admin' || u.role === 'admin');
    if (adminInUsers) {
      if (name) adminInUsers.name = name.trim();
      if (phone) adminInUsers.phone = phone.trim();
      if (avatar) adminInUsers.avatar = avatar;
    }
    writeDb(db);

    return res.json({
      success: true,
      message: 'Maklumat Pentadbir berjaya dikemaskini!',
      user: {
        id: 'u_admin',
        username: db.adminCredentials.username,
        name: db.adminCredentials.name,
        role: 'admin',
        roleLabel: 'Pentadbir Utama & Penyelaras PYIC PMTG',
        email: db.adminCredentials.email || 'faiz@pmtg.edu.my',
        phone: db.adminCredentials.phone,
        avatar: db.adminCredentials.avatar
      }
    });
  }

  const user = db.users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'Pengguna tidak dijumpai' });
  }

  if (name) user.name = name.trim();
  if (phone) user.phone = phone.trim();
  if (avatar) user.avatar = avatar;
  if (institution) user.institution = institution;
  if (newPassword) user.password = newPassword.trim();

  writeDb(db);

  res.json({
    success: true,
    message: 'Maklumat profil anda berjaya dikemaskini!',
    user
  });
});

// PUT /api/auth/users/:id/reset-password - Admin reset password for any user
router.put('/users/:id/reset-password', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ error: 'Kata laluan baharu diperlukan' });
  }

  if (id === 'u_admin' || id === 'admin') {
    if (!db.adminCredentials) db.adminCredentials = { username: 'admin', password: 'admin123' };
    db.adminCredentials.password = newPassword.trim();
    writeDb(db);
    return res.json({ success: true, message: 'Kata laluan Pentadbir berjaya ditukar!' });
  }

  const user = db.users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'Pengguna tidak ditemui' });
  }

  user.password = newPassword.trim();
  writeDb(db);

  res.json({
    success: true,
    message: 'Kata laluan untuk ' + user.name + ' berjaya dikemaskini!'
  });
});

// PUT /api/auth/users/:id - Admin edit user info
router.put('/users/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const { name, email, role, phone, roleLabel } = req.body;

  const user = db.users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'Pengguna tidak ditemui' });
  }

  if (name) user.name = name.trim();
  if (email) user.email = email.trim().toLowerCase();
  if (role) {
    user.role = role;
    user.roleLabel = role === 'consumer' ? 'Pelajar / Pengguna' : role === 'merchant' ? 'Peniaga Makanan' : 'NGO / Sukarelawan';
  }
  if (roleLabel) user.roleLabel = roleLabel;
  if (phone) user.phone = phone.trim();

  writeDb(db);

  res.json({
    success: true,
    message: 'Maklumat pengguna berjaya dikemaskini!',
    user
  });
});

// DELETE /api/auth/users/:id - Admin delete user
router.delete('/users/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;

  if (id === 'u_admin') {
    return res.status(403).json({ error: 'Akaun Pentadbir Utama tidak boleh dipadam.' });
  }

  db.users = db.users.filter(u => u.id !== id);
  writeDb(db);

  res.json({
    success: true,
    message: 'Pengguna berjaya dipadam daripada pangkalan data.'
  });
});

module.exports = router;