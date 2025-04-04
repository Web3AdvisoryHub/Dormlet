const express = require('express');
const router = express.Router();
const ethers = require('ethers');
const jwt = require('jsonwebtoken');
const { SiweMessage } = require('siwe');

// Authentication controller
const authController = {
  // Generate nonce for SIWE (Sign-In with Ethereum)
  getNonce: async (req, res) => {
    try {
      // Generate a random nonce
      const nonce = Math.floor(Math.random() * 1000000).toString();
      
      // Store nonce in session or temporary storage
      // In a production environment, this should be stored in Redis or similar
      req.session = req.session || {};
      req.session.nonce = nonce;
      
      res.status(200).json({ nonce });
    } catch (error) {
      console.error('Error generating nonce:', error);
      res.status(500).json({ error: 'Failed to generate nonce' });
    }
  },
  
  // Verify signature and authenticate user
  verify: async (req, res) => {
    try {
      const { message, signature } = req.body;
      
      if (!message || !signature) {
        return res.status(400).json({ error: 'Message and signature are required' });
      }
      
      // Parse the SIWE message
      const siweMessage = new SiweMessage(message);
      
      // Verify the signature
      const fields = await siweMessage.verify({
        signature,
        domain: process.env.DOMAIN || 'localhost',
        nonce: req.session.nonce
      });
      
      if (!fields.success) {
        return res.status(401).json({ error: 'Invalid signature' });
      }
      
      // Signature is valid, create JWT token
      const token = jwt.sign(
        { 
          address: fields.data.address,
          chainId: fields.data.chainId
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Clear the nonce
      req.session.nonce = null;
      
      // Return the token
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error verifying signature:', error);
      res.status(500).json({ error: 'Failed to verify signature' });
    }
  },
  
  // Validate JWT token
  validateToken: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }
      
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      res.status(200).json({ valid: true, user: decoded });
    } catch (error) {
      console.error('Error validating token:', error);
      res.status(401).json({ valid: false, error: 'Invalid token' });
    }
  }
};

// Routes
router.get('/nonce', authController.getNonce);
router.post('/verify', authController.verify);
router.get('/validate', authController.validateToken);

module.exports = router;
