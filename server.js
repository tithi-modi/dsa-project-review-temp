require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { hydrateHashTable } = require('./utils/hashTableService');
const { hydrateQueue } = require('./utils/queueService');
const connectDB = require('./config/db');
const farmerRoutes = require('./routes/farmerRoutes');
const authRoutes = require('./routes/authRoutes');
const intakeRoutes = require('./routes/intakeRoutes');
// --- DAY 3 ADDITIONS ---
const managerRoutes = require('./routes/managerRoutes');
const routeRoutes = require('./routes/routeRoutes');

const app = express();

// Middleware - Configured to allow dynamic local frontend ports (5173, 5174, etc.)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

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

// Async boot sequence to prevent Mongo operation buffering timeouts
const startServer = async () => {
  try {
    // 1. Wait for MongoDB connection
    await connectDB();

    // 2. Hydrate Hash Table after DB connection is established
    if (typeof hydrateHashTable === 'function') {
      await hydrateHashTable();
    }

    // 3. Hydrate the FIFO arrival Queue
    hydrateQueue();

    // 4. Start Express server listener
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to boot server:', error.message);
    process.exit(1);
  }
};

startServer();