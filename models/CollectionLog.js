const mongoose = require('mongoose');

const collectionLogSchema = new mongoose.Schema({
  farmerId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  liters: { type: Number, required: true },
  fat: { type: Number, required: true },
  snf: { type: Number, required: true },
  payout: { type: Number, required: true },
  centerId: { type: String, default: 'CENTER-001' }
}, { timestamps: true });

module.exports = mongoose.model('CollectionLog', collectionLogSchema);