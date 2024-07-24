import React, { useEffect, useState } from "react";
import { setLoading } from "../../../redux/loadersSlice.js";
import { Button, message, Rate, Table, Tooltip } from "antd";
import { useDispatch } from "react-redux";
import { DeleteReview, GetAllReviews } from "../../../apis/reviews.js";
import { roomOptions } from "../../../helpers/roomOptions.js";
import { formatDateToYYYY_MM_DD } from "../../../helpers/index.js";

function Reviews() {
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchAllReviews = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetAllReviews();
      setReviews(response.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  // Fetch dorms when the component mounts
  useEffect(() => {
    fetchAllReviews();
  }, []);

  // Function to delete a review by ID
  const deleteReview = async (id, dormId) => {
    try {
      dispatch(setLoading(true));
      const response = await DeleteReview(id, { dorm: dormId });
      message.success(response.message);
      fetchAllReviews();
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
      title: "University",
      key: "university",
      width: 100,
      render: (_, record) => record.dorm.parentUniversity.name,
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
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 80,
      render: (_, record) => record.createdBy.name,
    },
    {
      title: "Likes",
      dataIndex: "numberOfLikes",
      key: "Likes",
      width: 50,
    },
    {
      title: "Flags",
      dataIndex: "numberOfFlags",
      key: "Flags",
      width: 50,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 60,
      render: (_, record) => {
        return (
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
        scroll={{ x: 1500 }}
      />
    </div>
  );
}

export default Reviews;
