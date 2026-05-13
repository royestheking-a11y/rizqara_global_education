function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\p{L}\p{N}-]+/gu, '') // Remove all non-word/non-number chars except - (unicode aware)
    .replace(/--+/g, '-');          // Replace multiple - with single -
}

module.exports = slugify;
