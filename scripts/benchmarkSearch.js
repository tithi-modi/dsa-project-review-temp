const fs = require("fs");
const path = require("path");
const HashTable = require("../utils/HashTable");

const sizes = [100, 1000, 10000];
const trials = 1000;

const benchmarkPath = path.join(__dirname, "..", "data", "benchmarks");

for (const size of sizes) {
  const farmers = JSON.parse(
    fs.readFileSync(
      path.join(benchmarkPath, `farmers_${size}.json`),
      "utf8"
    )
  );

  const targetId = farmers[farmers.length - 1].farmerId;

  const hashTable = new HashTable(size * 2);

  for (const farmer of farmers) {
    hashTable.set(farmer.farmerId, farmer);
  }

  // Warm-up
  farmers.find(farmer => farmer.farmerId === targetId);
  hashTable.get(targetId);

  // Linear search benchmark
  const linearStart = process.hrtime.bigint();

  let linearResult;

  for (let i = 0; i < trials; i++) {
    linearResult = farmers.find(
      farmer => farmer.farmerId === targetId
    );
  }

  const linearEnd = process.hrtime.bigint();

  // Hash table benchmark
  const hashStart = process.hrtime.bigint();

  let hashResult;

  for (let i = 0; i < trials; i++) {
    hashResult = hashTable.get(targetId);
  }

  const hashEnd = process.hrtime.bigint();

  const linearAverage =
    Number(linearEnd - linearStart) / trials;

  const hashAverage =
    Number(hashEnd - hashStart) / trials;

  console.log(`\nDataset: ${size} farmers`);
  console.log(`Average linear search: ${linearAverage.toFixed(2)} ns`);
  console.log(`Average hash table:    ${hashAverage.toFixed(2)} ns`);
  console.log(`Linear found: ${!!linearResult}`);
  console.log(`Hash found:   ${!!hashResult}`);
}