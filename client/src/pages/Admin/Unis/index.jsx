import { useEffect, useState } from "react";
import { Button, Table, message } from "antd";
import UniForm from "./UniForm.jsx";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/loadersSlice.js";
import { DeleteUni, GetAllUnis } from "../../../apis/unis.js";

function Unis() {
  const dispatch = useDispatch(); // Redux dispatch function
  const [unis, setUnis] = useState([]);
  const [showUniForm, setShowUniForm] = useState(false);
  const [selectedUni, setSelectedUni] = useState(null);

  // Fetch all universities from the server
  const fetchUnis = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetAllUnis(); // API call to get all universities
      setUnis(response.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  // Delete a university by ID
  const deleteUni = async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await DeleteUni(id); // API call to delete a university
      message.success(response.message);
      fetchUnis(); // Refresh university list by calling the fetchUnis function
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  // Table columns definition
  const columns = [
    {
      title: "University",
      dataIndex: "logoPic",
      key: "logoPic",
      width: 100,
      render: (_, record) => {
        return (
          <img src={record?.logoPic || ""} alt="logoPic" className="w-20 h-20 object-contain " />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 100,
      className: " name-column",
    },
    {
      title: "Bio",
      dataIndex: "bio",
      key: "bio",
      width: 200,
      className: "",
    },
    {
      title: "Website URL",
      dataIndex: "websiteURL",
      key: "websiteURL",
      width: 150,
      className: "",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 150,
      render: (_, record) => (
        <div className="">
          {`${record.address}, ${record.postalCode}, ${record.city}, ${record.state}`}
        </div>
      ),
    },
    {
      title: "Established Year",
      dataIndex: "establishedYear",
      key: "establishedYear",
      width: 100,
      className: "",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 60,
      render: (_, record) => {
        return (
          <div className="flex gap-2 ">
            <i className="ri-delete-bin-line" onClick={() => deleteUni(record._id)}></i>
            <i
              className="ri-pencil-line"
              onClick={() => {
                setSelectedUni(record); // Set the selected university for editing
                setShowUniForm(true); // Show the UniForm
              }}
            ></i>
          </div>
        );
      },
    },
  ];

  // Fetch universities when component mounts
  useEffect(() => {
    fetchUnis();
  }, []);

  return (
    <div>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setSelectedUni(null); // Reset selected university
            setShowUniForm(true); // Show the UniForm
          }}
        >
          Add University
        </Button>
      </div>

      {/* rowKey provides unique key for each row */}
      <Table
        dataSource={unis}
        columns={columns}
        rowKey={(record) => record.logoPic}
        className="mt-5"
        scroll={{ x: 1300 }}
      />

      {showUniForm && (
        <UniForm
          showUniForm={showUniForm} // Control the visibility of the UniForm
          setShowUniForm={setShowUniForm} // Function to hide the UniForm
          selectedUni={selectedUni} // Selected university for editing
          reloadUnis={fetchUnis} // Function to reload universities
        />
      )}
    </div>
  );
}

export default Unis;
