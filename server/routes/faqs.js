const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');

router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const faq = new FAQ(req.body);
  try {
    const newFAQ = await faq.save();
    res.status(201).json(newFAQ);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedFAQ = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedFAQ);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ message: 'FAQ deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
