import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

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
  email: [
    {
      required: true,
      message: "Required",
    },
    {
      type: "email",
      message: "Please enter a valid email",
    },
  ],
  password: [
    {
      required: true,
      message: "Required",
    },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/,
      message:
        "Password must be between 8-15 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character(@.#$!%*?&^)",
    },
  ],
  country: [
    {
      required: true,
      message: "Required",
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
  roomsStayed: [
    {
      required: true,
      message: "Required",
    },
  ],
  rating: [
    {
      required: true,
      message: "Required",
    },
  ],
  title: [
    {
      required: true,
      message: "Required",
    },
    {
      min: 20,
      message: "Title must be at least 20 characters",
    },
  ],
  comment: [
    {
      required: true,
      message: "Required",
    },
    {
      min: 20,
      message: "Comment must be at least 20 characters",
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

// Custom validation function for To Date and From Date in ReviewForm.jsx
export const validateDates = (fieldName, value, form, dorm) => {
  const dormEstablishedYear = dorm.establishedYear;
  // Minimum date is the dorm's established year
  const minDate = dayjs(`${dormEstablishedYear}-01-01`);
  // Maximum date is current date
  const currentDate = dayjs();
  // Get the values of fromDate and toDate from the form
  const fromDate = form.getFieldValue("fromDate");
  const toDate = form.getFieldValue("toDate");

  if (!value) {
    return Promise.resolve();
  }

  if (value.isBefore(minDate)) {
    return Promise.reject(
      new Error(`Date cannot be before the dorm's established year of ${dormEstablishedYear}`),
    );
  }

  if (value.isAfter(currentDate, "day")) {
    return Promise.reject(new Error("Date cannot be in the future"));
  }

  //  If the field is fromDate, check if it is after toDate
  if (fieldName === "fromDate" && toDate && value.isAfter(toDate)) {
    return Promise.reject(new Error("From date cannot be after To date"));
  }

  // If the field is toDate, check if it is before fromDate
  if (fieldName === "toDate" && fromDate && value.isBefore(fromDate)) {
    return Promise.reject(new Error("To date cannot be before From date"));
  }

  return Promise.resolve();
};

// Function to format date to YYYY-MM-DD
export const formatDateToYYYY_MM_DD = (date) => {
  return dayjs(date).format("YYYY-MM-DD");
};

// Function to format date to MMM Do, YYYY
export const formatDateToMonthDayYear = (date) => {
  return dayjs(date).format("MMM Do, YYYY");
};

dayjs.extend(relativeTime);

// Function to get relative time
export const getRelativeTime = (date) => {
  const now = dayjs();
  const createdAt = dayjs(date);
  const diffInSeconds = now.diff(createdAt, "second");

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return createdAt.fromNow(); // This will show "X minutes ago"
  if (diffInSeconds < 86400) return createdAt.fromNow(); // This will show "X hours ago"
  if (diffInSeconds < 604800) return createdAt.fromNow(); // This will show "X days ago"
  if (diffInSeconds < 2592000) return createdAt.fromNow(); // This will show "X weeks ago"
  if (diffInSeconds < 31536000) return createdAt.fromNow(); // This will show "X months ago"
  return createdAt.fromNow(); // This will show "X years ago"
};

// Custom validation function for

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
