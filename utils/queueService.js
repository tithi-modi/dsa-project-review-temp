// utils/queueService.js
const Queue = require('./Queue');
const { farmerHashTable } = require('./hashTableService');

const arrivalQueue = new Queue();

// Seeds the queue at boot with a starting line — replace with real
// arrival data once you have a way to signal it (e.g. staff button, kiosk)
function hydrateQueue() {
  const startingLine = ["FARM-001", "FARM-002", "FARM-003", "FARM-004", "FARM-005"];
  startingLine.forEach((farmerId) => {
    const farmer = farmerHashTable.get(farmerId);
    arrivalQueue.enqueue({
      farmerId,
      name: farmer?.name || "Unknown",
      arrivalTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    });
  });
  console.log(`[Queue] Hydrated with ${arrivalQueue.size} farmers.`);
}

module.exports = { arrivalQueue, hydrateQueue };