const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));

// API Routes (Single live data source for all roles)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/dropoff', require('./routes/dropoff'));
app.use('/api/merchants', require('./routes/merchants'));
app.use('/api/esg', require('./routes/esg'));

// Root Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Zero Lapar API',
    tagline: 'Less Waste. More Meals. More Impact.',
    competition: 'PYIC 2026',
    institution: 'Politeknik METrO Tasek Gelugor',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend build
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  const indexHtml = path.join(clientDistPath, 'index.html');
  if (require('fs').existsSync(indexHtml)) {
    res.sendFile(indexHtml);
  } else {
    res.send('Zero Lapar Backend API Running on port ' + PORT);
  }
});

app.listen(PORT, () => {
  console.log('🌱 Zero Lapar Server running on http://localhost:' + PORT);
});