const { farmerHashTable } = require('../utils/hashTableService');
const fs = require('fs');
const path = require('path');

// 1. Get single farmer by ID (O(1) Hash Table Lookup)
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

// 2. Get all farmers (Optional: reads full JSON/DB list)
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
      message: 'Error fetching farmers dataset'
    });
  }
};