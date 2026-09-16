// routes/intakeRoutes.js
const express = require('express');
const router = express.Router();
const { submitIntake, getQueue, arriveAtQueue } = require('../controllers/intakeController');

router.post('/submit', submitIntake);
router.get('/queue', getQueue);
router.post('/arrive', arriveAtQueue);

module.exports = router;