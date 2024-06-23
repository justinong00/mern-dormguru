import apiRequest from "./index";
/** @fileoverview
 * @fileoverview Utility module for making API requests related to university management.
 */

/** Sends a POST request to create a new university.
 *
 * @param {Object} data - The data to be sent in the request body.
 * @return {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const AddUni = async (data) => {
  try {
    const response = await apiRequest({
      method: "POST",
      endPoint: "/api/unis",
      payload: data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/** Sends a GET request to fetch all universities.
 *
 * @return {Promise<Object>} A promise that resolves to the response data of all universities.
 * @throws {Error} If there is an error during the request.
 */
export const GetAllUnis = async () => {
  try {
    const response = await apiRequest({
      method: "GET",
      endPoint: "/api/unis",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/** Sends a GET request to fetch a university by its ID.
 *
 * @param {string} id - The ID of the university.
 * @return {Promise<Object>} A promise that resolves to the response data of the university.
 * @throws {Error} If there is an error during the request.
 */
export const GetUniById = async (id) => {
  try {
    const response = await apiRequest({
      method: "GET",
      endPoint: `/api/unis/${id}`,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/** Sends a PUT request to update a university by its ID.
 *
 * @param {string} id - The ID of the university.
 * @param {Object} data - The data to be sent in the request body.
 * @return {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const UpdateUni = async (id, data) => {
  try {
    const response = await apiRequest({
      method: "PUT",
      endPoint: `/api/unis/${id}`,
      payload: data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/** Sends a DELETE request to delete a university by its ID.
 *
 * @param {string} id - The ID of the university.
 * @return {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const DeleteUni = async (id) => {
  try {
    const response = await apiRequest({
      method: "DELETE",
      endPoint: `/api/unis/${id}`,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
