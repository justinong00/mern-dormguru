import apiRequest from "./index.js";
/** @fileoverview
 * @fileoverview Utility module for making API requests related to reviews.
 */

/** Sends a POST request to the "/api/reviews" endpoint to create a new review.
 *
 * @param {Object} data - The data to be sent in the request body.
 * @param {number} data.rating - The rating of the review.
 * @param {string} data.comment - The comment of the review.
 * @param {ObjectId} data.dorm - The ID of the dorm the review is for.
 * @param {Array} data.roomsStayed - The rooms stayed in the dorm.
 * @param {Date} data.fromDate - The from date of the review.
 * @param {Date} data.toDate - The to date of the review.
 * @param {ObjectId} data.createdBy - The ID of the user who created the review.
 * @return {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const AddReview = async (data) => {
  try {
    const response = await apiRequest({
      method: "POST",
      endPoint: `/api/reviews`,
      payload: data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const GetAllReviews = async () => {
  try {
    const response = await apiRequest({
      method: "GET",
      endPoint: `/api/reviews`,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/** Sends a GET request to the "/api/reviews/:id" endpoint on the server to retrieve all reviews for a specific dorm.
 *
 * @param {string} id - The ID of the dorm to retrieve reviews for.
 * @return {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const GetAllReviewsForDorm = async (id) => {
  try {
    // Send a GET request to the "/api/reviews/:id" endpoint on the server to retrieve all reviews for a specific dorm.
    const response = await apiRequest({
      method: "GET",
      endPoint: `/api/reviews/get-reviews-by-dorm/${id}`,
    });

    // Return the response data from the server.
    return response;
  } catch (error) {
    // If there is an error during the process, throw the error.
    throw error;
  }
};

/** Sends a GET request to the "/api/reviews/get-reviews-by-user/:id" endpoint on the server to retrieve all reviews for a specific user.
 *
 * @param {string} id - The ID of the user to retrieve reviews for.
 * @return {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const GetAllReviewsForUser = async (id) => {
  try {
    // Send a GET request to the "/api/reviews/get-reviews-by-user/:id" endpoint on the server to retrieve all reviews for a specific user.
    const response = await apiRequest({
      method: "GET",
      endPoint: `/api/reviews/get-reviews-by-user/${id}`,
    });

    // Return the response data from the server.
    return response;
  } catch (error) {
    // If there is an error during the process, throw the error.
    throw error;
  }
};

/** Sends a PUT request to the "/api/reviews/:id" endpoint on the server to update a review by its ID.
 *
 * @param {string} id - The ID of the review to update.
 * @param {Object} data - The data to be sent in the request body.
 * @return {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const UpdateReview = async (id, data) => {
  try {
    // Send a PUT request to the "/api/reviews/:id" endpoint on the server to update a review by its ID.
    const response = await apiRequest({
      method: "PUT",
      endPoint: `/api/reviews/${id}`,
      payload: data,
    });

    // Return the response data from the server.
    return response;
  } catch (error) {
    // If there is an error during the process, throw the error.
    throw error;
  }
};

/** Sends a DELETE request to the "/api/reviews/:id" endpoint on the server to delete a review by its ID.
 *
 * @param {string} id - The ID of the review to delete.
 * @return {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const DeleteReview = async (id, data) => {
  try {
    const response = await apiRequest({
      method: "DELETE",
      endPoint: `/api/reviews/${id}`,
      payload: data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/** Sends a PUT request to the "/api/reviews/toggle-like/:id" endpoint on the server to toggle the like status of a review by its ID.
 *
 * @param {string} id - The ID of the review to toggle the like status for.
 * @return {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const toggleLikeReview = async (id) => {
  try {
    const response = await apiRequest({
      method: "PUT",
      endPoint: `/api/reviews/toggle-like/${id}`,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/** Sends a PUT request to the "/api/reviews/toggle-flag/:id" endpoint on the server to toggle the flag status of a review by its ID.
 *
 * @param {string} id - The ID of the review to toggle the flag status for.
 * @return {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const toggleFlagReview = async (id) => {
  try {
    const response = await apiRequest({
      method: "PUT",
      endPoint: `/api/reviews/toggle-flag/${id}`,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
