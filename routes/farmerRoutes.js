const express = require('express');
const router = express.Router();
const { getFarmerById, registerFarmer } = require('../controllers/farmerController');

router.get('/:id', getFarmerById);
router.post('/register', registerFarmer);

module.exports = router;