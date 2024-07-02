import moment from "moment";

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
      min: 5,
      message: "Address must be at least 5 characters",
    },
  ],
  postalCode: [
    {
      required: true,
      message: "Required",
    },
  ],
  dormType: [
    {
      required: true,
      message: "Required",
    },
  ],
  description: [
    {
      required: true,
      message: "Required",
    },
    {
      min: 20,
      message: "Description must be at least 20 characters",
    },
  ],
  parentUniversity: [
    {
      required: true,
      message: "Required",
    },
  ],
  roomsOffered: [
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
