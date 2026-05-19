const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  highlight: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  cta1: { type: String, default: '' },
  cta2: { type: String, default: '' },
  bgGradient: { type: String, default: '' },
  image: { type: String },
  badgeIcon: { type: String, default: '' },
  badge: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('HeroSlide', heroSlideSchema);
