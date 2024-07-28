import React, { useEffect, useState } from "react";
import { setLoading } from "../../../redux/loadersSlice.js";
import { Button, message, Rate, Table, Tooltip, DatePicker, Popconfirm } from "antd";
import { useDispatch } from "react-redux";
import { DeleteReview, GetAllReviews } from "../../../apis/reviews.js";
import { roomOptions } from "../../../helpers/roomOptions.js";
import { formatDateToYYYY_MM_DD } from "../../../helpers/index.js";
import { useNavigate } from "react-router-dom";
import {
  filterByDateRange,
  filterByStayDuration,
  roomFilters,
} from "../../../helpers/columnFiltersHelper.js";

const { RangePicker } = DatePicker;

function Reviews() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

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

  // Generate filter options for dorm names
  const dormFilters = Array.from(new Set(reviews.map((review) => review.dorm.name))).map(
    (dorm) => ({
      text: dorm,
      value: dorm,
    }),
  );

  // Generate filter options for universities
  const universityFilters = Array.from(
    new Set(reviews.map((review) => review.dorm.parentUniversity.name)),
  ).map((university) => ({
    text: university,
    value: university,
  }));

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
      render: (_, record) => record.dorm?.name,
      filters: dormFilters,
      filterSearch: true,
      onFilter: (value, record) => record.dorm?.name === value,
    },
    {
      title: "University",
      key: "university",
      width: 100,
      render: (_, record) => record.dorm?.parentUniversity?.name,
      filters: universityFilters,
      filterSearch: true,
      onFilter: (value, record) => record.dorm?.parentUniversity?.name === value,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: 100,
      render: (_, record) => <Rate disabled value={record.rating} />,
      filters: [
        { text: "5 stars", value: 5 },
        { text: "4 stars", value: 4 },
        { text: "3 stars", value: 3 },
        { text: "2 stars", value: 2 },
        { text: "1 star", value: 1 },
      ],
      onFilter: (value, record) => record.rating === value,
    },
    {
      title: "Room/Rooms Stayed",
      dataIndex: "roomsStayed",
      key: "roomsStayed",
      width: 120,
      render: (_, record) => (
        <div>
          {record.roomsStayed?.map((room, index) => (
            <div key={room}>
              {roomOptions.find((roomOption) => roomOption.value === room)?.label}
              {index < record.roomsStayed?.length - 1 ? ", " : ""}
            </div>
          ))}
        </div>
      ),
      filters: roomFilters,
      onFilter: (value, record) => record.roomsStayed?.includes(value),
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
      /* filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <input
            placeholder="From Date (YYYY-MM-DD)"
            value={selectedKeys[0]?.from || ""}
            onChange={(e) => setSelectedKeys([{ ...selectedKeys[0], from: e.target.value }])}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <input
            placeholder="To Date (YYYY-MM-DD)"
            value={selectedKeys[0]?.to || ""}
            onChange={(e) => setSelectedKeys([{ ...selectedKeys[0], to: e.target.value }])}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90, marginRight: 8 }}>
            Reset
          </Button>
          <Button type="primary" onClick={() => confirm()} size="small" style={{ width: 90 }}>
            Search
          </Button>
        </div>
      ),
      onFilter: (value, record) => {
        if (!value || value.length === 0) return true; // No filter applied
        const { from, to } = value;
        return filterByStayDuration(record, from, to);
      },
    }, */
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="flex flex-col p-2">
          <RangePicker
            value={selectedKeys[0]}
            onChange={(dates) => setSelectedKeys(dates ? [dates] : [])}
            style={{ width: 240, marginBottom: 8, marginRight: 8 }}
          />
          <div className="flex justify-end gap-2">
            <Button onClick={() => clearFilters()} size="small">
              Reset
            </Button>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
          </div>
        </div>
      ),
      onFilter: (value, record) => {
        if (!value || value.length === 0) return true;
        const [from, to] = value;
        return filterByStayDuration(record, from, to);
      },
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
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="flex flex-col gap-2 p-2">
          <input
            placeholder="Enter title keyword"
            value={selectedKeys[0]?.title || ""}
            onChange={(e) => setSelectedKeys([{ ...selectedKeys[0], title: e.target.value }])}
          />
          <input
            placeholder="Enter comment keyword"
            value={selectedKeys[0]?.comment || ""}
            onChange={(e) => setSelectedKeys([{ ...selectedKeys[0], comment: e.target.value }])}
          />
          <div className="flex justify-end gap-2">
            <Button onClick={() => clearFilters()} size="small">
              Reset
            </Button>
            <Button type="primary" onClick={() => confirm()} size="small">
              Search
            </Button>
          </div>
        </div>
      ),
      onFilter: (value, record) => {
        const { title, comment } = value;
        return (
          record.title?.toLowerCase().includes(title?.toLowerCase()) ||
          record.comment?.toLowerCase().includes(comment?.toLowerCase())
        );
      },
    },
    {
      title: "Posted Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 80,
      render: (_, record) => formatDateToYYYY_MM_DD(record.createdAt),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      /* filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="flex flex-col p-2">
          <RangePicker
            value={selectedKeys[0]}
            onChange={(dates) => setSelectedKeys(dates ? [dates] : [])}
            style={{ width: 240, marginBottom: 8, marginRight: 8 }}
          />
          <div className="flex justify-end gap-2">
            <Button onClick={() => clearFilters()} size="small">
              Reset
            </Button>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
          </div>
        </div>
      ),
      onFilter: (value, record) => {
        if (!value || value.length === 0) return true;
        const [from, to] = value;
        return filterByStayDuration(record, from, to);
      },
    }, */
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="flex flex-col p-2">
          <RangePicker
            value={selectedKeys[0]}
            onChange={(dates) => setSelectedKeys(dates ? [dates] : [])}
            style={{ width: 240, marginBottom: 8, marginRight: 8 }}
          />
          <div className="flex justify-end gap-2">
            <Button onClick={() => clearFilters()} size="small">
              Reset
            </Button>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
          </div>
        </div>
      ),
      onFilter: (value, record) => {
        if (!value || value.length === 0) return true;
        const [start, end] = value;
        return filterByDateRange(record, start, end);
      },
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 80,
      render: (_, record) => record.createdBy?.name,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="flex flex-col gap-2 p-2">
          <input
            placeholder="Enter keyword"
            value={selectedKeys[0] || ""}
            onChange={(e) => setSelectedKeys([e.target.value])}
          />
          <div className="flex justify-end gap-2">
            <Button onClick={() => clearFilters()} size="small">
              Reset
            </Button>
            <Button type="primary" onClick={() => confirm()} size="small">
              Search
            </Button>
          </div>
        </div>
      ),
      onFilter: (value, record) =>
        record.createdBy?.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Likes",
      dataIndex: "numberOfLikes",
      key: "Likes",
      width: 50,
      sorter: (a, b) => a.numberOfLikes - b.numberOfLikes,
    },
    {
      title: "Flags",
      dataIndex: "numberOfFlags",
      key: "Flags",
      width: 50,
      sorter: (a, b) => a.numberOfFlags - b.numberOfFlags,
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
            <Popconfirm
              title="Are you sure you want to delete this?"
              onConfirm={(e) => {
                e.stopPropagation();
                deleteReview(record._id, record.dorm?._id);
              }}
              okText="Yes"
              cancelText="No"
              onCancel={(e) => e.stopPropagation()}
            >
              <i className="ri-delete-bin-line" onClick={(e) => e.stopPropagation()}></i>
            </Popconfirm>
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
        onRow={(record) => {
          return {
            onClick: () => {
              navigate(`/dorm/${record.dorm?._id}#${record._id}`);
            },
            style: {
              cursor: "pointer",
            },
          };
        }}
      />
    </div>
  );
}

export default Reviews;
