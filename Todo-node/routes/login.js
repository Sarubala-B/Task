// routes/signup.js

const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');

const router = express.Router();

const SECRET_KEY = 'supersecretkey123'; // Replace with a secure key
const REFRESH_SECRET_KEY = 'refreshkey123'; // Replace with a secure key

// Store refresh tokens temporarily (use a database in production)
const refreshTokens = [];

// Function to generate a token
function generateToken(userId, secret, expiresIn) {
    const hash = crypto.createHmac('sha256', secret).update(userId.toString()).digest('hex');
    return  userId.toString()+'.'+hash+'.'+Date.now() + expiresIn * 1000;
}

// Function to verify a token
function verifyToken(tokenString, hash, secret) {
    const expectedHash = crypto.createHmac('sha256', secret).update(tokenString).digest('hex');
    if (hash !== expectedHash) return false;

    const { expiry } = JSON.parse(tokenString);
    return Date.now() < expiry; // Check if token is still valid
}

// Route to refresh the access token
router.post('/refresh', (req, res) => {
  const  refreshToken  = req.headers['authorization'];
  if (!refreshToken) {
      return res.status(403).send('Invalid refresh token');
  }
  const payload = JSON.parse(
      Buffer.from(refreshToken.split('.')[1], 'base64').toString()
  );
  const newAccessToken = generateToken(ACCESS_TOKEN_SECRET, 3600000, { userId: payload.userId });
  res.status(200).json({
    status: 'success',
    message: 'Access token generated successful',
    data: { accessToken: newAccessToken },
  });
  res.json({ accessToken: newAccessToken });
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'User not found. Please sign up.' });
    }
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
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
