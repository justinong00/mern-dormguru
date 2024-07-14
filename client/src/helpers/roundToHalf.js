// Helper function to round to the nearest multiple of 0.5
export const roundToHalf = (num) => {
  // Extract the decimal part of the number
  const decimalPart = num - Math.floor(num);

  // Apply the custom rounding logic
  if (decimalPart < 0.3) {
    // Round down to the nearest whole number
    return Math.floor(num);
  } else if (decimalPart < 0.8) {
    // Round to the nearest 0.5
    return Math.floor(num) + 0.5;
  } else {
    // Round up to the next whole number
    return Math.ceil(num);
  }
};

// Examples of the custom rounding logic
// roundToHalf(3.1) ==》3.0 (decimalPart is 0.1, rounds down)
// roundToHalf(3.2) ==》3.0 (decimalPart is 0.2, rounds down)
// roundToHalf(3.3) ==》3.5 (decimalPart is 0.3, rounds up to nearest 0.5)
// roundToHalf(3.4) ==》3.5 (decimalPart is 0.4, rounds up to nearest 0.5)
// roundToHalf(3.6) ==》3.5 (decimalPart is 0.6, rounds down to nearest 0.5)
// roundToHalf(3.7) ==》3.5 (decimalPart is 0.7, rounds down to nearest 0.5)
// roundToHalf(3.8) ==》4.0 (decimalPart is 0.8, rounds up)
// roundToHalf(3.9) ==》4.0 (decimalPart is 0.9, rounds up)