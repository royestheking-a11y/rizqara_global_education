const express = require('express');
const router = express.Router();
const HeroSlide = require('../models/HeroSlide');

router.get('/', async (req, res) => {
  try {
    const slides = await HeroSlide.find();
    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const slide = new HeroSlide(req.body);
  try {
    const newSlide = await slide.save();
    res.status(201).json(newSlide);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedSlide = await HeroSlide.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSlide);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await HeroSlide.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slide deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
