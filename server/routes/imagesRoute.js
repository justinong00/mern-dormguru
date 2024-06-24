import express from "express";
import multer from "multer";
import cloudinaryConfig from "../config/cloudinaryConfig.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import fs from "fs";
import dayjs from "dayjs";

// Router is an instance of the express.Router class. It is responsible for handling HTTP requests and defining routes.
const router = express.Router();
const currentDateTime = dayjs().format("YYYY-MM-DD_HH-mm-ss");

// Multer middleware configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/uniLogos"); // Destination folder for uploaded files
  },
  // use_filename set to false, so the block of code below is not needed
  // filename: function (req, file, cb) {
  //   console.log(file); // Logging the file details
  //   cb(null, Date.now() + "_" + file.originalname); // Creating a unique filename
  // },
});
const upload = multer({ storage: storage }); // Multer instance with storage configuration

// Route for uploading an image
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { uniName } = req.body; // Get university name from request body
    const originalName = req.file.originalname;
    const fileExtension = originalName.substring(originalName.lastIndexOf("."));
    const fileName = `${currentDateTime}_${uniName}${fileExtension}`; // Construct the new filename

    // Move the file to the correct destination with the new filename
    const filePath = `../client/public/uniLogos/${fileName}`;

    /** Explanation
     * 
     * fs.renameSync() is a synchronous function from the fs module in Node.js that renames a file or moves it to a new location. It takes two arguments: the current path of the file (req.file.path) and the new path where you want to move the file (filePath).
     * req.file.path is the path of the uploaded file as provided by the multer middleware. It represents the temporary location where the file is stored on the server. 
     * filePath is the destination path where you want to move the uploaded file. In this case, it is constructed based on the current date-time and the university name, and it is set to "../client/public/uniLogos/${fileName}". 
     */
    fs.renameSync(req.file.path, filePath);
    console.log(filePath)

    // Uploading the image to Cloudinary
    const result = await cloudinaryConfig.uploader.upload(filePath, {
      folder: "dormguru", // Folder name in Cloudinary
      use_filename: false, // Do not use original filename
      unique_filename: false, // Do not make the filename unique, own handling with date and uniName
    });
    const imageURL = result.secure_url; // Get the secure URL of the uploaded image
    res.status(201).json({ message: "Image uploaded successfully", success: true, data: imageURL });
    console.log(imageURL)
  } catch (err) {
    res.status(500).json({ message: err.message, success: false }); // Handle errors
  }
});

export default router; // Exporting the router instance
