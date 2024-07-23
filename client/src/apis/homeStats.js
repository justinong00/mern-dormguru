import apiRequest from "./index.js";

/** Sends a GET request to the "/api/home-stats" endpoint to retrieve the counts of reviews, universities, and dormitories from the server.
 * @returns {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const getHomeStats = async () => {
  try {
    // Send a GET request to the "/api/home-stats" endpoint to retrieve the counts of reviews, universities, and dormitories from the server.
    const response = await apiRequest({
      method: "GET",
      endPoint: "/api/home-stats",
    });

    // Return the response data from the server.
    return response;
  } catch (error) {
    // If there is an error during the process, throw the error.
    throw error;
  }
};
