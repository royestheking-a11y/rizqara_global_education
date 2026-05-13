const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Country = require('../models/Country');

router.get('/', async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let country;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      country = await Country.findById(req.params.id);
    }
    
    if (!country) {
      country = await Country.findOne({ slug: req.params.id });
    }

    if (!country) return res.status(404).json({ message: 'Country not found' });
    res.json(country);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const country = new Country(req.body);
  try {
    const newCountry = await country.save();
    res.status(201).json(newCountry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Country.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Country.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
