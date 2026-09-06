const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
  farmerId: {
    type: String,
    required: true,
    unique: true,
    match: /^FARM-\d{3}$/
  },

  name: {
    type: String,
    required: true,
    match: /^[A-Za-z ]+$/
  },

  phone: {
    type: String,
    required: true,
    match: /^\d{10}$/
  },

  bankDetails: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },

  centerId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Farmer", farmerSchema);
