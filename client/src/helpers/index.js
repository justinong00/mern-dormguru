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
    message: 'Required',
    // Set this to true to make the input field required
    required: true,
  }
];
