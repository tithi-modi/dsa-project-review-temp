const fs = require('fs');
const path = require('path');
const { farmerHashTable } = require('../utils/hashTableService');
const CollectionLog = require('../models/CollectionLog');
const Farmer = require('../models/Farmer');

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

// GET /api/farmers (Supports ?centerId=CENTER-001)
exports.getAllFarmers = async (req, res) => {
  try {
    const { centerId } = req.query;
    let filter = {};
    if (centerId && centerId !== 'ALL') {
      filter.centerId = centerId;
    }

    let farmers = [];
    try {
      farmers = await Farmer.find(filter).lean();
    } catch (dbErr) {
      const filePath = path.join(__dirname, '../data/farmers.json');
      if (fs.existsSync(filePath)) {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        farmers = JSON.parse(rawData);
        if (centerId && centerId !== 'ALL') {
          farmers = farmers.filter((f) => f.centerId === centerId);
        }
      }
    }

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

// POST /api/farmers/register & POST /api/farmers
exports.registerFarmer = async (req, res) => {
  try {
    const { name, farmerName, phone, centerId, bankAccount, ifsc, farmerId: customId } = req.body;
    const finalName = name || farmerName;

    if (!finalName) {
      return res.status(400).json({
        success: false,
        message: 'Farmer name is required.'
      });
    }

    let farmerId = customId;
    if (!farmerId) {
      let count = 101;
      try {
        count += await Farmer.countDocuments();
      } catch (e) {
        count += Math.floor(Math.random() * 899);
      }
      farmerId = `FARM-${String(count).padStart(3, '0')}`;
    }

    const farmerData = {
      farmerId,
      name: finalName,
      phone: phone || '',
      centerId: centerId || 'CENTER-001',
      bankDetails: {
        accountNumber: bankAccount || '',
        ifsc: ifsc || ''
      }
    };

    try {
      await Farmer.create(farmerData);
    } catch (dbErr) {
      console.log('MongoDB save skipped, persisting directly to Hash Table.');
    }

    farmerHashTable.set(farmerId, farmerData);

    return res.status(201).json({
      success: true,
      message: 'Farmer registered successfully',
      data: farmerData
    });
  } catch (error) {
    console.error('Farmer registration error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to register farmer'
    });
  }
};

exports.createFarmer = exports.registerFarmer;

// GET /api/farmers/:id/logs
exports.getFarmerLogs = async (req, res) => {
  try {
    const { id } = req.params;

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