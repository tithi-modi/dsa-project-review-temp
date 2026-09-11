const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');
const HashTable = require('../utils/HashTable');

console.log('=== HASH TABLE vs. FLAT ARRAY BENCHMARK ===\n');

// 1. Load Dataset
const filePath = path.join(__dirname, '../data/farmers.json');
if (!fs.existsSync(filePath)) {
  console.error('❌ Error: data/farmers.json not found!');
  process.exit(1);
}

const farmersArray = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
console.log(`Loaded ${farmersArray.length} records from farmers.json.`);

// 2. Hydrate Hash Table (O(1))
const hashTable = new HashTable(128);
farmersArray.forEach((farmer) => {
  hashTable.set(farmer.farmerId, farmer);
});

// 3. Helper: Pick random keys for fair side-by-side comparison
function getRandomKeys(count) {
  const keys = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * farmersArray.length);
    keys.push(farmersArray[randomIndex].farmerId);
  }
  return keys;
}

// 4. Baseline O(n) Array Linear Search
function arrayLinearSearch(arr, targetId) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].farmerId === targetId) {
      return arr[i];
    }
  }
  return null;
}

// 5. Benchmark Configuration
const LOOKUP_COUNT = 10000; // 10,000 lookup operations
const testKeys = getRandomKeys(LOOKUP_COUNT);

console.log(`Running benchmark across ${LOOKUP_COUNT.toLocaleString()} random lookups...\n`);

// --- Benchmark 1: Array Linear Search O(n) ---
const startArray = performance.now();
for (let i = 0; i < LOOKUP_COUNT; i++) {
  arrayLinearSearch(farmersArray, testKeys[i]);
}
const endArray = performance.now();
const arrayTimeMs = endArray - startArray;

// --- Benchmark 2: Hash Table O(1) ---
const startHash = performance.now();
for (let i = 0; i < LOOKUP_COUNT; i++) {
  hashTable.get(testKeys[i]);
}
const endHash = performance.now();
const hashTimeMs = endHash - startHash;

// 6. Side-by-Side Results
const speedupRatio = (arrayTimeMs / hashTimeMs).toFixed(2);

console.log('----------------------------------------------------');
console.table([
  {
    Data_Structure: 'Flat Array Linear Search O(n)',
    Total_Operations: LOOKUP_COUNT,
    Total_Time_ms: `${arrayTimeMs.toFixed(3)} ms`,
    Avg_Per_Lookup: `${((arrayTimeMs / LOOKUP_COUNT) * 1000).toFixed(4)} μs`
  },
  {
    Data_Structure: 'In-Memory HashTable O(1)',
    Total_Operations: LOOKUP_COUNT,
    Total_Time_ms: `${hashTimeMs.toFixed(3)} ms`,
    Avg_Per_Lookup: `${((hashTimeMs / LOOKUP_COUNT) * 1000).toFixed(4)} μs`
  }
]);
console.log('----------------------------------------------------');
console.log(`🚀 RESULT: Hash Table lookup is ${speedupRatio}x FASTER than linear array search!\n`);
