import { createSlice } from '@reduxjs/toolkit';

/** Redux slice for managing loading state.
 *
 * This slice is responsible for managing the loading state of the application.
 * It contains a single loading property which is a boolean indicating whether
 * the application is currently loading or not.
 */
export const loadersSlice = createSlice({
  name: 'loaders', // The name of the slice
  initialState: {
    loading: false, // The initial loading state
  },
  reducers: {
    /** Reducer function to set the loading state.
     *
     * @param {Object} state - The current state of the slice
     * @param {Object} action - The action object containing the payload
     * @param {boolean} action.payload - The new loading state
     */
    setLoading: (state, action) => {
      state.loading = action.payload; // Set the loading state to the new value
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLoading } = loadersSlice.actions; // Export the setLoading action creator

