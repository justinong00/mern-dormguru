import apiRequest from "./index.js";

/** @fileoverview
 * @fileoverview Utility module for making API requests related to user management.
 * This module provides two functions, `LoginUser` and `RegisterUser`, which abstract the logic for making HTTP requests to the "/api/user/login" and "/api/user/register" endpoints, respectively.
 * These functions allow easy and reusable interactions with the backend API for user login and registration.
 */

/** Sends a POST request to the "/api/user/register" endpoint with the provided data to register a new user.
 *
 * @param {Object} data - The data to be sent in the request body.
 * @return {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const RegisterUser = async (data) => {
  try {
    const response = await apiRequest({
      method: "POST",
      endPoint: "/api/user/register",
      payload: data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
/** Sends a POST request to the "/api/user/login" endpoint with the provided data to log in a user.
 *
 * @param {Object} data - The data to be sent in the request body.
 * @return {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const LoginUser = async (data) => {
  try {
    const response = await apiRequest({
      method: "POST",
      endPoint: "/api/user/login",
      payload: data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/** Sends a GET request to fetch the current user data from the server.
 *
 * @return {Promise<Object>} A promise that resolves to the response data of the current user.
 * @throws {Error} If there is an error during the request.
 */
export const GetCurrentUser = async () => {
  try {
    const response = await apiRequest({
      method: "GET",
      endPoint: "/api/user/get-current-user",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/** Sends a PUT request to update a user by its ID.
 *
 * @param {Object} data - The data to be sent in the request body.
 *                       The data should have an _id property representing the user's ID.
 * @return {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const UpdateUser = async (data) => {
  try {
    const response = await apiRequest({
      method: "PUT",
      endPoint: `/api/user/update-user`,
      payload: data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
