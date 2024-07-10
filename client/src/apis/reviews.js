import apiRequest from "./index.js";
/** @fileoverview
 * @fileoverview Utility module for making API requests related to reviews.
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
