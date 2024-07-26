import mongoose from 'mongoose';

// Create a new Mongoose schema
const Schema = mongoose.Schema;

// Defining the document structure (Schema)
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { 
    //The timestamps option tells mongoose to assign createdAt and updatedAt fields to your schema
    timestamps: true,
  }
);

/** Create and export the database model based on the schema.
 * 
 * 'User' will be imported in other files to interact with the database collection
 * Mongoose automatically pluralizes 'User' to 'users' for the collection name
 */
export default mongoose.model('User', userSchema);