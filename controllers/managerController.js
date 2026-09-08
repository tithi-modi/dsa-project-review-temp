exports.getAnalytics = (req, res) => {
  res.status(200).json({
    status: "success",
    date: new Date().toISOString().split('T')[0],
    metrics: {
      totalLiters: 1250.5,
      averageFat: 4.2,
      averageSnf: 8.5,
      totalPayoutINR: 45000,
      activeFarmersToday: 42
    }
  });
};