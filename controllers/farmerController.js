// Stub handler: Get farmer profile by ID
exports.getFarmerById = (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    data: {
      farmerId: id,
      name: "Ramesh Patel",
      phone: "+91 98765 43210",
      centerId: "CENTER-01",
      bankDetails: {
        accountNo: "XXXX-XXXX-1234",
        ifsc: "SBIN0001234"
      }
    }
  });
};

// Stub handler: Register new farmer
exports.registerFarmer = (req, res) => {
  const { name, phone, centerId } = req.body;
  res.status(201).json({
    success: true,
    message: "Farmer registered successfully (Stub)",
    data: {
      farmerId: "FARM-" + Math.floor(100 + Math.random() * 900),
      name: name || "New Farmer",
      phone: phone || "+91 00000 00000",
      centerId: centerId || "CENTER-01"
    }
  });
};