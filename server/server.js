import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConfig from './config/dbConfig.js';
// Import routes
import usersRoute from './routes/usersRoute.js';
import unisRoute from './routes/unisRoute.js';
import imagesRoute from './routes/imagesRoute.js';
import dormRoute from './routes/dormRoute.js';


// Load environment variables from the .env file into process.env
dotenv.config();

// Create an instance of an Express application
const app = express();

// ========================================================================
// MIDDLEWARE
// ========================================================================
/** Enable Cross-Origin Resource Sharing (CORS)
 * 
 * CORS allows the frontend (running on localhost:3000) to communicate with the backend API (running on localhost:4000. This middleware enables fetching resources from different origins, which is essential for frontend-backend interaction in development environments 
 * */
app.use(cors());

/** Middleware to parse incoming JSON requests. 
 * 
 * For any incoming request, looks if there is data in the body that is sending to the server. If it does, then it will attach to the 'req' handler 
 */
app.use(express.json());

/** Global middleware that runs for every incoming request. 
 * 
 * It is the first code that runs between sending a request and receiving a response before other middleware code runs. You must state next() at the end to pass control to the next middleware or route handler or else other middleware code cannot run 
 */
app.use((req, res, next) => {
  console.log('=======================')
  console.log('Path:', req.path); // logs the request path
  console.log('Method:', req.method); // logs the request method
  console.log('Params:', req.params); // logs the request parameters
  console.log('Body:', req.body); // logs the request body
  next();
});

app.use('/api/user', usersRoute); // Mount the user routes at the '/api/user' path
app.use('/api/unis', unisRoute) // Mount the uni routes at the '/api/unis' path
app.use('/api/images', imagesRoute) // Mount the image routes at the '/api/images' path
app.use('/api/dorms', dormRoute) // Mount the dorm routes at the '/api/dorms' path

// Call the dbConfig function to connect to MongoDB
dbConfig();

const port = process.env.PORT || 5000;
app.listen(port, () => {
   console.log('=======================')
  console.log(`Node JS Server started on port ${port}`);
});