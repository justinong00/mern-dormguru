import apiRequest from "./index.js";
import axios from "axios";
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
}
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
}

export const GetCurrentUser = async () => {
  try {
    const response = await apiRequest({
      method: "GET",
      endPoint: "/api/user/current",
    });
    return response;
  } catch (error) {
    throw error;
  }
}

// Function to fetch the user's name based on the token
export const GetUserName = async (token) => {
  try {
    const response = await axios.get('api/user/name', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user name.');
  }
};