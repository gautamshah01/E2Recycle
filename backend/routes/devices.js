const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Device = require('../models/Device');
const auth = require('../middleware/auth');

// Get all devices for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const devices = await Device.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single device by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const device = await Device.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    res.json(device);
  } catch (error) {
    console.error('Error fetching device:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new device
router.post('/', auth, async (req, res) => {
  try {
    const { name, model, condition, purchaseDate, warrantyDate } = req.body;

    // Validate required fields
    if (!name || !model || !condition || !purchaseDate) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: name, model, condition, and purchase date' 
      });
    }

    // Validate condition enum
    const validConditions = ['working', 'minor-issues', 'major-issues', 'not-working'];
    if (!validConditions.includes(condition)) {
      return res.status(400).json({ 
        message: 'Invalid condition. Must be one of: working, minor-issues, major-issues, not-working' 
      });
    }

    // Create new device
    const device = new Device({
      name: name.trim(),
      model: model.trim(),
      condition,
      purchaseDate: new Date(purchaseDate),
      warrantyDate: warrantyDate ? new Date(warrantyDate) : undefined,
      userId: req.user.id
    });

    await device.save();
    res.status(201).json(device);
  } catch (error) {
    console.error('Error creating device:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update device
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, model, condition, purchaseDate, warrantyDate } = req.body;

    // Find device by ID and user
    const device = await Device.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Validate required fields
    if (!name || !model || !condition || !purchaseDate) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: name, model, condition, and purchase date' 
      });
    }

    // Validate condition enum
    const validConditions = ['working', 'minor-issues', 'major-issues', 'not-working'];
    if (!validConditions.includes(condition)) {
      return res.status(400).json({ 
        message: 'Invalid condition. Must be one of: working, minor-issues, major-issues, not-working' 
      });
    }

    // Update device fields
    device.name = name.trim();
    device.model = model.trim();
    device.condition = condition;
    device.purchaseDate = new Date(purchaseDate);
    device.warrantyDate = warrantyDate ? new Date(warrantyDate) : undefined;

    await device.save();
    res.json(device);
  } catch (error) {
    console.error('Error updating device:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete device
router.delete('/:id', auth, async (req, res) => {
  try {
    const device = await Device.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    await Device.deleteOne({ _id: req.params.id });
    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Error deleting device:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get device statistics for user
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get total devices count
    const totalDevices = await Device.countDocuments({ userId });
    
    // Get devices by condition
    const devicesByCondition = await Device.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$condition', count: { $sum: 1 } } }
    ]);
    
    // Get devices with expired warranty
    const expiredWarranty = await Device.countDocuments({
      userId,
      warrantyDate: { $lt: new Date() }
    });
    
    // Get recent devices (last 30 days)
    const recentDevices = await Device.countDocuments({
      userId,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      totalDevices,
      devicesByCondition,
      expiredWarranty,
      recentDevices
    });
  } catch (error) {
    console.error('Error fetching device statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;