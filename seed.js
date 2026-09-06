const mongoose = require("mongoose");

const Farmer = require("./models/Farmer");
const CollectionLog = require("./models/CollectionLog");
const CenterNode = require("./models/CenterNode");
const User = require("./models/User");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dairy_collection";

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Connected to MongoDB");

    await Farmer.deleteMany({});
    await CollectionLog.deleteMany({});
    await CenterNode.deleteMany({});
    await User.deleteMany({});

    const centers = await CenterNode.insertMany([
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
    ]);

    await Farmer.insertMany([
      {
        farmerId: "FARM-001",
        name: "Ramesh Patil",
        phone: "9876543210",
        bankDetails: {
          accountNumber: "1234567890",
          ifsc: "BANK0001234"
        },
        centerId: centers[0].centerId
      },
      {
        farmerId: "FARM-002",
        name: "Suresh More",
        phone: "9876543211",
        bankDetails: {
          accountNumber: "1234567891",
          ifsc: "BANK0001234"
        },
        centerId: centers[0].centerId
      },
      {
        farmerId: "FARM-003",
        name: "Anita Sharma",
        phone: "9876543212",
        bankDetails: {
          accountNumber: "1234567892",
          ifsc: "BANK0005678"
        },
        centerId: centers[1].centerId
      }
    ]);

    await CollectionLog.insertMany([
      {
        logId: "LOG-001",
        farmerId: "FARM-001",
        timestamp: new Date(),
        quantityLiters: 25,
        fatPercentage: 4.2,
        snfPercentage: 8.5,
        calculatedPayout: 1200
      },
      {
        logId: "LOG-002",
        farmerId: "FARM-002",
        timestamp: new Date(),
        quantityLiters: 30,
        fatPercentage: 4.5,
        snfPercentage: 8.7,
        calculatedPayout: 1500
      },
      {
        logId: "LOG-003",
        farmerId: "FARM-003",
        timestamp: new Date(),
        quantityLiters: 20,
        fatPercentage: 3.8,
        snfPercentage: 8.2,
        calculatedPayout: 950
      }
    ]);

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

    console.log("Mock village data inserted successfully");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
