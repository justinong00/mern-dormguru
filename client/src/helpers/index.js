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
      message: "Bio must be at least 20 characters",
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

// Custom validation function for fromDate
export const customValidateFromDate = (dormEstablishedYear, value) => {
  const minDate = dayjs(`${dormEstablishedYear}-01-01`);

  if (!value) {
    return Promise.resolve();
  }

  if (value.isBefore(minDate)) {
    return Promise.reject(
      new Error(`From date cannot be before the dorm's established year of ${dormEstablishedYear}`)
    );
  }

  if (value.isAfter(dayjs(), "day")) {
    return Promise.reject(new Error("From date cannot be in the future"));
  }

  return Promise.resolve();
};

// Custom validation function for toDate
export const customValidateToDate = (value) => {
  const currentDate = dayjs();
  if (!value || value.isBefore(currentDate, "day") || value.isSame(currentDate, "day")) {
    return Promise.resolve();
  }
  return Promise.reject(new Error("To date cannot be in the future"));
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
  const diffInSeconds = now.diff(createdAt, 'second');

  if (diffInSeconds < 60) return 'Just now';
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

