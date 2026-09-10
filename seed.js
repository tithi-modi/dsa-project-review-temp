require("dotenv").config();
const mongoose = require("mongoose");

const Farmer = require("./models/Farmer");
const CollectionLog = require("./models/CollectionLog");
const CenterNode = require("./models/CenterNode");
const User = require("./models/User");

const centers = require("./data/centers.json");
const farmers = require("./data/farmers.json");
const logs = require("./data/logs.json");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dairy_collection";

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Connected to MongoDB");

    // Clear existing data
    await Farmer.deleteMany({});
    await CollectionLog.deleteMany({});
    await CenterNode.deleteMany({});
    await User.deleteMany({});

    // Insert generated centers
    await CenterNode.insertMany(centers);
    console.log(`Inserted ${centers.length} centers`);

    // Insert generated farmers
    await Farmer.insertMany(farmers);
    console.log(`Inserted ${farmers.length} farmers`);

    // Insert generated collection logs
    await CollectionLog.insertMany(logs);
    console.log(`Inserted ${logs.length} collection logs`);

    // Insert sample users
    await User.insertMany([
      {
        username: "staff01",
        password: "password123",
        role: "staff"
      },
      {
        username: "manager01",
        password: "password123",
        role: "manager"
      }
    ]);

    console.log("Inserted 2 users");
    console.log("Database seeded successfully");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();