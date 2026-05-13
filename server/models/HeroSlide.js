const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  highlight: { type: String },
  subtitle: { type: String },
  cta1: { type: String },
  cta2: { type: String },
  bgGradient: { type: String },
  image: { type: String },
  badgeIcon: { type: String },
  badge: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HeroSlide', heroSlideSchema);
