const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, first_name, last_name, password } = req.body;
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).send('User already exists');
    }

    user = new User({
      username,
      first_name,
      last_name,
      password
    });

    // Password Encryption
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(201).send('User created successfully');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('User does not exist');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Password doesn\'t match');
    }

    res.status(200).send('User logged in successfully');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;