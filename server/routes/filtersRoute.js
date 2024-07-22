import Dorm from  "../models/dormModel.js";
import Uni from  "../models/uniModel.js";
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

/**@fileoverview
 * @fileoverview filtersRoute.js is is responsible for handling API routes related to filtering and searching dorms and universities.
 */

// Router is an instance of the express.Router class. It is responsible for handling HTTP requests and defining routes.
const router = express.Router();

/** Handles a GET request to the root route ("/") of the filters API.
 * This route is protected by the `authMiddleware` middleware, which ensures that only authenticated users can access it.
 * The route searches for dorms in the database whose name matches the provided search query (if any), and populates the `parentUniversity` field of the dorm documents.
 * The response includes a success flag and the found dorms.
 *
 * @param {Object} req - The Express request object.
 * @param {string} [req.query.search] - The search query to filter dorms by name.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the response is sent.
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const search = req.query.search || "";
    
    const dorms = await Dorm.aggregate([
      // Lookup to join with the 'unis' collection - this stage performs a left outer join to the unis collection, using the parentUniversity field in the dorms collection and the _id field in the unis collection. The resulting documents will have a parentUniversity array containing the matching university document.)
      {
        $lookup: {
          from: 'unis',
          localField: 'parentUniversity',
          foreignField: '_id',
          as: 'parentUniversity'
        }
      },
      // Unwind the parentUniversity array (because the result of $lookup is an array) - this stage deconstructs the parentUniversity array, which results from the $lookup stage, into individual documents. This makes it easier to perform searches on the parentUniversity.name field.
      {
        $unwind: {
          path: '$parentUniversity',
          preserveNullAndEmptyArrays: true
        }
      },
      // Match stage to filter dorms by search query - this stage filters the documents based on the search query. The $or operator is used to search across multiple fields, including name, city, state, and parentUniversity.name.
      {
        $match: {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { city: { $regex: search, $options: "i" } },
            { state: { $regex: search, $options: "i" } },
            { 'parentUniversity.name': { $regex: search, $options: "i" } }
          ]
        }
      }
    ]);

    res.status(200).json({ success: true, data: { dorms } });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

export default router;

/* 

// After applying the lookup and unwind stages, the resulting documents would look like this:

[
  {
    _id: "63f556e056b15441b4976c38",
    name: "Dorm 1",
    city: "City 1",
    state: "State 1",
    parentUniversity: {
      _id: "63f556e056b15441b4976c37",
      name: "University 1",
      city: "City 1",
      state: "State 1",
      // ... other fields of the university document
    }
  },
  // ... other dorm documents
] 
  
*/