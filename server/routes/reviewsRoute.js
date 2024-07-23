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
router.get("/get-reviews-by-dorm/:id", authMiddleware, async (req, res) => {
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

// Get all reviews by user id
router.get("/get-reviews-by-user/:id", authMiddleware, async (req, res) => {
  try {
    // Extract the user ID from the request parameters
    const { id } = req.params;

    // Check if the user ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid user ID");
    }

    // Find all reviews for the specified user, sort them by creation date in descending order, and populate the related user and dorm fields
    const reviews = await Review.find({ createdBy: id })
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

// Update review
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    // Get and Destructure the specific id from the request parameters
    const { id } = req.params;
    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid review ID");
    }

    // Add user id from authMiddleware to request body
    req.body.createdBy = req.userId; 

    // Set new option to true to return the modified document instead of the original one
    const review = await Review.findByIdAndUpdate(id, req.body, { new: true }); 
    // If review not found, throw an error
    if (!review) throw new Error("Review not found");

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
    const average = await Review.aggregate([
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

    // Extract the average rating value from the array, defaulting to 0 if no reviews are found
    const averageRatingValue = average[0]?.averageRating || 0;

    // Count the number of reviews for the specified dorm
    const numberOfReviews = await Review.countDocuments({ dorm: req.body.dorm });

    // Update the dorm document with the new average rating and the same number of reviews (since update, no change in number of reviews)
    await Dorm.findByIdAndUpdate(req.body.dorm, {
      numberOfReviews: numberOfReviews,
      averageRating: averageRatingValue,
    });

    res.status(200).json({ message: "Review updated successfully", success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

// Delete review
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Get and Destructure the specific id from the request parameters
    const { id } = req.params;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid review ID or dorm ID");
    }

    // Delete the review with the specified ID
    await Review.findByIdAndDelete(id);

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
    const average = await Review.aggregate([
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

    // Extract the average rating value from the array, defaulting to 0 if no reviews are found
    const averageRatingValue = average[0]?.averageRating || 0;

    // Count the number of reviews for the specified dorm
    const numberOfReviews = await Review.countDocuments({ dorm: req.body.dorm });

    // Update the dorm document with the new average rating and number of reviews
    await Dorm.findByIdAndUpdate(req.body.dorm, {
      numberOfReviews: numberOfReviews,
      averageRating: averageRatingValue,
    });

    res.status(200).json({ message: "Review deleted successfully", success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

// Add or remove like to review
router.put("/toggle-like/:id", authMiddleware, async (req, res) => {
  try {
    // Get the review with the specified ID
    const review = await Review.findById(req.params.id);
    // Get the user ID from the authMiddleware
    const userId = req.userId;

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Find the index of the userId in the likedBy array to see if the user has already liked the review
    const userIndex = review.likedBy.indexOf(userId);

    // User has not liked the review yet
    if (userIndex === -1) {
      // Add like to review
      review.likedBy.push(userId);
      review.numberOfLikes += 1;
    } else { // User has already liked the review
      // Remove like from review
      review.likedBy.splice(userIndex, 1);
      review.numberOfLikes -= 1;
    }

    await review.save();
    res.status(200).json({ 
      message: userIndex === -1 ? "Like added successfully" : "Like removed successfully",
      success: true, 
    });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

export default router;
