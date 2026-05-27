const express = require('express');
const jwt = require('jsonwebtoken');
const { Individual, Organization, Government, Recycler } = require('../models/User');

const router = express.Router();

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user in all collections
    let user = await Individual.findById(decoded.id) ||
               await Organization.findById(decoded.id) ||
               await Government.findById(decoded.id) ||
               await Recycler.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = req.user;
    
    // Remove sensitive information
    const userProfile = user.toObject();
    delete userProfile.password;

    res.json({
      success: true,
      user: userProfile
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;
    const updateData = req.body;

    // Remove sensitive fields from update
    delete updateData.password;
    delete updateData.email;
    delete updateData.role;

    let user;
    switch (role) {
      case 'individual':
        user = await Individual.findByIdAndUpdate(userId, updateData, { new: true });
        break;
      case 'organization':
        user = await Organization.findByIdAndUpdate(userId, updateData, { new: true });
        break;
      case 'government':
        user = await Government.findByIdAndUpdate(userId, updateData, { new: true });
        break;
      case 'recycler':
        user = await Recycler.findByIdAndUpdate(userId, updateData, { new: true });
        break;
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove sensitive information
    const userProfile = user.toObject();
    delete userProfile.password;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userProfile
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get all users (admin route - for testing)
router.get('/all', async (req, res) => {
  try {
    const individuals = await Individual.find().select('-password');
    const organizations = await Organization.find().select('-password');
    const governments = await Government.find().select('-password');
    const recyclers = await Recycler.find().select('-password');

    res.json({
      success: true,
      users: {
        individuals,
        organizations,
        governments,
        recyclers
      },
      total: individuals.length + organizations.length + governments.length + recyclers.length
    });
  } catch (error) {
    console.error('Fetch all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get users by role
router.get('/role/:role', async (req, res) => {
  try {
    const { role } = req.params;
    let users;

    switch (role) {
      case 'individual':
        users = await Individual.find().select('-password');
        break;
      case 'organization':
        users = await Organization.find().select('-password');
        break;
      case 'government':
        users = await Government.find().select('-password');
        break;
      case 'recycler':
        users = await Recycler.find().select('-password');
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid role specified'
        });
    }

    res.json({
      success: true,
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Fetch users by role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;