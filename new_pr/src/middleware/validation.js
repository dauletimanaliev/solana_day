const { PublicKey } = require('@solana/web3.js');

// Validation middleware for Solana public keys
const validatePublicKey = (fieldName) => {
  return (req, res, next) => {
    const value = req.body[fieldName] || req.params[fieldName];
    
    if (!value) {
      return res.status(400).json({
        success: false,
        error: `Missing required field: ${fieldName}`
      });
    }
    
    try {
      new PublicKey(value);
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: `Invalid public key format for ${fieldName}`
      });
    }
  };
};

// Validation middleware for numeric values
const validateNumeric = (fieldName, min = 0) => {
  return (req, res, next) => {
    const value = req.body[fieldName];
    
    if (value === undefined || value === null) {
      return res.status(400).json({
        success: false,
        error: `Missing required field: ${fieldName}`
      });
    }
    
    const numValue = Number(value);
    
    if (isNaN(numValue)) {
      return res.status(400).json({
        success: false,
        error: `${fieldName} must be a valid number`
      });
    }
    
    if (numValue < min) {
      return res.status(400).json({
        success: false,
        error: `${fieldName} must be greater than or equal to ${min}`
      });
    }
    
    // Update the request body with the validated number
    req.body[fieldName] = numValue;
    next();
  };
};

// Validation middleware for required fields
const validateRequired = (fields) => {
  return (req, res, next) => {
    const missing = [];
    
    fields.forEach(field => {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    });
    
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missing.join(', ')}`
      });
    }
    
    next();
  };
};

// Validation middleware for string length
const validateStringLength = (fieldName, minLength = 1, maxLength = 255) => {
  return (req, res, next) => {
    const value = req.body[fieldName];
    
    if (value !== undefined && value !== null) {
      if (typeof value !== 'string') {
        return res.status(400).json({
          success: false,
          error: `${fieldName} must be a string`
        });
      }
      
      if (value.length < minLength || value.length > maxLength) {
        return res.status(400).json({
          success: false,
          error: `${fieldName} must be between ${minLength} and ${maxLength} characters`
        });
      }
    }
    
    next();
  };
};

module.exports = {
  validatePublicKey,
  validateNumeric,
  validateRequired,
  validateStringLength
};
