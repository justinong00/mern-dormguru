import { Button, Input, Table, Tooltip, message, DatePicker, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/loadersSlice.js";
import { DeleteDorm, GetAllDorms } from "../../../apis/dorms.js";
import DormForm from "./DormForm.jsx";
import { getStateCode } from "../../../helpers/stateCodesHelper.js";
import { roomOptions } from "../../../helpers/roomOptions.js";
import {
  dormTypeFilters,
  filterByYearRange,
  roomFilters,
} from "../../../helpers/columnFiltersHelper.js";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;

function Dorms() {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  // Generate filter options for dorm name
  const dormNameFilters = Array.from(new Set(dorms.map((dorm) => dorm.name))).map((dormName) => ({
    text: dormName,
    value: dormName,
  }));

  // Generate filter options for parent university
  const parentUniversityFilters = Array.from(
    new Set(dorms.map((dorm) => dorm.parentUniversity?.name)),
  ).map((parentUniversity) => ({
    text: parentUniversity,
    value: parentUniversity,
  }));

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
      /* filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
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
      onFilter: (value, record) => record.name?.toLowerCase().includes(value.toLowerCase()), */
      filters: dormNameFilters,
      filterSearch: true,
      onFilter: (value, record) => record.name === value,
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
        <div className="flex flex-col gap-y-1">
          <span
            className={`malaysia-state-flag-icon h-5 w-10 malaysia-state-flag-icon-${getStateCode(record?.state)}`}
          ></span>
          <span>{`${record?.address}, ${record?.postalCode}, ${record?.city}, ${record?.state}`}</span>
        </div>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="flex flex-col gap-2 p-2">
          <Input
            placeholder="Enter keyword"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
      /* filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#101820" : "rgba(0, 0, 0, 0.29)" }} />
      ), */
      onFilter: (value, record) => {
        const combinedAddress =
          `${record.address}, ${record.postalCode}, ${record.city}, ${record.state}`.toLowerCase();
        return combinedAddress.includes(value.toLowerCase());
      },
    },
    {
      title: "Rooms Offered",
      dataIndex: "roomsOffered",
      key: "roomsOffered",
      width: 150,
      render: (_, record) => (
        <div>
          {record.roomsOffered?.map((room, index) => (
            <div key={room}>
              {roomOptions.find((roomOption) => roomOption.value === room)?.label}
              {index < record.roomsOffered?.length - 1 ? ", " : ""}
            </div>
          ))}
        </div>
      ),
      filters: roomFilters,
      onFilter: (value, record) => record.roomsOffered?.includes(value),
    },
    {
      title: "Parent University",
      // Since the parentUniversity field in each dorm document is an object that includes the university's details. After being populated, we use dataIndex as an array to access the nested 'name' field within the 'parentUniversity' object.
      dataIndex: ["parentUniversity", "name"],
      key: "parentUniversity",
      width: 100,
      /* filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
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
        record.parentUniversity?.name?.toLowerCase().includes(value.toLowerCase()), */
      filters: parentUniversityFilters,
      filterSearch: true,
      onFilter: (value, record) => record.parentUniversity?.name === value,
    },
    {
      title: "Dorm Type",
      dataIndex: "dormType",
      key: "dormType",
      width: 100,
      filters: dormTypeFilters,
      filterMultiple: false,
      onFilter: (value, record) => record.dormType === value,
    },
    {
      title: "Established Year",
      dataIndex: "establishedYear",
      key: "establishedYear",
      width: 100,
      sorter: (a, b) => a.establishedYear - b.establishedYear,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="flex w-56 flex-col gap-2 p-2">
          <RangePicker
            picker="year"
            value={selectedKeys[0]}
            // Sets the selected years in selectedKeys.
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
      /* filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#101820" : "rgba(0, 0, 0, 0.29)" }} />
      ), */
      // onFilter extracts the start and end years from the value array, which contains moment objects.
      onFilter: (value, record) => {
        if (!value || value.length === 0) return true;
        const [start, end] = value;
        // The filterByYearRange function compares the record's established year with the selected year range.
        return filterByYearRange(record, start, end);
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 60,
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="Edit Dorm">
            <i
              className="ri-pencil-line"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDorm(record);
                setShowDormForm(true);
                // navigate(`/admin/dorms/edit/${record._id}`);
              }}
            ></i>
          </Tooltip>
          <Tooltip title="Delete Dorm">
            <Popconfirm
              title="Are you sure you want to delete this?"
              onConfirm={(e) => {
                e.stopPropagation();
                deleteDorm(record._id);
              }}
              okText="Yes"
              cancelText="No"
              onCancel={(e) => e.stopPropagation()}
            >
              <i className="ri-delete-bin-line" onClick={(e) => e.stopPropagation()}></i>
            </Popconfirm>
          </Tooltip>
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
        onRow={(record) => {
          return {
            onClick: () => {
              navigate(`/dorm/${record._id}`);
            },
            style: {
              cursor: "pointer",
            },
          };
        }}
      />

      {showDormForm && (
        <DormForm
          showDormForm={showDormForm}
          setShowDormForm={setShowDormForm}
          selectedDorm={selectedDorm}
          setSelectedDorm={setSelectedDorm}
          reloadDorms={fetchDorms}
        />
      )}
    </div>
  );
}

export default Dorms;
