import User from '../models/userModel.js';
import express from 'express';
import brcypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middlewares/authMiddleware.js';

// Router is an instance of the express.Router class. It is responsible for handling HTTP requests and defining routes.
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) throw new Error('User with this email already exists');

    // Check if email ends with '.edu.my'
    const isVerifiedStudent = req.body.email.endsWith('.edu.my');

    // Hash Password
    const salt = await brcypt.genSalt(10);
    req.body.password = await brcypt.hash(req.body.password, salt);

    // Create new user with the isVerifiedStudent flag
    await User.create({ ...req.body, isVerifiedStudent });

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
    if (!user) throw new Error('User with this email does not exist');

    // Check if user is active
    if (!user.isActive) throw new Error('User is banned');

    // Check if password is correct
    const validPassword = await brcypt.compare(
      req.body.password, // user input
      user.password // hashed password from database
    );
    if (!validPassword) throw new Error('Wrong password');

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

// Get Current User (for protected routes) - By passing authMiddleware as a parameter to router.get, you are instructing Express to execute this middleware function before the route handler function is called. This ensures that only authenticated users can access the /get-current-user endpoint.
router.get('/get-current-user', authMiddleware , async (req, res) => {
  try {
    // Find user by ID and exclude password
    const user = await User.findById(req.userId).select('-password');
    res.status(200).json({ message: 'User fetched successfully', success: true, data: user });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

// Update User
router.put('/update-user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    if (!user) throw new Error('User not found');

    // Check if old password is provided and if it matches the user's stored password
    if (req.body.oldPassword) {
      const validPassword = await brcypt.compare(
        req.body.oldPassword, // user input
        user.password // hashed password from database
      );
      if (!validPassword) throw new Error('The old password is incorrect');
    }

    // If new password is provided, hash it and update the user's password
    if (req.body.newPassword) {
      const salt = await brcypt.genSalt(10);
      req.body.password = await brcypt.hash(req.body.newPassword, salt);
    }

    // Prepare the updateData, excluding oldPassword and newPassword (so only req.body.name, req.body.email, and req.body.password are in updateData)
    const updateData = { ...req.body };
    delete updateData.oldPassword;
    delete updateData.newPassword;

    const updatedUser = await User.findByIdAndUpdate(req.body.id, updateData, { new: true }).select('-password');
    res
      .status(200)
      .json({ message: 'User updated successfully', success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// Get All Users
router.get('/get-all-users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ message: 'Users fetched successfully', success: true, data: users });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

export default router;
