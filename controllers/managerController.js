const CollectionLog = require('../models/CollectionLog');
const { farmerHashTable } = require('../utils/hashTableService');

exports.getAnalytics = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const from = req.query.from || today;
    const to = req.query.to || from;

    const summary = await CollectionLog.aggregate([
      { $match: { date: { $gte: from, $lte: to } } },
      {
        $group: {
          _id: null,
          totalLiters: { $sum: "$liters" },
          averageFat: { $avg: "$fat" },
          averageSnf: { $avg: "$snf" },
          totalPayoutINR: { $sum: "$payout" },
          activeFarmers: { $addToSet: "$farmerId" }
        }
      }
    ]);

    const perFarmer = await CollectionLog.aggregate([
      { $match: { date: { $gte: from, $lte: to } } },
      {
        $group: {
          _id: "$farmerId",
          liters: { $sum: "$liters" },
          avgFat: { $avg: "$fat" },
          avgSnf: { $avg: "$snf" },
          payout: { $sum: "$payout" }
        }
      }
    ]);

    // Resolve names via the Hash Table — O(1) per farmer, not a DB join
    const farmerBreakdown = perFarmer.map((row) => {
      const farmer = farmerHashTable.get(row._id);
      return {
        farmerId: row._id,
        name: farmer?.name || "Unknown",
        liters: row.liters,
        avgFat: Number(row.avgFat.toFixed(2)),
        avgSnf: Number(row.avgSnf.toFixed(2)),
        payout: row.payout
      };
    });

    const m = summary[0] || { totalLiters: 0, averageFat: 0, averageSnf: 0, totalPayoutINR: 0, activeFarmers: [] };

    res.status(200).json({
      status: "success",
      range: { from, to },
      metrics: {
        totalLiters: m.totalLiters,
        averageFat: Number(m.averageFat?.toFixed(2)) || 0,
        averageSnf: Number(m.averageSnf?.toFixed(2)) || 0,
        totalPayoutINR: m.totalPayoutINR,
        activeFarmersToday: m.activeFarmers.length
      },
      farmerBreakdown
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};