const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  flag: { type: String },
  continent: { type: String },
  tuitionRange: { type: String },
  livingCost: { type: String },
  ieltsRequired: { type: Boolean, default: false },
  popularSubjects: [{ type: String }],
  scholarshipCount: { type: Number, default: 0 },
  description: { type: String },
  partTimeWork: { type: Boolean, default: false },
  prPathway: { type: Boolean, default: false },
  image: { type: String },
  currency: { type: String },
  language: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Country', countrySchema);
