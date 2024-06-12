import User from '../models/userModel.js';
import express from 'express';
import brcypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    res
      .status(201)
      .json({ message: 'User registered successfully', success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error('User does not exist');

    // Check if password is correct
    const validPassword = await brcypt.compare(
      req.body.password, // user input
      user.password // hashed password from database
    );
    if (!validPassword) throw new Error('Invalid password');

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Send token in response
    res.status(200).json({
      message: 'User logged in successfully',
      success: true,
      data: token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

export default router;
