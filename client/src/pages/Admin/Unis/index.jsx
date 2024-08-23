import { useEffect, useState } from "react";
import { Button, Table, Tooltip, message, Input, DatePicker, Popconfirm } from "antd";
import UniForm from "./UniForm.jsx";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/loadersSlice.js";
import { DeleteUni, GetAllUnis } from "../../../apis/unis.js";
import { SearchOutlined } from "@ant-design/icons";
import { filterByYearRange } from "../../../helpers/columnFiltersHelper.js";
import { getStateCode } from "../../../helpers/stateCodesHelper.js";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;

function Unis() {
  const dispatch = useDispatch(); // Redux dispatch function
  const navigate = useNavigate(); // React Router's navigate function
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
          <img src={record?.logoPic || ""} alt="logoPic" className="h-20 w-20 object-contain" />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 100,
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
      title: "Bio",
      dataIndex: "bio",
      key: "bio",
      width: 200,
    },
    {
      title: "Website URL",
      dataIndex: "websiteURL",
      key: "websiteURL",
      width: 150,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 150,
      render: (_, record) => (
        <div className="flex flex-col gap-y-1">
          <span
            className={`malaysia-state-flag-icon h-5 w-10 malaysia-state-flag-icon-${getStateCode(record?.state)} shadow-md`}
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
      render: (_, record) => {
        return (
          <div className="flex gap-2">
            <Tooltip title="Edit University">
              <i
                className="ri-pencil-line"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedUni(record); // Set the selected university for editing
                  setShowUniForm(true); // Show the UniForm
                }}
              ></i>
            </Tooltip>
            <Tooltip title="Delete University">
              <Popconfirm
                title="Are you sure you want to delete this?"
                onConfirm={(e) => {
                  e.stopPropagation();
                  deleteUni(record._id);
                }}
                okText="Yes"
                cancelText="No"
                onCancel={(e) => e.stopPropagation()}
              >
                <i className="ri-delete-bin-line" onClick={(e) => e.stopPropagation()}></i>
              </Popconfirm>
            </Tooltip>
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
        onRow={(record) => {
          return {
            onClick: () => {
              navigate(`/uni/${record._id}`);
            },
            style: {
              cursor: "pointer",
            },
          };
        }}
        pagination={{
          pageSize: 5,
        }}
      />

      {showUniForm && (
        <UniForm
          showUniForm={showUniForm} // Control the visibility of the UniForm
          setShowUniForm={setShowUniForm} // Function to hide the UniForm
          selectedUni={selectedUni} // Selected university for editing
          setSelectedUni={setSelectedUni} // Function to set the selected university for editing
          reloadUnis={fetchUnis} // Function to reload universities
        />
      )}
    </div>
  );
}

export default Unis;
