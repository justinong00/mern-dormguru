import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConfig from './config/dbConfig.js';
// Import routes
import usersRoute from './routes/usersRoute.js';
import unisRoute from './routes/unisRoute.js';

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

app.use('/api/user', usersRoute); // Mount the user routes at the '/api/user' path
app.use('/api/unis', unisRoute) // Mount the uni routes at the '/api/unis' path

// Call the dbConfig function to connect to MongoDB
dbConfig();

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Node JS Server started on port ${port}`);
});