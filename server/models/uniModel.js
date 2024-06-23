import mongoose from 'mongoose';

// Create a new Mongoose schema
const Schema = mongoose.Schema;

// Defining the document structure (Schema)
const uniSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    websiteURL: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    logoPic: {
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
    // relatedDorms: {
    //   type: mongoose.Schema.Types.Array,
    //   type: [String],
    //   required: true,
    // },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    //The timestamps option tells mongoose to assign createdAt and updatedAt fields to your schema
    timestamps: true,
  }
);

/** Create and export the database model based on the schema.
 *
 * 'Uni' will be imported in other files to interact with the database collection
 * Mongoose automatically pluralizes 'Uni' to 'unis' for the collection name
 */
export default mongoose.model('Uni', uniSchema);
