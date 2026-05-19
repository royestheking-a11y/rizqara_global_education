const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String },
  excerpt: { type: String },
  content: { type: String },
  image: { type: String },
  images: [{ type: String }],
  date: { type: String },
  readTime: { type: String },
  author: { type: String },
  tags: [{ type: String }]
}, { timestamps: true });

blogPostSchema.pre('validate', function() {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title);
  }
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
