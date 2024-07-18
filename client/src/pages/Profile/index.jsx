import React from "react";
import { Tabs } from "antd";
import Reviews from "./Reviews.jsx";

function Profile() {
  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Reviews" key="1">
        <Reviews />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Profile" key="2">
        Profile
      </Tabs.TabPane>
    </Tabs>
  );
}

export default Profile;
