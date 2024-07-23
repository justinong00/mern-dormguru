import Dorm from  "../models/dormModel.js";
import Uni from  "../models/uniModel.js";
import Review from  "../models/reviewModel.js";
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

// Router is an instance of the express.Router class. It is responsible for handling HTTP requests and defining routes.
const router = express.Router();


/** Retrieves the counts of reviews, universities, and dormitories from the database.
 *
 * @route GET /api/home-stats
 * @group Home Statistics
 * @param {string} x-access-token - User's access token
 * @returns {object} 200 - An object containing the counts of dormitories and universities
 * @returns {object} 500 - Error message
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const reviewCount = await Review.countDocuments();
    const uniCount = await Uni.countDocuments();
    const dormCount = await Dorm.countDocuments();
    res.status(200).json({ success: true, data: { reviewCount, uniCount, dormCount } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  } 
});

export default router;