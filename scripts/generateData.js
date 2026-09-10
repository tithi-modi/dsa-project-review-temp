const { faker } = require("@faker-js/faker");
const fs = require("fs");
const path = require("path");
const farmers = [];

for (let i = 1; i <= 100; i++) {
      const farmer = {
    farmerId: `FARM-${String(i).padStart(3, "0")}`,
    name: faker.person.fullName(),
    phone: faker.string.numeric(10),
    bankDetails: {
      accountNumber: faker.string.numeric(12),
      ifsc: "BANK0001234"
    },
    centerId: `CENTER-${String(((i - 1) % 2) + 1).padStart(3, "0")}`
  };
    farmers.push(farmer);
} 
console.log(`Generated ${farmers.length} farmers`);
const dataPath = path.join(__dirname, "..", "data");

fs.writeFileSync(
  path.join(dataPath, "farmers.json"),
  JSON.stringify(farmers, null, 2)
);


const centers = [
  {
    centerId: "CENTER-001",
    name: "Rampur Collection Center",
    locationCoords: {
      latitude: 20.5937,
      longitude: 78.9629
    },
    tankerCapacityLiters: 5000
  },
  {
    centerId: "CENTER-002",
    name: "Shivapur Collection Center",
    locationCoords: {
      latitude: 20.6001,
      longitude: 78.9702
    },
    tankerCapacityLiters: 4000
  }
];

fs.writeFileSync(
  path.join(dataPath, "centers.json"),
  JSON.stringify(centers, null, 2)
);

const logs = [];

for (let i = 1; i <= 500; i++) {
  const farmerId = `FARM-${String(faker.number.int({ min: 1, max: 100 })).padStart(3, "0")}`;

  const shift = i % 2 === 0 ? "morning" : "evening";

  const timestamp = new Date();
  timestamp.setHours(shift === "morning" ? 7 : 18);
  timestamp.setMinutes(faker.number.int({ min: 0, max: 59 }));

  const log = {
    logId: `LOG-${String(i).padStart(3, "0")}`,
    farmerId: farmerId,
    timestamp: timestamp,
    quantityLiters: faker.number.float({
      min: 5,
      max: 50,
      fractionDigits: 1
    }),
    fatPercentage: faker.number.float({
      min: 2.0,
      max: 8.0,
      fractionDigits: 1
    }),
    snfPercentage: faker.number.float({
      min: 7.0,
      max: 10.0,
      fractionDigits: 1
    }),
    calculatedPayout: faker.number.float({
      min: 200,
      max: 2500,
      fractionDigits: 2
    })
  };

  logs.push(log);
}

console.log(`Generated ${logs.length} collection logs`);

fs.writeFileSync(
  path.join(dataPath, "logs.json"),
  JSON.stringify(logs, null, 2)
);