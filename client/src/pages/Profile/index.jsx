import React from "react";
import { Tabs } from "antd";
import Reviews from "./Reviews.jsx";

function Profile() {
  const tabItems = [
    {
      key: "1",
      label: "Reviews",
      children: <Reviews />,
    },
    {
      key: "2",
      label: "Profile",
      children: "Profile",
    },
  ];

  return <Tabs defaultActiveKey="1" items={tabItems} />;
}

export default Profile;
