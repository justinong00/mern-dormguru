import axios from 'axios';
/**@fileoverview
 * @fileoverview Utility module for making API requests using axios.
 * This module provides a single function, `apiRequest`, which abstracts
 * the logic for making HTTP requests, allowing easy and reusable interactions
 * with backend APIs.
 */

/** Makes an API request using axios.
 * 
 * @param {Object} options - The options for the API request.
 * @param {string} options.method - The HTTP method for the request.
 * @param {string} options.endPoint - The endpoint for the request.
 * @param {Object} [options.payload] - The data to be sent in the request body (for POST, PUT requests).
 * @param {Object} [options.queryStrings] - The data to be sent as query strings (for GET requests).
 * @returns {Promise<Object>} - The data returned from the API request.
 * @throws {Error} - If there is an error during the request.
 */
const apiRequest = async ({ method, endPoint, payload, queryStrings }) => {
  try {
    const response = await axios(
      {
        method, // HTTP method for the request
        url: endPoint, // Endpoint for the request
        data: payload, // Data to be sent in the request body (for POST, PUT requests)
        params: queryStrings, // Data to be sent as query strings (for GET requests)
      },
      {
        headers: {
          // Set the Authorization header to include the sign in token
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data; // Return the data from the API request
  } catch (error) {
    throw new Error( // Throw an error with the appropriate message
      error.response?.data?.message || error.message || `Something went wrong`
    );
  }
};

export default apiRequest;
