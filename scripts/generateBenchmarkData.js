const { faker } = require("@faker-js/faker");
const fs = require("fs");
const path = require("path");

const sizes = [100, 1000, 10000];

const benchmarkPath = path.join(__dirname, "..", "data", "benchmarks");

if (!fs.existsSync(benchmarkPath)) {
  fs.mkdirSync(benchmarkPath, { recursive: true });
}

for (const size of sizes) {
  const farmers = [];

  for (let i = 1; i <= size; i++) {
    farmers.push({
      farmerId: `FARM-${String(i).padStart(5, "0")}`,
      name: faker.person.fullName(),
      phone: faker.string.numeric(10),
      centerId: `CENTER-${String((i - 1) % 2 + 1).padStart(3, "0")}`
    });
  }

  const filePath = path.join(
    benchmarkPath,
    `farmers_${size}.json`
  );

  fs.writeFileSync(
    filePath,
    JSON.stringify(farmers, null, 2)
  );

  console.log(`Generated ${size} farmers`);
}
