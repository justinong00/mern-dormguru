import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../../../redux/loadersSlice.js";
import { GetAllUsers, UpdateUser } from "../../../apis/users.js";
import { Button, message, Switch, Table, DatePicker, Tag } from "antd";
import { formatDateToYYYY_MM_DD } from "../../../helpers/index.js";
import { filterByDateRange } from "../../../helpers/columnFiltersHelper.js";
import { countryOptions } from "./../../../helpers/countryOptions";

const { RangePicker } = DatePicker;

function Users() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchAllUsers = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetAllUsers();
      setUsers(response.data);
      dispatch(setLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(setLoading(false));
    }
  };

  const updateUser = async (user) => {
    try {
      dispatch(setLoading(true));
      // Need to set 'id' key because backend (router) check req.body.id (affected by UserDetails.jsx (non-admin))
      const response = await UpdateUser({ ...user, id: user._id });
      message.success(response.message);
      fetchAllUsers();
      dispatch(setLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Generate filter options for country
  const countryFilters = Array.from(new Set(users.map((user) => user.country))).map((country) => ({
    text: countryOptions.find((option) => option.value === country)?.labelForSearch,
    value: country,
  }));

  const columns = [
    {
      title: "User",
      dataIndex: "profilePicture",
      key: "profilePicture",
      width: 50,
      render: (profilePicture) => (
        <img
          src={profilePicture}
          alt="Profile Picture"
          className="h-10 w-10 rounded-full object-cover md:h-12 md:w-12"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 100,
      fixed: "left",
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
      onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      width: 150,
      render: (country) => countryOptions.find((option) => option.value === country)?.label,
      filters: countryFilters,
      filterSearch: true,
      onFilter: (value, record) => record.country === value,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 150,
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
      onFilter: (value, record) => record.email.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Verified Student",
      dataIndex: "isVerifiedStudent",
      key: "isVerifiedStudent",
      width: 100,
      render: (isVerifiedStudent) => (
        <Tag color={isVerifiedStudent ? "green" : "volcano"}>
          {isVerifiedStudent ? "YES" : "NO"}
        </Tag>
      ),
      filters: [
        {
          text: "YES",
          value: true,
        },
        {
          text: "NO",
          value: false,
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.isVerifiedStudent === value,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 80,
      render: (text) => formatDateToYYYY_MM_DD(text),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="flex w-64 flex-col gap-2 p-2">
          <RangePicker
            value={selectedKeys[0]}
            onChange={(dates) => setSelectedKeys(dates ? [dates] : [])}
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
        if (!value || value.length === 0) return true;
        const [start, end] = value;
        return filterByDateRange(record, start, end);
      },
    },
    {
      title: "Admin Status",
      dataIndex: "isAdmin",
      key: "isAdmin",
      width: 80,
      render: (text, record) => (
        <Switch
          checked={text}
          onChange={(checked) => updateUser({ ...record, isAdmin: checked })}
        />
      ),
      filters: [
        {
          text: "Yes",
          value: true,
        },
        {
          text: "No",
          value: false,
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.isAdmin === value,
    },
    {
      title: "Active Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 80,
      render: (text, record) => (
        <Switch
          checked={text}
          onChange={(checked) => updateUser({ ...record, isActive: checked })}
        />
      ),
      filters: [
        {
          text: "Yes",
          value: true,
        },
        {
          text: "No",
          value: false,
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.isActive === value,
    },
  ];

  return (
    <div>
      {/* rowKey provides unique key for each row */}
      <Table
        dataSource={users}
        columns={columns}
        rowKey={(record) => record._id}
        className="mt-5"
        scroll={{ x: 1500 }}
      />
    </div>
  );
}

export default Users;
