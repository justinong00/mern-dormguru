import React from "react";
import { Tabs } from "antd";
import Reviews from "./Reviews.jsx";
import UserDetails from "./UserDetails.jsx";
import { useSelector } from "react-redux";

function Profile() {
  const { user } = useSelector((state) => state.users);

  const tabItems = user.isVerifiedStudent
    ? [
        {
          key: "1",
          label: "Reviews",
          children: <Reviews />,
        },
        {
          key: "2",
          label: "Profile",
          children: <UserDetails />,
        },
      ]
    : [
        {
          key: "2",
          label: "Profile",
          children: <UserDetails />,
        },
      ];

  return <Tabs defaultActiveKey="1" items={tabItems} />;
}

export default Profile;
