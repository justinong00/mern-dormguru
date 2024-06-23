import Uni from '../models/uniModel.js';
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import mongoose from 'mongoose';


// Router is an instance of the express.Router class. It is responsible for handling HTTP requests and defining routes.
const router = express.Router();

// Add university
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Check if a university with the same name already exists
    const existingUni = await Uni.findOne({ name: req.body.name });
    if (existingUni) {
      return res.status(400).json({
        message: 'University with this name already exists',
        success: false,
      });
    }

    req.body.createdBy = req.userId; // Add user id from authMiddleware to request
    await Uni.create(req.body); // Create new university
    res
      .status(201)
      .json({ message: 'University added successfully', success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

// Get all universities
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Find all universities
    const universities = await Uni.find();
    res.status(200).json({ success: true, data: universities });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

// Get single university
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    // Get and Destructure the specific id from the request
    const { id } = req.params;
    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid university ID');
    }

    // Fetch the university with the given ID from db
    const university = await Uni.findById(id);
    if (!university) throw new Error('University not found');

    res.status(200).json({
      message: 'University fetched successfully',
      success: true,
      data: university,
    });
  } catch (err) {
    if (err.message === 'Invalid university ID') {
      res.status(400).json({ message: err.message, success: false });
    } else if (err.message === 'University not found') {
      res.status(404).json({ message: err.message, success: false });
    } else {
      res.status(500).json({ message: err.message, success: false });
    }
  }
});

// Update university
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Get and Destructure the specific id from the request
    const { id } = req.params;
    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid university ID');
    }

    // Add user id from authMiddleware to request
    req.body.createdBy = req.userId;

    // Update the university with the updated request body
    const university = await Uni.findByIdAndUpdate(id, req.body, { new: true });  // Set new option to true to return the modified document instead of the original one
    if (!university) throw new Error('University not found');
    res
      .status(200)
      .json({ message: 'University updated successfully', success: true });
  } catch (err) {
    if (err.message === 'Invalid university ID') {
      res.status(400).json({ message: err.message, success: false });
    } else if (err.message === 'University not found') {
      res.status(404).json({ message: err.message, success: false });
    } else {
      res.status(500).json({ message: err.message, success: false });
    }
  }
});

// Delete university
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid university ID');
    }

    const university = await Uni.findById(id);
    if (!university) throw new Error('University not found');

    await Uni.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: 'University deleted successfully', success: true });
  } catch (err) {
    if (err.message === 'Invalid university ID') {
      res.status(400).json({ message: err.message, success: false });
    } else if (err.message === 'University not found') {
      res.status(404).json({ message: err.message, success: false });
    } else {
      res.status(500).json({ message: err.message, success: false });
    }
  }
});

export default router;

