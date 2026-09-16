const express = require('express');
const router = express.Router();
const {
  submitIntake,
  getQueue,
  arriveAtQueue,
  getIntakeHistory
} = require('../controllers/intakeController');

// GET /api/intake/history - Fetch filtered intake history records
router.get('/history', getIntakeHistory);

// GET /api/intake/queue - Fetch active arrival queue
router.get('/queue', getQueue);

// POST /api/intake/arrive - Check-in farmer at the desk
router.post('/arrive', arriveAtQueue);

// POST /api/intake/submit - Submit milk entry and calculate payout
router.post('/submit', submitIntake);

module.exports = router;