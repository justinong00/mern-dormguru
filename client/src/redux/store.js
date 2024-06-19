import { configureStore } from '@reduxjs/toolkit';
import { loadersSlice } from './loadersSlice.js';
import { usersSlice } from './usersSlice';

/** Configure the Redux store.
 *
 * The store combines the reducers from both the loadersSlice and usersSlice.
 * Each slice manages a different part of the application's state.
 */
const store = configureStore({
  reducer: {
    loaders: loadersSlice.reducer, // Attach the loaders slice reducer
    users: usersSlice.reducer, // Attach the users slice reducer
  },
});

export default store; // Export the configured store as the default export
