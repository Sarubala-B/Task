// routes/signup.js
const express = require('express');
const User = require('../models/User'); 
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: 'failure',
        message: 'Email and password are required',
      });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        status: 'failure',
        message: 'Email already in use',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password:hashedPassword });
    res.status(200).json({
      status: 'success',
      message: 'User successfully registered',
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
