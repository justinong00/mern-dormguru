import express from "express";
import multer from "multer";
import cloudinaryConfig from "../config/cloudinaryConfig.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import fs from "fs";
import dayjs from "dayjs";

// Router is an instance of the express.Router class. It is responsible for handling HTTP requests and defining routes.
const router = express.Router();

/** Configures Multer middleware to use in-memory storage for uploaded files.
 *
 * This allows the request body data to be directly accessed in the main route handler function,
 * making it easier to determine the destination folder based on the presence of `uniName` or `dormName`.
 * Using in-memory storage avoids the potential issues that could arise from trying to access the request body data
 * in the destination function of `multer.diskStorage()`.
 */
//========================================================================================
const memoryStorage = multer.memoryStorage(); // Store uploaded files in memory (RAM) instead of writing to disk
const upload = multer({ storage: memoryStorage }); // Multer instance with memory storage configuration
//========================================================================================
//REPLACED
//========================================================================================
/* // Multer middleware configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Hi:", req.body);
    if (req.body.uniName) cb(null, "../client/public/uniLogos"); // Destination folder for uploaded files
    if (req.body.dormName) cb(null, "../client/public/dormCoverPhotos");
    else cb(null, "../client/public/uploads");
  },
  // use_filename set to false, so the block of code below is not needed
  // filename: function (req, file, cb) {
  //   console.log(file); // Logging the file details
  //   cb(null, Date.now() + "_" + file.originalname); // Creating a unique filename
  // },
});
const upload = multer({ storage: storage }); // Multer instance with storage configuration */
//========================================================================================

/** Handles the request from client/src/apis/images.js to upload of an image file to the server and Cloudinary.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.body.uniName - The name of the university, if provided.
 * @param {string} req.body.dormName - The name of the dorm, if provided.
 * @param {Express.Multer.File} req.file - The uploaded image file.
 * @param {string} req.file.originalname - The original filename of the uploaded file.
 * @param {Buffer} req.file.buffer - The in-memory buffer containing the uploaded file data.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves when the image has been uploaded successfully.
 */
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    // Extract university or dorm name from the request body
    const { uniName, dormName } = req.body;
    console.log("Request Body:", req.body); // Log the request body for debugging

    // Determine the correct destination folder based on the presence of uniName or dormName
    const folder = uniName ? "uniLogos" : dormName ? "dormCoverPhotos" : null;

    if (!folder) {
      // Throw an error if neither uniName nor dormName is present in the request body
      throw new Error("Request body must contain either 'uniName' or 'dormName'");
    }

    const currentDateTime = dayjs().format("YYYY-MM-DD_HH-mm-ss"); // Generate a timestamp for unique filenames

    const originalName = req.file.originalname; // Get the original filename of the uploaded file
    const fileExtension = originalName.substring(originalName.lastIndexOf(".")); // Extract the file extension
    const fileName = `${currentDateTime}_${uniName || dormName}${fileExtension}`; // Construct the new filename
    const filePath = `../client/public/${folder}/${fileName}`; // Determine the full path to save the file

    // Write the file from memory to the correct destination with the new filename
    fs.writeFileSync(filePath, req.file.buffer);
    console.log("File Path:", filePath); // Log the file path for debugging

    // Upload the image to Cloudinary
    const result = await cloudinaryConfig.uploader.upload(filePath, {
      folder: `dormguru/${folder}`, // Cloudinary folder name
      use_filename: false, // Do not use the original filename
      unique_filename: false, // Use our custom filename handling
    });
    const imageURL = result.secure_url; // Get the secure URL of the uploaded image from Cloudinary
    console.log("Image URL:", imageURL); // Log the image URL for debugging

    // Respond with the URL of the uploaded image
    res.status(201).json({ message: "Image uploaded successfully", success: true, data: imageURL });
  } catch (err) {
    // Handle errors and respond with a 500 status code
    res.status(500).json({ message: err.message, success: false });
  }
});

export default router; // Exporting the router instance
