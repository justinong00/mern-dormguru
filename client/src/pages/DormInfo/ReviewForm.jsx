import { Input, message, Modal, Rate, Select } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loadersSlice.js";
import { AddReview } from "../../apis/reviews.js";
import { roomOptions } from "./../../helpers/roomOptions";

function ReviewForm({ dorm, reloadData, showReviewForm, setShowReviewForm }) {
  const [rating, setRating] = useState(3);
  const ratingDescriptions = ["Terrible", "Bad", "Average", "Good", "Excellent"];
  const [comment, setComment] = useState("");
  const [roomsStayed, setRoomsStayed] = useState([]);
  const dispatch = useDispatch();

  const getRatingDescription = (value) => {
    const roundedValue = Math.ceil(value);
    return ratingDescriptions[roundedValue - 1];
  };

  const addReview = async () => {
    try {
      dispatch(setLoading(true)); // Show loading indicator
      console.log(dorm);
      const response = await AddReview({
        rating,
        comment,
        dorm: dorm._id,
        roomsStayed,
      });
      message.success(response.message);
      setShowReviewForm(false);
      reloadData();
      dispatch(setLoading(false)); // Hide loading indicator
    } catch (error) {
      dispatch(setLoading(false)); // Hide loading indicator
      message.error(error.message); // Show error message
    }
  };

  return (
    <Modal
      open={showReviewForm}
      onCancel={() => setShowReviewForm(false)}
      title="Add Review"
      centered // Center the modal on the screen
      width="90%" // Set the width of the modal for smaller screens
      style={{ maxWidth: 500, width: "100%" }} // Set a maximum width for larger screens
      className="reviewModalStyle"
      onOk={addReview}
    >
      <div className="flex flex-col gap-4">
        <div>
          <span className="text-lg font-semibold">Dorm: </span>
          <span className="text-lg font-semibold ml-2">{dorm?.name}</span>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">Room/Rooms Stayed:</label>
          <Select
            value={roomsStayed}
            onChange={(value) => setRoomsStayed(value)}
            mode="multiple"
            maxTagCount={"responsive"}
            showSearch
            placeholder="Select room type"
            optionFilterProp="label"
            options={roomOptions.filter((options) => dorm?.roomsOffered.includes(options.value))} // Filter options based on dorm's roomsOffered
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">Rating:</label>
          <Rate
            value={rating}
            onChange={(value) => setRating(value)}
            allowHalf
          />
          {rating ? <span>{getRatingDescription(rating)}</span> : null}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">Comments:</label>
          <Input.TextArea
            autoSize={{ minRows: 5 }}
            allowClear
            showCount
            maxLength={250}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comments here..."
          />
        </div>
      </div>
    </Modal>
  );
}

export default ReviewForm;
