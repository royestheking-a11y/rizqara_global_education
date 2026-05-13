const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
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

countrySchema.pre('validate', function() {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name);
  }
});

module.exports = mongoose.model('Country', countrySchema);
