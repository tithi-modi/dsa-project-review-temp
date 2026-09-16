const CollectionLog = require("../models/CollectionLog");
const { farmerHashTable } = require("../utils/hashTableService");
const { arrivalQueue } = require("../utils/queueService");

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

    const numLiters = parseFloat(liters ?? quantityLiters ?? quantity ?? 0);
    const numFat = parseFloat(fat ?? fatPercentage ?? 0);
    const numSnf = parseFloat(snf ?? snfPercentage ?? 0);

    if (!farmerId || !numLiters) {
      return res.status(400).json({
        status: "fail",
        message: "Farmer ID and valid volume (liters) are required."
      });
    }

    const today = new Date().toISOString().split("T")[0];
    const computedPayout = Number((numLiters * (numFat * 6.5 + numSnf * 3.5)).toFixed(2));

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

    // Remove this farmer from the live arrival queue now that they've been served
    arrivalQueue.dequeueMatching(
      (entry) => entry.farmerId === String(farmerId).trim()
    );

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
  const queue = arrivalQueue.toArray();
  res.status(200).json({
    status: "success",
    queueCount: queue.length,
    queue
  });
};

exports.arriveAtQueue = (req, res) => {
  const { farmerId } = req.body;

  if (!farmerId) {
    return res.status(400).json({ status: "fail", message: "farmerId is required" });
  }

  const cleanId = String(farmerId).trim();
  const farmer = farmerHashTable.get(cleanId);

  arrivalQueue.enqueue({
    farmerId: cleanId,
    name: farmer?.name || "Unknown",
    arrivalTime: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  });

  res.status(201).json({
    status: "success",
    message: "Farmer added to queue"
  });
};  