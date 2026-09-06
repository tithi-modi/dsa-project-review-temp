const express = require('express');
const router = express.Router();
const { submitIntake } = require('../controllers/intakeController');

// POST /api/intake/submit -> calls submitIntake in intakeController.js
router.post('/submit', submitIntake);

module.exports = router;