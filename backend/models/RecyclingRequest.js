const mongoose = require('mongoose');

const recyclingRequestSchema = new mongoose.Schema({
  // User who made the request
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'userModel'
  },
  userModel: {
    type: String,
    required: true,
    enum: ['Individual', 'Organization', 'Government']
  },
  
  // Recycler to whom request is sent
  recyclerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Recycler'
  },
  recyclerName: {
    type: String,
    required: true
  },
  
  // Product details
  productName: {
    type: String,
    required: true,
    trim: true
  },
  productType: {
    type: String,
    required: true,
    enum: [
      'Smartphone',
      'Laptop', 
      'Desktop Computer',
      'Tablet',
      'Monitor',
      'Printer',
      'Television',
      'Audio Equipment',
      'Camera',
      'Gaming Console',
      'Other Electronics'
    ]
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  condition: {
    type: String,
    required: true
  },
  estimatedPrice: {
    type: Number,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  
  // Contact details
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  
  // Appointment details
  preferredDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true,
    enum: ['9:00 AM - 12:00 PM', '12:00 PM - 3:00 PM', '3:00 PM - 6:00 PM']
  },
  
  // Request status
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'accepted', 'rejected', 'completed']
  },
  
  // Unique booking code
  uniqueCode: {
    type: String,
    required: true,
    unique: true
  },
  
  // Response from recycler
  recyclerResponse: {
    message: String,
    respondedAt: Date,
    finalPrice: Number
  },
  
  // Notification status
  userNotified: {
    type: Boolean,
    default: false
  },
  
  // Completion details
  completedAt: {
    type: Date
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recycler'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RecyclingRequest', recyclingRequestSchema);