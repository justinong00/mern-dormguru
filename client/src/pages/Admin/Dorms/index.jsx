import { Button, Table, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/loadersSlice.js";
import { DeleteDorm, GetAllDorms } from "../../../apis/dorms.js";
import DormForm from "./DormForm.jsx";

function Dorms() {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dorms, setDorms] = useState([]);
  const [showDormForm, setShowDormForm] = useState(false);
  const [selectedDorm, setSelectedDorm] = useState(null);

  // Function to fetch all dorms from the backend
  const fetchDorms = async () => {
    try {
      dispatch(setLoading(true)); // Show loading indicator
      const response = await GetAllDorms();
      setDorms(response.data); // Update state with fetched dorms
      dispatch(setLoading(false)); // Hide loading indicator
    } catch (error) {
      dispatch(setLoading(false)); // Hide loading indicator
      message.error(error.message); // Show error message
    }
  };

  // Fetch dorms when the component mounts
  useEffect(() => {
    fetchDorms();
  }, []);

  // Function to delete a dorm by ID
  const deleteDorm = async (id) => {
    try {
      dispatch(setLoading(true)); // Show loading indicator
      const response = await DeleteDorm(id);
      message.success(response.message); // Show success message
      fetchDorms(); // Refresh the dorms list
      dispatch(setLoading(false)); // Hide loading indicator
    } catch (error) {
      dispatch(setLoading(false)); // Hide loading indicator
      message.error(error.message); // Show error message
    }
  };

  // Define columns for the Table component
  const columns = [
    {
      title: "Dorm",
      dataIndex: "coverPhotos",
      key: "coverPhotos",
      width: 80,
      render: (_, record) => {
        return (
          <img
            src={record?.coverPhotos || ""}
            alt="coverPhotos"
            className="h-20 w-20 object-contain"
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 100,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 200,
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
      title: "Rooms Offered",
      dataIndex: "roomsOffered",
      key: "roomsOffered",
      width: 150,
      render: (_, record) => <div className="">{record.roomsOffered.join(", ")}</div>,
      // display on each line
      /*       render: (_, record) => (
        <div>
          {record.roomsOffered.map((room, index) => (
            <div key={index}>{room}</div>
          ))}
        </div>
      ), */
    },
    {
      title: "Parent University",
      // Since the parentUniversity field in each dorm document is an object that includes the university's details. After being populated, we use dataIndex as an array to access the nested 'name' field within the 'parentUniversity' object.
      dataIndex: ["parentUniversity", "name"],
      key: "parentUniversity",
      width: 100,
    },
    {
      title: "Dorm Type",
      dataIndex: "dormType",
      key: "dormType",
      width: 100,
    },
    {
      title: "Established Year",
      dataIndex: "establishedYear",
      key: "establishedYear",
      width: 100,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 60,
      render: (_, record) => (
        <div className="flex gap-2">
          <i className="ri-delete-bin-line" onClick={() => deleteDorm(record._id)}></i>
          <i
            className="ri-pencil-line"
            onClick={() => {
              setSelectedDorm(record);
              setShowDormForm(true);
              // navigate(`/admin/dorms/edit/${record._id}`);
            }}
          ></i>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setSelectedDorm(null);
            setShowDormForm(true);
            // navigate("/admin/dorms/add");
          }}
        >
          Add Dorm
        </Button>
      </div>

      {/* rowKey provides unique key for each row */}
      <Table
        dataSource={dorms}
        columns={columns}
        rowKey={(record) => record._id}
        className="mt-5"
        scroll={{ x: 1500 }}
      />

      {showDormForm && (
        <DormForm
          showDormForm={showDormForm}
          setShowDormForm={setShowDormForm}
          selectedDorm={selectedDorm}
          reloadDorms={fetchDorms}
        />
      )}
    </div>
  );
}

export default Dorms;
