import express from "express";
import multer from "multer";
import cloudinaryConfig from "../config/cloudinaryConfig.js";
import authMiddleware from "../middlewares/authMiddleware.js";

// Router is an instance of the express.Router class. It is responsible for handling HTTP requests and defining routes.
const router = express.Router();

// Multer middleware configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../public"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    console.log(file); // Logging the file details
    cb(null, Date.now() + file.originalname); // Creating a unique filename
  },
});
const upload = multer({ storage: storage }); // Multer instance with storage configuration

// Route for uploading an image
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    // Uploading the image to Cloudinary
    const result = await cloudinaryConfig.uploader.upload(req.file.path, {
      folder: "dormguru", // Folder name in Cloudinary
      use_filename: true, // Use original filename
      unique_filename: false, // Do not make the filename unique
    });
    const imageURL = result.secure_url; // Get the secure URL of the uploaded image
    res.status(201).json({ message: "Image uploaded successfully", success: true, data: imageURL });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false }); // Handle errors
  }
});

export default router; // Exporting the router instance
