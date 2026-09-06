// controllers/intakeController.js
exports.submitIntake = async (req, res) => {
  const { farmerId, quantityLiters, fatPercentage, snfPercentage } = req.body;

  // Simple payout formula stub
  const calculatedPayout = quantityLiters * (fatPercentage * 10 + snfPercentage * 5);

  res.status(201).json({
    message: "Collection log submitted",
    log: {
      logId: "LOG-001",
      farmerId,
      quantityLiters,
      fatPercentage,
      snfPercentage,
      calculatedPayout,
      timestamp: new Date()
    }
  });
};
