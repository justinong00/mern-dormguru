import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../../../redux/loadersSlice.js";
import { GetAllUsers, UpdateUser } from "../../../apis/users.js";
import { message, Switch, Table } from "antd";
import { formatDateToYYYY_MM_DD } from "../../../helpers/index.js";

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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (text) => formatDateToYYYY_MM_DD(text),
    },
    {
      title: "Is Admin",
      dataIndex: "isAdmin",
      key: "isAdmin",
      fixed: "right",
      width: 100,
      render: (text, record) => (
        <Switch
          checked={text}
          onChange={(checked) => updateUser({ ...record, isAdmin: checked })}
        />
      ),
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      key: "isActive",
      fixed: "right",
      width: 100,
      render: (text, record) => (
        <Switch
          checked={text}
          onChange={(checked) => updateUser({ ...record, isActive: checked })}
        />
      ),
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
