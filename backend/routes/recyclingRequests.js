const express = require('express');
const RecyclingRequest = require('../models/RecyclingRequest');
const Transaction = require('../models/Transaction');
const { Individual, Organization, Government } = require('../models/User');
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Generate unique code
const generateUniqueCode = () => {
  return 'E2R-' + uuidv4().substring(0, 8).toUpperCase();
};

// Create a new recycling request
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Determine user model based on the user
    let userModel;
    let user = await Individual.findById(userId);
    if (user) {
      userModel = 'Individual';
    } else {
      user = await Organization.findById(userId);
      if (user) {
        userModel = 'Organization';
      } else {
        user = await Government.findById(userId);
        if (user) {
          userModel = 'Government';
        } else {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }
      }
    }

    // Generate unique code
    let uniqueCode;
    let isUnique = false;
    while (!isUnique) {
      uniqueCode = generateUniqueCode();
      const existingRequest = await RecyclingRequest.findOne({ uniqueCode });
      if (!existingRequest) {
        isUnique = true;
      }
    }

    const requestData = {
      ...req.body,
      userId,
      userModel,
      uniqueCode
    };

    const recyclingRequest = new RecyclingRequest(requestData);
    await recyclingRequest.save();

    res.status(201).json({
      success: true,
      message: 'Recycling request created successfully',
      request: recyclingRequest,
      uniqueCode: uniqueCode
    });
  } catch (error) {
    console.error('Error creating recycling request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating request',
      error: error.message
    });
  }
});

// Get recycling requests for a specific recycler (incoming requests)
router.get('/recycler/:recyclerId', auth, async (req, res) => {
  try {
    const { recyclerId } = req.params;
    const { status } = req.query;

    // Verify that the requesting user is the recycler
    if (req.user.id !== recyclerId && req.user.id !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check for pending commission payments
    const pendingPayments = await Transaction.countDocuments({
      recyclerId,
      status: { $in: ['pending', 'paid'] }
    });

    // If showing pending requests, check payment eligibility
    if (status === 'pending' && pendingPayments > 0) {
      return res.json({
        success: true,
        requests: [],
        blocked: true,
        message: `You have ${pendingPayments} pending commission payment(s). Please complete payment to receive new appointments. Contact admin at ${process.env.ADMIN_CONTACT_EMAIL} for assistance.`
      });
    }

    let query = { recyclerId };
    if (status) {
      query.status = status;
    }

    const requests = await RecyclingRequest.find(query)
      .populate('userId', 'email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
      blocked: false,
      pendingPayments
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

// Update request status (accept/reject by recycler)
router.put('/:requestId/status', auth, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, message, finalPrice } = req.body;

    const request = await RecyclingRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Verify that the requesting user is the assigned recycler
    if (req.user.id !== request.recyclerId.toString() && req.user.id !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    request.status = status;
    request.recyclerResponse = {
      message,
      respondedAt: new Date(),
      finalPrice
    };

    await request.save();

    res.json({
      success: true,
      message: `Request ${status} successfully`,
      request
    });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating request',
      error: error.message
    });
  }
});

// Get user's own recycling requests
router.get('/my-requests', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await RecyclingRequest.find({ userId })
      .populate('recyclerId', 'companyName email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching requests',
      error: error.message
    });
  }
});

// Accept or reject a recycling request (for recyclers)
router.put('/:id/respond', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message, finalPrice } = req.body;
    const recyclerId = req.user.id;

    // Validate status
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "accepted" or "rejected"'
      });
    }

    const request = await RecyclingRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Recycling request not found'
      });
    }

    // Check if the recycler is authorized to respond to this request
    if (request.recyclerId.toString() !== recyclerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to respond to this request'
      });
    }

    // Update request
    request.status = status;
    request.recyclerResponse = {
      message,
      respondedAt: new Date(),
      finalPrice: finalPrice || request.estimatedPrice
    };
    request.userNotified = false; // Mark for notification

    await request.save();

    res.json({
      success: true,
      message: `Request ${status} successfully`,
      request
    });
  } catch (error) {
    console.error('Error responding to request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while responding to request',
      error: error.message
    });
  }
});

// Complete an order (for recyclers) - requires unique code verification
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { uniqueCode } = req.body;
    const recyclerId = req.user.id;

    if (!uniqueCode) {
      return res.status(400).json({
        success: false,
        message: 'Unique code is required to complete the order'
      });
    }

    const request = await RecyclingRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Recycling request not found'
      });
    }

    // Check if the recycler is authorized
    if (request.recyclerId.toString() !== recyclerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to complete this request'
      });
    }

    // Check if request is accepted
    if (request.status !== 'accepted') {
      console.log(`Completion attempt failed: Request ${id} has status '${request.status}', expected 'accepted'`);
      return res.status(400).json({
        success: false,
        message: `Request must be accepted before completion. Current status: ${request.status}`
      });
    }

    // Verify unique code
    if (request.uniqueCode !== uniqueCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid unique code'
      });
    }

    // Complete the order
    request.status = 'completed';
    request.completedAt = new Date();
    request.completedBy = recyclerId;
    request.userNotified = false; // Mark for notification

    await request.save();

    // Create commission transaction for admin
    const finalPrice = request.recyclerResponse?.finalPrice || 0;
    const commissionRate = parseFloat(process.env.ADMIN_COMMISSION_RATE) || 8;
    
    if (finalPrice > 0) {
      try {
        const commissionAmount = (finalPrice * commissionRate) / 100;
        
        const transaction = new Transaction({
          recyclingRequestId: request._id,
          recyclerId: recyclerId,
          orderAmount: finalPrice,
          commissionRate: commissionRate,
          commissionAmount: commissionAmount,
          productDetails: {
            name: request.productName,
            type: request.productType,
            quantity: request.quantity
          }
        });

        await transaction.save();
        console.log('Commission transaction created successfully');
      } catch (transactionError) {
        console.error('Error creating commission transaction:', transactionError);
        // Don't fail the order completion if transaction creation fails
        // Just log the error for admin review
      }
    }

    res.json({
      success: true,
      message: 'Order completed successfully. Commission payment required.',
      request,
      commissionRequired: finalPrice > 0,
      commissionAmount: finalPrice > 0 ? (finalPrice * commissionRate) / 100 : 0
    });
  } catch (error) {
    console.error('Error completing order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while completing order',
      error: error.message
    });
  }
});

// Get user's accepted requests
router.get('/accepted-requests', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await RecyclingRequest.find({ 
      userId,
      status: 'accepted'
    })
    .populate('recyclerId', 'companyName email phone address')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error('Error fetching accepted requests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching accepted requests',
      error: error.message
    });
  }
});

module.exports = router;