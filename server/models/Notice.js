const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  category: { type: String },
  date: { type: String },
  isUrgent: { type: Boolean, default: false },
  isImportant: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
