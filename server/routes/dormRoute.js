import Dorm from "../models/dormModel.js";
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import mongoose from "mongoose";

// Router is an instance of the express.Router class. It is responsible for handling HTTP requests and defining routes.
const router = express.Router();

// Add dorm
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Check if a dorm with the same name already exists
    const existingDorm = await Dorm.findOne({ name: req.body.name });
    if (existingDorm) {
      return res.status(400).json({
        message: "Dorm with this name already exists",
        success: false,
      });
    }

    req.body.createdBy = req.userId; // Add user id from authMiddleware to request
    await Dorm.create(req.body); // Create new dorm
    res.status(201).json({ message: "Dorm added successfully", success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

// Get all dorms
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Since the form submission only stores the _id of the parentUniversity in the Dorm collection, we use populate() to replace the parentUniversity field when displaying them in the Dorm-related pages. The populate() method is used to reference the actual university name from the Uni collection, specifically fetching the 'name' field. This is necessary to display the name of the parent university when listing the dorms.
    const dorms = await Dorm.find().sort({ createdAt: -1 }).populate("parentUniversity");

    res.status(200).json({ success: true, data: dorms });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

// Get single dorm
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid dorm ID");
    }

    // Since the form submission only stores the _id of the parentUniversity in the Dorm collection, we use populate() to replace the parentUniversity field when displaying them in the Dorm-related pages. The populate() method is used to reference the actual university name from the Uni collection, specifically fetching the 'name' field. This is necessary to display the name of the parent university when listing the dorms.
    const dorm = await Dorm.findById(id).populate("parentUniversity");
    if (!dorm) throw new Error("Dorm not found");

    res.status(200).json({ success: true, data: dorm });
  } catch (err) {
    if (err.message === "Invalid dorm ID") {
      res.status(400).json({ message: err.message, success: false });
    } else if (err.message === "Dorm not found") {
      res.status(404).json({ message: err.message, success: false });
    } else {
      res.status(500).json({ message: err.message, success: false });
    }
  }
});

// Update dorm
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid dorm ID");
    }

    req.body.createdBy = req.userId; // Add user id from authMiddleware to request

    const dorm = await Dorm.findByIdAndUpdate(id, req.body, { new: true });
    if (!dorm) throw new Error("Dorm not found");
    res.status(200).json({ message: "Dorm updated successfully", success: true });
  } catch (err) {
    if (err.message === "Invalid dorm ID") {
      res.status(400).json({ message: err.message, success: false });
    } else if (err.message === "Dorm not found") {
      res.status(404).json({ message: err.message, success: false });
    } else {
      res.status(500).json({ message: err.message, success: false });
    }
  }
});

// Delete dorm
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid dorm ID");
    }

    const dorm = await Dorm.findByIdAndDelete(id);
    if (!dorm) throw new Error("Dorm not found");
    res.status(200).json({ message: "Dorm deleted successfully", success: true });
  } catch (err) {
    if (err.message === "Invalid dorm ID") {
      res.status(400).json({ message: err.message, success: false });
    } else if (err.message === "Dorm not found") {
      res.status(404).json({ message: err.message, success: false });
    } else {
      res.status(500).json({ message: err.message, success: false });
    }
  }
});

export default router;
