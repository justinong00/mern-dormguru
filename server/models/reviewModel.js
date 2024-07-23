import mongoose from 'mongoose';

// Create a new Mongoose schema
const Schema = mongoose.Schema;

// Defining the document structure (Schema)
const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    dorm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dorm',
      required: true,
    },
    roomsStayed: {
      type: [],
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likedBy: [
      {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: false,
      },
    ],
    numberOfLikes: {
      type: Number,
      required: false,
      default: 0,
    },
    isFlagged: {
      type: Boolean,
      required: false,
      default: false,
    },
    flaggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    //The timestamps option tells mongoose to assign createdAt and updatedAt fields to your schema
    timestamps: true,
  }
);

/** Create and export the database model based on the schema.
 *
 * 'Review' will be imported in other files to interact with the database collection
 * Mongoose automatically pluralizes 'Uni' to 'unis' for the collection name
 */
export default mongoose.model('Review', reviewSchema);
