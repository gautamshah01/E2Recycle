const express = require('express');
const { Recycler } = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all approved recyclers
router.get('/approved', auth, async (req, res) => {
  try {
    const approvedRecyclers = await Recycler.find({ status: 'active' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      recyclers: approvedRecyclers
    });
  } catch (error) {
    console.error('Error fetching approved recyclers:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recyclers',
      error: error.message
    });
  }
});

module.exports = router;