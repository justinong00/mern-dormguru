import apiRequest from "./index.js";

/** @fileoverview 
 * @fileoverview
 * Utility module for making API requests related to image management.
 * 
 * This module provides a function to handle the image upload requests to the server.
 */

/**
 * Sends a POST request to the "/api/images" endpoint with the provided data to upload an image.
 *
 * @param {Object} data - The data to be sent in the request body. It should include the image file and dorm name.
 * @param {File} data.image - The image file to be uploaded.
 * @param {string} data.dormName - The name of the dorm the image belongs to if image is for a dorm
 * @param {string} data.uniName - The name of the university the image belongs if image is for a university
 * @return {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const AddImage = async (data) => {
  try {
    // Make a POST request to the "/api/images" endpoint with the provided data
    const response = await apiRequest({
      method: "POST",
      endPoint: "/api/images",
      payload: data,
    });
    return response; // Return the response data
  } catch (error) {
    // If there is an error, throw it to be handled by the caller
    throw error;
  }
}
