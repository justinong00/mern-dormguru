import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button, message, Rate } from "antd";
import { setLoading } from "../../redux/loadersSlice.js";
import { GetDormById } from "../../apis/dorms.js";
import ReviewForm from "./ReviewForm.jsx";
import { GetAllReviews } from "../../apis/reviews.js";
import { roundToHalf } from "./../../helpers/roundToHalf";
import {
  getLastMonthAverageRating,
  countNumberOfReviewsForEachRating,
  renderRatingBar,
} from "../../helpers/ratingHelpers.jsx";
import { formatDateToMonthDayYear } from "../../helpers/index.js";
import { LikeOutlined, LikeFilled, FlagOutlined, FlagFilled } from "@ant-design/icons";
import { roomOptions } from "../../helpers/roomOptions.js";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import "/node_modules/malaysia-state-flag-icon-css/css/flag-icon.min.css";
import { getStateCode } from "../../helpers/stateCodesHelper.js";

function DormInfo() {
  const [dorm, setDorm] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState([]);
  const [allReviewsShown, setAllReviewsShown] = useState(false);
  // Initialize ratingCounts state with a default value of {5: 0, 4: 0, 3: 0, 2: 0, 1: 0} to store the number of reviews for each rating when calling countNumberOfReviewsForEachRating() during fetch
  const [ratingCounts, setRatingCounts] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const [isLiked, setIsLiked] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // Toggle like status
  const toggleLike = () => {
    setIsLiked((prev) => !prev);
  };

  // Toggle flagged status
  const toggleFlag = () => {
    setIsFlagged((prev) => !prev);
  };

  // Toggle visibility of reviews
  const toggleReviews = () => {
    if (allReviewsShown) {
      setVisibleReviews(reviews.slice(0, 2));
    } else {
      setVisibleReviews(reviews);
    }
    setAllReviewsShown(!allReviewsShown);
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
        GetAllReviews(id),
      ]);
      setDorm(dormResponse.data);
      setReviews(reviewsResponse.data);
      setVisibleReviews(reviewsResponse.data.slice(0, 2)); // Display only 2 reviews initially
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

  return (
    dorm && (
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
          <div className="col-span-8 flex h-full flex-col justify-between gap-y-4 lg:col-span-4">
            {/* Aspect ratio container */}
            {/* This div maintains a 2:3 aspect ratio on smaller screens */}
            {/* The custom padding-bottom (pb-2/3) creates a 66.67% height relative to width */}
            {/* On larger screens (lg), it switches to a flexible 1:1 ratio */}
            <div className="pb-2/3 relative h-0 w-full lg:flex-1 lg:pb-0">
              {/* The image is absolutely positioned within the container */}
              {/* This allows it to fill the aspect ratio container completely */}
              {/* On larger screens (lg), it becomes static, fitting the flexible container */}
              <img
                src={dorm.coverPhotos}
                alt="Dorm Image"
                className="absolute left-0 top-0 h-full w-full rounded-lg object-cover shadow-lg transition-shadow duration-300 hover:shadow-xl lg:static"
              />
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
                <div className="flex flex-col items-center gap-y-4 sm:items-center sm:justify-between lg:flex-row">
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
                <div className="flex flex-col items-center gap-y-4 sm:items-center sm:justify-between sm:border-y-0 sm:border-l-2 sm:border-r-0 sm:border-solid sm:border-gray-200 sm:px-2 md:border-x-2 lg:flex-1 lg:flex-row lg:items-start lg:border-none lg:px-0">
                  <div className="flex h-full flex-1">
                    <span className="text-2xl font-semibold">Postal Code</span>
                  </div>
                  <div className="flex h-full flex-col items-center justify-center lg:flex-1 lg:items-start">
                    <span className="text-center text-lg lg:text-start">{dorm?.postalCode}</span>
                  </div>
                </div>

                {/* City */}
                <div className="flex flex-col items-center gap-y-4 sm:items-center sm:justify-between lg:flex-row">
                  <div className="flex h-full flex-1">
                    <span className="text-2xl font-semibold">City</span>
                  </div>
                  <div className="flex h-full flex-col items-center justify-center lg:flex-1 lg:items-start">
                    <span className="text-center text-lg lg:text-start">{dorm?.city}</span>
                  </div>
                </div>

                {/* State */}
                <div className="flex flex-col items-center gap-y-4 sm:items-center sm:justify-between sm:border-y-0 sm:border-l-2 sm:border-r-0 sm:border-solid sm:border-gray-200 sm:px-2 md:border-none md:px-0 lg:flex-row">
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
                <div className="flex flex-col items-center gap-y-4 sm:items-center sm:justify-between md:border-x-2 md:border-y-0 md:border-solid md:border-gray-200 md:px-2 lg:flex-1 lg:flex-row lg:items-start lg:border-none lg:px-0">
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
                <div className="flex flex-col items-center gap-y-4 sm:items-center sm:justify-between sm:border-y-0 sm:border-l-2 sm:border-r-0 sm:border-solid sm:border-gray-200 sm:px-2 md:border-none md:px-0 lg:flex-row">
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

        {/* Description Section */}
        <h2 className="my-10 text-center text-3xl font-bold leading-10 text-black sm:text-4xl">
          Description
        </h2>

        {/* Description Content */}
        <div className="my-10 text-center text-lg">{dorm?.description}</div>
        <hr />

        {/* Parent University */}
        <h2 className="my-10 text-center text-3xl font-bold leading-10 text-black sm:text-4xl">
          Parent University
        </h2>

        {/* Parent University Content */}
        <div className="mb-10 grid grid-cols-12 gap-4">
          {/* University Logo */}
          <div className="col-span-12 flex flex-col items-center gap-y-4 lg:col-span-4 lg:px-2">
            <p className="text-2xl font-semibold">Logo</p>
            <div className="flex flex-1 flex-col items-center justify-center">
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/uni/${dorm?.parentUniversity?._id}`)}
              >
                <img
                  src={dorm?.parentUniversity?.logoPic}
                  alt="University Logo"
                  className="max-h-28 transform rounded-sm object-cover transition-transform ease-in-out hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* University Name */}
          <div className="col-span-12 flex flex-col items-center gap-y-4 lg:col-span-4 lg:border-x-2 lg:border-y-0 lg:border-solid lg:border-gray-200 lg:px-2">
            <p className="text-2xl font-semibold">Name</p>
            <div className="flex flex-1 flex-col items-center justify-center">
              <p className="transform cursor-pointer text-center text-lg transition-transform ease-in-out hover:scale-105 hover:underline">
                {dorm?.parentUniversity?.name}
              </p>
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

        {/* <h2 className="text-lg font-semibold text-gray-600">Parent University</h2>
        <hr />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 my-10 text-gray-600 ">
          <div
            className="flex h-24 cursor-pointer"
            onClick={() => navigate(`/uni/${dorm?.parentUniversity?._id}`)}
          >
            <img
              src={dorm?.parentUniversity?.logoPic}
              alt="University Logo"
              className="rounded-sm object-cover"
            />
            <div className="flex justify-center items-center pl-5">
              <span className="font-semibold">{dorm?.parentUniversity?.name}</span>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <span className="font-semibold">Bio:</span>
            <span>{dorm?.parentUniversity?.bio}</span>
          </div>
        </div> */}

        {/* <div className="flex justify-between items-center mt-5">
          <span className="text font-semibold">Reviews</span>
          <Button type="default" onClick={() => setShowReviewForm(true)}>
            Add Review
          </Button>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          {reviews.map((review) => (
            <div
              key={review?._id}
              className="flex justify-between border-solid border p-2 rounded-sm border-gray-300"
            >
              <div className="flex flex-col">
                <span className="text-gray-600 font-semibold text-md">
                  {review?.createdBy?.name}
                </span>
                <Rate disabled value={review?.rating || 0} className="mt-2" />
                <span className="text-gray-600 text-sm mt-2">{review?.comment}</span>
              </div>

              <div className="mr-5">
                <span className="text-gray-600 text-sm">{getRelativeTime(review?.createdAt)}</span>
              </div>
            </div>
          ))}
        </div> */}

        {/* Rating & Reviews */}
        <h2 className="my-10 text-center text-3xl font-bold leading-10 text-black sm:text-4xl">
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
                  <div className="flex flex-col items-center justify-center border-gray-200 sm:border-r sm:pr-3">
                    <h2 className="mb-4 text-center text-5xl font-bold text-black">
                      {dorm?.averageRating}
                    </h2>

                    <div className="mb-4 flex items-center gap-3">
                      <Rate
                        disabled
                        value={roundToHalf(dorm.averageRating)}
                        allowHalf
                        style={{ fontSize: 25 }}
                      />
                    </div>

                    <p className="text-lg font-normal leading-8 text-gray-400">
                      {dorm.numberOfReviews} Reviews
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center border-gray-200 sm:border-r sm:pr-3">
                    <h2 className="mb-4 text-center text-5xl font-bold text-black">
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

              <div className="col-span-12 max-lg:mt-8 md:col-span-4 md:pl-8">
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <Button
                    type="primary"
                    onClick={() => setShowReviewForm(true)}
                    className="mb-2 w-full whitespace-nowrap"
                  >
                    Add Review
                  </Button>
                  <Button
                    disabled={reviews.length === 0}
                    type="default"
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

        {/* Reviews List */}
        {visibleReviews.map((review) => (
          <div
            key={review?._id}
            className="border-b border-gray-100 pb-8 max-xl:mx-auto max-xl:max-w-2xl"
          >
            <div className="mb-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              {/* Rating */}
              <Rate disabled value={review?.rating} style={{ fontSize: 25, marginBottom: 4 }} />
              {/* Like and Flag Icons */}
              <div className="flex justify-start gap-4 sm:flex-row sm:justify-end">
                <div onClick={toggleLike} style={{ fontSize: 20, cursor: "pointer" }}>
                  {isLiked ? <LikeFilled /> : <LikeOutlined />}
                </div>
                <div onClick={toggleFlag} style={{ fontSize: 20, cursor: "pointer" }}>
                  {isFlagged ? <FlagFilled style={{ color: "red" }} /> : <FlagOutlined />}
                </div>
              </div>
            </div>

            {/* Review Title */}
            <p className="mb-4 text-xl font-semibold leading-9 text-black sm:text-2xl">
              {review?.title || "No title"}
            </p>

            <div className="mb-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              {/* User Info */}
              <div className="flex items-center gap-5">
                <img
                  src="https://pagedone.io/asset/uploads/1704349572.png"
                  alt="John image"
                  className="h-14 w-14"
                />
                <div className="flex flex-col">
                  <h6 className="text-lg font-semibold leading-8">{review?.createdBy?.name}</h6>
                  <div className="flex gap-2 max-[400px]:mt-2 max-[400px]:flex-col">
                    {/* Country */}
                    <span className="fi fi-my"></span>
                    <span className="text-lg font-semibold leading-8">British Virgin Islands</span>
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
              <h4 className="mb-2 font-medium leading-6 text-black sm:mb-0">
                <span className="font-bold">Room/Rooms Stayed:</span>
              </h4>
              <p className="leading-6 text-black">
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
              <h4 className="mb-2 font-medium leading-6 text-black sm:mb-0">
                <span className="font-bold">From:</span>
              </h4>
              <p className="leading-6 text-black">
                {formatDateToMonthDayYear(review?.fromDate)} -{" "}
                {formatDateToMonthDayYear(review?.toDate)}
              </p>
            </div>

            {/* Comment */}
            <p className="text-lg font-normal leading-8 text-gray-400 max-xl:text-justify">
              {review?.comment}
            </p>
            <hr className="mt-8" />
          </div>
        ))}

        {/* Review Form */}
        <div>
          {showReviewForm && (
            <ReviewForm
              dorm={dorm}
              reloadData={fetchSpecificDorm}
              showReviewForm={showReviewForm}
              setShowReviewForm={setShowReviewForm}
            />
          )}
        </div>
      </div>
    )
  );
}

export default DormInfo;
