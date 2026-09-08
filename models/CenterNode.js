const mongoose = require("mongoose");

const centerNodeSchema = new mongoose.Schema({
  centerId: {
    type: String,
    required: true,
    unique: true,
    match: /^CENTER-\d{3}$/
  },

  name: {
    type: String,
    required: true
  },

  locationCoords: {
    type: {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180
      }
    },
    required: true
  },

  tankerCapacityLiters: {
    type: Number,
    required: true,
    min: 0
  }
});

module.exports = mongoose.model("CenterNode", centerNodeSchema);
