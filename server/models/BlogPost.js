const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String },
  excerpt: { type: String },
  content: { type: String },
  image: { type: String },
  date: { type: String },
  readTime: { type: String },
  author: { type: String },
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', blogPostSchema);
