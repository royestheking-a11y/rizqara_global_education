const express = require('express');
const router = express.Router();
const ManualApplication = require('../models/ManualApplication');

// Get all manual student applications
router.get('/', async (req, res) => {
  try {
    const list = await ManualApplication.find().sort({ updatedAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get manual stats (daily, monthly, yearly counts & revenue)
router.get('/stats', async (req, res) => {
  try {
    const list = await ManualApplication.find({});
    
    let totalCount = 0;
    let totalRevenue = 0;
    let totalRevenueBDT = 0;
    
    let dailyRevenue = 0;
    let dailyRevenueBDT = 0;
    let dailyCount = 0;
    
    let monthlyRevenue = 0;
    let monthlyRevenueBDT = 0;
    let monthlyCount = 0;
    
    let yearlyRevenue = 0;
    let yearlyRevenueBDT = 0;
    let yearlyCount = 0;
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);
    
    list.forEach(student => {
      student.applications.forEach(app => {
        totalCount++;
        const amt = app.payment?.amount || 0;
        const currency = app.payment?.currency || 'USD';
        const isPaid = app.payment?.status === 'Completed';
        
        if (isPaid) {
          if (currency === 'BDT') {
            totalRevenueBDT += amt;
          } else {
            totalRevenue += amt;
          }
        }
        
        const appDate = new Date(app.createdAt || student.createdAt || now);
        
        // Check Daily
        if (appDate >= todayStart) {
          dailyCount++;
          if (isPaid) {
            if (currency === 'BDT') {
              dailyRevenueBDT += amt;
            } else {
              dailyRevenue += amt;
            }
          }
        }
        
        // Check Monthly
        if (appDate >= monthStart) {
          monthlyCount++;
          if (isPaid) {
            if (currency === 'BDT') {
              monthlyRevenueBDT += amt;
            } else {
              monthlyRevenue += amt;
            }
          }
        }
        
        // Check Yearly
        if (appDate >= yearStart) {
          yearlyCount++;
          if (isPaid) {
            if (currency === 'BDT') {
              yearlyRevenueBDT += amt;
            } else {
              yearlyRevenue += amt;
            }
          }
        }
      });
    });
    
    res.json({
      totalCount,
      totalRevenue,
      totalRevenueBDT,
      daily: { count: dailyCount, revenue: dailyRevenue, revenueBDT: dailyRevenueBDT },
      monthly: { count: monthlyCount, revenue: monthlyRevenue, revenueBDT: monthlyRevenueBDT },
      yearly: { count: yearlyCount, revenue: yearlyRevenue, revenueBDT: yearlyRevenueBDT }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single manual application record
router.get('/:id', async (req, res) => {
  try {
    const record = await ManualApplication.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create manual application record (New Student)
router.post('/', async (req, res) => {
  try {
    // If applications are not provided, make sure we have at least one from initial form
    const bodyData = req.body;
    if (!bodyData.applications || bodyData.applications.length === 0) {
      bodyData.applications = [{
        scholarship: bodyData.scholarship || 'General Scholarship',
        country: bodyData.country || 'N/A',
        notes: bodyData.notes || '',
        status: bodyData.status || 'Pending',
        payment: {
          amount: bodyData.paymentAmount || 0,
          currency: bodyData.paymentCurrency || 'USD',
          method: bodyData.paymentMethod || 'WhatsApp Manual',
          status: bodyData.paymentStatus || 'Unpaid',
          date: bodyData.paymentDate || new Date()
        }
      }];
    }
    
    const record = new ManualApplication(bodyData);
    const newRecord = await record.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update manual application record (Update Student or Applications array)
router.put('/:id', async (req, res) => {
  try {
    const updatedRecord = await ManualApplication.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedRecord) return res.status(404).json({ message: 'Record not found' });
    res.json(updatedRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete manual application record
router.delete('/:id', async (req, res) => {
  try {
    const deletedRecord = await ManualApplication.findByIdAndDelete(req.params.id);
    if (!deletedRecord) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Manual student application deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
