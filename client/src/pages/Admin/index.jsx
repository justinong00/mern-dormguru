import React from 'react';
import Dorms from './Dorms/index.jsx';
import Unis from './Unis/index.jsx';
import Users from './Users/index.jsx';
import { useSelector } from 'react-redux';
import { Tabs } from 'antd';

/** Admin component responsible for rendering the admin interface 
 * 
 * This page includes three tabs for managing Dorms, Unis, and Users. 
 * The component uses Ant Design's Tabs component for tab navigation and Redux for user state management.
 */
function Admin() {
  // Retrieve the current user from the Redux store
  const { user } = useSelector((state) => state.users);

  // Handler function for tab change events
  const onChange = (key) => {
    console.log(key); // Log the key of the selected tab
  };

  // Define the tab items with keys, labels, and content components
  const items = [
    {
      key: '1',
      label: 'Dorms', // Label for the tab
      children: <Dorms />, // Content component for the tab
    },
    {
      key: '2',
      label: 'Unis', // Label for the tab
      children: <Unis />, // Content component for the tab
    },
    {
      key: '3',
      label: 'Users', // Label for the tab
      children: <Users />, // Content component for the tab
    },
  ];

  return (
    <div>
      {user?.isAdmin ? (
        // Render the Tabs component if the user is an admin
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      ) : (
        // Show a message if the user is not authorized
        <div className="text-gray-600 text-md text-center mt-20">
          You are not authorized to view this page
        </div>
      )}
    </div>
  );
}

export default Admin;
