const CollectionLog = require("../models/CollectionLog");
const Farmer = require("../models/Farmer");
const { farmerHashTable } = require("../utils/hashTableService");
const { arrivalQueue } = require("../utils/queueService");

// Helper to resolve farmer profile from RAM or DB
async function findFarmerProfile(farmerId) {
  const cleanId = String(farmerId).trim();
  let farmer = farmerHashTable.get(cleanId);
  if (!farmer) {
    try {
      farmer = await Farmer.findOne({ farmerId: cleanId }).lean();
    } catch (e) {
      // Offline fallback
    }
  }
  return farmer;
}

// POST /api/intake
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

    if (!farmerId) {
      return res.status(400).json({ status: "fail", message: "Farmer ID is required." });
    }

    const cleanId = String(farmerId).trim();
    const farmer = await findFarmerProfile(cleanId);

    if (!farmer) {
      return res.status(404).json({
        status: "fail",
        message: `Farmer with ID ${cleanId} not found.`
      });
    }

    // Validate center assignment match
    if (centerId && centerId !== "ALL" && farmer.centerId !== centerId) {
      return res.status(400).json({
        status: "fail",
        message: `Farmer ${cleanId} is not assigned to ${centerId}.`
      });
    }

    const numLiters = parseFloat(liters ?? quantityLiters ?? quantity ?? 0);
    const numFat = parseFloat(fat ?? fatPercentage ?? 0);
    const numSnf = parseFloat(snf ?? snfPercentage ?? 0);

    if (!numLiters) {
      return res.status(400).json({
        status: "fail",
        message: "Valid volume in liters is required."
      });
    }

    const today = new Date().toISOString().split("T")[0];
    const computedPayout = Number((numLiters * (numFat * 6.5 + numSnf * 3.5)).toFixed(2));

    const newLog = await CollectionLog.create({
      logId: `LOG-${Date.now().toString().slice(-6)}`,
      farmerId: cleanId,
      date: today,
      liters: numLiters,
      fat: numFat,
      snf: numSnf,
      payout: computedPayout,
      centerId: centerId || farmer.centerId || "CENTER-001"
    });

    // Remove farmer from arrival queue upon completion
    arrivalQueue.dequeueMatching((entry) => entry.farmerId === cleanId);

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

// GET /api/intake/queue?centerId=CENTER-001
exports.getQueue = (req, res) => {
  const { centerId } = req.query;
  let queue = arrivalQueue.toArray();

  if (centerId && centerId !== "ALL") {
    queue = queue.filter((item) => item.centerId === centerId);
  }

  res.status(200).json({
    status: "success",
    queueCount: queue.length,
    queue
  });
};

// POST /api/intake/queue
exports.arriveAtQueue = async (req, res) => {
  try {
    const { farmerId, centerId } = req.body;

    if (!farmerId) {
      return res.status(400).json({ status: "fail", message: "farmerId is required" });
    }

    const cleanId = String(farmerId).trim();
    const farmer = await findFarmerProfile(cleanId);

    if (!farmer) {
      return res.status(404).json({
        status: "fail",
        message: `Farmer with ID ${cleanId} not found.`
      });
    }

    // Reject check-in if farmer belongs to another center
    if (centerId && centerId !== "ALL" && farmer.centerId !== centerId) {
      return res.status(400).json({
        status: "fail",
        message: `Farmer ${cleanId} is assigned to ${farmer.centerId}, not ${centerId}.`
      });
    }

    const assignedCenter = centerId || farmer.centerId;
    const currentQueue = arrivalQueue.toArray();
    const alreadyEnqueued = currentQueue.some(
      (item) => item.farmerId === cleanId && item.centerId === assignedCenter
    );

    if (alreadyEnqueued) {
      return res.status(400).json({
        status: "fail",
        message: "Farmer is already in the queue."
      });
    }

    arrivalQueue.enqueue({
      farmerId: cleanId,
      name: farmer.name || "Unknown",
      centerId: assignedCenter,
      arrivalTime: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    });

    return res.status(201).json({
      status: "success",
      message: "Farmer added to queue successfully."
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

// GET /api/intake?centerId=CENTER-001
exports.getIntakeHistory = async (req, res) => {
  try {
    const { startDate, endDate, centerId } = req.query;
    let query = {};

    if (centerId && centerId !== "ALL") {
      query.centerId = centerId;
    }

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.date = { $gte: startDate };
    } else if (endDate) {
      query.date = { $lte: endDate };
    }

    const logs = await CollectionLog.find(query).sort({ createdAt: -1 });

    const formattedLogs = logs.map((log) => {
      const farmer = farmerHashTable.get(log.farmerId);
      return {
        _id: log._id,
        logId: log.logId,
        farmerId: log.farmerId,
        centerId: log.centerId,
        name: farmer ? farmer.name : "Unknown Farmer",
        liters: log.liters,
        fat: log.fat,
        snf: log.snf,
        payout: log.payout,
        date: log.date
      };
    });

    return res.status(200).json({
      status: "success",
      data: formattedLogs
    });
  } catch (error) {
    console.error("Fetch intake history error:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to fetch intake history"
    });
  }
};