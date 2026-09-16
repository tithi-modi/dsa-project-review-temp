const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
  farmerId: {
    type: String,
    required: true,
    unique: true,
    match: /^FARM-\d+$/ // Allows FARM-001 as well as scale beyond FARM-999
  },
  name: {
    type: String,
    required: true,
    match: /^[A-Za-z .'-]+$/
  },
  phone: {
    type: String,
    required: true,
    match: /^\d{10}$/
  },
  bankDetails: {
    accountNumber: { type: String, default: "" },
    ifsc: { type: String, default: "" }
  },
  centerId: {
    type: String,
    required: true,
    default: "CENTER-001"
  }
}, { timestamps: true });

module.exports = mongoose.model("Farmer", farmerSchema);