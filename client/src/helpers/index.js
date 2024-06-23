import moment from "moment";
/** @fileoverview
 * @fileoverview An array of validation error objects used by Ant Design Form component.
 * This array contains a single error object with a 'message' property set to 'Required'
 * and a 'required' property set to true, which will display a 'Required' error message
 * when a required input field is left empty.
 *
 * @type {Array<Object>}
 */
export const antValidationError = [
  {
    // The error message to display when the input field is required but not filled in
    message: "Required",
    // Set this to true to make the input field required
    required: true,
  },
];

/** Returns a formatted date  string based on the provided date.
 *
 * @param {Date} date - The date to format.
 * @return {string} The formatted date string.
 */
export const getDateFormat = (date) => {
  /** Format the date using the moment.js library and the specified format string.
   * 
   * - "MMMM" represents the full month name.
   * - "Do" represents the day of the month with a leading zero if necessary.
   * - "YYYY" represents the full year.   * 
   */
  return moment(date).format("MMMM-Do-YYYY, h:mm:ss a");
};

/** Returns a formatted date and time string based on the provided date.
 *
 * @param {Date} date - The date to format.
 * @return {string} The formatted date and time string.
 */
export const getDateTimeFormat = (date) => {
  /** Format the date using the moment.js library and the specified format string.
   * 
   * - "h:mm:ss a" represents the hour, minute, second, and AM/PM indicator.   * 
   */
  return moment(date).format("MMMM-Do-YYYY, h:mm:ss a");
};
