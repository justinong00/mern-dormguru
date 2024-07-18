import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, message, Rate } from "antd";
import { setLoading } from "../../redux/loadersSlice.js";
import { GetDormById } from "../../apis/dorms.js";
import { GetAllReviewsForUser } from "../../apis/reviews.js";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faSchoolFlag } from "@fortawesome/free-solid-svg-icons";

function Reviews() {
  const { user } = useSelector((state) => state.users); // Get the users state from the Redux store
  const [reviews, setReviews] = useState([]);
  const dispatch = useDispatch();

  const fetchAllReviews = async () => {
    try {
      dispatch(setLoading(true));
      console.log(user);
      const response = await GetAllReviewsForUser(user._id);
      setReviews(response.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  return <div>Reviews</div>;
}

export default Reviews;
