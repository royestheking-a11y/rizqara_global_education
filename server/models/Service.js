const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String },
  price: { type: String },
  features: [{ type: String }],
  isFree: { type: Boolean, default: false }
}, { timestamps: true });

serviceSchema.pre('validate', function() {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title);
  }
});

module.exports = mongoose.model('Service', serviceSchema);
