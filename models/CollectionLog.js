const mongoose = require("mongoose");

const collectionLogSchema = new mongoose.Schema({
  logId: { 
    type: String, 
    default: () => `LOG-${Date.now()}` 
  },
  farmerId: { 
    type: String, 
    required: true, 
    index: true 
  },
  centerId: { 
    type: String, 
    required: true, 
    default: "CENTER-001" 
  },
  date: { 
    type: String, 
    required: true, 
    default: () => new Date().toISOString().split("T")[0] 
  },
  liters: { 
    type: Number, 
    required: true 
  },
  fat: { 
    type: Number, 
    required: true 
  },
  snf: { 
    type: Number, 
    required: true 
  },
  payout: { 
    type: Number, 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model("CollectionLog", collectionLogSchema);