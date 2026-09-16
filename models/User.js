const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ["STAFF", "MANAGER", "FARMER", "staff", "manager", "farmer"],
    required: true
  },
  centerId: { 
    type: String, 
    default: "CENTER-001" // Set to 'ALL' for District Managers
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);