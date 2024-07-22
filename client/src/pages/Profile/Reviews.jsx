import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message, Rate, Table, Tooltip } from "antd";
import { setLoading } from "../../redux/loadersSlice.js";
import { GetAllReviewsForUser } from "../../apis/reviews.js";
import { formatDateToYYYY_MM_DD } from "../../helpers/index.js";
import ReviewForm from "./../DormInfo/ReviewForm";
import { DeleteReview } from "./../../apis/reviews";
import { useNavigate } from "react-router-dom";
import { roomOptions } from "../../helpers/roomOptions.js";

function Reviews() {
  const { user } = useSelector((state) => state.users); // Get the users state from the Redux store
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchAllReviewsForUser = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetAllReviewsForUser(user._id);
      setReviews(response.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllReviewsForUser();
  }, []);

  const deleteReview = async (id, dormId) => {
    try {
      dispatch(setLoading(true));
      const response = await DeleteReview(id, { dorm: dormId });
      message.success(response.message);
      fetchAllReviewsForUser();
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  // Table columns definition
  const columns = [
    // want to show dorm cover photo
    {
      title: "Dorm",
      dataIndex: "coverPhotos",
      key: "coverPhotos",
      width: 50,
      render: (_, record) => {
        return (
          <img
            src={record.dorm.coverPhotos || ""}
            alt="coverPhotos"
            className="h-20 w-20 object-contain"
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "dorm",
      key: "dorm",
      width: 100,
      fixed: "left",
      render: (_, record) => record.dorm.name,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: 100,
      render: (_, record) => <Rate disabled value={record.rating} />,
    },
    {
      title: "Room/Rooms Stayed",
      dataIndex: "roomsStayed",
      key: "roomsStayed",
      width: 120,
      render: (_, record) => (
        <div>
          {record.roomsStayed.map((room, index) => (
            <div key={room}>
              {roomOptions.find((roomOption) => roomOption.value === room)?.label}
              {index < record.roomsStayed.length - 1 ? ", " : ""}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Stay Duration",
      key: "stayDuration",
      width: 100,
      render: (_, record) => (
        <div>
          <div>
            <span className="font-semibold">From:</span> {formatDateToYYYY_MM_DD(record.fromDate)}
          </div>
          <div>
            <span className="font-semibold">To:</span> {formatDateToYYYY_MM_DD(record.toDate)}
          </div>
        </div>
      ),
    },
    {
      title: "Review",
      dataIndex: "review",
      key: "review",
      width: 150,
      render: (_, record) => (
        <div>
          <div className="font-semibold">{record.title}</div>
          <div className="italic">{record.comment}</div>
        </div>
      ),
    },
    {
      title: "Posted Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 80,
      render: (_, record) => formatDateToYYYY_MM_DD(record.createdAt),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 50,
      render: (_, record) => {
        return (
          <div className="flex gap-2">
            <Tooltip title="Edit Review">
              <i
                className="ri-pencil-line"
                onClick={(e) => {
                  // Stop event bubbling to the parent card to prevent it from triggering the onClick event
                  e.stopPropagation();
                  setSelectedReview(record);
                  setShowReviewForm(true);
                }}
              ></i>
            </Tooltip>
            <Tooltip title="Delete Review">
              <i
                className="ri-delete-bin-line"
                onClick={(e) => {
                  // Stop event bubbling to the parent card to prevent it from triggering the onClick event
                  e.stopPropagation();
                  deleteReview(record._id, record.dorm._id);
                }}
              ></i>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {/* rowKey provides unique key for each row */}
      <Table
        dataSource={reviews}
        columns={columns}
        rowKey={(record) => record._id}
        className="reviews-table mt-5"
        scroll={{ x: 1300, scrollToFirstRowOnChange: true }}
        onRow={(record) => {
          return {
            onClick: () => {
              navigate(`/dorm/${record.dorm._id}#${record._id}`);
            },
            style: {
              cursor: "pointer",
            },
          };
        }}
      />

      {/* Mobile view */}
      <div className="review-card mt-5">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="my-8 cursor-pointer overflow-hidden rounded-xl bg-white shadow-md shadow-gray-300 transition hover:scale-105 hover:shadow-2xl"
            onClick={() => {
              navigate(`/dorm/${review.dorm._id}#${review._id}`);
            }}
          >
            {/* Image Container */}
            <div className="aspect-w-3 aspect-h-2">
              <img
                src={review.dorm.coverPhotos || ""}
                alt="coverPhotos"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Content Container */}
            <div className="flex flex-col justify-between gap-y-4 p-4">
              {/* Dorm Name */}
              <div className="text-2xl font-semibold">{review.dorm.name}</div>

              {/* Rating */}
              <Rate disabled value={review.rating} className="my-2" style={{ fontSize: 25 }} />

              {/* Rooms Stayed */}
              <div className="text-sm">
                <div className="font-bold">Room/Rooms Stayed:</div>
                <div>
                  {review.roomsStayed.map((room, index) => (
                    <div key={room}>
                      {roomOptions.find((roomOption) => roomOption.value === room)?.label}
                      {index < review.roomsStayed.length - 1 ? ", " : ""}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stay Duration */}
              <div className="text-sm">
                <div className="font-bold">Stay Duration:</div>
                <div>
                  <span className="font-semibold">From:</span>{" "}
                  {formatDateToYYYY_MM_DD(review.fromDate)}
                </div>
                <div>
                  <span className="font-semibold">To:</span> {formatDateToYYYY_MM_DD(review.toDate)}
                </div>
              </div>

              {/* Review Title and Comment */}
              <div className="text-sm">
                <div className="font-bold">Review:</div>
                <div className="font-semibold">{review.title}</div>
                <div className="italic">{review.comment}</div>
              </div>

              {/* Posted Date */}
              <div className="text-sm">
                <div className="font-bold">Posted Date:</div>
                <div>{formatDateToYYYY_MM_DD(review.createdAt)}</div>
              </div>

              {/* Action Icons */}
              <div className="mt-2 flex gap-2">
                <Tooltip title="Edit Review">
                  <i
                    className="ri-pencil-line"
                    onClick={(e) => {
                      // Stop event bubbling to the parent card to prevent it from triggering the onClick event
                      e.stopPropagation();
                      setSelectedReview(review);
                      setShowReviewForm(true);
                    }}
                  ></i>
                </Tooltip>
                <Tooltip title="Delete Review">
                  <i
                    className="ri-delete-bin-line"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteReview(review._id, review.dorm._id);
                    }}
                  ></i>
                </Tooltip>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show review form when selectedReview is not null */}
      {showReviewForm && selectedReview && (
        <ReviewForm
          dorm={selectedReview.dorm}
          reloadData={fetchAllReviewsForUser}
          showReviewForm={showReviewForm}
          setShowReviewForm={setShowReviewForm}
          selectedReview={selectedReview}
          setSelectedReview={setSelectedReview}
        />
      )}
    </div>
  );
}

export default Reviews;
