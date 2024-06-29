import apiRequest from "./index.js";
/** @fileoverview
 * @fileoverview Utility module for making API requests related to dorm management.
 */

/** Sends a POST request to the "/api/dorms" endpoint on the server with the provided data to create a new dorm.
 *
 * @param {Object} data - The data to be sent in the request body.
 * @return {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const AddDorm = async (data) => {
  try {
    const response = await apiRequest({
      method: "POST",
      endPoint: "/api/dorms",
      payload: data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/** Sends a GET request to the "/api/dorms" endpoint on the server to retrieve all dorms.
 *
 * @return {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request.
 *
 */
export const GetAllDorms = async () => {
  try {
    const response = await apiRequest({
      method: "GET",
      endPoint: "/api/dorms",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/** Sends a GET request to the "/api/dorms/:id" endpoint on the server to retrieve a dorm by its ID.
 * 
 * @param {string} id - The ID of the dorm to retrieve.
 * @return {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const GetDormById = async (id) => {
  try {
    const response = await apiRequest({
      method: "GET",
      endPoint: `/api/dorms/${id}`,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/** Sends a PUT request to the "/api/dorms/:id" endpoint on the server to update a dorm by its ID.
 * 
 * @param {string} id - The ID of the dorm to update.
 * @param {Object} data - The data to be sent in the request body.
 * @return {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const UpdateDorm = async (id, data) => {
  try {
    const response = await apiRequest({
      method: "PUT",
      endPoint: `/api/dorms/${id}`,
      payload: data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/** Sends a DELETE request to the "/api/dorms/:id" endpoint on the server to delete a dorm by its ID.
 * 
 * @param {string} id - The ID of the dorm to delete.
 * @return {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const DeleteDorm = async (id) => {
  try {
    const response = await apiRequest({
      method: "DELETE",
      endPoint: `/api/dorms/${id}`,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
