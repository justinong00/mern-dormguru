import dayjs from "dayjs";

// Function to get last month average rating
export const getLastMonthAverageRating = (reviews) => {
  const now = dayjs();
  const lastMonthStart = now.subtract(1, 'month').startOf('month');
  const lastMonthEnd = now.subtract(1, 'month').endOf('month');

  const lastMonthReviews = reviews.filter(review => {
    const reviewDate = dayjs(review.createdAt);
    return reviewDate.isAfter(lastMonthStart) && reviewDate.isBefore(lastMonthEnd);
  });

  if (lastMonthReviews.length === 0) return 0;

  const totalRating = lastMonthReviews.reduce((sum, review) => sum + review.rating, 0);
  return (totalRating / lastMonthReviews.length).toFixed(1);
}

/** Counts the number of reviews for each rating.
 * 
 * @param {Array} reviews - Array of review objects.
 * @returns {Object} - Object with ratings as keys and their counts as values.
 */
export const countNumberOfReviewsForEachRating = (reviews) => {
  return reviews.reduce((acc, review) => {
    const rating = Math.floor(review.rating);
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {});
};

/** Renders a rating bar.
 * 
 * @param {number} rating - The rating value.
 * @param {number} count - The count of reviews with the given rating.
 * @param {number} totalReviews - The total number of reviews.
 * @returns {JSX.Element} - JSX element representing the rating bar.
 */
export const renderRatingBar = (rating, count, totalReviews) => {
  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

  return (
    <div className="flex w-full items-center" key={rating}>
      <p className="mr-[2px] py-[1px] text-lg font-medium text-black">{rating}</p>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_12042_8589)">
          <path
            d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
            fill="#FBBF24"
          />
        </g>
        <defs>
          <clipPath id="clip0_12042_8589">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <p className="ml-5 mr-3 h-2 w-full rounded-[30px] bg-gray-200 xl:min-w-[278px]">
        <span
          className="flex h-full rounded-[30px] bg-[#101820]"
          style={{ width: `${percentage}%` }}
        ></span>
      </p>
      <p className="mr-[2px] py-[1px] text-lg font-medium text-black">{count}</p>
    </div>
  );
};