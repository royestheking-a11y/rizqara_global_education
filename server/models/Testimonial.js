const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String },
  program: { type: String },
  university: { type: String },
  feedback: { type: String },
  image: { type: String },
  status: { type: String },
  year: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
