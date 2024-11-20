// routes/signup.js
const express = require('express');
const User = require('../models/User'); // Import the User model correctly
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    console.log("req", req.body)
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the plain-text password (not recommended)
    const user = await User.create({ email, password:hashedPassword });
    res.status(201).json({ message: 'User successfully registered', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
