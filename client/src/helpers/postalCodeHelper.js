import { allPostcodes, findPostcode } from "malaysia-postcodes";

/** Function to get all postcode options as an array of objects.
 * Each object contains a value and label property representing the postcode value and label respectively.
 * @returns {Array} An array of objects representing postcode options.
 */
export const getAllPostcodeOptions = () => {
  // Get all postcodes from the "malaysia-postcodes" library
  const postcodes = allPostcodes;
  // Reduce the postcodes to an array of objects representing postcode options
  const allPostcodeOptions = postcodes.reduce((acc, state) => {
    // Iterate over each state's cities
    state.city.forEach((city) => {
      // Iterate over each city's postcodes
      city.postcode.forEach((postcode) => {
        // Create an object with the postcode value and label
        const option = {
          value: postcode,
          label: `${postcode}`,
        };
        acc.push(option);
      });
    });
    return acc;
  }, []);

  // Returns the sorted allPostcodeOptions array in ascending order based on the value property
  return allPostcodeOptions.sort((a, b) => a.value - b.value);
};

/** Function to update city and state input fields based on a provided postcode.
 * @param {string} postcode - The postcode to search for in the Malaysia Postcodes data.
 * @param {Object} form - The form object from the antd Form component.
 * @returns {Promise<void>} - A promise that resolves when the city and state fields have been updated in the form.
 */
export const updateCityAndStateInputFieldsFromPostcode = (postcode, form) => {
  // Find the location associated with the postcode
  const location = findPostcode(postcode);
  // If the postcode is found in the data
  if (location.found) {
    // Update the city and state fields in the form
    form.setFieldsValue({
      city: location.city, // Update the city field with the location's city
      state: location.state, // Update the state field with the location's state
    });
  } else {
    // Display an error message and clear the city and state fields
    form.setFieldsValue({
      city: "", // Clear the city field
      state: "", // Clear the state field
    });
  }
};
