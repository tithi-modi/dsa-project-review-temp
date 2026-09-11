const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { hydrateHashTable } = require('./utils/hashTableService');
const connectDB = require('./config/db');
const farmerRoutes = require('./routes/farmerRoutes');
const authRoutes = require('./routes/authRoutes');
const intakeRoutes = require('./routes/intakeRoutes');
// --- DAY 3 ADDITIONS ---
const managerRoutes = require('./routes/managerRoutes');
const routeRoutes = require('./routes/routeRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Hydrate In-Memory Hash Table on Boot
hydrateHashTable();

// API Route Mounts
app.use('/api/farmers', farmerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/intake', intakeRoutes);
// --- DAY 3 ADDITIONS ---
app.use('/api/manager', managerRoutes);
app.use('/api/routes', routeRoutes);

// Root Health Check Route
app.get('/', (req, res) => {
  res.send('Dairy Cooperative Backend API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});