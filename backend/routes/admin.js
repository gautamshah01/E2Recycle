const express = require('express');
const { Recycler } = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.id !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// Get all pending recycler requests
router.get('/recycler-requests', auth, isAdmin, async (req, res) => {
  try {
    const pendingRecyclers = await Recycler.find({ status: 'pending' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests: pendingRecyclers
    });
  } catch (error) {
    console.error('Error fetching recycler requests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching requests',
      error: error.message
    });
  }
});

// Approve a recycler request
router.put('/recycler-requests/:id/approve', auth, isAdmin, async (req, res) => {
  try {
    const recycler = await Recycler.findById(req.params.id);
    
    if (!recycler) {
      return res.status(404).json({
        success: false,
        message: 'Recycler not found'
      });
    }

    if (recycler.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Recycler request is not in pending status'
      });
    }

    recycler.status = 'active';
    recycler.updatedAt = new Date();
    await recycler.save();

    res.json({
      success: true,
      message: 'Recycler request approved successfully',
      recycler: {
        id: recycler._id,
        companyName: recycler.companyName,
        email: recycler.email,
        status: recycler.status
      }
    });
  } catch (error) {
    console.error('Error approving recycler:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while approving request',
      error: error.message
    });
  }
});

// Reject a recycler request
router.put('/recycler-requests/:id/reject', auth, isAdmin, async (req, res) => {
  try {
    const recycler = await Recycler.findById(req.params.id);
    
    if (!recycler) {
      return res.status(404).json({
        success: false,
        message: 'Recycler not found'
      });
    }

    if (recycler.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Recycler request is not in pending status'
      });
    }

    recycler.status = 'rejected';
    recycler.updatedAt = new Date();
    await recycler.save();

    res.json({
      success: true,
      message: 'Recycler request rejected successfully',
      recycler: {
        id: recycler._id,
        companyName: recycler.companyName,
        email: recycler.email,
        status: recycler.status
      }
    });
  } catch (error) {
    console.error('Error rejecting recycler:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while rejecting request',
      error: error.message
    });
  }
});

// Get all recyclers (with status)
router.get('/recyclers', auth, isAdmin, async (req, res) => {
  try {
    const recyclers = await Recycler.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      recyclers
    });
  } catch (error) {
    console.error('Error fetching recyclers:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recyclers',
      error: error.message
    });
  }
});

module.exports = router;