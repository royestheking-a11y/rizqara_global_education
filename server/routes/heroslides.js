const express = require('express');
const router = express.Router();
const HeroSlide = require('../models/HeroSlide');

// GET — sorted by order
router.get('/', async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1 });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST — create new slide
router.post('/', async (req, res) => {
  try {
    const count = await HeroSlide.countDocuments();
    const slide = new HeroSlide({ ...req.body, order: req.body.order ?? count });
    const newSlide = await slide.save();
    res.status(201).json(newSlide);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /reorder — bulk update order positions
router.patch('/reorder', async (req, res) => {
  try {
    const updates = req.body; // [{id, order}, ...]
    await Promise.all(
      updates.map(({ id, order }) =>
        HeroSlide.findByIdAndUpdate(id, { order })
      )
    );
    res.json({ message: 'Reordered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /:id — update slide
router.put('/:id', async (req, res) => {
  try {
    const updatedSlide = await HeroSlide.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSlide);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /:id
router.delete('/:id', async (req, res) => {
  try {
    await HeroSlide.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slide deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
