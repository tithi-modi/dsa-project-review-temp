// controllers/intakeController.js

exports.submitIntake = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Milk intake log submitted successfully (stub)",
    data: {
      logId: "LOG-1001",
      farmerId: req.body.farmerId || "FARM-101",
      quantityLiters: req.body.quantityLiters || 15.5,
      fatPercentage: req.body.fatPercentage || 4.2,
      snfPercentage: req.body.snfPercentage || 8.5,
      timestamp: new Date().toISOString()
    }
  });
};

exports.getQueue = (req, res) => {
  res.status(200).json({
    status: "success",
    queueCount: 3,
    queue: [
      { farmerId: "FARM-101", name: "Ramesh Patel", arrivalTime: "08:15 AM" },
      { farmerId: "FARM-102", name: "Suresh Kumar", arrivalTime: "08:22 AM" },
      { farmerId: "FARM-103", name: "Anita Sharma", arrivalTime: "08:30 AM" }
    ]
  });
};