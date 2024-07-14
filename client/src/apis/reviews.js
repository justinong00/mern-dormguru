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


export const GetAllReviews = async (id) => {
  try {
    const response = await apiRequest({
      method: "GET",
      endPoint: `/api/reviews/${id}`,
    });
    return response;
  } catch (error) {
    throw error;
  }
}