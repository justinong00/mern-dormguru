import React, { useState } from "react";
import Dorms from "./Dorms/index.jsx";
import Unis from "./Unis/index.jsx";
import Users from "./Users/index.jsx";
import { useSelector } from "react-redux";
import { Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import Reviews from "./Reviews/index.jsx";
import Profile from "./Profile/index.jsx";

/** Admin component responsible for rendering the admin interface
 *
 * This page includes three tabs for managing Dorms, Unis, and Users.
 * The component uses Ant Design's Tabs component for tab navigation and Redux for user state management.
 */
function Admin() {
  const [activeTab, setActiveTab] = useState("1");
  // Retrieve the current user from the Redux store
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();

  // Define the tab items with keys, labels, and content components
  const items = [
    {
      key: "1",
      label: "Dorms", // Label for the tab
      children: <Dorms />, // Content component for the tab
    },
    {
      key: "2",
      label: "Universities", // Label for the tab
      children: <Unis />, // Content component for the tab
    },
    {
      key: "3",
      label: "Users", // Label for the tab
      children: <Users />, // Content component for the tab
    },
    {
      key: "4",
      label: "Reviews", // Label for the tab
      children: <Reviews />, // Content component for the tab
    },
    {
      key: "5",
      label: "Profile", // Label for the tab
      children: <Profile />, // Content component for the tab
    },
  ];

  return (
    <div>
      {user?.isAdmin ? (
        // Render the Tabs component if the user is an admin
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={(key) => {
            const label = items.find((item) => item.key === key)?.label.toLowerCase(); // Find the label based on the key
            setActiveTab(key);
            navigate(`/admin/?tab=${encodeURIComponent(label)}`); // Use the label as the URL parameter
          }}
        />
      ) : (
        // Show a message if the user is not authorized
        <div className="text-md mt-20 text-center text-gray-600">
          You are not authorized to view this page
        </div>
      )}
    </div>
  );
}

export default Admin;
