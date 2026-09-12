const CollectionLog = require("../models/CollectionLog");

exports.submitIntake = async (req, res) => {
  try {
    const {
      farmerId,
      liters,
      quantityLiters,
      quantity,
      fat,
      fatPercentage,
      snf,
      snfPercentage,
      centerId
    } = req.body;

    // Handle variable key naming from form inputs
    const numLiters = parseFloat(liters ?? quantityLiters ?? quantity ?? 0);
    const numFat = parseFloat(fat ?? fatPercentage ?? 0);
    const numSnf = parseFloat(snf ?? snfPercentage ?? 0);

    if (!farmerId || !numLiters) {
      return res.status(400).json({
        status: "fail",
        message: "Farmer ID and valid volume (liters) are required."
      });
    }

    // Auto-generate date string (YYYY-MM-DD) required by CollectionLog schema
    const today = new Date().toISOString().split("T")[0];

    // Compute payout based on quantity, fat, and SNF quality
    const computedPayout = Number((numLiters * (numFat * 6.5 + numSnf * 3.5)).toFixed(2));

    // Save actual document to MongoDB
    const newLog = await CollectionLog.create({
      logId: `LOG-${Date.now().toString().slice(-6)}`,
      farmerId: String(farmerId).trim(),
      date: today,
      liters: numLiters,
      fat: numFat,
      snf: numSnf,
      payout: computedPayout,
      centerId: centerId || "CENTER-001"
    });

    return res.status(201).json({
      status: "success",
      message: "Milk intake log submitted successfully",
      data: newLog
    });
  } catch (error) {
    console.error("Intake submission error:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to submit milk intake"
    });
  }
};

exports.getQueue = (req, res) => {
  res.status(200).json({
    status: "success",
    queueCount: 3,
    queue: [
      { farmerId: "FARM-001", name: "Ramesh Patel", arrivalTime: "08:15 AM" },
      { farmerId: "FARM-002", name: "Suresh Kumar", arrivalTime: "08:22 AM" },
      { farmerId: "FARM-003", name: "Anita Sharma", arrivalTime: "08:30 AM" }
    ]
  });
};