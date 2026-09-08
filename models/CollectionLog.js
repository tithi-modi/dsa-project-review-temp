const mongoose = require("mongoose");

const collectionLogSchema = new mongoose.Schema({
  logId: {
    type: String,
    required: true,
    unique: true,
    match: /^LOG-\d{3}$/
  },

  farmerId: {
    type: String,
    required: true
  },

  timestamp: {
    type: Date,
    required: true
  },

  quantityLiters: {
    type: Number,
    required: true,
    min: 0
  },

  fatPercentage: {
    type: Number,
    required: true,
    min: 2.0,
    max: 15.0
  },

  snfPercentage: {
    type: Number,
    required: true
  },

  calculatedPayout: {
    type: Number,
    required: true,
    min: 0
  }
});

module.exports = mongoose.model("CollectionLog", collectionLogSchema);
