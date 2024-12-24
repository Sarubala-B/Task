// routes/signup.js
const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const router = express.Router();

const SECRET_KEY = "a3f5c1eaa2834c1f92f0568abed83b4b9f0fcd8a7e5cbfed4fbd01dc5762c8ab"; // Replace with a secure key
const REFRESH_SECRET_KEY = "c7e92847a38418d4b5e12668ee5c11a8bf88cf31a79e1e9e4b9279d9fbdad3c5"; // Replace with a secure key

// Store refresh tokens temporarily (use a database in production)
const refreshTokens = [];

// Function to generate a token
function generateToken(userId, secret, expiresIn) {
    const hash = crypto.createHmac('sha256', secret).update(userId.toString()).digest('hex');
    return  userId.toString()+'.'+hash+'.'+Date.now() + expiresIn * 1000;
}

// Route to refresh the access token
router.post('/refresh', (req, res) => {
  const  refreshToken  = req.headers['authorization'];
  if(refreshToken){
    const authHeader = refreshToken.split('.');
    const expectedHash = crypto.createHmac('sha256', REFRESH_SECRET_KEY).update(authHeader[0]).digest('hex');
    if (authHeader[1] != expectedHash){
      res.status(401).json({
        status: 'failure',
        message: 'Invalid Token',
      });
    }else{
      if(Date.now > parseInt(authHeader[2])){
        res.status(401).json({
          status: 'failure',
          message: 'Token Expired',
        });
      }else{
        const newAccessToken = generateToken(refreshToken.split('.')[0], SECRET_KEY, 3600);
        res.status(200).json({
          status: 'success',
          message: 'Access token generated successful',
          data: { accessToken: newAccessToken },
        });
      }
    }
  }else{
    res.status(400).json({
      status: 'failure',
      message: 'Token not available',
    });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ where: { email:email } });
    if (!user) {
      return res.status(404).json({
        status: 'failure',
        message: 'User not found. Please sign up'
      });
    }
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'failure',
        message: 'Invalid email or password'
      });
    }
    const accessToken = generateToken(user.id, SECRET_KEY, 3600); // 1-hour expiry
    const refreshToken = generateToken(user.id, REFRESH_SECRET_KEY, 86400); // 24-hour expiry
    refreshTokens.push(refreshToken.token); // Store refresh token  
    await user.save(); // Save the token to the user record in the database (optional)
    // Send the access token to the client
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: { id: user.id, accessToken: accessToken, refreshToken: refreshToken },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
