import apiRequest from "./index.js";

/** @fileoverview
 * @fileoverview Utility module for making API requests related to image management.
 * 
 * This module provides a single function, `AddUniLogoPic`, which abstracts the logic for making HTTP requests to the "/api/images" endpoint.
 * These functions allow easy and reusable interactions with the backend API for uni logo image management.
 */

/** Sends a POST request to the "/api/images" endpoint with the provided data to add a new university logo image.
 *
 * @param {Object} data - The data to be sent in the request body.
 * @param {File} data.image - The image file to be uploaded.
 * @param {string} data.uniName - The name of the university the image belongs to.
 * @return {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const AddUniLogoPic = async (data) => {
  try {
    // Make a POST request to the "/api/images" endpoint with the provided data
    const response = await apiRequest({
      method: "POST",
      endPoint: "/api/images",
      payload: data,
    });
    return response;
  } catch (error) {
    // If there is an error, throw it
    throw error;
  }
}
