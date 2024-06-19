import jwt from 'jsonwebtoken';

/** @fileoverviewI don
 * @fileoverview authMiddleware.js
 * 
 * - This file contains a middleware function to require authentication for a request to pass authenticated requests to protected routes
 * - The purpose of this to protect the user-specifc routes from unauthorized access
 * - Hence, only authenticated users can access the routes and can access the data in the database * 
 */

/** Middleware function to authenticate requests.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void}
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header by converting 'Bearer <token>' from string to array
    const token = req.headers.authorization.split(' ')[1];
    // Verify token with secret key from .env
    const decryptedToken = jwt.verify(token, process.env.JWT_SECRET);
    // Add user id to request
    req.user._id = decryptedToken._id;
    // pass the authenticated user to the req object to be used in other routes
    next();
  } catch (error) {
    res.status(401).json({ message: error.message, success: false });
    // next() won't be called
  }
};

export default authMiddleware;

// module.exports = (req, res, next) => {
//   try {
//     // Get token from header by converting 'Bearer <token>' from string to array
//     const token = req.headers.authorization.split(' ')[1];
//     // Verify token with secret key from .env
//     const decryptedToken = jwt.verify(token, process.env.JWT_SECRET);
//     // Add user id to request
//     req.userId = decryptedToken._id;
//     // pass the authenticated user to the req object to be used in other routes
//     next();
//   } catch (error) {
//     res.status(401).json({ message: error.message, success: false });
//     // next() won't be called
//   }
// };
