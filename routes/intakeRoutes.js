// routes/intakeRoutes.js
const express = require('express');
const router = express.Router();
const { submitIntake, getQueue } = require('../controllers/intakeController');

router.post('/submit', submitIntake);
router.get('/queue', getQueue);

module.exports = router;