import { Button, Table, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/loadersSlice.js";
import { DeleteDorm, GetAllDorms } from "../../../apis/dorms.js";

function Dorms() {
  // State to store the list of dorms
  const [dorms, setDorms] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      render: (_, record) => {
        return (
          <img
            src={record?.coverPhotos || ""}
            alt="coverPhotos"
            className="w-20 h-20 object-contain"
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (_, record) =>
        `${record.address}, ${record.postalCode}, ${record.city}, ${record.state}`,
    },
    {
      title: "Rooms Offered",
      dataIndex: "roomsOffered",
      key: "roomsOffered",
      render: (_, record) => record.roomsOffered.join(", "),
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
    },
    {
      title: "Dorm Type",
      dataIndex: "dormType",
      key: "dormType",
    },
    {
      title: "Established Year",
      dataIndex: "establishedYear",
      key: "establishedYear",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <i className="ri-delete-bin-line" onClick={() => deleteDorm(record._id)}></i>
          <i
            className="ri-pencil-line"
            onClick={() => {
              navigate(`/admin/dorms/edit/${record._id}`);
            }}
          ></i>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-end">
        <Button onClick={() => navigate("/admin/dorms/add")}>Add Dorm</Button>
      </div>

      {/* rowKey provides unique key for each row */}
      <Table
        dataSource={dorms}
        columns={columns}
        rowKey={(record) => record._id}
        className="mt-5"
      />
    </div>
  );
}

export default Dorms;
