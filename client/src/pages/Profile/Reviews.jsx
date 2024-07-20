import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message, Rate, Table } from "antd";
import { setLoading } from "../../redux/loadersSlice.js";
import { GetAllReviewsForUser } from "../../apis/reviews.js";
import { formatDateToYYYY_MM_DD } from "../../helpers/index.js";
import ReviewForm from "./../DormInfo/ReviewForm";
import { DeleteReview } from "./../../apis/reviews";

function Reviews() {
  const { user } = useSelector((state) => state.users); // Get the users state from the Redux store
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const dispatch = useDispatch();

  const fetchAllReviewsForUser = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetAllReviewsForUser(user._id);
      console.log("Reviews:", response.data);
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
    {
      title: "Dorm",
      dataIndex: "dorm",
      key: "dorm",
      width: 200,
      fixed: "left",
      render: (_, record) => record.dorm.name,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: 150,
      render: (_, record) => <Rate disabled value={record.rating} />,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 200,
    },
    {
      title: "Review",
      dataIndex: "comment",
      key: "comment",
      width: 300,
    },
    {
      title: "Room/Rooms Stayed",
      dataIndex: "roomsStayed",
      key: "roomsStayed",
      width: 200,
    },
    {
      title: "From Date",
      dataIndex: "fromDate",
      key: "fromDate",
      width: 100,
      render: (_, record) => formatDateToYYYY_MM_DD(record.fromDate),
    },
    {
      title: "To Date",
      dataIndex: "toDate",
      key: "toDate",
      width: 100,
      render: (_, record) => formatDateToYYYY_MM_DD(record.toDate),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 60,
      render: (_, record) => formatDateToYYYY_MM_DD(record.createdAt),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 60,
      render: (_, record) => {
        return (
          <div className="flex gap-2">
            <i
              className="ri-delete-bin-line"
              onClick={() => {
                deleteReview(record._id, record.dorm._id);
              }}
            ></i>
            <i
              className="ri-pencil-line"
              onClick={() => {
                setSelectedReview(record);
                setShowReviewForm(true);
              }}
            ></i>
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
        className="mt-5"
        scroll={{ x: 1300, scrollToFirstRowOnChange: true }}
      />

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
