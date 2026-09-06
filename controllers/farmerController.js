// controllers/farmerController.js

// 1. Get farmer details by ID (Stub)
exports.getFarmerById = async (req, res) => {
  const { id } = req.params;
  
  res.status(200).json({
    farmerId: id,
    name: "Ramesh Patel",
    phone: "9876543210",
    centerId: "CENTER-001"
  });
};

// 2. Register a new farmer (Stub matching Chinmay's spec)
exports.registerFarmer = async (req, res) => {
  const { farmerId, name, phone, bankDetails, centerId } = req.body;

  res.status(201).json({
    message: "Farmer registered successfully",
    farmer: { farmerId, name, phone, bankDetails, centerId }
  });
};