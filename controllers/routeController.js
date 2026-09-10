exports.getOptimizedRoute = (req, res) => {
  res.status(200).json({
    status: "success",
    tankerId: "TANKER-01",
    totalDistanceKm: 24.5,
    pickupOrder: [
      { step: 1, centerId: "CENTER-A", name: "North Village Hub", estimatedVolume: 450 },
      { step: 2, centerId: "CENTER-B", name: "East Dairy Node", estimatedVolume: 300 },
      { step: 3, centerId: "CENTER-C", name: "Central Processing Plant", estimatedVolume: 500 }
    ]
  });
};