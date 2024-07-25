import { roomOptions } from "./roomOptions.js";
import { dormTypeOptions } from "./dormTypeOptions";

// Generate filter options for rooms
export const roomFilters = roomOptions.map((room) => ({
  text: room.label,
  value: room.value,
}));

// Generate filter options for dorm type
export const dormTypeFilters = dormTypeOptions.map((dormType) => ({
  text: dormType.label,
  value: dormType.value,
}));

// Function to filter the stay duration by date range
export const filterByStayDuration = (record, fromDate, toDate) => {
  if (!fromDate || !toDate) return true; // No filter applied
  const filterFromDate = new Date(fromDate);
  const filterToDate = new Date(toDate);

  const reviewFromDate = new Date(record.fromDate);
  const reviewToDate = new Date(record.toDate);

  return reviewFromDate >= filterFromDate && reviewToDate <= filterToDate;
};

// Function to filter the posted date by date range
export const filterByDateRange = (record, startDate, endDate) => {
  // Normalize the record's date to midnight to ensure accurate date range comparison because we don't want to include the time in the comparison
  const recordDate = new Date(new Date(record.createdAt).setHours(0, 0, 0, 0));
  const filterStartDate = new Date(startDate);
  const filterEndDate = new Date(endDate);
  return recordDate >= filterStartDate && recordDate <= filterEndDate;
};

// Function to filter the established year by year range
export const filterByYearRange = (record, start, end) => {
  const recordYear = record.establishedYear;
  const filterMinYear = start.year();
  const filterMaxYear = end.year();
  return recordYear >= filterMinYear && recordYear <= filterMaxYear;
};
