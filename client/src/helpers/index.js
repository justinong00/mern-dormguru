import moment from "moment";
import dayjs from "dayjs";

// Required field validation rule
export const antValidationError = [
  {
    message: "Required",
    required: true,
  },
];

// Validation rules
export const validationRules = {
  name: [
    {
      required: true,
      message: "Required",
    },
    {
      min: 3,
      message: "Name must be at least 3 characters",
    },
  ],
  bio: [
    {
      required: true,
      message: "Required",
    },
    {
      min: 20,
      message: "Bio must be at least 20 characters",
    },
  ],
  websiteURL: [
    {
      required: true,
      message: "Required",
    },
    {
      type: "url",
      message: "Please enter a valid URL",
    },
  ],
  address: [
    {
      required: true,
      message: "Required",
    },
    {
      min: 10,
      message: "Address must be at least 10 characters",
    },
  ],
  postalCode: [
    {
      required: true,
      message: "Required",
    },
  ],
};

// Custom validation function for established year
export const customValidateEstablishedYear = (_, minYear, maxYear, value) => {
  if (!value) {
    return Promise.resolve();
  }

  const isValid = value >= minYear && value <= maxYear;

  if (isValid) {
    return Promise.resolve();
  }

  return Promise.reject(new Error(`Valid only between ${minYear} and ${maxYear}`));
};

// Custom validation function for file list
export const customValidateFileList = (fileList, selectedUni) => {
  if (selectedUni?.logoPic) {
    return Promise.resolve();
  }
  if (fileList.length === 0) {
    return Promise.reject("Required");
  }
  return Promise.resolve();
};

// Function to allow only number inputs
export const allowNumbersOnly = (e) => {
  var code = e.which ? e.which : e.keyCode;
  if (code > 31 && (code < 48 || code > 57)) {
    e.preventDefault();
  }
};

// Function to limit input length
export const limitInputLengthTo = (maxLength, e) => {
  const value = e.target.value;
  if (value.length > maxLength) {
    e.target.value = value.slice(0, maxLength);
  }
};

/** Returns a formatted date string based on the provided date.
 *
 * @param {Date} date - The date to format.
 * @return {string} The formatted date string.
 */
export const getDateFormat = (date) => {
  return moment(date).format("MMMM-Do-YYYY, h:mm:ss a");
};

/** Returns a formatted date and time string based on the provided date.
 *
 * @param {Date} date - The date to format.
 * @return {string} The formatted date and time string.
 */
export const getDateTimeFormat = (date) => {
  return moment(date).format("MMMM-Do-YYYY, h:mm:ss a");
};
