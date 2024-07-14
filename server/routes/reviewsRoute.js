import Review from "../models/reviewModel.js";
import Dorm from "../models/dormModel.js";
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import mongoose from "mongoose";

// Router is an instance of the express.Router class. It is responsible for handling HTTP requests and defining routes.
const router = express.Router();

// Add review
router.post("/", authMiddleware, async (req, res) => {
  try {
    req.body.createdBy = req.userId; // Add user id from authMiddleware to the request body
    const newReview = new Review(req.body);
    await newReview.save(); // Save new review, save() bypasses schema validation

    /** Aggregate reviews to calculate the average rating for the specified dorm.
     *
     * The aggregate method in MongoDB allows for performing complex queries that involve multiple stages. Each stage in the pipeline performs an operation on the input documents and passes the result to the next stage.
     *
     * - $match: Filters the documents to include only those that match the specified condition. In this case, it matches documents where the dorm field matches req.body.dorm. This ensures that we only consider reviews for the specific dorm we're interested in.
     *
     * - $group: Groups the documents by the specified _id and calculates aggregate values for each group. Here, it groups by the dorm field and calculates the average rating using $avg.
     *
     * The result of the aggregate operation is an array of documents, where each document represents a group (in this case, a single dorm) and contains the _id (the dorm value) and the averageRating calculated for that group.
     */
    const averageRating = await Review.aggregate([
      {
        $match: { dorm: mongoose.Types.ObjectId.createFromHexString(req.body.dorm) },
      },
      {
        $group: {
          _id: "$dorm",
          averageRating: { $avg: "$rating" },
        },
      },
      {
        $addFields: { averageRating: { $round: ["$averageRating", 1] } },
      },
    ]);

    console.log(averageRating);

    // Extract the average rating value from the array, defaulting to 0 if no reviews are found
    const averageRatingValue = averageRating[0]?.averageRating || 0;

    // Count the number of reviews for the specified dorm
    const numberOfReviews = await Review.countDocuments({ dorm: req.body.dorm });

    // Update the dorm document with the new average rating and number of reviews
    await Dorm.findByIdAndUpdate(req.body.dorm, {
      numberOfReviews: numberOfReviews,
      averageRating: averageRatingValue,
    });

    // Send a success response back to the client
    res.status(201).json({ message: "Review added successfully", success: true });
  } catch (err) {
    // Handle any errors that occur during the process
    res.status(500).json({ message: err.message, success: false });
  }
});

// Get all reviews by dorm id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    // Extract the dorm ID from the request parameters
    const { id } = req.params;

    // Check if the dorm ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid dorm ID");
    }

    // Find all reviews for the specified dorm, sort them by creation date in descending order, and populate the related user and dorm fields
    const reviews = await Review.find({ dorm: id })
      .sort({ createdAt: -1 })
      .populate("createdBy")
      .populate("dorm");

    // Send a success response with the retrieved reviews
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    // Handle any errors that occur during the process
    res.status(500).json({ message: err.message, success: false });
  }
});

export default router;
