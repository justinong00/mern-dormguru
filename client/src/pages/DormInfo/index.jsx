import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button, message, Rate, Select, Tooltip } from "antd";
import { setLoading } from "../../redux/loadersSlice.js";
import { GetDormById } from "../../apis/dorms.js";
import ReviewForm from "./ReviewForm.jsx";
import { GetAllReviewsForDorm, toggleFlagReview, toggleLikeReview } from "../../apis/reviews.js";
import { roundToHalf } from "./../../helpers/roundToHalf";
import {
  getLastMonthAverageRating,
  countNumberOfReviewsForEachRating,
  renderRatingBar,
} from "../../helpers/ratingHelpers.jsx";
import { formatDateToMonthDayYear } from "../../helpers/index.js";
import {
  LikeOutlined,
  LikeFilled,
  FlagOutlined,
  FlagFilled,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { roomOptions } from "../../helpers/roomOptions.js";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import "/node_modules/malaysia-state-flag-icon-css/css/flag-icon.min.css";
import { getStateCode } from "../../helpers/stateCodesHelper.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faFaceFrown, faSchoolFlag } from "@fortawesome/free-solid-svg-icons";
import countryList from "react-select-country-list";
import VerifiedStudentBadge from "./../../components/VerifiedStudentBadge";

function DormInfo() {
  const [dorm, setDorm] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [visibleReviews, setVisibleReviews] = useState([]);
  const [allReviewsShown, setAllReviewsShown] = useState(false);
  // Add state for sorting criteria
  const [sortCriteria, setSortCriteria] = useState("mostRecent");
  // Add state for checking if there are no reviews
  const [noReviews, setNoReviews] = useState(true);
  // Initialize ratingCounts state with a default value of {5: 0, 4: 0, 3: 0, 2: 0, 1: 0} to store the number of reviews for each rating when calling countNumberOfReviewsForEachRating() during fetch
  const [ratingCounts, setRatingCounts] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users); // Get the users state from the Redux store
  const { id } = useParams();
  const { Option } = Select;

  // Define edit and delete handlers
  const editReview = (reviewId) => {
    // Handle review edit action
  };

  const deleteReview = (reviewId) => {
    // Handle review delete action
  };

  /** Fetches a specific dorm and its reviews from the server. Updates the state with the fetched data.
   *
   * @return {Promise<void>} - A Promise that resolves when the fetch is complete.
   */
  const fetchSpecificDorm = async () => {
    try {
      dispatch(setLoading(true));
      // Use Promise.all to execute multiple async operations concurrently,
      // reducing overall waiting time and improving performance
      const [dormResponse, reviewsResponse] = await Promise.all([
        GetDormById(id),
        GetAllReviewsForDorm(id),
      ]);
      setDorm(dormResponse.data);
      /* 
      // Sort reviews to put user's review first
      const userFirstReviews = reviewsResponse.data.sort((a, b) => {
        if (a.createdBy._id === user._id) return -1;
        if (b.createdBy._id === user._id) return 1;
        return 0;
      }); */

      setReviews(reviewsResponse.data.filter((review) => review.createdBy._id !== user._id)); // Get all reviews except the user's review
      setUserReview(reviewsResponse.data.find((review) => review.createdBy._id === user._id)); // Get the user's review
      setVisibleReviews(
        reviewsResponse.data.filter((review) => review.createdBy._id !== user._id).slice(0, 2),
      ); // Get the first 2 reviews
      setRatingCounts(countNumberOfReviewsForEachRating(reviewsResponse.data)); // Update the number of reviews for each rating
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  // Fetch dorm data on component mount
  useEffect(() => {
    fetchSpecificDorm();
  }, []);

  /** Toggles the like status of a review.
   *
   * @param {string} reviewId - The ID of the review to toggle the like status for.
   * @return {Promise<void>} - A Promise that resolves when the like status is toggled.
   */
  const toggleLike = async (reviewId) => {
    try {
      const response = await toggleLikeReview(reviewId);
      // Reload the page to update the like count
      fetchSpecificDorm();
      message.success(response.message);
    } catch (error) {
      message.error(error.message);
    }
  };

  /** Toggles the flag status of a review.
   *
   * @param {string} reviewId - The ID of the review to toggle the flag status for.
   * @return {Promise<void>} A Promise that resolves when the flag status is toggled.
   */
  const toggleFlag = async (reviewId) => {
    try {
      const response = await toggleFlagReview(reviewId);
      // Reload the page to update the flag count
      fetchSpecificDorm();
      message.success(response.message);
    } catch (error) {
      message.error(error.message);
    }
  };

  /** Filters and sorts the reviews based on the current sort criteria, and updates the visible reviews accordingly.
   *
   * This effect is triggered whenever the `reviews`, `sortCriteria`, or `allReviewsShown` state changes.
   *
   * If `allReviewsShown` is true, all the filtered and sorted reviews will be displayed. Otherwise, only the first 2 reviews will be shown.
   *
   * @param {Array<Review>} reviews - The array of reviews to be filtered and sorted.
   * @param {string} sortCriteria - The current sort criteria, which can be "mostHelpful", "mostRecent", or a rating-based criteria like "stars5".
   * @param {boolean} allReviewsShown - Indicates whether all the filtered and sorted reviews should be displayed.
   */
  useEffect(() => {
    console.log(reviews);
    console.log(visibleReviews);
    const sortedAndFilteredReviews = reviews
      .filter((review) => {
        if (sortCriteria.startsWith("stars")) {
          const rating = parseInt(sortCriteria.split("stars")[1], 10);
          return review.rating === rating;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortCriteria === "mostHelpful") {
          return b.numberOfLikes - a.numberOfLikes;
        } else if (sortCriteria === "mostRecent") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
      });

    if (sortedAndFilteredReviews.length === 0) {
      setNoReviews(true);
    } else {
      setNoReviews(false);
    }

    if (allReviewsShown) {
      setVisibleReviews(sortedAndFilteredReviews);
    } else {
      setVisibleReviews(sortedAndFilteredReviews.slice(0, 2));
    }
  }, [reviews, sortCriteria, allReviewsShown]);

  /** Toggles the visibility of all reviews based on the current sort criteria and the `allReviewsShown` state.
   *
   * If `allReviewsShown` is true, the first 2 sorted and filtered reviews will be displayed. Otherwise, all the sorted and filtered reviews will be shown.
   *
   * This function is responsible for updating the `visibleReviews` state based on the current sort criteria and the `allReviewsShown` flag.
   */
  const toggleReviews = () => {
    const sortedAndFilteredReviews = reviews
      .filter((review) => {
        if (sortCriteria.startsWith("stars")) {
          const rating = parseInt(sortCriteria.split("stars")[1], 10);
          return review.rating === rating;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortCriteria === "mostHelpful") {
          return b.numberOfLikes - a.numberOfLikes;
        } else if (sortCriteria === "mostRecent") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
      });

    if (sortedAndFilteredReviews.length === 0) {
      setNoReviews(true);
    } else {
      setNoReviews(false);
    }

    if (allReviewsShown) {
      setVisibleReviews(sortedAndFilteredReviews.slice(0, 2));
    } else {
      setVisibleReviews(sortedAndFilteredReviews);
    }
    setAllReviewsShown(!allReviewsShown);
  };

  // Scroll to the specific review when there is a hash in the URL (for when user clicks on a review in Profile)
  useEffect(() => {
    const hash = window.location.hash; // Gets the hash from the URL
    if (hash) {
      const reviewId = hash.replace("#", ""); // Extracts the review ID from the hash
      const reviewElement = document.getElementById(reviewId); // Finds the review element in the DOM
      if (reviewElement) {
        reviewElement.scrollIntoView({ behavior: "smooth" }); // Scrolls to the review element if found
      }
    }
  }, [visibleReviews]); // When the component first mounts, visibleReviews might be empty or not fully populated yet. By including visibleReviews in the dependency array, you ensure that the effect runs after the reviews have been fetched and rendered. Without visibleReviews as a dependency, the useEffect might run before the review elements are present in the DOM. This would result in document.getElementById(reviewId) returning null because the elements are not yet created.

  return (
    dorm &&
    reviews && (
      <div className="mx-auto w-full max-w-7xl px-4 md:px-5 lg:px-6">
        {/* Title Section */}
        <div className="bg-primary rounded-xl p-4">
          <h1 className="text-center text-4xl font-extrabold leading-10 text-white lg:text-5xl">
            {dorm?.name}
          </h1>
        </div>

        {/* Dorm Basic Info Section */}
        <div className="my-10 grid grid-cols-8 justify-center gap-10">
          {/* Dorm Basic Info Image */}
          <div className="col-span-8 flex h-full flex-col justify-between gap-y-4 transition hover:scale-105 lg:col-span-4">
            {/* Aspect ratio container using padding-bottom method */}
            <div className="pb-2/4 sm:pb-2/5 relative h-0 w-full overflow-hidden lg:flex-1 lg:pb-0">
              {/** Explanation:
               *
               * pb-2/4 and sm:pb-2/5: These set the padding-bottom to a fraction of the width.
               * For example, pb-2/4 means the padding-bottom is 50% of the width, creating a 2:1 aspect ratio.
               * relative: This sets the position of the container as relative, allowing the img to be positioned absolutely within it.
               * h-0: This sets the initial height to 0. The actual height is controlled by the padding-bottom.
               * w-full: This sets the width to 100% of the parent container.
               * overflow-hidden: This hides any overflow content, ensuring the image doesn't exceed the container.
               * lg:flex-1: On large screens and above, this makes the container flexible, allowing it to grow and fill available space.
               * lg:pb-0: On large screens and above, this removes the padding-bottom, allowing the container height to be controlled by flexbox.
               */}
              <img
                src={dorm.coverPhotos}
                alt="Dorm Image"
                className="absolute inset-0 h-full w-full rounded-lg object-contain lg:object-cover"
              />
              {/** Explanation:
               *
               * absolute: This positions the image absolutely within its container.
               * inset-0: This ensures the image is positioned at the top-left corner of the container.
               * h-full and w-full: These make the image fill the height and width of the container.
               * rounded-lg: This applies a large border-radius to the image, making it rounded.
               * object-contain: This ensures the image maintains its aspect ratio and is contained within the container.
               * lg:object-cover: On large screens and above, this ensures the image covers the entire container.
               */}
            </div>
          </div>

          {/* Dorm Basic Info Details */}
          <div className="col-span-8 flex flex-col gap-5 lg:col-span-4 lg:text-left">
            {/* Flex container for vertical layout */}
            <div className="flex h-full flex-col justify-between">
              {/* Section title */}
              <p className="mb-10 text-center text-3xl font-bold leading-10 sm:text-4xl lg:text-left">
                Basic Info
              </p>

              {/* Grid container for info items */}
              {/* Responsive grid: 1 column on extra small screens, 2 on small, 3 on medium, back to 1 on large and wider */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 lg:gap-8">
                {/* Address */}
                <div className="flex flex-col items-center gap-y-4 transition hover:scale-105 sm:items-center sm:justify-between lg:flex-row">
                  {/* Label container */}
                  {/* flex-1 and h-full to ensure the label takes up the entire space within its container */}
                  <div className="flex h-full flex-1">
                    <span className="text-2xl font-semibold">Address</span>
                  </div>
                  {/* Value container */}
                  {/* flex-1 and h-full to ensure the value takes up the entire space within its container */}
                  <div className="flex h-full flex-col items-center justify-center lg:flex-1 lg:items-start">
                    <span className="text-center text-lg lg:text-start">{dorm?.address}</span>
                  </div>
                </div>

                {/* Similar structure repeated for Postal Code, City, State, Established Year, and Rooms Offered */}
                {/* ... */}

                {/* Postal Code */}
                <div className="flex flex-col items-center gap-y-4 transition hover:scale-105 sm:items-center sm:justify-between sm:border-y-0 sm:border-l-2 sm:border-r-0 sm:border-solid sm:border-gray-200 sm:px-2 md:border-x-2 lg:flex-1 lg:flex-row lg:items-start lg:border-none lg:px-0">
                  <div className="flex h-full flex-1">
                    <span className="text-2xl font-semibold">Postal Code</span>
                  </div>
                  <div className="flex h-full flex-col items-center justify-center lg:flex-1 lg:items-start">
                    <span className="text-center text-lg lg:text-start">{dorm?.postalCode}</span>
                  </div>
                </div>

                {/* City */}
                <div className="flex flex-col items-center gap-y-4 transition hover:scale-105 sm:items-center sm:justify-between lg:flex-row">
                  <div className="flex h-full flex-1">
                    <span className="text-2xl font-semibold">City</span>
                  </div>
                  <div className="flex h-full flex-col items-center justify-center lg:flex-1 lg:items-start">
                    <span className="text-center text-lg lg:text-start">{dorm?.city}</span>
                  </div>
                </div>

                {/* State */}
                <div className="flex flex-col items-center gap-y-4 transition hover:scale-105 sm:items-center sm:justify-between sm:border-y-0 sm:border-l-2 sm:border-r-0 sm:border-solid sm:border-gray-200 sm:px-2 md:border-none md:px-0 lg:flex-row">
                  <div className="flex h-full flex-1">
                    <span className="text-2xl font-semibold">State</span>
                  </div>
                  <div className="flex h-full flex-col items-center justify-center lg:flex-1 lg:items-start">
                    <div className="flex w-full flex-col items-center gap-4 lg:flex-row">
                      <span
                        className={`malaysia-state-flag-icon h-10 w-20 shadow-md transition-shadow duration-300 hover:shadow-lg malaysia-state-flag-icon-${getStateCode(dorm?.state)}`}
                      ></span>
                      <span className="text-center text-lg lg:text-start">{dorm?.state}</span>
                    </div>
                  </div>
                </div>

                {/* Established Year */}
                <div className="flex flex-col items-center gap-y-4 transition hover:scale-105 sm:items-center sm:justify-between md:border-x-2 md:border-y-0 md:border-solid md:border-gray-200 md:px-2 lg:flex-1 lg:flex-row lg:items-start lg:border-none lg:px-0">
                  <div className="flex h-full flex-1">
                    <span className="text-2xl font-semibold">Established Year</span>
                  </div>
                  <div className="flex h-full flex-col items-center justify-center lg:flex-1 lg:items-start">
                    <span className="text-center text-lg lg:text-start">
                      {dorm?.establishedYear}
                    </span>
                  </div>
                </div>

                {/* Rooms Offered */}
                <div className="flex flex-col items-center gap-y-4 transition hover:scale-105 sm:items-center sm:justify-between sm:border-y-0 sm:border-l-2 sm:border-r-0 sm:border-solid sm:border-gray-200 sm:px-2 md:border-none md:px-0 lg:flex-row">
                  <div className="flex h-full flex-1">
                    <span className="text-2xl font-semibold">Rooms Offered</span>
                  </div>
                  <div className="flex h-full flex-col items-center justify-center lg:flex-1 lg:items-start">
                    {dorm?.roomsOffered?.map((room, index) => (
                      <span key={index} className="text-center text-lg lg:text-start">
                        {roomOptions.find((option) => option.value === room)?.label}
                        {index < dorm.roomsOffered.length - 1 && ", "}
                      </span>
                    ))}
                  </div>
                  {/* {review?.roomsStayed?.map((room, index) => (
                    <span key={index}>
                      {roomOptions.find((option) => option.value === room)?.label}
                      {index < review.roomsStayed.length - 1 && ", "}
                    </span>
                  ))} */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />

        <div className="my-10 grid grid-cols-12 gap-x-4 gap-y-10">
          {/* Description Section */}
          <div className="col-span-12 flex flex-col items-center gap-y-10 transition hover:scale-105 md:col-span-6 md:px-2">
            <p className="text-3xl font-bold leading-10 sm:text-4xl">Description</p>
            <div className="md:px-15 flex flex-1 flex-col items-center justify-center sm:px-10 lg:px-20">
              <p className="text-center text-lg">{dorm?.description}</p>
            </div>
          </div>
          {/* Dorm Type Section */}
          <div className="col-span-12 flex flex-col items-center gap-y-10 transition hover:scale-105 md:col-span-6 md:border-x-2 md:border-y-0 md:border-r-0 md:border-solid md:border-gray-200 md:px-2">
            <p className="text-3xl font-bold leading-10 sm:text-4xl">Dorm Type</p>
            <div className="flex flex-1 flex-col items-center justify-center gap-y-2">
              {dorm?.dormType === "On-Campus Accommodation" && (
                <FontAwesomeIcon icon={faSchoolFlag} style={{ fontSize: "2rem" }} />
              )}
              {dorm?.dormType === "Off-Campus Accommodation" && (
                <FontAwesomeIcon icon={faBuilding} style={{ fontSize: "2rem" }} />
              )}
              {dorm?.dormType && <p className="text-center text-lg">{dorm.dormType}</p>}
            </div>
          </div>
        </div>
        <hr />

        {/* Parent University */}
        <h2 className="my-10 text-center text-3xl font-bold leading-10 sm:text-4xl">
          Parent University
        </h2>

        {/* Parent University Content */}
        <div
          className="mb-10 grid grid-cols-12 gap-4 transition hover:scale-105 hover:cursor-pointer hover:shadow-lg"
          onClick={() => navigate(`/uni/${dorm?.parentUniversity?._id}`)}
        >
          {/* University Logo */}
          <div className="col-span-12 flex flex-col items-center gap-y-4 lg:col-span-4 lg:px-2">
            <p className="text-2xl font-semibold">Logo</p>
            <div className="flex flex-1 flex-col items-center justify-center">
              <img
                src={dorm?.parentUniversity?.logoPic}
                alt="University Logo"
                className="max-h-28 rounded-sm object-cover"
              />
            </div>
          </div>

          {/* University Name */}
          <div className="col-span-12 flex flex-col items-center gap-y-4 lg:col-span-4 lg:border-x-2 lg:border-y-0 lg:border-solid lg:border-gray-200 lg:px-2">
            <p className="text-2xl font-semibold">Name</p>
            <div className="flex flex-1 flex-col items-center justify-center">
              <p className="text-center text-lg">{dorm?.parentUniversity?.name}</p>
            </div>
          </div>

          {/* University Bio */}
          <div className="col-span-12 flex flex-col items-center gap-y-4 lg:col-span-4 lg:px-2">
            <p className="text-2xl font-semibold">Bio</p>
            <div className="flex flex-1 flex-col items-center justify-center">
              <p className="text-center text-lg">{dorm?.parentUniversity?.bio}</p>
            </div>
          </div>
        </div>
        <hr />

        {/* Rating & Reviews */}
        <h2 className="my-10 text-center text-3xl font-bold leading-10 sm:text-4xl">
          Rating & Reviews
        </h2>
        <div className="mb-10 grid grid-cols-12">
          {/* Rating Bar */}
          <div className="col-span-12 flex items-center xl:col-span-4">
            <div className="box mx-auto flex w-full flex-col gap-y-4 max-xl:max-w-3xl">
              <div>
                {[5, 4, 3, 2, 1].map((rating) =>
                  renderRatingBar(rating, ratingCounts[rating], reviews.length),
                )}
              </div>
            </div>
          </div>

          {/* Average Rating, Last Month's Rating and Buttons */}
          <div className="col-span-12 min-h-[230px] w-full max-xl:mt-8 xl:col-span-8 xl:pl-8">
            <div className="grid h-full w-full grid-cols-12 rounded-3xl bg-gray-100 px-8 max-xl:mx-auto max-xl:max-w-3xl max-lg:py-8">
              <div className="col-span-12 flex items-center md:col-span-8">
                <div className="flex h-full w-full flex-col items-center justify-evenly max-sm:gap-4 sm:flex-row">
                  {/* Average Rating */}
                  <div className="flex flex-col items-center justify-center border-gray-200 sm:border-r sm:pr-3">
                    <h2 className="mb-4 text-center text-5xl font-bold">
                      {dorm.averageRating === 0 ? "0" : dorm.averageRating?.toFixed(1)}
                    </h2>
                    <div className="mb-4 flex items-center gap-3">
                      <Rate
                        disabled
                        value={roundToHalf(dorm.averageRating)}
                        allowHalf
                        style={{ fontSize: 25 }}
                      />
                    </div>

                    {/* Number of Reviews */}
                    <p className="text-lg font-normal leading-8 text-gray-400">
                      {dorm.numberOfReviews} Reviews
                    </p>
                  </div>

                  {/* Last Month's Rating */}
                  <div className="flex flex-col items-center justify-center border-gray-200 sm:border-r sm:pr-3">
                    <h2 className="mb-4 text-center text-5xl font-bold">
                      {getLastMonthAverageRating(reviews)}
                    </h2>

                    <div className="mb-4 flex items-center gap-3">
                      <Rate
                        disabled
                        value={roundToHalf(getLastMonthAverageRating(reviews))}
                        allowHalf
                        style={{ fontSize: 25 }}
                      />
                    </div>

                    <p className="text-lg font-normal leading-8 text-gray-400">Last Month</p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="col-span-12 max-lg:mt-8 md:col-span-4 md:pl-8">
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <Tooltip
                    title={
                      !user.isVerifiedStudent && !user.isAdmin
                        ? "Sign up with school email to submit a review"
                        : !user.isAdmin && userReview
                          ? "You have already submitted a review for this dorm"
                          : user.isAdmin
                            ? "Admins cannot review dorms"
                            : ""
                    }
                  >
                    <Button
                      disabled={!user.isVerifiedStudent || user.isAdmin || userReview}
                      type="primary"
                      onClick={() => setShowReviewForm(true)}
                      className="mb-2 w-full whitespace-nowrap"
                    >
                      Add Review
                    </Button>
                  </Tooltip>
                  <Button
                    disabled={reviews.length === 0}
                    type={!user.isVerifiedStudent ? "primary" : "default"}
                    onClick={toggleReviews}
                    className="w-full whitespace-nowrap"
                  >
                    {allReviewsShown ? "Minimize Reviews" : "See All Reviews"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Review Section - will only render if user has submitted a dorm review in the past */}
        {userReview && (
          <div
            key={userReview?._id}
            id={userReview?._id} // Ensure each review has the correct ID for scrolling
            className="mb-10 border-b border-gray-100 max-xl:mx-auto max-xl:max-w-2xl"
          >
            {/* Section Header */}
            <h2 className="bold mb-10 text-center text-3xl font-bold leading-9 sm:text-left">
              Your Review
            </h2>

            <div className="mb-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              {/* Rating */}
              <Rate disabled value={userReview?.rating} style={{ fontSize: 25, marginBottom: 4 }} />
              {/* Edit and Delete Icons */}
              <div className="flex justify-start gap-4 sm:flex-row sm:justify-end">
                {/* Edit Icon */}
                <div
                  onClick={() => setShowReviewForm(true)}
                  style={{ fontSize: 20, cursor: "pointer" }}
                >
                  <EditOutlined />
                </div>
                {/* Delete Icon */}
                <div
                  onClick={() => deleteReview(userReview?._id)}
                  style={{ fontSize: 20, cursor: "pointer" }}
                >
                  <DeleteOutlined />
                </div>
              </div>
            </div>

            {/* Review Title */}
            <p className="mb-4 text-xl font-semibold leading-9 sm:text-2xl">
              {userReview?.title || "No title"}
            </p>

            <div className="mb-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              {/* User Info */}
              <div className="flex items-center gap-5">
                <img
                  src={`${userReview?.createdBy?.profilePicture}`}
                  alt="User Profile Picture"
                  className="h-14 w-14 rounded-full"
                />
                <div className="flex flex-col">
                  <div className="xxs:flex-row flex flex-col gap-2">
                    <h6 className="text-lg font-semibold leading-8">
                      {userReview?.createdBy?.name}
                    </h6>
                    {userReview?.createdBy?.isVerifiedStudent && (
                      <VerifiedStudentBadge className="xxs:max-w-none max-w-32" />
                    )}
                  </div>
                  <div className="flex gap-2 max-[400px]:mt-2 max-[400px]:flex-col">
                    {/* Country */}
                    <span
                      className={`fi fi-${userReview?.createdBy?.country?.toLowerCase()}`}
                    ></span>
                    <span className="text-lg font-semibold leading-8">
                      {`${countryList().getLabel(userReview?.createdBy?.country)}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date */}
              <p className="text-lg font-normal leading-8 text-gray-400">
                {formatDateToMonthDayYear(userReview?.createdAt)}
              </p>
            </div>

            {/* Rooms Stayed */}
            <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <h4 className="mb-2 font-medium leading-6 sm:mb-0">
                <span className="font-bold">Room/Rooms Stayed:</span>
              </h4>
              <p className="leading-6">
                {userReview?.roomsStayed?.map((room, index) => (
                  <span key={index}>
                    {roomOptions.find((option) => option.value === room)?.label}
                    {index < userReview.roomsStayed.length - 1 && ", "}
                  </span>
                ))}
              </p>
            </div>

            {/* Date Stayed */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <h4 className="mb-2 font-medium leading-6 sm:mb-0">
                <span className="font-bold">From:</span>
              </h4>
              <p className="leading-6">
                {formatDateToMonthDayYear(userReview?.fromDate)} -{" "}
                {formatDateToMonthDayYear(userReview?.toDate)}
              </p>
            </div>

            {/* Comment */}
            <p className="text-lg font-normal leading-8 text-gray-400 max-xl:text-justify">
              {userReview?.comment}
            </p>
            <hr className="mt-8" />
          </div>
        )}

        {/* Other Reviews Section */}
        <div className="mb-5 flex w-full flex-col justify-between gap-10 max-xl:mx-auto max-xl:max-w-2xl sm:mb-10 sm:flex-row sm:items-center sm:gap-5">
          {/* Section Header */}
          <h2 className="bold text-center text-3xl font-bold leading-9 sm:text-left">
            {userReview ? "Other Reviews" : "Reviews"}
          </h2>

          {/* Sort Reviews */}
          <div className="xs:flex-row xs:items-center xs:gap-x-4 flex flex-col">
            <h2 className="text-lg font-bold leading-10 sm:text-xl">Sort Reviews by</h2>
            <div>
              <Select
                defaultValue="mostRecent"
                onChange={(value) => setSortCriteria(value)}
                className="sort-select"
              >
                <Option value="mostRecent">Most Recent</Option>
                <Option value="mostHelpful">Most Helpful</Option>
                <Option value="stars5">5 Stars</Option>
                <Option value="stars4">4 Stars</Option>
                <Option value="stars3">3 Stars</Option>
                <Option value="stars2">2 Stars</Option>
                <Option value="stars1">1 Star</Option>
              </Select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {noReviews ? (
          <div className="xs:flex-row my-10 flex flex-col items-center justify-center gap-2 text-center text-gray-500">
            <FontAwesomeIcon icon={faFaceFrown} className="h-8 w-8 text-gray-300" />
            <span>No reviews available.</span>
          </div>
        ) : (
          visibleReviews.map((review) => (
            <div
              key={review?._id}
              id={review?._id} // Ensure each review has the correct ID for scrolling
              className="mb-10 border-b border-gray-100 max-xl:mx-auto max-xl:max-w-2xl"
            >
              <div className="mb-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                {/* Rating */}
                <Rate disabled value={review?.rating} style={{ fontSize: 25, marginBottom: 4 }} />
                {/* Like and Flag Icons */}
                <div className="flex justify-start gap-4 sm:flex-row sm:justify-end">
                  {/* Like Icon */}
                  <div
                    onClick={() => toggleLike(review?._id)}
                    style={{ fontSize: 20, cursor: "pointer" }}
                  >
                    {/* Render the like icon based on whether the user has already liked the review */}
                    {/* We use the 'some' method to iterate over the likedBy array. For each objectId in the array, we convert it to a string using the toString() method. We then compare the string representation of the user's ObjectId with the string representation of the ObjectId in the likedBy array. If there is a match, we know that the user has already liked the review, and we render the like icon with a filled color. If there is no match, we know that the user has not yet liked the review, and we render the like icon with an outline color. */}
                    {review?.likedBy.some((objectId) => objectId.toString() === user?._id) ? (
                      <LikeFilled />
                    ) : (
                      <LikeOutlined />
                    )}
                    <span className="ml-2 text-gray-400">{review?.numberOfLikes}</span>
                  </div>
                  {/* Flag Icon */}
                  <div
                    onClick={() => toggleFlag(review?._id)}
                    style={{ fontSize: 20, cursor: "pointer" }}
                  >
                    {review?.flaggedBy.some((objectId) => objectId.toString() === user?._id) ? (
                      <FlagFilled style={{ color: "red" }} />
                    ) : (
                      <FlagOutlined />
                    )}
                  </div>
                </div>
              </div>

              {/* Review Title */}
              <p className="mb-4 text-xl font-semibold leading-9 sm:text-2xl">
                {review?.title || "No title"}
              </p>

              <div className="mb-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                {/* User Info */}
                <div className="flex items-center gap-5">
                  <img
                    src={`${review?.createdBy?.profilePicture}`}
                    alt="User Profile Picture"
                    className="h-14 w-14 rounded-full"
                  />
                  <div className="flex flex-col">
                    <div className="xxs:flex-row flex flex-col gap-2">
                      <h6 className="text-lg font-semibold leading-8">{review?.createdBy?.name}</h6>
                      {review?.createdBy?.isVerifiedStudent && (
                        <VerifiedStudentBadge className="xxs:max-w-none max-w-32" />
                      )}
                    </div>
                    <div className="flex gap-2 max-[400px]:mt-2 max-[400px]:flex-col">
                      {/* Country */}
                      <span className={`fi fi-${review?.createdBy?.country?.toLowerCase()}`}></span>
                      <span className="text-lg font-semibold leading-8">
                        {`${countryList().getLabel(review?.createdBy?.country)}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Date */}
                <p className="text-lg font-normal leading-8 text-gray-400">
                  {formatDateToMonthDayYear(review?.createdAt)}
                </p>
              </div>

              {/* Rooms Stayed */}
              <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <h4 className="mb-2 font-medium leading-6 sm:mb-0">
                  <span className="font-bold">Room/Rooms Stayed:</span>
                </h4>
                <p className="leading-6">
                  {review?.roomsStayed?.map((room, index) => (
                    <span key={index}>
                      {roomOptions.find((option) => option.value === room)?.label}
                      {index < review.roomsStayed.length - 1 && ", "}
                    </span>
                  ))}
                </p>
              </div>

              {/* Date Stayed */}
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <h4 className="mb-2 font-medium leading-6 sm:mb-0">
                  <span className="font-bold">From:</span>
                </h4>
                <p className="leading-6">
                  {formatDateToMonthDayYear(review?.fromDate)} -{" "}
                  {formatDateToMonthDayYear(review?.toDate)}
                </p>
              </div>

              {/* Comment */}
              <p className="text-lg font-normal leading-8 text-gray-400 max-xl:text-justify">
                {review?.comment}
              </p>
            </div>
          ))
        )}

        {/* Review Form */}
        <div>
          {showReviewForm && userReview ? (
            <ReviewForm
              dorm={userReview.dorm}
              reloadData={fetchSpecificDorm}
              showReviewForm={showReviewForm}
              setShowReviewForm={setShowReviewForm}
              selectedReview={userReview}
            />
          ) : (
            showReviewForm && (
              <ReviewForm
                dorm={dorm}
                reloadData={fetchSpecificDorm}
                showReviewForm={showReviewForm}
                setShowReviewForm={setShowReviewForm}
              />
            )
          )}
        </div>
      </div>
    )
  );
}

export default DormInfo;
