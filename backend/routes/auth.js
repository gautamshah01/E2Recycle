const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { Individual, Organization, Government, Recycler } = require('../models/User');

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Register route
router.post('/register', [
  // Validation middleware
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['individual', 'organization', 'government', 'recycler']).withMessage('Invalid role selected'),
  body('phone').isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
  body('address').notEmpty().withMessage('Address is required'),
  body('bankDetails.accountHolderName').notEmpty().trim().withMessage('Account holder name is required'),
  body('bankDetails.accountNumber').notEmpty().trim().withMessage('Account number is required'),
  body('bankDetails.bankName').notEmpty().trim().withMessage('Bank name is required'),
  body('bankDetails.ifscCode').matches(/^[A-Z]{4}0[A-Z0-9]{6}$/).withMessage('Invalid IFSC code format'),
], async (req, res) => {
  try {
    console.log('Received registration data:', req.body);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { role, email, password, phone, address, bankDetails, ...roleSpecificData } = req.body;

    // Check if user already exists
    let existingUser;
    switch (role) {
      case 'individual':
        existingUser = await Individual.findOne({ email });
        break;
      case 'organization':
        existingUser = await Organization.findOne({ email });
        break;
      case 'government':
        existingUser = await Government.findOne({ email });
        break;
      case 'recycler':
        existingUser = await Recycler.findOne({ email });
        break;
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user based on role
    let user;
    const userData = {
      role,
      email,
      password,
      phone,
      address,
      bankDetails,
      ...roleSpecificData
    };

    // Set status to pending for recyclers
    if (role === 'recycler') {
      userData.status = 'pending';
    }

    switch (role) {
      case 'individual':
        user = new Individual(userData);
        break;
      case 'organization':
        user = new Organization(userData);
        break;
      case 'government':
        user = new Government(userData);
        break;
      case 'recycler':
        user = new Recycler(userData);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid user role'
        });
    }

    await user.save();

    // Special handling for recyclers - they need admin approval
    if (role === 'recycler') {
      return res.status(201).json({
        success: true,
        message: 'Registration successful! Your account is pending admin approval. You will be able to login after an admin accepts your request.',
        isPending: true,
        user: {
          id: user._id,
          role: user.role,
          email: user.email,
          status: user.status,
          createdAt: user.createdAt
        }
      });
    }

    // Generate token for other user types
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// Login route
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    console.log('Login attempt:', { email, providedPassword: password });
    console.log('Expected admin email:', process.env.ADMIN_EMAIL);
    console.log('Expected admin password:', process.env.ADMIN_PASSWORD);

    // Check if it's admin login
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      console.log('Admin login successful');
      const token = generateToken('admin');
      return res.json({
        success: true,
        message: 'Admin login successful',
        token,
        user: {
          id: 'admin',
          role: 'admin',
          email: process.env.ADMIN_EMAIL
        }
      });
    }

    // Find user in all collections
    let user = await Individual.findOne({ email }).select('+password') ||
               await Organization.findOne({ email }).select('+password') ||
               await Government.findOne({ email }).select('+password') ||
               await Recycler.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if recycler account is pending approval
    if (user.role === 'recycler' && user.status === 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin approval. Please wait for approval before logging in.',
        isPending: true
      });
    }

    // Check if recycler account is rejected
    if (user.role === 'recycler' && user.status === 'rejected') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been rejected by the admin. Please contact support.',
        isRejected: true
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
        status: user.status
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

module.exports = router;