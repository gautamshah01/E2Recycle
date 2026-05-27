const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Remove Bearer from string
    const tokenValue = token.replace('Bearer ', '');
    
    // Check if token is valid format before verification
    if (!tokenValue || tokenValue === 'null' || tokenValue === 'undefined') {
      return res.status(401).json({ message: 'Invalid token format' });
    }
    
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;