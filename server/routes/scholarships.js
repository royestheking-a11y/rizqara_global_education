const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Scholarship = require('../models/Scholarship');

// Get all scholarships
router.get('/', async (req, res) => {
  try {
    const { ids } = req.query;
    let query = {};
    if (ids) {
      query = { _id: { $in: ids.split(',') } };
    }
    const scholarships = await Scholarship.find(query);
    res.json(scholarships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single scholarship
router.get('/:id', async (req, res) => {
  try {
    let scholarship;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      scholarship = await Scholarship.findById(req.params.id);
    }
    
    if (!scholarship) {
      scholarship = await Scholarship.findOne({ slug: req.params.id });
    }

    if (!scholarship) return res.status(404).json({ message: 'Scholarship not found' });
    res.json(scholarship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create scholarship (Admin only - simplification)
router.post('/', async (req, res) => {
  const scholarship = new Scholarship(req.body);
  try {
    const newScholarship = await scholarship.save();
    res.status(201).json(newScholarship);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update scholarship
router.put('/:id', async (req, res) => {
  try {
    const updatedScholarship = await Scholarship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedScholarship);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete scholarship
router.delete('/:id', async (req, res) => {
  try {
    await Scholarship.findByIdAndDelete(req.params.id);
    res.json({ message: 'Scholarship deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
