import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, message } from "antd";
import UniForm from "./UniForm.jsx";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/loadersSlice.js";
import { GetAllUnis } from "../../../apis/unis.js";
import { isFulfilled } from "@reduxjs/toolkit";

function Unis() {
  const [unis, setUnis] = useState([]);
  const dispatch = useDispatch();
  const [showUniForm, setShowUniForm] = useState(false);
  const navigate = useNavigate();

  const fetchUnis = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetAllUnis();
      setUnis(response.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "University",
      dataIndex: "logoPic",
      render: (text, record) => {
        return <img src={record?.logoPic} alt="logoPic" className="w-20 h-20 rounded" />;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Bio",
      dataIndex: "bio",
    },
    {
      title: "Website URL",
      dataIndex: "websiteURL",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Established Year",
      dataIndex: "establishedYear",
    },
    {
      title: "Postal Code",
      dataIndex: "postalCode",
    },
    {
      title: "City",
      dataIndex: "city",
    },
    {
      title: "State",
      dataIndex: "state",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-2">
            <i className="ri-delete-bin-line"></i>
            <i className="ri-pencil-line"></i>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchUnis();
  }, []);

  return (
    <div>
      <div className="flex justify-end">
        <Button onClick={() => setShowUniForm(true)}>Add University</Button>
      </div>

      <Table dataSource={unis} columns={columns} rowKey={(record) => record.logoPic} />

      {showUniForm && <UniForm showUniForm={showUniForm} setShowUniForm={setShowUniForm} />}
    </div>
  );
}

export default Unis;
