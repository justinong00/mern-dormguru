import { createSlice } from '@reduxjs/toolkit';

/** Redux slice for managing users state.
 *
 * This slice is responsible for managing the users state of the application.
 * It contains an array of users which can be updated through the setUsers action.
 */
export const usersSlice = createSlice({
  name: 'users', // The name of the slice
  initialState: {
    user: null, // The initial users state set to null
  },
  reducers: {
    /** Reducer function to set the users state.
     *
     * @param {Object} state - The current state of the slice
     * @param {Object} action - The action object containing the payload
     * @param {Array} action.payload - The new users array
     */
    setUsers: (state, action) => {
      state.user = action.payload; // Set the users state to the new array of users
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUsers } = usersSlice.actions; // Export the setUsers action creator
