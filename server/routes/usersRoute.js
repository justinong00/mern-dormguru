import User from '../models/userModel.js';
import express from 'express';
import brcypt from 'bcryptjs';

// Router is an instance of the express.Router class. It is responsible for handling HTTP requests and defining routes.
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) throw new Error('User already exists');

    // Hash Password
    const salt = await brcypt.genSalt(10);
    req.body.password = await brcypt.hash(req.body.password, salt);

    // Create new user
    await User.create(req.body);
    res.status(201).json({ message: 'User registered successfully', success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});
