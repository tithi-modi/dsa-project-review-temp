const { farmerHashTable } = require('../utils/hashTableService');
const fs = require('fs');
const path = require('path');

// GET /api/farmers/:id (O(1) Hash Table Lookup)
exports.getFarmerById = (req, res) => {
  const { id } = req.params;
  const farmer = farmerHashTable.get(id);

  if (!farmer) {
    return res.status(404).json({
      success: false,
      message: `Farmer with ID ${id} not found.`
    });
  }

  return res.status(200).json({
    success: true,
    data: farmer
  });
};

// GET /api/farmers
exports.getAllFarmers = (req, res) => {
  try {
    const filePath = path.join(__dirname, '../data/farmers.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const farmers = JSON.parse(rawData);

    return res.status(200).json({
      success: true,
      count: farmers.length,
      data: farmers
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error reading farmers dataset'
    });
  }
};

// POST /api/farmers
exports.createFarmer = (req, res) => {
  const newFarmer = req.body;

  if (!newFarmer || !newFarmer.farmerId) {
    return res.status(400).json({
      success: false,
      message: 'Farmer data with a valid farmerId is required.'
    });
  }

  // Store into RAM
  farmerHashTable.set(newFarmer.farmerId, newFarmer);

  return res.status(201).json({
    success: true,
    message: 'Farmer record saved to RAM',
    data: newFarmer
  });
};
const CollectionLog = require('../models/CollectionLog'); // Adjust model path if different

exports.getFarmerLogs = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the 30 most recent collection logs for this farmer
    const logs = await CollectionLog.find({ farmerId: id })
      .sort({ date: -1 })
      .limit(30);

    return res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve collection logs',
      error: error.message 
    });
  }
};