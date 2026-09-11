// services/hashTableService.js

const HashTable = require('../utils/HashTable');
const fs = require('fs');
const path = require('path');

const farmerHashTable = new HashTable(128);

function hydrateHashTable() {
  try {
    const filePath = path.join(__dirname, '../data/farmers.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const farmers = JSON.parse(rawData);

    farmers.forEach((farmer) => {
      farmerHashTable.set(farmer.farmerId, farmer);
    });

    console.log(`[HashTable] Hydrated ${farmerHashTable.count} farmer records into RAM.`);
  } catch (error) {
    console.error('[HashTable] Hydration failed:', error.message);
  }
}

module.exports = {
  farmerHashTable,
  hydrateHashTable,
};