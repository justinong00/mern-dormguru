import mongoose from "mongoose";

// Create a new Mongoose schema
const Schema = mongoose.Schema;

// Defining the document structure (Schema)
const dormSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    roomsOffered: {
      type: [],
      required: true,
    },
    parentUniversity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Uni", // Referencing the 'Uni' model
      required: true,
    },
    dormType: {
      type: String,
      required: true,
    },
    establishedYear: {
      type: Number,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    coverPhotos: {
      type: String,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referencing the 'User' model
      required: true,
    },
    numberOfReviews: {
      type: Number,
      required: false,
      default: 0,
    },
    averageRating: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    //The timestamps option tells mongoose to assign createdAt and updatedAt fields to your schema
    timestamps: true,
  }
);

/** Create and export the database model based on the schema.
 *
 * 'Dorm' will be imported in other files to interact with the database collection
 * Mongoose automatically pluralizes 'Dorm' to 'dorms' for the collection name
 */
export default mongoose.model("Dorm", dormSchema);
