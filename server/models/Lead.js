const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  targetCountry: { type: String },
  targetDegree: { type: String },
  gpa: { type: String },
  ieltsStatus: { type: String },
  message: { type: String },
  status: { type: String, default: 'New' },
  unread: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', leadSchema);
