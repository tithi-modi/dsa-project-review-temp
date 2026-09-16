// seed.js
const mongoose = require("mongoose");
require("dotenv").config();

const Farmer = require("./models/Farmer");
const CollectionLog = require("./models/CollectionLog");
const User = require("./models/User");
const CenterNode = require("./models/CenterNode");

const centersData = [
  {
    centerId: "CENTER-001",
    name: "Center 01 - Main Hub",
    locationCoords: { latitude: 18.5204, longitude: 73.8567 },
    tankerCapacityLiters: 7000
  },
  {
    centerId: "CENTER-002",
    name: "Center 02 - Shivapur",
    locationCoords: { latitude: 18.3518, longitude: 73.8344 },
    tankerCapacityLiters: 5000
  }
];

const usersData = [
  { username: "staff01", password: "password123", role: "STAFF", centerId: "CENTER-001" },
  { username: "staff02", password: "password123", role: "STAFF", centerId: "CENTER-002" },
  { username: "manager01", password: "password123", role: "MANAGER", centerId: "ALL" },
  { username: "manager02", password: "password123", role: "MANAGER", centerId: "CENTER-002" }
];

const firstNames = ["Ramesh", "Suresh", "Anand", "Vijay", "Sunil", "Prakash", "Ganesh", "Dnyaneshwar", "Santosh", "Sachin"];
const lastNames = ["Patil", "Pawar", "Shinde", "Deshmukh", "Kulkarni", "Jadhav", "More", "Gaikwad", "Kadam", "Chavan"];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dairy_collection";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Reset collections
    await Promise.all([
      CenterNode.deleteMany({}),
      Farmer.deleteMany({}),
      User.deleteMany({}),
      CollectionLog.deleteMany({})
    ]);

    await CenterNode.insertMany(centersData);
    console.log("Inserted 2 centers");

    await User.insertMany(usersData);
    console.log("Inserted 4 users");

    // Generate 100 Farmers with valid 10-digit phones and purely alphabetic names
    const farmersData = [];
    for (let i = 1; i <= 100; i++) {
      const idNum = String(i).padStart(3, "0");
      const centerId = i <= 50 ? "CENTER-001" : "CENTER-002";
      const fn = firstNames[(i - 1) % firstNames.length];
      const ln = lastNames[Math.floor((i - 1) / 10) % lastNames.length];
      
      farmersData.push({
        farmerId: `FARM-${idNum}`,
        name: `${fn} ${ln}`,
        phone: String(9876500000 + i), // Guarantees exactly 10 digits
        centerId: centerId,
        bankDetails: {
          accountNumber: `ACC${100000 + i}`,
          ifsc: "SBIN0001234"
        }
      });
    }
    await Farmer.insertMany(farmersData);
    console.log("Inserted 100 farmers");

    // Generate Collection Logs
    const logsData = [];
    const today = new Date().toISOString().split("T")[0];

    for (let i = 1; i <= 100; i++) {
      const idNum = String(i).padStart(3, "0");
      const centerId = i <= 50 ? "CENTER-001" : "CENTER-002";
      const liters = parseFloat((Math.random() * 30 + 10).toFixed(1));
      const fat = parseFloat((Math.random() * 3 + 3.5).toFixed(1));
      const snf = parseFloat((Math.random() * 2 + 8.0).toFixed(1));
      const payout = parseFloat((liters * (fat * 6 + snf * 3)).toFixed(2));

      logsData.push({
        logId: `LOG-${idNum}`,
        farmerId: `FARM-${idNum}`,
        centerId: centerId,
        date: today,
        liters: liters,
        fat: fat,
        snf: snf,
        payout: payout
      });
    }

    await CollectionLog.insertMany(logsData);
    console.log("Inserted 100 collection logs");

    console.log("\n✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();