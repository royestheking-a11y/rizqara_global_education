const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  price: { type: String },
  features: [{ type: String }],
  isFree: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
