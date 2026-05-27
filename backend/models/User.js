const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Bank Details Schema
const bankDetailsSchema = new mongoose.Schema({
  accountHolderName: {
    type: String,
    required: true,
    trim: true
  },
  accountNumber: {
    type: String,
    required: true,
    trim: true
  },
  bankName: {
    type: String,
    required: true,
    trim: true
  },
  ifscCode: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    validate: {
      validator: function(v) {
        return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v);
      },
      message: 'Invalid IFSC code format'
    }
  },
  upiId: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^[\w.-]+@[\w.-]+$/.test(v);
      },
      message: 'Invalid UPI ID format'
    }
  },
  branchName: {
    type: String,
    trim: true
  }
});

// Base User Schema
const userSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['individual', 'organization', 'government', 'recycler']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  bankDetails: {
    type: bankDetailsSchema,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'pending', 'rejected'],
    description: 'Account status - pending for recyclers awaiting admin approval'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Individual User Schema
const individualSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  occupation: {
    type: String,
    trim: true
  }
});

// Organization User Schema
const organizationSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  companySize: {
    type: String,
    required: true,
    enum: ['1-10', '11-50', '51-200', '201-1000', '1000+']
  },
  industry: {
    type: String,
    required: true,
    enum: ['technology', 'healthcare', 'finance', 'education', 'manufacturing', 'retail', 'other']
  }
});

// Government User Schema
const governmentSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  governmentLevel: {
    type: String,
    required: true,
    enum: ['central', 'state', 'local']
  },
  departmentType: {
    type: String,
    required: true,
    enum: ['environmental', 'waste-management', 'public-works', 'sustainability', 'other']
  },
  authCode: {
    type: String,
    required: true,
    trim: true
  }
});

// Recycler User Schema
const recyclerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  licenseNumber: {
    type: String,
    required: true,
    trim: true
  },
  specialization: [{
    type: String,
    enum: ['Electronics', 'Metals', 'Plastics', 'Batteries', 'Cables', 'Monitors']
  }],
  yearsInBusiness: {
    type: String,
    required: true,
    enum: ['0-1', '2-5', '6-10', '11-20', '20+']
  },
  processingCapacity: {
    type: String,
    required: true,
    enum: ['small', 'medium', 'large']
  },
  certifications: {
    type: String,
    trim: true
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update updatedAt before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create models for each user type
const User = mongoose.model('User', userSchema);
const Individual = User.discriminator('Individual', individualSchema);
const Organization = User.discriminator('Organization', organizationSchema);
const Government = User.discriminator('Government', governmentSchema);
const Recycler = User.discriminator('Recycler', recyclerSchema);

module.exports = {
  User,
  Individual,
  Organization,
  Government,
  Recycler
};