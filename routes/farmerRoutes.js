const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');

router.get('/', farmerController.getAllFarmers);
router.post('/', farmerController.createFarmer);
router.post('/register', farmerController.registerFarmer);

// MUST BE BEFORE /:id
router.get('/:id/logs', farmerController.getFarmerLogs);
router.get('/:id', farmerController.getFarmerById);

module.exports = router;