const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// Get all applications (Admin)
router.get('/', async (req, res) => {
  try {
    const apps = await Application.find()
      .populate('student', 'name email')
      .populate('scholarship', 'name country countryFlag')
      .sort({ updatedAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my applications (Student)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token' });
    const token = authHeader.split(' ')[1];
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    
    const apps = await Application.find({ student: decoded.id })
      .populate('scholarship')
      .sort({ updatedAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create application
router.post('/', async (req, res) => {
  const application = new Application(req.body);
  try {
    const newApp = await application.save();
    res.status(201).json(newApp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update application
router.put('/:id', async (req, res) => {
  try {
    const updatedApp = await Application.findByIdAndUpdate(req.params.id, {
      ...req.body,
      lastUpdate: Date.now()
    }, { new: true });
    res.json(updatedApp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete application
router.delete('/:id', async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
